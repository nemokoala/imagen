import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/services/auth/authService";
import { errorHandler } from "@/lib/errors/errorHandler";
import { ApiError } from "@/lib/errors/AppError";
import { cookies } from "next/headers";

interface CreateUserData {
  email: string;
  password: string;
  nickname: string;
}

export const authController = {
  async register(req: NextRequest): Promise<NextResponse> {
    try {
      const data: CreateUserData = await req.json();

      const user = await authService.register(data);

      return NextResponse.json(
        {
          message: "회원가입이 완료되었습니다.",
          user,
        },
        { status: 201 }
      );
    } catch (error) {
      console.error("회원가입 에러:", error);
      return errorHandler(error);
    }
  },

  async login(req: NextRequest): Promise<NextResponse> {
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
  },

  async refreshAccessToken(): Promise<NextResponse> {
    try {
      const cookieStore = await cookies();
      const refreshToken = cookieStore.get("refreshToken")?.value;
      console.log("refreshToken", refreshToken);

      if (!refreshToken) {
        return NextResponse.json(
          { message: "리프레시 토큰이 없습니다." },
          { status: 400 }
        );
      }

      // authService를 사용하여 새로운 액세스 토큰 생성
      const newAccessToken = await authService.refreshAccessToken(refreshToken);
      console.log("newAccessToken", newAccessToken);

      return NextResponse.json(
        {
          message: "액세스 토큰이 갱신되었습니다.",
          accessToken: newAccessToken,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("토큰 갱신 에러:", error);
      return errorHandler(error);
    }
  },
};
