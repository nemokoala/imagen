import { readFile } from "fs/promises";
import { join } from "path";
import {
  GenerationFailedError,
  LocalServerUnavailableError,
  localFetch,
  readLocalBuffer,
  readLocalJson,
} from "./localServer";

export type ComfyWorkflow = Record<string, { inputs: Record<string, unknown> }>;

interface ComfyImageRef {
  filename: string;
  subfolder: string;
  type: string;
}

interface ComfyHistoryEntry {
  status?: { status_str?: string; completed?: boolean; messages?: unknown };
  outputs?: Record<string, { images?: ComfyImageRef[] }>;
}

interface ComfyQueue {
  queue_running?: unknown[][];
  queue_pending?: unknown[][];
}

type QueueState = "running" | "pending" | "missing";

export interface ComfyRunOptions {
  /** 이전 시도에서 제출한 prompt_id. 있으면 다시 제출하지 않고 결과를 이어서 기다린다. */
  externalId: string | null;
  /** 새로 제출할 때만 부른다. 번역처럼 AI 서버가 켜져 있어야 하는 준비를 여기서 한다. */
  buildWorkflow: () => Promise<ComfyWorkflow>;
  outputNodeId: string;
  clientId: string;
  onSubmitted: (promptId: string) => Promise<void>;
  onProgress: (message: string) => Promise<void>;
}

const POLL_INTERVAL_MS = 1500;
// 약 15초마다 ComfyUI 대기열을 확인해 작업이 사라지지 않았는지 본다.
const QUEUE_CHECK_EVERY_POLLS = 10;
// 서버를 막 켠 직후에는 모델 로딩으로 오래 걸리므로 넉넉히 기다린다.
const MAX_WAIT_MS =
  Number(process.env.COMFY_JOB_MAX_WAIT_MS) > 0
    ? Number(process.env.COMFY_JOB_MAX_WAIT_MS)
    : 30 * 60_000;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function getComfyUrl(): string {
  const url = process.env.COMFYUI_URL?.replace(/\/$/, "");
  if (!url) {
    throw new GenerationFailedError("ComfyUI 서버 주소가 설정되지 않았습니다.");
  }
  return url;
}

export async function loadWorkflow(fileName: string): Promise<ComfyWorkflow> {
  const path = join(process.cwd(), "lib", "services", "image", fileName);
  return JSON.parse(await readFile(path, "utf-8")) as ComfyWorkflow;
}

export const randomSeed = () => Math.floor(Math.random() * 2 ** 48);

async function submit(
  comfyUrl: string,
  workflow: ComfyWorkflow,
  clientId: string,
): Promise<string> {
  const response = await localFetch(`${comfyUrl}/api/prompt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: clientId, prompt: workflow }),
  });
  const data = await readLocalJson<{ prompt_id?: string; node_errors?: unknown }>(
    response,
  );
  if (!response.ok || typeof data.prompt_id !== "string") {
    console.error("[comfy] 작업 등록 거부:", response.status, data.node_errors ?? data);
    throw new GenerationFailedError("AI 서버가 작업을 받지 못했습니다.");
  }
  return data.prompt_id;
}

async function getHistoryEntry(
  comfyUrl: string,
  promptId: string,
): Promise<ComfyHistoryEntry | undefined> {
  const response = await localFetch(`${comfyUrl}/api/history/${promptId}`);
  if (!response.ok) return undefined;
  const history = await readLocalJson<Record<string, ComfyHistoryEntry>>(response);
  return history[promptId];
}

async function getQueueState(comfyUrl: string, promptId: string): Promise<QueueState> {
  const response = await localFetch(`${comfyUrl}/queue`);
  if (!response.ok) {
    throw new LocalServerUnavailableError("AI 서버 대기열을 확인하지 못했습니다.");
  }
  const queue = await readLocalJson<ComfyQueue>(response);
  // 대기열 항목은 [번호, prompt_id, workflow, extra, outputs] 모양이다.
  const has = (items?: unknown[][]) => items?.some((item) => item[1] === promptId);
  if (has(queue.queue_running)) return "running";
  if (has(queue.queue_pending)) return "pending";
  return "missing";
}

/** 시간 초과로 포기한 작업이 GPU를 계속 쓰지 않도록 ComfyUI에서도 지운다. */
async function abandon(comfyUrl: string, promptId: string): Promise<void> {
  try {
    const state = await getQueueState(comfyUrl, promptId);
    if (state === "pending") {
      await localFetch(`${comfyUrl}/queue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ delete: [promptId] }),
      });
    } else if (state === "running") {
      await localFetch(`${comfyUrl}/interrupt`, { method: "POST" });
    }
  } catch (error) {
    console.error("[comfy] 시간 초과 작업 정리 실패:", error);
  }
}

async function waitForOutput(
  comfyUrl: string,
  promptId: string,
  { outputNodeId, onProgress }: ComfyRunOptions,
): Promise<ComfyImageRef> {
  const startedAt = Date.now();

  for (let poll = 1; ; poll++) {
    const entry = await getHistoryEntry(comfyUrl, promptId);
    if (entry?.status?.status_str === "error") {
      console.error("[comfy] 실행 실패:", promptId, entry.status.messages);
      throw new GenerationFailedError("AI 서버에서 이미지 생성이 실패했습니다.");
    }
    const image = entry?.outputs?.[outputNodeId]?.images?.[0];
    if (image) return image;
    if (entry?.status?.completed) {
      throw new GenerationFailedError("생성 결과 이미지를 찾지 못했습니다.");
    }

    if (poll % QUEUE_CHECK_EVERY_POLLS === 0) {
      const state = await getQueueState(comfyUrl, promptId);
      // 대기열 확인 사이에 끝났을 수 있으므로 기록을 한 번 더 본 뒤에 판단한다.
      if (state === "missing" && !(await getHistoryEntry(comfyUrl, promptId))) {
        throw new LocalServerUnavailableError("AI 서버 대기열에서 작업이 사라졌습니다.");
      }
      const elapsed = Math.round((Date.now() - startedAt) / 1000);
      await onProgress(
        state === "pending"
          ? "AI 서버의 앞선 작업이 끝나기를 기다리는 중입니다..."
          : `이미지 생성 중... (${elapsed}초 경과)`,
      );
    }

    if (Date.now() - startedAt > MAX_WAIT_MS) {
      await abandon(comfyUrl, promptId);
      throw new GenerationFailedError("이미지 생성 시간이 초과됐습니다.");
    }
    await delay(POLL_INTERVAL_MS);
  }
}

async function isKnown(comfyUrl: string, promptId: string): Promise<boolean> {
  if (await getHistoryEntry(comfyUrl, promptId)) return true;
  return (await getQueueState(comfyUrl, promptId)) !== "missing";
}

/**
 * 워크플로를 실행해 결과 이미지를 받는다.
 * 재시작 뒤에는 저장해 둔 prompt_id로 이어서 기다리고, ComfyUI도 재시작돼 기록이 없을 때만 다시 제출한다.
 */
export async function runComfyWorkflow(options: ComfyRunOptions): Promise<Buffer> {
  const comfyUrl = getComfyUrl();
  let promptId = options.externalId;

  if (promptId && !(await isKnown(comfyUrl, promptId))) {
    await options.onProgress("AI 서버가 재시작돼 작업을 다시 등록합니다...");
    promptId = null;
  }

  if (promptId) {
    await options.onProgress("이전에 등록한 작업의 결과를 기다리는 중입니다...");
  } else {
    const workflow = await options.buildWorkflow();
    await options.onProgress("AI 서버에 작업을 등록하는 중입니다...");
    promptId = await submit(comfyUrl, workflow, options.clientId);
    await options.onSubmitted(promptId);
    await options.onProgress("이미지를 생성하는 중입니다...");
  }

  const image = await waitForOutput(comfyUrl, promptId, options);

  await options.onProgress("생성된 이미지를 저장하는 중입니다...");
  const viewUrl = new URL("/view", comfyUrl);
  viewUrl.searchParams.set("filename", image.filename);
  viewUrl.searchParams.set("subfolder", image.subfolder);
  viewUrl.searchParams.set("type", image.type);
  const response = await localFetch(viewUrl);
  if (!response.ok) {
    throw new GenerationFailedError("생성된 이미지를 가져오지 못했습니다.");
  }
  return readLocalBuffer(response);
}
