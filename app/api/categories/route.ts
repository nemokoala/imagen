import { NextResponse } from "next/server";
import { categoryService } from "@/lib/services/category/categoryService";

/**
 * GET /api/categories
 * 모든 카테고리 조회
 */
export async function GET() {
  try {
    const categories = await categoryService.getAllCategories();

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, error: "카테고리 조회에 실패했습니다." },
      { status: 500 },
    );
  }
}
