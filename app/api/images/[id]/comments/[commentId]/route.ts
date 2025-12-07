import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/services/auth/authService";
import { commentService } from "@/lib/services/image/commentService";
import { errorHandler } from "@/lib/errors/errorHandler";
import { cookies } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

// 댓글 수정
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    const cookieStore = await cookies();
    const userId = await authService.getUserIdFromCookie(cookieStore);
    const { commentId: commentIdParam } = await params;
    const commentId = parseInt(commentIdParam);
    const { content } = await req.json();

    const updatedComment = await commentService.updateComment(
      commentId,
      userId,
      { content }
    );

    return NextResponse.json({
      success: true,
      comment: updatedComment,
      message: "댓글이 수정되었습니다.",
    });
  } catch (error: unknown) {
    console.error("댓글 수정 에러:", error);
    return errorHandler(error);
  }
}

// 댓글 삭제
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    const cookieStore = await cookies();
    const userId = await authService.getUserIdFromCookie(cookieStore);
    const { commentId: commentIdParam } = await params;
    const commentId = parseInt(commentIdParam);

    await commentService.deleteComment(commentId, userId);

    return NextResponse.json({
      success: true,
      message: "댓글이 삭제되었습니다.",
    });
  } catch (error: unknown) {
    console.error("댓글 삭제 에러:", error);
    return errorHandler(error);
  }
}
