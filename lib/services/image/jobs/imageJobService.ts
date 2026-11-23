import { prisma } from "@/lib/prisma";
import {
  ImageJobStatus,
  NotificationType,
  type ImageJob,
  type Prisma,
} from "@/lib/generated/prisma";
import { ApiError } from "@/lib/errors/AppError";
import { MODEL_CREDIT_SETTINGS } from "@/constants/credit.constants";
import { isLocalModel, type LocalModel } from "@/constants/model.constants";
import { ImageRatio } from "@/types/image.interfaces";
import type {
  ImageJob as ImageJobDto,
  ImageJobHistoryFilter,
  ImageJobHistoryResponse,
} from "@/types/imageJob.interfaces";
import { creditSettingsService } from "../../admin/creditSettingsService";
import { notificationService } from "../../notification/notificationService";
import { imageGenerationService } from "../imageGenerationService";
import { checkLocalModelHealth, getCachedLocalModelHealth } from "./localHealth";
import type { LocalRunResult } from "./localRunners";

const positiveIntEnv = (name: string, fallback: number) => {
  const value = Number(process.env[name]);
  return Number.isInteger(value) && value > 0 ? value : fallback;
};

export const IMAGE_JOB_TTL_HOURS = positiveIntEnv("IMAGE_JOB_TTL_HOURS", 72);
const MAX_ACTIVE_PER_USER = positiveIntEnv("IMAGE_JOB_MAX_PER_USER", 5);
const MAX_ACTIVE_TOTAL = positiveIntEnv("IMAGE_JOB_MAX_TOTAL", 100);
const MAX_CATEGORY_SLUGS = 10;
const RECENT_FINISHED_MS = 24 * 60 * 60_000;
const LIST_LIMIT = 20;
// 접수 직전에 워커가 확인한 결과가 있으면 그대로 쓴다.
const ENQUEUE_HEALTH_MAX_AGE_MS = 15_000;

const ACTIVE_STATUSES = [ImageJobStatus.PENDING, ImageJobStatus.RUNNING];
// 이 상태로 끝난 작업은 모두 선차감한 크레딧을 돌려받았다.
const REFUNDED_STATUSES = [
  ImageJobStatus.FAILED,
  ImageJobStatus.CANCELED,
  ImageJobStatus.EXPIRED,
];

const HISTORY_FILTER_STATUSES: Record<ImageJobHistoryFilter, ImageJobStatus[] | null> = {
  all: null,
  active: ACTIVE_STATUSES,
  succeeded: [ImageJobStatus.SUCCEEDED],
  failed: [ImageJobStatus.FAILED, ImageJobStatus.EXPIRED],
  canceled: [ImageJobStatus.CANCELED],
};

export const isImageJobHistoryFilter = (value: string): value is ImageJobHistoryFilter =>
  value in HISTORY_FILTER_STATUSES;

const imageSelect = { image: { select: { id: true, imageUrl: true, ratio: true } } };

/** 다른 워커가 이미 가져갔거나 끝낸 작업. 결과를 버린다. */
export class StaleImageJobError extends Error {
  constructor(jobId: number) {
    super(`image job ${jobId} was taken over`);
    this.name = "StaleImageJobError";
  }
}

// 가져갈 때 늘린 attempts가 그대로일 때만 이 워커가 작업의 주인이다(펜싱 토큰).
const ownedBy = (job: ImageJob): Prisma.ImageJobWhereInput => ({
  id: job.id,
  status: ImageJobStatus.RUNNING,
  attempts: job.attempts,
});

const parseSlugs = (value: Prisma.JsonValue | null): string[] =>
  Array.isArray(value)
    ? value.filter((slug): slug is string => typeof slug === "string")
    : [];

type JobWithImage = ImageJob & {
  image: { id: number; imageUrl: string; ratio: string } | null;
};

function toDto(job: JobWithImage, position: number | null): ImageJobDto {
  const waitingForServer =
    job.status === ImageJobStatus.PENDING &&
    isLocalModel(job.model) &&
    getCachedLocalModelHealth(job.model) === false;

  return {
    id: job.id,
    model: job.model,
    prompt: job.prompt,
    ratio: job.ratio as ImageRatio,
    status: job.status,
    creditCost: job.creditCost,
    progress: job.progress,
    error: job.error,
    position: job.status === ImageJobStatus.PENDING ? position : null,
    waitingForServer,
    image: job.image
      ? { ...job.image, ratio: job.image.ratio as ImageRatio }
      : null,
    createdAt: job.createdAt.toISOString(),
    finishedAt: job.finishedAt?.toISOString() ?? null,
    expiresAt: job.expiresAt.toISOString(),
  };
}

/** 대기 순번은 전체 진행 중 작업 가운데 내 앞에 몇 개가 있는지로 센다. */
async function withPositions(jobs: JobWithImage[]): Promise<ImageJobDto[]> {
  const activeIds = jobs.some((job) => job.status === ImageJobStatus.PENDING)
    ? (
        await prisma.imageJob.findMany({
          where: { status: { in: ACTIVE_STATUSES } },
          select: { id: true },
          orderBy: { id: "asc" },
        })
      ).map(({ id }) => id)
    : [];

  return jobs.map((job) => toDto(job, activeIds.indexOf(job.id)));
}

/** 상태를 바꾼 경우에만 같은 트랜잭션에서 환불한다. 두 번 불려도 한 번만 돌려준다. */
async function closeWithRefund(
  job: ImageJob,
  where: Prisma.ImageJobWhereInput,
  status: ImageJobStatus,
  reason: string,
): Promise<boolean> {
  return prisma.$transaction(async (tx) => {
    const { count } = await tx.imageJob.updateMany({
      where: { ...where, id: job.id },
      data: {
        status,
        error: reason.slice(0, 255),
        progress: null,
        finishedAt: new Date(),
      },
    });
    if (count !== 1) return false;

    await tx.user.update({
      where: { id: job.userId },
      data: { credits: { increment: job.creditCost } },
    });
    return true;
  });
}

async function notify(
  job: ImageJob,
  type: NotificationType,
  message: string,
  imageId?: number,
) {
  try {
    await notificationService.createSystemNotification({
      userId: job.userId,
      type,
      message,
      imageId,
    });
  } catch (error) {
    console.error("[image-job] 알림 생성 실패:", job.id, error);
  }
}

export const imageJobService = {
  async enqueue(input: {
    userId: number;
    model: LocalModel;
    prompt: string;
    ratio: ImageRatio;
    categorySlugs: unknown;
  }): Promise<ImageJobDto> {
    const { userId, model, prompt, ratio } = input;
    const categorySlugs = Array.isArray(input.categorySlugs)
      ? input.categorySlugs
          .filter((slug): slug is string => typeof slug === "string")
          .slice(0, MAX_CATEGORY_SLUGS)
      : [];

    const [userActive, totalActive] = await Promise.all([
      prisma.imageJob.count({
        where: { userId, status: { in: ACTIVE_STATUSES } },
      }),
      prisma.imageJob.count({ where: { status: { in: ACTIVE_STATUSES } } }),
    ]);
    if (userActive >= MAX_ACTIVE_PER_USER) {
      throw new ApiError(
        `대기 중인 작업은 ${MAX_ACTIVE_PER_USER}개까지 둘 수 있습니다. 앞선 작업이 끝난 뒤 다시 시도해주세요.`,
        429,
        "IMAGE_JOB_USER_LIMIT",
      );
    }
    if (totalActive >= MAX_ACTIVE_TOTAL) {
      throw new ApiError(
        "생성 대기열이 가득 찼습니다. 잠시 후 다시 시도해주세요.",
        429,
        "IMAGE_JOB_QUEUE_FULL",
      );
    }

    const settings = await creditSettingsService.getCreditSettings();
    const creditCost = settings[MODEL_CREDIT_SETTINGS[model].creditKey];
    const serverOnline = await checkLocalModelHealth(model, ENQUEUE_HEALTH_MAX_AGE_MS);

    // 크레딧을 먼저 잡아 둔다. 잔액 확인과 차감이 한 문장이라 동시 요청에도 음수가 되지 않는다.
    const job = await prisma.$transaction(async (tx) => {
      const { count } = await tx.user.updateMany({
        where: { id: userId, credits: { gte: creditCost } },
        data: { credits: { decrement: creditCost } },
      });
      if (count !== 1) {
        throw new ApiError("크레딧이 부족합니다.", 400, "INSUFFICIENT_CREDITS");
      }

      return tx.imageJob.create({
        data: {
          userId,
          model,
          prompt,
          ratio,
          categorySlugs: categorySlugs.length ? categorySlugs : undefined,
          creditCost,
          notifyOnFinish: !serverOnline,
          expiresAt: new Date(Date.now() + IMAGE_JOB_TTL_HOURS * 60 * 60_000),
        },
      });
    });

    const ahead = await prisma.imageJob.count({
      where: { status: { in: ACTIVE_STATUSES }, id: { lt: job.id } },
    });
    return toDto({ ...job, image: null }, ahead);
  },

  async listForUser(userId: number): Promise<ImageJobDto[]> {
    const jobs = await prisma.imageJob.findMany({
      where: {
        userId,
        OR: [
          { status: { in: ACTIVE_STATUSES } },
          { finishedAt: { gte: new Date(Date.now() - RECENT_FINISHED_MS) } },
        ],
      },
      orderBy: { id: "desc" },
      take: LIST_LIMIT,
      include: imageSelect,
    });
    return withPositions(jobs);
  },

  /** 프로필의 생성 요청 탭: 내 요청 전체를 최신순으로, 상태별 개수·크레딧 합계와 함께 돌려준다. */
  async historyForUser(
    userId: number,
    { page, limit, filter }: { page: number; limit: number; filter: ImageJobHistoryFilter },
  ): Promise<Omit<ImageJobHistoryResponse, "success">> {
    const statuses = HISTORY_FILTER_STATUSES[filter];
    const where: Prisma.ImageJobWhereInput = {
      userId,
      ...(statuses ? { status: { in: statuses } } : {}),
    };

    const [jobs, totalCount, byStatus] = await Promise.all([
      prisma.imageJob.findMany({
        where,
        orderBy: { id: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: imageSelect,
      }),
      prisma.imageJob.count({ where }),
      prisma.imageJob.groupBy({
        by: ["status"],
        where: { userId },
        _count: { _all: true },
        _sum: { creditCost: true },
      }),
    ]);

    const countOf = (list: ImageJobStatus[]) =>
      byStatus
        .filter((row) => list.includes(row.status))
        .reduce((sum, row) => sum + row._count._all, 0);
    const creditsOf = (list: ImageJobStatus[]) =>
      byStatus
        .filter((row) => list.includes(row.status))
        .reduce((sum, row) => sum + (row._sum.creditCost ?? 0), 0);

    return {
      jobs: await withPositions(jobs),
      totalCount,
      currentPage: page,
      hasNextPage: page * limit < totalCount,
      summary: {
        total: countOf(Object.values(ImageJobStatus)),
        active: countOf(ACTIVE_STATUSES),
        succeeded: countOf([ImageJobStatus.SUCCEEDED]),
        failed: countOf([ImageJobStatus.FAILED, ImageJobStatus.EXPIRED]),
        canceled: countOf([ImageJobStatus.CANCELED]),
        spentCredits: creditsOf([ImageJobStatus.SUCCEEDED]),
        reservedCredits: creditsOf(ACTIVE_STATUSES),
        refundedCredits: creditsOf(REFUNDED_STATUSES),
      },
    };
  },

  async cancel(userId: number, jobId: number): Promise<ImageJobDto> {
    const job = await prisma.imageJob.findFirst({ where: { id: jobId, userId } });
    if (!job) {
      throw new ApiError("작업을 찾을 수 없습니다.", 404, "IMAGE_JOB_NOT_FOUND");
    }

    const canceled = await closeWithRefund(
      job,
      { status: ImageJobStatus.PENDING },
      ImageJobStatus.CANCELED,
      "사용자가 취소했습니다.",
    );
    if (!canceled) {
      throw new ApiError(
        "이미 시작했거나 끝난 작업은 취소할 수 없습니다.",
        409,
        "IMAGE_JOB_NOT_CANCELABLE",
      );
    }

    const updated = await prisma.imageJob.findUniqueOrThrow({
      where: { id: jobId },
      include: imageSelect,
    });
    return toDto(updated, null);
  },

  /** 대기 중인 작업이 있는 모델 목록. 워커는 이 모델들의 서버만 확인한다. */
  async pendingModels(): Promise<string[]> {
    const rows = await prisma.imageJob.findMany({
      where: { status: ImageJobStatus.PENDING, expiresAt: { gt: new Date() } },
      distinct: ["model"],
      select: { model: true },
    });
    return rows.map(({ model }) => model);
  },

  /** 켜진 모델의 가장 오래된 작업을 가져간다. 조건부 갱신이라 두 워커가 같은 작업을 가져가지 않는다. */
  async claimNext(models: string[]): Promise<ImageJob | null> {
    for (let retry = 0; retry < 3; retry++) {
      const next = await prisma.imageJob.findFirst({
        where: {
          status: ImageJobStatus.PENDING,
          model: { in: models },
          expiresAt: { gt: new Date() },
        },
        orderBy: { id: "asc" },
      });
      if (!next) return null;

      const startedAt = new Date();
      const progress = "생성을 준비하는 중입니다...";
      const { count } = await prisma.imageJob.updateMany({
        where: { id: next.id, status: ImageJobStatus.PENDING },
        data: {
          status: ImageJobStatus.RUNNING,
          attempts: { increment: 1 },
          startedAt,
          progress,
        },
      });
      if (count === 1) {
        return {
          ...next,
          status: ImageJobStatus.RUNNING,
          attempts: next.attempts + 1,
          startedAt,
          progress,
        };
      }
    }
    return null;
  },

  async updateProgress(job: ImageJob, message: string): Promise<void> {
    await prisma.imageJob.updateMany({
      where: ownedBy(job),
      data: { progress: message.slice(0, 255) },
    });
  },

  async setExternalId(job: ImageJob, externalId: string): Promise<void> {
    await prisma.imageJob.updateMany({ where: ownedBy(job), data: { externalId } });
  },

  /** 이미지 저장과 작업 완료를 한 트랜잭션으로 묶어, 완료된 작업에 이미지가 없거나 이미지가 두 번 생기지 않게 한다. */
  async complete(job: ImageJob, result: LocalRunResult) {
    const imageUrl = await imageGenerationService.saveImageBufferToFileSystem(
      result.buffer,
      job.userId,
    );

    const image = await prisma.$transaction(async (tx) => {
      // 기다리는 동안 카테고리가 지워졌을 수 있으므로 남아 있는 것만 연결한다.
      const slugs = parseSlugs(job.categorySlugs);
      const categories = slugs.length
        ? await tx.category.findMany({
            where: { slug: { in: slugs } },
            select: { slug: true },
          })
        : [];

      const image = await tx.generatedImage.create({
        data: {
          userId: job.userId,
          prompt: job.prompt,
          translatedPrompt: result.translatedPrompt,
          imageUrl,
          model: job.model,
          size: result.size,
          ratio: job.ratio,
          ...(categories.length ? { categories: { connect: categories } } : {}),
        },
      });

      const { count } = await tx.imageJob.updateMany({
        where: ownedBy(job),
        data: {
          status: ImageJobStatus.SUCCEEDED,
          imageId: image.id,
          progress: null,
          error: null,
          finishedAt: new Date(),
        },
      });
      if (count !== 1) throw new StaleImageJobError(job.id);
      return image;
    });

    if (job.notifyOnFinish) {
      await notify(job, NotificationType.GENERATION_DONE, "예약한 이미지가 완성됐어요.", image.id);
    }
    return image;
  },

  async failRunning(job: ImageJob, reason: string): Promise<void> {
    const failed = await closeWithRefund(job, ownedBy(job), ImageJobStatus.FAILED, reason);
    if (failed && job.notifyOnFinish) {
      await notify(
        job,
        NotificationType.GENERATION_FAILED,
        `예약한 이미지를 만들지 못했어요. ${job.creditCost} 크레딧을 돌려드렸어요.`,
      );
    }
  },

  /** 서버 문제로 중단된 작업을 대기열로 되돌린다. prompt_id는 남겨 두어 다음 시도에서 이어 받는다. */
  async requeue(job: ImageJob, reason: string): Promise<void> {
    await prisma.imageJob.updateMany({
      where: ownedBy(job),
      data: { status: ImageJobStatus.PENDING, progress: reason.slice(0, 255) },
    });
  },

  /** 서버를 기다린 작업은 사용자가 화면을 떠났을 가능성이 높으므로 끝나면 알린다. */
  async markWaitingForServer(models: string[]): Promise<void> {
    await prisma.imageJob.updateMany({
      where: {
        status: ImageJobStatus.PENDING,
        model: { in: models },
        notifyOnFinish: false,
      },
      data: { notifyOnFinish: true },
    });
  },

  async expireOverdue(): Promise<number> {
    const overdue = await prisma.imageJob.findMany({
      where: { status: ImageJobStatus.PENDING, expiresAt: { lte: new Date() } },
      take: 50,
    });

    let expired = 0;
    for (const job of overdue) {
      const closed = await closeWithRefund(
        job,
        { status: ImageJobStatus.PENDING },
        ImageJobStatus.EXPIRED,
        `AI 서버가 ${IMAGE_JOB_TTL_HOURS}시간 동안 켜지지 않아 예약이 만료됐습니다.`,
      );
      if (!closed) continue;
      expired++;
      await notify(
        job,
        NotificationType.GENERATION_FAILED,
        `AI 서버가 ${IMAGE_JOB_TTL_HOURS}시간 동안 켜지지 않아 예약을 취소했어요. ${job.creditCost} 크레딧을 돌려드렸어요.`,
      );
    }
    return expired;
  },

  /**
   * 프로세스가 뜰 때 RUNNING으로 남은 작업을 되돌린다(배포·재시작으로 끊긴 작업).
   * 워커는 프로세스 하나에서만 돈다는 전제다. 혹시 이전 프로세스가 살아 있어도 펜싱 토큰 때문에 결과를 덮어쓰지 못한다.
   */
  async recoverInterrupted(): Promise<number> {
    const { count } = await prisma.imageJob.updateMany({
      where: { status: ImageJobStatus.RUNNING },
      data: {
        status: ImageJobStatus.PENDING,
        progress: "서버가 재시작돼 다시 대기 중입니다.",
      },
    });
    return count;
  },

  /**
   * 완료·실패 기록이 DB 오류로 실패하면 작업이 RUNNING으로 남아 크레딧과 사용자 한도를 붙잡는다.
   * 진행 메시지가 오래 갱신되지 않은 작업만 되돌린다(A1111 한 번 요청이 최대 10분이라 그보다 길게 둔다).
   */
  async recoverStale(staleMs: number): Promise<number> {
    const { count } = await prisma.imageJob.updateMany({
      where: {
        status: ImageJobStatus.RUNNING,
        updatedAt: { lt: new Date(Date.now() - staleMs) },
      },
      data: {
        status: ImageJobStatus.PENDING,
        progress: "응답이 없어 다시 대기 중입니다.",
      },
    });
    return count;
  },
};
