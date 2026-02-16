import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/services/auth/authService";
import { likeService } from "@/lib/services/image/likeService";
import { errorHandler } from "@/lib/errors/errorHandler";
import { cookies } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

// 좋아요 추가/제거 (토글)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const cookieStore = await cookies();
    const userId = await authService.getUserIdFromCookie(cookieStore);
    const { id } = await params;
    const imageId = parseInt(id);

    const { liked } = await likeService.toggleLike(userId, imageId);

    return NextResponse.json({
      success: true,
      liked,
      message: liked ? "좋아요가 추가되었습니다." : "좋아요가 취소되었습니다.",
    });
  } catch (error: unknown) {
    console.error("좋아요 토글 에러:", error);
    return errorHandler(error);
  }
}

// 좋아요 상태 확인
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const cookieStore = await cookies();
    const { id } = await params;
    const imageId = parseInt(id);

    const currentUserId =
      await authService.tryGetUserFromCookieOrRefresh(cookieStore);

    const { likeCount, liked } = await likeService.getLikeStatus(
      imageId,
      currentUserId,
    );

    return NextResponse.json({
      success: true,
      likeCount,
      liked,
    });
  } catch (error: unknown) {
    console.error("좋아요 조회 에러:", error);
    return errorHandler(error);
  }
}
