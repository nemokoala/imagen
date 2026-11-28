import type { LocalModel } from "@/constants/model.constants";

export interface ErrorResponse {
  message: string;
  code?: string;
  statusCode?: number;
}

//@ts-expect-error 타입 추론 문제 때문에 추가
export interface SuccessResponse<T = unkown> {
  data?: T;
  message?: string;
}

/** GET /api/health-check — 로컬 모델별 AI 서버 켜짐 여부 */
export interface LocalModelHealthResponse {
  models: Record<LocalModel, boolean>;
}
