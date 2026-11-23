import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { authService } from "@/lib/services/auth/authService";
import { imageJobService } from "@/lib/services/image/jobs/imageJobService";
import { errorHandler } from "@/lib/errors/errorHandler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 내 대기열: 진행 중인 작업과 최근 24시간 안에 끝난 작업
export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = await authService.getUserIdFromCookie(cookieStore);

    const jobs = await imageJobService.listForUser(userId);
    return NextResponse.json({ success: true, jobs });
  } catch (error: unknown) {
    return errorHandler(error);
  }
}
