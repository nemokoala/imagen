import { NextRequest, NextResponse } from "next/server";
import { imageService } from "@/lib/services/image/imageService";
import { errorHandler } from "@/lib/errors/errorHandler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    if (!id) {
      return NextResponse.json(
        { error: "이미지 ID가 필요합니다." },
        { status: 400 }
      );
    }

    const image = await imageService.getImageById(parseInt(id));

    if (!image) {
      return NextResponse.json(
        { error: "이미지를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        image,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Get image by id error:", error);
    return errorHandler(error);
  }
}
