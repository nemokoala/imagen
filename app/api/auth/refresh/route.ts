import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/services/auth/authService";
import { errorHandler } from "@/lib/errors/errorHandler";
import { cookies } from "next/headers";

export async function POST(_req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;
    console.log("refreshToken", refreshToken);

    if (!refreshToken) {
      return NextResponse.json(
        { message: "리프레시 토큰이 없습니다." },
        { status: 400 },
      );
    }

    // authService를 사용하여 새로운 액세스 토큰 생성
    const { accessToken: newAccessToken } =
      await authService.refreshAccessToken(refreshToken);
    console.log("newAccessToken", newAccessToken);

    return NextResponse.json(
      {
        message: "액세스 토큰이 갱신되었습니다.",
        accessToken: newAccessToken,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("토큰 갱신 에러:", error);
    return errorHandler(error);
  }
}
