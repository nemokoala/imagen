import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/services/auth/authService";
import { commentService } from "@/lib/services/image/commentService";
import { errorHandler } from "@/lib/errors/errorHandler";
import { cookies } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

// 댓글 목록 조회
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const imageId = parseInt(id);

    const comments = await commentService.getCommentsByImageId(imageId);

    return NextResponse.json({
      success: true,
      comments,
    });
  } catch (error: unknown) {
    console.error("댓글 조회 에러:", error);
    return errorHandler(error);
  }
}

// 댓글 작성
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const userId = await authService.getUserIdFromCookie(cookieStore);
    const { id } = await params;
    const imageId = parseInt(id);
    const { content, parentId } = await req.json();

    const comment = await commentService.createComment({
      userId,
      imageId,
      content,
      parentId,
    });

    return NextResponse.json({
      success: true,
      comment,
      message: "댓글이 작성되었습니다.",
    });
  } catch (error: unknown) {
    console.error("댓글 작성 에러:", error);
    return errorHandler(error);
  }
}
