import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/services/auth/authService";
import { notificationService } from "@/lib/services/notification/notificationService";
import { errorHandler } from "@/lib/errors/errorHandler";
import { cookies } from "next/headers";
import { ApiError } from "@/lib/errors/AppError";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 특정 이미지와 관련된 알림 읽음 처리
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ imageId: string }> },
) {
  try {
    const cookieStore = await cookies();
    const userId = await authService.getUserIdFromCookie(cookieStore);
    const { imageId } = await params;
    const imageIdNum = parseInt(imageId);

    if (isNaN(imageIdNum)) {
      throw new ApiError("이미지 ID가 유효하지 않습니다.", 400);
    }

    await notificationService.markAsReadByImageId(imageIdNum, userId);

    return NextResponse.json({
      success: true,
      message: "이미지 관련 알림을 읽음 처리했습니다.",
    });
  } catch (error: unknown) {
    return errorHandler(error);
  }
}
