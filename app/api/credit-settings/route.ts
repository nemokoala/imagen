import { NextResponse } from "next/server";
import { creditSettingsService } from "@/lib/services/admin/creditSettingsService";
import { errorHandler } from "@/lib/errors/errorHandler";

// 공개 API - 크레딧 설정 조회 (인증 불필요)
export async function GET() {
  try {
    const settings = await creditSettingsService.getCreditSettings();
    return NextResponse.json(settings);
  } catch (error) {
    return errorHandler(error);
  }
}

