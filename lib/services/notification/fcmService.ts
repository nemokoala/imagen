import { prisma } from "@/lib/prisma";
import admin from "@/lib/firebaseAdmin";
import { NotificationType } from "@/lib/generated/prisma";

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
      await admin.messaging().send({
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
    await prisma.user.update({
      where: { id: userId },
      data: { fcmToken: token },
    });
  },
};
