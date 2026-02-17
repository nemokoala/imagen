import { prisma } from "../../prisma";
import type { Image as ImageType } from "@/types/image.interfaces";
import { discordService } from "../logs/logService";
import { ApiError } from "@/lib/errors/AppError";
import { unlink } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";

const getImageInclude = (currentUserId?: number) => ({
  user: {
    select: {
      id: true,
      nickname: true,
      profileImageUrl: true,
    },
  },
  categories: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
  // 현재 사용자가 좋아요를 눌렀는지 확인
  likes: currentUserId
    ? {
        where: { userId: currentUserId },
        select: { userId: true },
      }
    : false,
  _count: {
    select: {
      likes: true,
      comments: true,
    },
  },
});

export const imageRetrievalService = {
  /**
   * Prisma 쿼리 결과를 ImageType으로 변환하는 공통 함수
   */
  convertToImageType(image: {
    id: number;
    userId: number;
    prompt: string;
    translatedPrompt: string | null;
    imageUrl: string;
    model: string;
    size: string;
    editData: string | null;
    editedImageUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
    user: {
      id: number;
      nickname: string;
      profileImageUrl: string | null;
    };
    categories: {
      id: number;
      name: string;
      slug: string;
    }[];
    likes?: { userId: number }[]; // 현재 사용자의 좋아요 여부 확인용
    _count: {
      likes: number;
      comments: number;
    };
  }): ImageType {
    const { _count, createdAt, updatedAt, categories, ...imageData } = image;
    return {
      ...imageData,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
      user: {
        id: image.user.id,
        nickname: image.user.nickname,
        profileImageUrl: image.user.profileImageUrl,
      },
      categories: categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
      })),
      likeCount: _count.likes,
      commentCount: _count.comments,
      isLiked: image.likes && image.likes.length > 0 ? true : false,
    };
  },

  async getImageById(
    id: number,
    currentUserId?: number,
  ): Promise<ImageType | null> {
    try {
      const image = await prisma.generatedImage.findUnique({
        where: { id },
        include: getImageInclude(currentUserId),
      });

      if (!image) {
        discordService.sendError(`이미지 조회 실패: ${id}`);
        return null;
      }

      discordService.sendLog(
        `이미지 조회 성공: ${image.id} - ${image.prompt} - ${image.imageUrl}`,
      );

      return imageRetrievalService.convertToImageType(image);
    } catch (error: unknown) {
      console.error("Error fetching image by id:", error);
      if (error instanceof ApiError) throw error;
      throw new ApiError("이미지 조회에 실패했습니다.", 500);
    }
  },

  async getAdjacentImages(
    id: number,
    prevCount: number = 2,
    nextCount: number = 2,
    currentUserId?: number,
  ): Promise<{ prevImages: ImageType[]; nextImages: ImageType[] }> {
    try {
      // 현재 이미지 정보 가져오기
      const currentImage = await prisma.generatedImage.findUnique({
        where: { id },
        select: { id: true, createdAt: true },
      });

      if (!currentImage) {
        return { prevImages: [], nextImages: [] };
      }

      // 이전 이미지들 (ID가 작고, 최신순으로 정렬하여 최대 prevCount개)
      const prevImages = await prisma.generatedImage.findMany({
        where: {
          id: {
            lt: id,
          },
        },
        include: getImageInclude(currentUserId),
        orderBy: { id: "desc" },
        take: prevCount,
      });

      // 다음 이미지들 (ID가 크고, 오래된순으로 정렬하여 최대 nextCount개)
      const nextImages = await prisma.generatedImage.findMany({
        where: {
          id: {
            gt: id,
          },
        },
        include: getImageInclude(currentUserId),
        orderBy: { id: "asc" },
        take: nextCount,
      });

      return {
        prevImages: prevImages.map(imageRetrievalService.convertToImageType),
        nextImages: nextImages.map(imageRetrievalService.convertToImageType),
      };
    } catch (error: unknown) {
      console.error("Error fetching adjacent images:", error);
      if (error instanceof ApiError) throw error;
      throw new ApiError("이전/다음 이미지 조회에 실패했습니다.", 500);
    }
  },

  async getAllImages(
    page: number = 1,
    limit: number = 20,
    userId?: number,
    categorySlugs?: string[],
    currentUserId?: number,
  ) {
    try {
      const skip = (page - 1) * limit;

      // whereClause 구성: userId, categorySlugs 필터 적용
      const whereClause: {
        userId?: number;
        categories?: { some: { slug: { in: string[] } } };
      } = {};

      if (userId) {
        whereClause.userId = userId;
      }

      // 다중 카테고리: OR 조건으로 필터링 (해당 카테고리 중 하나라도 포함)
      if (categorySlugs && categorySlugs.length > 0) {
        whereClause.categories = {
          some: { slug: { in: categorySlugs } },
        };
      }

      const [images, totalCount] = await Promise.all([
        prisma.generatedImage.findMany({
          where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
          include: getImageInclude(currentUserId),
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        prisma.generatedImage.count({
          where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
        }),
      ]);

      // Image 타입으로 변환
      const flattenedImages = images.map((image) =>
        imageRetrievalService.convertToImageType(image),
      );

      return {
        images: flattenedImages,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPrevPage: page > 1,
      };
    } catch (error: unknown) {
      console.error("Error fetching all images:", error);
      if (error instanceof ApiError) throw error;
      throw new ApiError("모든 이미지 조회에 실패했습니다.", 500);
    }
  },

  async deleteImage(id: number): Promise<void> {
    try {
      // 이미지 정보 조회
      const image = await prisma.generatedImage.findUnique({
        where: { id },
      });

      if (!image) {
        throw new ApiError("이미지를 찾을 수 없습니다.", 404);
      }

      // 파일시스템에서 이미지 파일 삭제
      // imageUrl 형식: /api/uploads/images/${userId}/${fileName}
      if (image.imageUrl.startsWith("/api/uploads/images/")) {
        const pathParts = image.imageUrl
          .replace("/api/uploads/images/", "")
          .split("/");
        const userId = pathParts[0];
        const fileName = pathParts[1];

        const uploadBaseDir =
          process.env.UPLOAD_PATH || join(process.cwd(), "uploads");
        const filePath = join(uploadBaseDir, "images", userId, fileName);

        if (existsSync(filePath)) {
          await unlink(filePath);
          console.log(`✅ 이미지 파일 삭제 완료: ${filePath}`);
        } else {
          console.warn(`⚠️ 이미지 파일을 찾을 수 없습니다: ${filePath}`);
        }
      }

      // 데이터베이스에서 이미지 삭제 (Cascade로 좋아요와 댓글도 자동 삭제됨)
      await prisma.generatedImage.delete({
        where: { id },
      });

      console.log(`✅ 이미지 삭제 완료: ID ${id}`);
    } catch (error: unknown) {
      console.error("Error deleting image:", error);
      if (error instanceof ApiError) throw error;
      const errorMessage =
        error instanceof Error ? error.message : "이미지 삭제에 실패했습니다.";
      throw new ApiError(errorMessage, 500);
    }
  },

  async getTopLikedImages(
    limit: number = 10,
    currentUserId?: number,
  ): Promise<ImageType[]> {
    try {
      const images = await prisma.generatedImage.findMany({
        include: getImageInclude(currentUserId),
        orderBy: {
          likes: {
            _count: "desc",
          },
        },
        take: limit,
      });

      return images.map(imageRetrievalService.convertToImageType);
    } catch (error) {
      console.error("Error fetching top liked images:", error);
      throw new ApiError("인기 이미지 조회에 실패했습니다.", 500);
    }
  },

  async getMonthlyRankingImages(
    limit: number = 10,
    currentUserId?: number,
  ): Promise<ImageType[]> {
    try {
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const images = await prisma.generatedImage.findMany({
        where: {
          createdAt: {
            gte: firstDayOfMonth,
          },
        },
        include: getImageInclude(currentUserId),
        orderBy: {
          likes: {
            _count: "desc",
          },
        },
        take: limit,
      });

      return images.map(imageRetrievalService.convertToImageType);
    } catch (error) {
      console.error("Error fetching monthly ranking images:", error);
      throw new ApiError("월간 랭킹 조회에 실패했습니다.", 500);
    }
  },
};
