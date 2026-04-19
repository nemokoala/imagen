import { ApiError } from "@/lib/errors/AppError";
import type { GenerateImageResponse } from "./imageGenerationService";

type LocalImageStreamChunk = string | GenerateImageResponse;
type LocalImageGeneratorFactory = () => AsyncGenerator<
  LocalImageStreamChunk,
  void,
  unknown
>;

interface EnqueueLocalImageOptions {
  userId: number;
  model: string;
  signal?: AbortSignal;
  generator: LocalImageGeneratorFactory;
}

interface LocalImageQueueJob {
  id: string;
  userId: number;
  model: string;
  generator: LocalImageGeneratorFactory;
  createdAt: number;
  started: boolean;
  canceled: boolean;
  finished: boolean;
  startPromise: Promise<void>;
  resolveStart: () => void;
}

const DEFAULT_MAX_ACCEPTED = 10;
const DEFAULT_CONCURRENCY = 1;
const WAITING_MESSAGE_INTERVAL_MS = 2000;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getPositiveIntegerEnv = (name: string, fallback: number) => {
  const value = Number(process.env[name]);
  return Number.isInteger(value) && value > 0 ? value : fallback;
};

class LocalImageQueue {
  private running = 0;
  private waiting: LocalImageQueueJob[] = [];
  private sequence = 0;

  private get maxAccepted() {
    return getPositiveIntegerEnv("LOCAL_IMAGE_QUEUE_MAX", DEFAULT_MAX_ACCEPTED);
  }

  private get concurrency() {
    return getPositiveIntegerEnv(
      "LOCAL_IMAGE_CONCURRENCY",
      DEFAULT_CONCURRENCY,
    );
  }

  enqueue(
    options: EnqueueLocalImageOptions,
  ): AsyncGenerator<LocalImageStreamChunk, void, unknown> {
    if (this.running + this.waiting.length >= this.maxAccepted) {
      throw new ApiError(
        "현재 로컬 이미지 생성 대기열이 가득 찼습니다. 잠시 후 다시 시도해주세요.",
        429,
        "LOCAL_IMAGE_QUEUE_FULL",
      );
    }

    const job = this.createJob(options);
    this.waiting.push(job);
    this.runNext();

    return this.createQueuedStream(job, options.signal);
  }

  private createJob(options: EnqueueLocalImageOptions): LocalImageQueueJob {
    let resolveStart!: () => void;
    const startPromise = new Promise<void>((resolve) => {
      resolveStart = resolve;
    });

    this.sequence += 1;

    return {
      id: `${Date.now()}-${this.sequence}`,
      userId: options.userId,
      model: options.model,
      generator: options.generator,
      createdAt: Date.now(),
      started: false,
      canceled: false,
      finished: false,
      startPromise,
      resolveStart,
    };
  }

  private async *createQueuedStream(
    job: LocalImageQueueJob,
    signal?: AbortSignal,
  ): AsyncGenerator<LocalImageStreamChunk, void, unknown> {
    let removeAbortListener: (() => void) | undefined;

    try {
      if (signal?.aborted) {
        this.cancelWaitingJob(job);
        return;
      }

      let lastPosition = -1;
      const abortPromise = new Promise<never>((_, reject) => {
        if (!signal) return;

        const onAbort = () => {
          if (!job.started) {
            this.cancelWaitingJob(job);
            reject(new Error("REQUEST_ABORTED"));
          }
        };

        signal.addEventListener("abort", onAbort, { once: true });
        removeAbortListener = () =>
          signal.removeEventListener("abort", onAbort);
      });

      while (!job.started) {
        const position = this.getWaitingPosition(job.id);

        if (position === -1) {
          return;
        }

        if (position !== lastPosition) {
          yield `로컬 이미지 생성 대기열 ${position}번째입니다. 앞선 작업이 끝나면 자동으로 시작됩니다.`;
          lastPosition = position;
        }

        await Promise.race([
          job.startPromise,
          abortPromise,
          delay(WAITING_MESSAGE_INTERVAL_MS),
        ]);
      }

      yield "로컬 이미지 생성 작업을 시작합니다...";

      for await (const chunk of job.generator()) {
        yield chunk;
      }
    } catch (error) {
      if (error instanceof Error && error.message === "REQUEST_ABORTED") {
        return;
      }

      const errorMessage =
        error instanceof Error
          ? error.message
          : "로컬 이미지 생성 중 오류가 발생했습니다.";

      yield { success: false, error: errorMessage };
    } finally {
      removeAbortListener?.();

      if (job.started) {
        this.finishJob(job);
      } else {
        this.cancelWaitingJob(job);
      }
    }
  }

  private runNext() {
    while (this.running < this.concurrency && this.waiting.length > 0) {
      const job = this.waiting.shift();

      if (!job || job.canceled) {
        continue;
      }

      job.started = true;
      this.running += 1;
      job.resolveStart();
    }
  }

  private finishJob(job: LocalImageQueueJob) {
    if (job.finished) {
      return;
    }

    job.finished = true;
    this.running = Math.max(0, this.running - 1);
    this.runNext();
  }

  private cancelWaitingJob(job: LocalImageQueueJob) {
    if (job.started || job.canceled) {
      return;
    }

    job.canceled = true;
    const waitingIndex = this.waiting.findIndex((item) => item.id === job.id);

    if (waitingIndex !== -1) {
      this.waiting.splice(waitingIndex, 1);
    }

    job.resolveStart();
  }

  private getWaitingPosition(jobId: string) {
    const waitingIndex = this.waiting.findIndex((job) => job.id === jobId);
    return waitingIndex === -1 ? -1 : waitingIndex + 1;
  }
}

const globalForLocalImageQueue = globalThis as typeof globalThis & {
  __localImageQueue?: LocalImageQueue;
};

export const localImageQueue =
  globalForLocalImageQueue.__localImageQueue ?? new LocalImageQueue();

globalForLocalImageQueue.__localImageQueue = localImageQueue;
