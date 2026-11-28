import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { authService } from "@/lib/services/auth/authService";
import { creditSettingsService } from "@/lib/services/admin/creditSettingsService";
import { imageJobService } from "@/lib/services/image/jobs/imageJobService";
import { imageJobWorker } from "@/lib/services/image/jobs/imageJobWorker";
import type { EditImageMime, EditUpload } from "@/lib/services/image/jobs/jobInputs";
import { Model } from "@/types/model.interfaces";
import { MAX_REFERENCE_IMAGES } from "@/constants/model.constants";
import { ApiError } from "@/lib/errors/AppError";
import { errorHandler } from "@/lib/errors/errorHandler";
import { promptSafetyService } from "@/lib/services/image/promptSafetyService";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES: readonly EditImageMime[] = ["image/png", "image/jpeg", "image/webp"];

async function readImage(
  value: FormDataEntryValue | null,
  required: boolean,
): Promise<EditUpload | undefined> {
  if (value === null && !required) return undefined;
  if (!(value instanceof File) || value.size === 0) {
    throw new ApiError("이미지 파일을 선택해주세요.", 400, "IMAGE_REQUIRED");
  }
  if (value.size > MAX_IMAGE_BYTES) {
    throw new ApiError("이미지는 파일당 10MB 이하여야 합니다.", 400, "IMAGE_TOO_LARGE");
  }
  if (!ALLOWED_IMAGE_TYPES.includes(value.type as EditImageMime)) {
    throw new ApiError("PNG, JPEG, WebP 이미지만 사용할 수 있습니다.", 400, "INVALID_IMAGE_TYPE");
  }
  return {
    data: Buffer.from(await value.arrayBuffer()),
    mimeType: value.type as EditImageMime,
  };
}

// 편집도 생성처럼 대기열에 접수하고 바로 응답한다. AI 서버가 꺼져 있어도 받아 두었다가 켜지면 처리한다.
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
    const referenceEntries = form.getAll("reference").filter((value) => value !== null);
    if (referenceEntries.length > MAX_REFERENCE_IMAGES) {
      throw new ApiError(
        `참고 이미지는 최대 ${MAX_REFERENCE_IMAGES}장까지 사용할 수 있습니다.`,
        400,
        "TOO_MANY_REFERENCES",
      );
    }
    const references = (
      await Promise.all(referenceEntries.map((value) => readImage(value, true)))
    ).filter((item) => item !== undefined);
    const mask = await readImage(form.get("mask"), false);
    if (mask && mask.mimeType !== "image/png") {
      throw new ApiError("편집 영역 마스크는 PNG여야 합니다.", 400, "INVALID_MASK_TYPE");
    }

    // <image1>은 원본이므로 참고 이미지는 <image2>부터 번호가 붙는다.
    // 실행 시점이 아니라 접수할 때 막아야 크레딧을 잡기 전에 사용자가 고칠 수 있다.
    const missingSlot = [...prompt.matchAll(/<image(\d+)>/g)]
      .map((match) => Number(match[1]))
      .find((index) => index > references.length + 1);
    if (missingSlot !== undefined) {
      throw new ApiError(
        `<image${missingSlot}>를 사용하려면 참고 이미지를 ${missingSlot - 1}장 이상 추가해주세요.`,
        400,
        "MISSING_REFERENCE_IMAGE",
      );
    }

    const job = await imageJobService.enqueueEdit({
      userId,
      model: Model.QWEN_IMAGE_21,
      prompt: prompt.trim(),
      uploads: { source, references, mask },
    });
    imageJobWorker.wake();

    return NextResponse.json({ success: true, job }, { status: 202 });
  } catch (error) {
    return errorHandler(error);
  }
}
