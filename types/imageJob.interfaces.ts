import { ImageRatio } from "./image.interfaces";

export type ImageJobStatus =
  | "PENDING"
  | "RUNNING"
  | "SUCCEEDED"
  | "FAILED"
  | "CANCELED"
  | "EXPIRED";

export type ImageJobKind = "GENERATE" | "EDIT";

export interface ImageJob {
  id: number;
  kind: ImageJobKind;
  model: string;
  prompt: string;
  ratio: ImageRatio;
  status: ImageJobStatus;
  creditCost: number;
  progress: string | null;
  error: string | null;
  /** 내 앞에 남은 작업 수. PENDING일 때만 값이 있다. */
  position: number | null;
  /** AI 서버가 꺼져 있어 기다리는 중이다. */
  waitingForServer: boolean;
  image: { id: number; imageUrl: string; ratio: ImageRatio } | null;
  createdAt: string;
  finishedAt: string | null;
  expiresAt: string;
}

export interface ImageJobsResponse {
  success: boolean;
  jobs: ImageJob[];
}

export type ImageJobHistoryFilter =
  | "all"
  | "active"
  | "succeeded"
  | "failed"
  | "canceled";

export interface ImageJobHistorySummary {
  total: number;
  active: number;
  succeeded: number;
  /** FAILED + EXPIRED */
  failed: number;
  canceled: number;
  /** 완성된 요청에 쓴 크레딧 */
  spentCredits: number;
  /** 진행 중인 요청에 먼저 잡아 둔 크레딧 */
  reservedCredits: number;
  /** 실패·취소·만료로 돌려받은 크레딧 */
  refundedCredits: number;
}

export interface ImageJobHistoryResponse {
  success: boolean;
  jobs: ImageJob[];
  totalCount: number;
  currentPage: number;
  hasNextPage: boolean;
  summary: ImageJobHistorySummary;
}

export interface EnqueueImageJobResponse {
  success: boolean;
  job: ImageJob;
}
