import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/services/auth/authService";
import { notificationService } from "@/lib/services/notification/notificationService";
import { errorHandler } from "@/lib/errors/errorHandler";
import { cookies } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = await authService.getUserIdFromCookie(cookieStore);

    const notifications = await notificationService.getNotifications(userId);
    const unreadCount = await notificationService.getUnreadCount(userId);

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error: unknown) {
    return errorHandler(error);
  }
}

// 모든 알림 읽음 처리
export async function PATCH(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = await authService.getUserIdFromCookie(cookieStore);

    await notificationService.markAllAsRead(userId);

    return NextResponse.json({
      success: true,
      message: "모든 알림을 읽음 처리했습니다.",
    });
  } catch (error: unknown) {
    return errorHandler(error);
  }
}
