import { ApiError } from "@/lib/errors/AppError";
import { prisma } from "../../prisma";
import { jevCategoryService } from "./jevCategoryService";

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
    try {
      const settings = await prisma.llmSettings.findUnique({
        where: { id: 1 },
        select: { categoryEnabled: true },
      });
      if (settings?.categoryEnabled === false) return [];

      if (process.env.TYPESAFE_API_KEY) {
        try {
          return await jevCategoryService.suggestCategories(prompt);
        } catch (error) {
          console.error("JEV 카테고리 추천 실패, 기존 LLM으로 재시도:", error);
        }
      }

      const { llmService } = await import("../llmService");
      const result = await llmService.translateAndClassify(prompt);
      return result.categories;
    } catch (error) {
      throw new ApiError("카테고리 추천에 실패했습니다." + error, 400);
    }
  },
};
