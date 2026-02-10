import { NextRequest, NextResponse } from "next/server";
import { categoryService } from "@/lib/services/category/categoryService";
import { errorHandler } from "@/lib/errors/errorHandler";

/**
 * POST /api/categories/suggest
 * 프롬프트 기반 카테고리 추천 (AI 분석)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { success: false, error: "프롬프트가 필요합니다." },
        { status: 400 },
      );
    }

    const suggestedCategories =
      await categoryService.suggestCategoriesFromPrompt(prompt);

    return NextResponse.json({
      success: true,
      data: suggestedCategories,
    });
  } catch (error) {
    errorHandler(error);
  }
}
