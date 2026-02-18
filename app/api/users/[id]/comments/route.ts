import { NextRequest, NextResponse } from "next/server";
import { commentService } from "@/lib/services/image/commentService";
import { errorHandler } from "@/lib/errors/errorHandler";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const comments = await commentService.getCommentsByUserId(parseInt(id));

    return NextResponse.json({
      success: true,
      comments,
    });
  } catch (error) {
    return errorHandler(error);
  }
}
