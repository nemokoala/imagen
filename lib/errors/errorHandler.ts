import { NextResponse } from "next/server";
import { ApiError } from "./AppError";

export function errorHandler(error: unknown) {
  console.error("API 에러:", error);

  if (error instanceof ApiError) {
    return NextResponse.json(
      { message: error.message },
      { status: error.statusCode }
    );
  }

  return NextResponse.json(
    { message: "서버 에러가 발생했습니다." },
    { status: 500 }
  );
}
