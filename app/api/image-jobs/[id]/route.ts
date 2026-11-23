import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { authService } from "@/lib/services/auth/authService";
import { imageJobService } from "@/lib/services/image/jobs/imageJobService";
import { errorHandler } from "@/lib/errors/errorHandler";
import { ApiError } from "@/lib/errors/AppError";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 대기 중인 작업 취소. 선차감한 크레딧을 돌려준다.
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const cookieStore = await cookies();
    const userId = await authService.getUserIdFromCookie(cookieStore);
    const jobId = Number((await params).id);
    if (!Number.isInteger(jobId) || jobId <= 0) {
      throw new ApiError("잘못된 작업 ID입니다.", 400, "INVALID_JOB_ID");
    }

    const job = await imageJobService.cancel(userId, jobId);
    return NextResponse.json({ success: true, job });
  } catch (error: unknown) {
    return errorHandler(error);
  }
}
