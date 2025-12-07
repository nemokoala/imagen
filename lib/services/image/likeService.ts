import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/errors/AppError";

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
    imageId: number
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
