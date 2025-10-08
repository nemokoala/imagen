import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/services/auth/authService";
import { errorHandler } from "@/lib/errors/errorHandler";
import { ApiError } from "@/lib/errors/AppError";

export async function POST(req: NextRequest) {
  let email = "";

  try {
    const { email: emailFromBody, password } = await req.json();
    email = emailFromBody;

    // 서비스의 로그인 메서드 호출
    const user = await authService.login(email, password);

    return NextResponse.json(
      {
        message: "로그인이 완료되었습니다.",
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("로그인 에러:", error);

    // 비밀번호 오류 시 로그인 시도 기록 (선택사항)
    if (error instanceof ApiError && error.code === "INVALID_PASSWORD") {
      try {
        // 로그인 시도 기록 로직은 별도로 구현 가능
        console.log(`로그인 실패: ${email} - 비밀번호 오류`);
      } catch (logError) {
        console.error("로그인 시도 기록 실패:", logError);
      }
    }

    return errorHandler(error);
  }
}
