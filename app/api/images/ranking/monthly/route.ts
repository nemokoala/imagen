import { NextResponse } from "next/server";
import { imageService } from "@/lib/services/image/imageService";
import { errorHandler } from "@/lib/errors/errorHandler";

import { cookies } from "next/headers";
import { authService } from "@/lib/services/auth/authService";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const cookieStore = await cookies();
    let currentUserId: number | undefined;
    try {
      currentUserId = await authService.getUserIdFromCookie(cookieStore);
    } catch {
      // ignore
    }

    const images = await imageService.getMonthlyRankingImages(
      limit,
      currentUserId,
    );

    return NextResponse.json({
      success: true,
      images,
    });
  } catch (error: unknown) {
    errorHandler(error);
  }
}
