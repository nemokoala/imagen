import { prisma } from "@/lib/prisma";
import { initFirebaseAdmin } from "@/lib/firebaseAdmin";
import { NotificationType } from "@/lib/generated/prisma";
import { ApiError } from "@/lib/errors/AppError";

export const fcmService = {
  /**
   * FCM 전송
   */
  async sendFCM(
    userId: number,
    type: NotificationType,
    message: string,
    link?: string,
  ) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { fcmToken: true },
    });

    if (!user?.fcmToken) {
      return;
    }

    let title = "새로운 알림";
    if (type === NotificationType.LIKE) title = "좋아요 알림";
    if (type === NotificationType.COMMENT) title = "댓글 알림";

    try {
      // Lazy init to ensure "The default Firebase app does not exist" error is avoided
      await initFirebaseAdmin()
        .messaging()
        .send({
          token: user.fcmToken,
          data: {
            title,
            body: message,
            icon: "/icon.png",
            link: link || "",
          },
          android: {
            priority: "high",
          },
          apns: {
            payload: {
              aps: {
                contentAvailable: true,
              },
            },
          },
        });
    } catch (error) {
      console.error("FCM Send Error:", error);
      // TODO: 토큰이 유효하지 않은 경우 처리 로직 (예: DB에서 토큰 삭제)
    }
  },

  /**
   * 사용자 FCM 토큰 업데이트
   */
  async updateFCMToken(userId: number, token: string) {
    if (!token) {
      throw new ApiError("토큰이 없습니다.", 400);
    }

    // 이미 사용 중인 토큰 삭제
    await prisma.user.updateMany({
      where: { fcmToken: token },
      data: { fcmToken: null },
    });

    // 토큰 업데이트
    await prisma.user.update({
      where: { id: userId },
      data: { fcmToken: token },
    });
  },
};
