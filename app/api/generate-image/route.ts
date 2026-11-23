// app/api/generate-image/route.ts
import { NextRequest, NextResponse } from "next/server";
import { imageService } from "@/lib/services/image/imageService";
import { authService } from "@/lib/services/auth/authService";
import { cookies } from "next/headers";
import { errorHandler } from "@/lib/errors/errorHandler";
import { ApiError } from "@/lib/errors/AppError";
import { Model } from "@/types/model.interfaces";
import { ImageRatio } from "@/types/image.interfaces";
import { discordService } from "@/lib/services/logs/logService";
import { imageJobService } from "@/lib/services/image/jobs/imageJobService";
import { imageJobWorker } from "@/lib/services/image/jobs/imageJobWorker";
import { isLocalModel } from "@/constants/model.constants";
import { creditSettingsService } from "@/lib/services/admin/creditSettingsService";
import { promptSafetyService } from "@/lib/services/image/promptSafetyService";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const maxDuration = 60;

// 계정 생성 검증 전까지 서버 전체 요청 횟수 제한 (Stable Diffusion 제외)
let totalRequestCount = 0;
const MAX_TOTAL_REQUESTS = 5;

export async function POST(req: NextRequest) {
  try {
    const { prompt, model, categories, ratio } = await req.json();
    const imageRatio = Object.values(ImageRatio).includes(ratio)
      ? (ratio as ImageRatio)
      : ImageRatio.RATIO_1_1;

    if (typeof prompt !== "string" || !prompt.trim()) {
      throw new ApiError("프롬프트가 필요합니다.", 400, "PROMPT_REQUIRED");
    }

    await creditSettingsService.assertModelEnabled(model);

    // 로컬 모델은 전체 요청 횟수 제한에서 제외한다.
    const isLocal = isLocalModel(model);

    if (!isLocal && totalRequestCount >= MAX_TOTAL_REQUESTS) {
      throw new ApiError(
        `테스트 요청 한도에 도달했습니다. (전체 ${MAX_TOTAL_REQUESTS}회)`,
        429,
        "RATE_LIMIT_EXCEEDED",
      );
    }

    const cookieStore = await cookies();
    const userId = await authService.getUserIdFromCookie(cookieStore);

    await promptSafetyService.assertAllowed(prompt, model);

    // 로컬 모델은 대기열에 접수하고 바로 응답한다. 생성은 워커가 하고 클라이언트는 작업 상태를 조회한다.
    if (isLocal) {
      const job = await imageJobService.enqueue({
        userId,
        model,
        prompt,
        ratio: imageRatio,
        categorySlugs: categories,
      });
      imageJobWorker.wake();

      return NextResponse.json({ success: true, job }, { status: 202 });
    }

    // 기존 로직 (다른 모델들)
    let result;

    if (model === Model.DALL_E_3) {
      result = await imageService.generateImageByOpenAI({
        prompt,
        model,
        userId,
        ratio: imageRatio,
        categorySlugs: categories,
      });
    } else if (model === Model.GOOGLE_IMAGEN) {
      result = await imageService.generateImageByGoogleImagen({
        prompt,
        model,
        userId,
        ratio: imageRatio,
        categorySlugs: categories,
      });
    } else if (model === Model.NANO_BANANA) {
      result = await imageService.generateImageByNanoBanana({
        prompt,
        model,
        userId,
        ratio: imageRatio,
        categorySlugs: categories,
      });
    } else {
      // Fallback or Unknown model
      throw new ApiError("지원하지 않는 모델입니다.", 400, "INVALID_MODEL");
    }

    if (!result.success) {
      console.log("result", result);
      let errorMessage = result.error || "이미지 생성에 실패했습니다.";
      if (result.error?.includes("blocked"))
        errorMessage = "이미지 생성이 차단되었습니다. 프롬프트를 수정해주세요.";
      throw new ApiError(errorMessage, 400, "IMAGE_GENERATION_FAILED");
    }

    // 로컬 모델은 위에서 대기열로 응답했으므로 여기에는 외부 API 모델만 온다.
    totalRequestCount++;
    console.log(`[Request Count] ${totalRequestCount}/${MAX_TOTAL_REQUESTS}`);

    // Discord 로그 전송 (비동기, 응답 대기 안 함)
    const resetCount = MAX_TOTAL_REQUESTS - totalRequestCount;
    discordService.sendLog(
      `이미지 생성 성공 (남은 요청 횟수 ${resetCount}): ${process.env.NEXT_PUBLIC_BASE_URL}${result.imageUrl}`,
    );

    return NextResponse.json(
      {
        success: true,
        imageUrl: result.imageUrl,
        id: result.id,
        ratio: result.ratio,
        remaining: MAX_TOTAL_REQUESTS - totalRequestCount,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Image generation error:", error);
    return errorHandler(error);
  }
}
