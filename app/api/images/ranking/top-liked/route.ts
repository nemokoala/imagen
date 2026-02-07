import { NextResponse } from "next/server";
import { imageService } from "@/lib/services/image/imageService";
import { errorHandler } from "@/lib/errors/errorHandler";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const images = await imageService.getTopLikedImages(limit);

    return NextResponse.json({
      success: true,
      images,
    });
  } catch (error: unknown) {
    errorHandler(error);
  }
}
