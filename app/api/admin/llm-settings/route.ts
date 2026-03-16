import { NextResponse } from "next/server";
import { checkAdminRole } from "@/lib/server-utils";
import { llmSettingsService } from "@/lib/services/admin/llmSettingsService";
import { errorHandler } from "@/lib/errors/errorHandler";

export async function GET() {
  try {
    await checkAdminRole();

    const settings = await llmSettingsService.getLlmSettings();
    return NextResponse.json(settings);
  } catch (error) {
    return errorHandler(error);
  }
}

export async function PATCH(request: Request) {
  try {
    await checkAdminRole();

    const body = await request.json();
    const updatedSettings = await llmSettingsService.updateLlmSettings(body);
    return NextResponse.json(updatedSettings);
  } catch (error) {
    return errorHandler(error);
  }
}
