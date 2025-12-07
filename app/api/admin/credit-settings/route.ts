import { NextResponse } from "next/server";
import { checkAdminRole } from "@/lib/server-utils";
import { creditSettingsService } from "@/lib/services/admin/creditSettingsService";
import { errorHandler } from "@/lib/errors/errorHandler";

export async function GET() {
  try {
    // 어드민 권한 확인
    await checkAdminRole();

    const settings = await creditSettingsService.getCreditSettings();
    return NextResponse.json(settings);
  } catch (error) {
    return errorHandler(error);
  }
}

export async function PATCH(request: Request) {
  try {
    // 어드민 권한 확인
    await checkAdminRole();

    const body = await request.json();
    const updatedSettings = await creditSettingsService.updateCreditSettings(
      body
    );
    return NextResponse.json(updatedSettings);
  } catch (error) {
    return errorHandler(error);
  }
}

