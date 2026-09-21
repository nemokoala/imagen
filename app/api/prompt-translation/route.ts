import { NextResponse } from "next/server";
import { llmSettingsService } from "@/lib/services/admin/llmSettingsService";
import { errorHandler } from "@/lib/errors/errorHandler";

export interface PromptTranslationSettings {
  translateEnabled: boolean;
}

// 공개 API - 프롬프트 번역 사용 여부만 노출한다 (인증 불필요).
// 편집 화면에서 영어 입력을 권해야 하는지 판단하는 용도라 provider/model은 내보내지 않는다.
export async function GET() {
  try {
    const { translateEnabled } = await llmSettingsService.getLlmSettings();
    return NextResponse.json({ translateEnabled } satisfies PromptTranslationSettings);
  } catch (error) {
    return errorHandler(error);
  }
}
