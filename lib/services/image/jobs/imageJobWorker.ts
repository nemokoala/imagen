import type { ImageJob } from "@/lib/generated/prisma";
import { isLocalModel, type LocalModel } from "@/constants/model.constants";
import { ImageRatio } from "@/types/image.interfaces";
import { creditSettingsService } from "../../admin/creditSettingsService";
import { discordService } from "../../logs/logService";
import { StaleImageJobError, imageJobService } from "./imageJobService";
import { sweepOrphanEditInputs } from "./jobInputs";
import { checkLocalModelHealth, markLocalModelUnavailable } from "./localHealth";
import { runLocalModel } from "./localRunners";
import { GenerationFailedError, LocalServerUnavailableError } from "./localServer";

// 대기 작업이 없을 때는 만료 처리만 하면 되므로 길게 쉰다. 새 접수는 wake()로 바로 깨운다.
const IDLE_DELAY_MS = 60_000;
// 서버가 꺼져 있으면 15초 → 30초 → 60초로 간격을 늘린다.
const OFFLINE_MIN_DELAY_MS = 15_000;
const OFFLINE_MAX_DELAY_MS = 60_000;
const STALE_RUNNING_MS = 15 * 60_000;
const HEARTBEAT_MS = 60_000;
// 삭제에 실패했거나 접수 도중 끊겨 남은 편집 입력 폴더를 한 시간마다 정리한다.
const SWEEP_INTERVAL_MS = 60 * 60_000;
const ORPHAN_MIN_AGE_MS = 60 * 60_000;
const MAX_ATTEMPTS =
  Number(process.env.IMAGE_JOB_MAX_ATTEMPTS) > 0
    ? Number(process.env.IMAGE_JOB_MAX_ATTEMPTS)
    : 3;

class ImageJobWorker {
  private started = false;
  private ticking = false;
  private wakeRequested = false;
  private timer: NodeJS.Timeout | undefined;
  private offlineStreak = 0;
  private lastSweepAt = 0;

  start() {
    if (this.started) return;
    this.started = true;
    console.log("[image-job] 워커 시작");

    imageJobService
      .recoverInterrupted()
      .then((count) => {
        if (count > 0) console.log(`[image-job] 중단된 작업 ${count}개를 대기열로 되돌림`);
      })
      .catch((error) => console.error("[image-job] 중단 작업 복구 실패:", error))
      .finally(() => this.schedule(0));
  }

  /** 새 작업이 들어오면 다음 확인을 기다리지 않고 바로 처리한다. */
  wake() {
    if (!this.started) return;
    // 도는 중이면 이번 바퀴가 "대기 없음"을 이미 확인했을 수 있으므로, 끝나자마자 한 번 더 돈다.
    if (this.ticking) {
      this.wakeRequested = true;
      return;
    }
    this.schedule(0);
  }

  private schedule(delayMs: number) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => void this.tick(), delayMs);
    this.timer.unref();
  }

  private async tick() {
    if (this.ticking) return;
    this.ticking = true;
    let nextDelay = OFFLINE_MIN_DELAY_MS;
    try {
      nextDelay = await this.step();
    } catch (error) {
      console.error("[image-job] 워커 처리 중 오류:", error);
    } finally {
      this.ticking = false;
      this.schedule(this.wakeRequested ? 0 : nextDelay);
      this.wakeRequested = false;
    }
  }

  /** 한 번 돌고 다음 확인까지 쉴 시간을 돌려준다. */
  private async step(): Promise<number> {
    await imageJobService.expireOverdue();
    await imageJobService.recoverStale(STALE_RUNNING_MS);
    if (Date.now() - this.lastSweepAt >= SWEEP_INTERVAL_MS) {
      this.lastSweepAt = Date.now();
      const removed = await sweepOrphanEditInputs(
        await imageJobService.activeInputDirs(),
        ORPHAN_MIN_AGE_MS,
      );
      if (removed > 0) console.log(`[image-job] 남은 편집 입력 폴더 ${removed}개 정리`);
    }

    const models = (await imageJobService.pendingModels()).filter(isLocalModel);
    if (models.length === 0) {
      this.offlineStreak = 0;
      return IDLE_DELAY_MS;
    }

    const health = await Promise.all(
      models.map(async (model) => ({
        model,
        healthy: await checkLocalModelHealth(model),
      })),
    );
    const online = health.filter((item) => item.healthy).map((item) => item.model);
    const offline = health.filter((item) => !item.healthy).map((item) => item.model);
    if (offline.length > 0) await imageJobService.markWaitingForServer(offline);

    if (online.length === 0) {
      const delay = Math.min(
        OFFLINE_MIN_DELAY_MS * 2 ** this.offlineStreak,
        OFFLINE_MAX_DELAY_MS,
      );
      this.offlineStreak = Math.min(this.offlineStreak + 1, 3);
      return delay;
    }
    this.offlineStreak = 0;

    // 생성과 편집이 모두 이 워커 하나로 한 건씩 돌기 때문에 GPU를 동시에 쓰지 않는다.
    const job = await imageJobService.claimNext(online);
    if (!job) return OFFLINE_MIN_DELAY_MS;
    await this.run(job);
    return 0;
  }

  private async run(job: ImageJob) {
    if (!isLocalModel(job.model)) {
      await imageJobService.failRunning(job, "지원하지 않는 모델입니다.");
      return;
    }
    const model: LocalModel = job.model;

    const enabled = await creditSettingsService.assertModelEnabled(model).then(
      () => true,
      () => false,
    );
    if (!enabled) {
      await imageJobService.failRunning(job, "관리자가 모델을 중지해 예약을 취소했습니다.");
      return;
    }

    let lastProgress = job.progress;
    let lastWriteAt = Date.now();
    try {
      const result = await runLocalModel(
        {
          kind: job.kind,
          model,
          prompt: job.prompt,
          ratio: job.ratio as ImageRatio,
          inputs: job.inputs,
        },
        {
          externalId: job.externalId,
          onSubmitted: (externalId) => imageJobService.setExternalId(job, externalId),
          // 같은 메시지는 건너뛰되, 살아 있다는 표시(updatedAt)는 1분마다 남겨 recoverStale에 걸리지 않게 한다.
          onProgress: async (message) => {
            if (message === lastProgress && Date.now() - lastWriteAt < HEARTBEAT_MS) return;
            lastProgress = message;
            lastWriteAt = Date.now();
            await imageJobService.updateProgress(job, message);
          },
        },
      );

      const image = await imageJobService.complete(job, result);
      console.log(`[image-job] #${job.id} 완료 (시도 ${job.attempts}회)`);
      discordService.sendLog(
        `대기열 이미지 ${job.kind === "EDIT" ? "편집" : "생성"} 성공 #${job.id}: ${process.env.NEXT_PUBLIC_BASE_URL}${image.imageUrl}`,
      );
    } catch (error) {
      if (error instanceof StaleImageJobError) {
        console.warn(`[image-job] #${job.id} 다른 워커가 가져간 작업이라 결과를 버림`);
        return;
      }

      if (error instanceof LocalServerUnavailableError) {
        markLocalModelUnavailable(model);
        console.warn(`[image-job] #${job.id} 서버 연결 끊김 (시도 ${job.attempts}회):`, error.message);
        if (job.attempts >= MAX_ATTEMPTS) {
          await imageJobService.failRunning(job, "AI 서버 연결이 계속 끊겨 생성하지 못했습니다.");
        } else {
          await imageJobService.requeue(job, "AI 서버 연결이 끊겨 다시 대기 중입니다.");
        }
        return;
      }

      if (error instanceof GenerationFailedError) {
        console.warn(`[image-job] #${job.id} 생성 실패:`, error.message);
        await imageJobService.failRunning(job, error.message);
        return;
      }

      console.error(`[image-job] #${job.id} 예상하지 못한 오류:`, error);
      discordService.sendError(
        `대기열 이미지 생성 오류 #${job.id}: ${error instanceof Error ? error.message : String(error)}`,
      );
      await imageJobService.failRunning(job, "이미지 생성 중 오류가 발생했습니다.");
    }
  }
}

// instrumentation과 API 라우트는 서로 다른 번들이라, globalThis로 한 인스턴스를 공유해야 wake()가 워커에 닿는다.
const globalForWorker = globalThis as typeof globalThis & {
  __imageJobWorker?: ImageJobWorker;
};

export const imageJobWorker = (globalForWorker.__imageJobWorker ??= new ImageJobWorker());
