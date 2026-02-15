import { NextRequest, NextResponse } from "next/server";
import { imageService } from "@/lib/services/image/imageService";
import { errorHandler } from "@/lib/errors/errorHandler";

import { cookies } from "next/headers";
import { authService } from "@/lib/services/auth/authService";

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

    const cookieStore = await cookies();
    let currentUserId: number | undefined;
    try {
      currentUserId = await authService.getUserIdFromCookie(cookieStore);
    } catch {
      // 로그인하지 않은 경우 무시
    }

    const result = await imageService.getAllImages(
      page,
      limit,
      undefined,
      categories,
      currentUserId,
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
