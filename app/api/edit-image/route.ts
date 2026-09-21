import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { authService } from "@/lib/services/auth/authService";
import { creditSettingsService } from "@/lib/services/admin/creditSettingsService";
import { imageService } from "@/lib/services/image/imageService";
import { localImageQueue } from "@/lib/services/image/localImageQueue";
import type { EditImageRequest } from "@/lib/services/image/qwenImageService";
import type { GenerateImageResponse } from "@/lib/services/image/imageService";
import { Model } from "@/types/model.interfaces";
import { ApiError } from "@/lib/errors/AppError";
import { errorHandler } from "@/lib/errors/errorHandler";
import { promptSafetyService } from "@/lib/services/image/promptSafetyService";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"] as const;

async function readImage(
  value: FormDataEntryValue | null,
  required: boolean,
): Promise<EditImageRequest["source"] | undefined> {
  if (value === null && !required) return undefined;
  if (!(value instanceof File) || value.size === 0) {
    throw new ApiError("이미지 파일을 선택해주세요.", 400, "IMAGE_REQUIRED");
  }
  if (value.size > MAX_IMAGE_BYTES) {
    throw new ApiError("이미지는 파일당 10MB 이하여야 합니다.", 400, "IMAGE_TOO_LARGE");
  }
  if (!ALLOWED_IMAGE_TYPES.includes(value.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    throw new ApiError("PNG, JPEG, WebP 이미지만 사용할 수 있습니다.", 400, "INVALID_IMAGE_TYPE");
  }
  return {
    data: Buffer.from(await value.arrayBuffer()),
    mimeType: value.type as (typeof ALLOWED_IMAGE_TYPES)[number],
  };
}

function streamResponse(
  generator: AsyncGenerator<string | GenerateImageResponse, void, unknown>,
) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of generator) {
          const payload =
            typeof chunk === "string"
              ? { status: "progress", message: chunk }
              : chunk.success
                ? { status: "complete", ...chunk }
                : { status: "error", message: chunk.error };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "이미지 편집에 실패했습니다.";
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: "error", message })}\n\n`));
      } finally {
        controller.close();
      }
    },
  });
  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = await authService.getUserIdFromCookie(cookieStore);
    await creditSettingsService.assertModelEnabled(Model.QWEN_IMAGE_21);

    const form = await req.formData();
    const prompt = form.get("prompt");
    if (typeof prompt !== "string" || !prompt.trim()) {
      throw new ApiError("편집 지시문이 필요합니다.", 400, "PROMPT_REQUIRED");
    }
    await promptSafetyService.assertAllowed(prompt, Model.QWEN_IMAGE_21);
    const source = await readImage(form.get("source"), true);
    if (!source) {
      throw new ApiError("원본 이미지가 필요합니다.", 400, "IMAGE_REQUIRED");
    }
    const reference = await readImage(form.get("reference"), false);
    const request: EditImageRequest = {
      prompt: prompt.trim(),
      userId,
      source,
      reference,
    };
    const generator = localImageQueue.enqueue({
      userId,
      model: Model.QWEN_IMAGE_21,
      signal: req.signal,
      generator: () => imageService.editImageByQwenImage21Stream(request),
    });
    return streamResponse(generator);
  } catch (error) {
    return errorHandler(error);
  }
}
