import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { authService } from "@/lib/services/auth/authService";
import {
  imageJobService,
  isImageJobHistoryFilter,
} from "@/lib/services/image/jobs/imageJobService";
import { errorHandler } from "@/lib/errors/errorHandler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_LIMIT = 50;

// 프로필 생성 요청 탭: 내 요청 전체(최신순)와 상태별 요약
export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = await authService.getUserIdFromCookie(cookieStore);

    const params = req.nextUrl.searchParams;
    const page = Math.max(1, Number.parseInt(params.get("page") ?? "1", 10) || 1);
    const limit = Math.min(
      MAX_LIMIT,
      Math.max(1, Number.parseInt(params.get("limit") ?? "20", 10) || 20),
    );
    const filterParam = params.get("filter") ?? "all";
    const filter = isImageJobHistoryFilter(filterParam) ? filterParam : "all";

    const history = await imageJobService.historyForUser(userId, { page, limit, filter });
    return NextResponse.json({ success: true, ...history });
  } catch (error: unknown) {
    return errorHandler(error);
  }
}
