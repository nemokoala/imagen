import { NextRequest, NextResponse } from "next/server";
import { commentService } from "@/lib/services/image/commentService";
import { errorHandler } from "@/lib/errors/errorHandler";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const result = await commentService.getCommentsByUserId(
      parseInt(id),
      page,
      limit,
    );

    return NextResponse.json({
      success: true,
      comments: result.comments,
      totalCount: result.totalCount,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
      hasNextPage: result.hasNextPage,
      hasPrevPage: result.hasPrevPage,
    });
  } catch (error) {
    return errorHandler(error);
  }
}
