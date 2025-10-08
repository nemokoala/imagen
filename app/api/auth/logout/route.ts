import { NextResponse } from "next/server";
import { authService } from "@/lib/services/auth/authService";
import { errorHandler } from "@/lib/errors/errorHandler";

export async function POST() {
  try {
    // authService의 로그아웃 메서드 호출
    await authService.logout();

    return NextResponse.json(
      {
        message: "로그아웃이 완료되었습니다.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("로그아웃 에러:", error);
    return errorHandler(error);
  }
}
