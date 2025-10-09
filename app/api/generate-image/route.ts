import { NextRequest, NextResponse } from "next/server";
import { imageService } from "@/lib/services/image/imageService";
import { authService } from "@/lib/services/auth/authService";
import { cookies } from "next/headers";
import { errorHandler } from "@/lib/errors/errorHandler";
import { ApiError } from "@/lib/errors/AppError";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { prompt, model } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "프롬프트가 필요합니다." },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const userId = await authService.getUserIdFromCookie(cookieStore);

    let result;

    if (model === "dall-e-3") {
      result = await imageService.generateImageByOpenAI({
        prompt,
        model,
        userId,
      });
    } else if (model === "google-imagen") {
      result = await imageService.generateImageByGoogleImagen({
        prompt,
        model,
        userId,
      });
    } else if (model === "nano-banana") {
      result = await imageService.generateImageByNanoBanana({
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

    return NextResponse.json(
      {
        success: true,
        imageUrl: result.imageUrl,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Image generation error:", error);
    return errorHandler(error);
  }
}
