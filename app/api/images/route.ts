import { NextRequest, NextResponse } from "next/server";
import { imageService } from "@/lib/services/image/imageService";
import { errorHandler } from "@/lib/errors/errorHandler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const categoryParam = searchParams.get("category");

    // 콤마로 구분된 카테고리를 배열로 변환
    const categories = categoryParam
      ? categoryParam.split(",").filter((c) => c.trim())
      : undefined;

    const result = await imageService.getAllImages(
      page,
      limit,
      undefined,
      categories,
    );

    return NextResponse.json(
      {
        success: true,
        ...result,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Get all images error:", error);
    return errorHandler(error);
  }
}
