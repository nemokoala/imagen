import { NextRequest, NextResponse } from "next/server";
import { imageService } from "@/lib/services/image/imageService";
import { errorHandler } from "@/lib/errors/errorHandler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "사용자 ID가 필요합니다." },
        { status: 400 }
      );
    }

    const images = await imageService.getUserImages(parseInt(userId));

    return NextResponse.json(
      {
        success: true,
        images,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Get user images error:", error);
    return errorHandler(error);
  }
}
