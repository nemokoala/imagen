// app/api/generate-image/route.ts
import { NextRequest, NextResponse } from "next/server";
import { imageService } from "@/lib/services/image/imageService";
import { authService } from "@/lib/services/auth/authService";
import { cookies } from "next/headers";
import { errorHandler } from "@/lib/errors/errorHandler";
import { ApiError } from "@/lib/errors/AppError";
import { Model } from "@/types/model.interfaces";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const maxDuration = 60;

// 계정 생성 검증 전까지 서버 전체 요청 횟수 제한 (Stable Diffusion 제외)
let totalRequestCount = 0;
const MAX_TOTAL_REQUESTS = 5;

export async function POST(req: NextRequest) {
  try {
    const { prompt, model } = await req.json();

    if (!prompt) {
      throw new ApiError("프롬프트가 필요합니다.", 400, "PROMPT_REQUIRED");
    }

    // 🆕 Stable Diffusion과 Z-Image 제외하고 전체 요청 횟수 체크
    const isZImage = model === Model.Z_IMAGE;
    const isStableDiffusion = model === Model.STABLE_DIFFUSION_XL;

    if (
      !isStableDiffusion &&
      !isZImage &&
      totalRequestCount >= MAX_TOTAL_REQUESTS
    ) {
      throw new ApiError(
        `테스트 요청 한도에 도달했습니다. (전체 ${MAX_TOTAL_REQUESTS}회)`,
        429,
        "RATE_LIMIT_EXCEEDED"
      );
    }

    const cookieStore = await cookies();
    const userId = await authService.getUserIdFromCookie(cookieStore);

    let result;

    if (model === Model.DALL_E_3) {
      result = await imageService.generateImageByOpenAI({
        prompt,
        model,
        userId,
      });
    } else if (model === Model.GOOGLE_IMAGEN) {
      result = await imageService.generateImageByGoogleImagen({
        prompt,
        model,
        userId,
      });
    } else if (model === Model.NANO_BANANA) {
      result = await imageService.generateImageByNanoBanana({
        prompt,
        model,
        userId,
      });
    } else if (model === Model.Z_IMAGE) {
      result = await imageService.generateImageByZImage({
        prompt,
        model,
        userId,
      });
    } else {
      result = await imageService.generateImageByStableDiffusion({
        prompt,
        model,
        userId,
      });
    }

    if (!result.success) {
      console.log("result", result);
      let errorMessage = result.error || "이미지 생성에 실패했습니다.";
      if (result.error?.includes("blocked"))
        errorMessage = "이미지 생성이 차단되었습니다. 프롬프트를 수정해주세요.";
      throw new ApiError(errorMessage, 400, "IMAGE_GENERATION_FAILED");
    }

    // 🆕 성공 시 Stable Diffusion과 Z-Image 제외하고 카운트 증가
    if (!isStableDiffusion && !isZImage) {
      totalRequestCount++;
      console.log(`[Request Count] ${totalRequestCount}/${MAX_TOTAL_REQUESTS}`);
    }

    return NextResponse.json(
      {
        success: true,
        imageUrl: result.imageUrl,
        remaining:
          isStableDiffusion || isZImage
            ? "unlimited"
            : MAX_TOTAL_REQUESTS - totalRequestCount,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Image generation error:", error);
    return errorHandler(error);
  }
}
