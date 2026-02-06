import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/errors/AppError";
import { NotificationType } from "@/lib/generated/prisma";
import { notificationService } from "@/lib/services/notification/notificationService";

export interface CreateCommentData {
  userId: number;
  imageId: number;
  content: string;
  parentId?: number | null;
}

export interface UpdateCommentData {
  content: string;
}

export interface CommentWithUser {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  imageId: number;
  parentId: number | null;
  user: {
    id: number;
    nickname: string;
    profileImageUrl: string | null;
  };
  replies: CommentWithUser[];
}

export const commentService = {
  /**
   * 이미지의 댓글 목록 조회 (최상위 댓글만)
   */
  async getCommentsByImageId(imageId: number): Promise<CommentWithUser[]> {
    if (isNaN(imageId)) {
      throw new ApiError("유효하지 않은 이미지 ID입니다.", 400);
    }

    const comments = await prisma.imageComment.findMany({
      where: {
        imageId,
        parentId: null, // 최상위 댓글만 조회 (대댓글 제외)
      },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            profileImageUrl: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                nickname: true,
                profileImageUrl: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return comments as CommentWithUser[];
  },

  /**
   * 댓글 작성
   */
  async createComment(data: CreateCommentData): Promise<CommentWithUser> {
    const { userId, imageId, content, parentId } = data;

    if (isNaN(imageId)) {
      throw new ApiError("유효하지 않은 이미지 ID입니다.", 400);
    }

    if (!content || content.trim().length === 0) {
      throw new ApiError("댓글 내용을 입력해주세요.", 400);
    }

    // 이미지 존재 확인
    const image = await prisma.generatedImage.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      throw new ApiError("이미지를 찾을 수 없습니다.", 404);
    }

    // 대댓글인 경우 부모 댓글 확인
    if (parentId) {
      const parentComment = await prisma.imageComment.findUnique({
        where: { id: parentId },
      });

      if (!parentComment || parentComment.imageId !== imageId) {
        throw new ApiError("유효하지 않은 부모 댓글입니다.", 400);
      }
    }

    const comment = await prisma.imageComment.create({
      data: {
        userId,
        imageId,
        content: content.trim(),
        parentId: parentId || null,
      },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            profileImageUrl: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                nickname: true,
                profileImageUrl: true,
              },
            },
          },
        },
      },
    });

    // 알림 생성 (자신의 게시물이 아닌 경우에만)
    if (image.userId !== userId) {
      await notificationService.createNotification({
        userId: image.userId, // 받는 사람 (이미지 주인)
        actorId: userId, // 보낸 사람 (댓글 작성자)
        type: NotificationType.COMMENT,
        imageId: imageId,
        commentId: comment.id,
        message: `${comment.user.nickname}님이 회원님의 이미지에 댓글을 남겼습니다.`,
      });
    }

    return comment as CommentWithUser;
  },

  /**
   * 댓글 수정
   */
  async updateComment(
    commentId: number,
    userId: number,
    data: UpdateCommentData,
  ): Promise<CommentWithUser> {
    if (isNaN(commentId)) {
      throw new ApiError("유효하지 않은 댓글 ID입니다.", 400);
    }

    if (!data.content || data.content.trim().length === 0) {
      throw new ApiError("댓글 내용을 입력해주세요.", 400);
    }

    // 댓글 소유자 확인
    const comment = await prisma.imageComment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new ApiError("댓글을 찾을 수 없습니다.", 404);
    }

    if (comment.userId !== userId) {
      throw new ApiError("댓글을 수정할 권한이 없습니다.", 403);
    }

    const updatedComment = await prisma.imageComment.update({
      where: { id: commentId },
      data: {
        content: data.content.trim(),
      },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            profileImageUrl: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                nickname: true,
                profileImageUrl: true,
              },
            },
          },
        },
      },
    });

    return updatedComment as CommentWithUser;
  },

  /**
   * 댓글 삭제
   */
  async deleteComment(commentId: number, userId: number): Promise<void> {
    if (isNaN(commentId)) {
      throw new ApiError("유효하지 않은 댓글 ID입니다.", 400);
    }

    // 댓글 소유자 확인
    const comment = await prisma.imageComment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new ApiError("댓글을 찾을 수 없습니다.", 404);
    }

    if (comment.userId !== userId) {
      throw new ApiError("댓글을 삭제할 권한이 없습니다.", 403);
    }

    await prisma.imageComment.delete({
      where: { id: commentId },
    });
  },
};
