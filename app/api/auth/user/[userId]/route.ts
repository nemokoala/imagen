import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/services/auth/authService";
import { errorHandler } from "@/lib/errors/errorHandler";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const param = await params;
    const userId = parseInt(param.userId, 10);
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: "유효하지 않은 사용자 ID입니다." },
        { status: 400 }
      );
    }

    const user = await authService.getUserInfoById(userId);

    // 민감한 정보 제거 (크레딧은 본인만 볼 수 있도록)
    const publicUserInfo = {
      id: user.id,
      profileImageUrl: user.profileImageUrl,
      nickname: user.nickname,
    };

    return NextResponse.json(publicUserInfo);
  } catch (error) {
    return errorHandler(error);
  }
}
