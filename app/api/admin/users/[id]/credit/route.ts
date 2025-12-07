import { NextResponse } from "next/server";
import { checkAdminRole } from "@/lib/server-utils";
import { prisma } from "@/lib/prisma";
import { errorHandler } from "@/lib/errors/errorHandler";
import { ApiError } from "@/lib/errors/AppError";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 어드민 권한 확인
    await checkAdminRole();

    const resolvedParams = await params;
    const userId = parseInt(resolvedParams.id);
    if (isNaN(userId)) {
      throw new ApiError(
        "유효하지 않은 사용자 ID입니다.",
        400,
        "INVALID_USER_ID"
      );
    }

    const body = await request.json();
    const { credits } = body;

    if (typeof credits !== "number") {
      throw new ApiError("크레딧은 숫자여야 합니다.", 400, "INVALID_CREDITS");
    }

    if (credits < 0) {
      throw new ApiError(
        "크레딧은 0 이상이어야 합니다.",
        400,
        "INVALID_CREDITS"
      );
    }

    // 유저 존재 확인 및 크레딧 업데이트
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError("사용자를 찾을 수 없습니다.", 404, "USER_NOT_FOUND");
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { credits },
      select: {
        id: true,
        email: true,
        nickname: true,
        credits: true,
        role: true,
        provider: true,
        createdAt: true,
        updatedAt: true,
        profileImageUrl: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return errorHandler(error);
  }
}
