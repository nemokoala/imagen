import { ApiError } from "@/lib/errors/AppError";
import { prisma } from "../../prisma";

export interface CategoryDto {
  id: number;
  name: string;
  slug: string;
}

export const categoryService = {
  /**
   * 모든 카테고리 조회
   */
  async getAllCategories(): Promise<CategoryDto[]> {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return categories;
  },

  /**
   * slug로 카테고리 조회
   */
  async getCategoryBySlug(slug: string): Promise<CategoryDto | null> {
    const category = await prisma.category.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    return category;
  },

  /**
   * slug 배열로 카테고리 ID 배열 조회
   */
  async getCategoryIdsBySlugs(slugs: string[]): Promise<number[]> {
    const categories = await prisma.category.findMany({
      where: {
        slug: { in: slugs },
      },
      select: { id: true },
    });

    return categories.map((c) => c.id);
  },

  /**
   * 프롬프트 기반 카테고리 추천 (AI 분석)
   */
  async suggestCategoriesFromPrompt(prompt: string): Promise<string[]> {
    // ollamaService 동적 import (순환 참조 방지)
    const { ollamaService } = await import("../ollamaService");

    try {
      const result = await ollamaService.translateAndClassify(prompt);
      return result.categories;
    } catch (error) {
      throw new ApiError("카테고리 추천에 실패했습니다." + error, 400);
    }
  },
};
