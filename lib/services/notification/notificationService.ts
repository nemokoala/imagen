import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/errors/AppError";

import { NotificationType } from "@/lib/generated/prisma";

interface CreateNotificationData {
  userId: number;
  actorId: number;
  type: NotificationType;
  message: string;
  imageId?: number;
  commentId?: number;
}

export const notificationService = {
  /**
   * 알림 생성
   */
  async createNotification(data: CreateNotificationData) {
    const { userId, actorId, type, message, imageId, commentId } = data;

    // 본인에게는 알림을 보내지 않음
    if (userId === actorId) {
      return;
    }

    await prisma.notification.create({
      data: {
        userId,
        actorId,
        type,
        message,
        imageId,
        commentId,
      },
    });
  },

  /**
   * 내 알림 목록 조회
   */
  async getNotifications(userId: number) {
    const notifications = await prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        actor: {
          select: {
            id: true,
            nickname: true,
            profileImageUrl: true,
          },
        },
        image: {
          select: {
            id: true,
            imageUrl: true,
          },
        },
      },
    });

    return notifications;
  },

  /**
   * 알림 읽음 처리
   */
  async markAsRead(notificationId: number, userId: number) {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new ApiError("알림을 찾을 수 없습니다.", 404);
    }

    if (notification.userId !== userId) {
      throw new ApiError("권한이 없습니다.", 403);
    }

    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  },

  /**
   * 모든 알림 읽음 처리
   */
  async markAllAsRead(userId: number) {
    await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: { isRead: true },
    });
  },

  /**
   * 읽지 않은 알림 개수 조회
   */
  async getUnreadCount(userId: number) {
    const count = await prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });

    return count;
  },

  /**
   * 알림 삭제
   */
  async deleteNotification(notificationId: number, userId: number) {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new ApiError("알림을 찾을 수 없습니다.", 404);
    }

    if (notification.userId !== userId) {
      throw new ApiError("권한이 없습니다.", 403);
    }

    await prisma.notification.delete({
      where: { id: notificationId },
    });
  },

  /**
   * 모든 알림 삭제
   */
  async deleteAllNotifications(userId: number) {
    await prisma.notification.deleteMany({
      where: {
        userId,
      },
    });
  },
};
