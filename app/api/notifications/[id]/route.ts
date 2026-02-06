import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/services/auth/authService";
import { notificationService } from "@/lib/services/notification/notificationService";
import { errorHandler } from "@/lib/errors/errorHandler";
import { cookies } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 알림 읽음 처리
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const cookieStore = await cookies();
    const userId = await authService.getUserIdFromCookie(cookieStore);
    const { id } = await params;
    const notificationId = parseInt(id);

    await notificationService.markAsRead(notificationId, userId);

    return NextResponse.json({
      success: true,
      message: "알림을 읽음 처리했습니다.",
    });
  } catch (error: unknown) {
    return errorHandler(error);
  }
}

// 알림 삭제
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const cookieStore = await cookies();
    const userId = await authService.getUserIdFromCookie(cookieStore);
    const { id } = await params;
    const notificationId = parseInt(id);

    await notificationService.deleteNotification(notificationId, userId);

    return NextResponse.json({
      success: true,
      message: "알림을 삭제했습니다.",
    });
  } catch (error: unknown) {
    return errorHandler(error);
  }
}
