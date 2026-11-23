import { ImageRatio } from "./image.interfaces";

export type ImageJobStatus =
  | "PENDING"
  | "RUNNING"
  | "SUCCEEDED"
  | "FAILED"
  | "CANCELED"
  | "EXPIRED";

export interface ImageJob {
  id: number;
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

export interface EnqueueImageJobResponse {
  success: boolean;
  job: ImageJob;
}
