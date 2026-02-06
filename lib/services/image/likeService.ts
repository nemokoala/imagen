import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/errors/AppError";
import { NotificationType } from "@/lib/generated/prisma";
import { notificationService } from "@/lib/services/notification/notificationService";

export interface LikeStatus {
  likeCount: number;
  liked: boolean;
}

export const likeService = {
  /**
   * 좋아요 토글 (추가/제거)
   */
  async toggleLike(
    userId: number,
    imageId: number,
  ): Promise<{
    liked: boolean;
  }> {
    if (isNaN(imageId)) {
      throw new ApiError("유효하지 않은 이미지 ID입니다.", 400);
    }

    // 이미지 존재 확인
    const image = await prisma.generatedImage.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      throw new ApiError("이미지를 찾을 수 없습니다.", 404);
    }

    // 이미 좋아요가 있는지 확인
    const existingLike = await prisma.imageLike.findUnique({
      where: {
        userId_imageId: {
          userId,
          imageId,
        },
      },
    });

    if (existingLike) {
      // 좋아요 제거
      await prisma.imageLike.delete({
        where: {
          id: existingLike.id,
        },
      });

      return { liked: false };
    } else {
      // 좋아요 추가
      await prisma.imageLike.create({
        data: {
          userId,
          imageId,
        },
      });

      // 알림 생성 (자신의 게시물이 아닌 경우에만)
      if (image.userId !== userId) {
        const actor = await prisma.user.findUnique({
          where: { id: userId },
          select: { nickname: true },
        });

        if (actor) {
          await notificationService.createNotification({
            userId: image.userId, // 받는 사람 (이미지 주인)
            actorId: userId, // 보낸 사람 (좋아요 누른 사람)
            type: NotificationType.LIKE,
            imageId: imageId,
            message: `${actor.nickname}님이 회원님의 이미지를 좋아합니다.`,
          });
        }
      }

      return { liked: true };
    }
  },

  /**
   * 좋아요 상태 조회
   */
  async getLikeStatus(imageId: number, userId?: number): Promise<LikeStatus> {
    if (isNaN(imageId)) {
      throw new ApiError("유효하지 않은 이미지 ID입니다.", 400);
    }

    // 좋아요 개수 조회
    const likeCount = await prisma.imageLike.count({
      where: { imageId },
    });

    // 로그인한 사용자의 좋아요 여부 확인
    let liked = false;
    if (userId) {
      const userLike = await prisma.imageLike.findUnique({
        where: {
          userId_imageId: {
            userId,
            imageId,
          },
        },
      });
      liked = !!userLike;
    }

    return {
      likeCount,
      liked,
    };
  },
};
