import { NextResponse } from "next/server";
import { ApiError } from "./AppError";
import { discordService } from "../services/logs/logService";

export function errorHandler(error: unknown) {
  console.error("API 에러:", error);
  // 비동기 호출이지만 에러 핸들러이므로 await 없이 호출 (fire-and-forget)
  // discordService 내부에서 이미 에러를 처리하므로 .catch() 불필요
  if (
    process.env.NODE_ENV === "production" &&
    error instanceof ApiError &&
    error.statusCode !== 401
  ) {
    discordService.sendError(
      error instanceof Error ? error.message : "Unknown error",
    );
  }

  if (error instanceof ApiError) {
    return NextResponse.json(
      { message: error.message, code: error.code },
      { status: error.statusCode },
    );
  }

  return NextResponse.json(
    { message: "서버 에러가 발생했습니다." },
    { status: 500 },
  );
}
