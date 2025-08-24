export interface ErrorResponse {
  message: string;
}

//@ts-expect-error 타입 추론 문제 때문에 추가
export interface SuccessResponse<T = unkown> {
  data?: T;
  message?: string;
}
