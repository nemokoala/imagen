import { readFile } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { authService } from "@/lib/services/auth/authService";
import { creditSettingsService } from "@/lib/services/admin/creditSettingsService";
import { getResolution } from "@/constants/model.constants";
import { ImageRatio } from "@/types/image.interfaces";
import { Model } from "@/types/model.interfaces";
import { imageGenerationService } from "./imageGenerationService";
import type {
  GenerateImageRequest,
  GenerateImageResponse,
} from "./imageGenerationService";

type ComfyHistory = Record<string, {
  status?: { status_str?: string; messages?: [string, unknown][] };
  outputs?: Record<string, {
    images?: { filename: string; subfolder: string; type: string }[];
  }>;
}>;

const workflowPath = join(
  process.cwd(),
  "lib",
  "services",
  "image",
  "qwen-image-21-workflow.json",
);

const editWorkflowPath = join(
  process.cwd(),
  "lib",
  "services",
  "image",
  "qwen-image-21-edit-workflow.json",
);

interface EditUpload {
  data: Buffer;
  mimeType: "image/png" | "image/jpeg" | "image/webp";
}

export interface EditImageRequest {
  prompt: string;
  userId: number;
  source: EditUpload;
  reference?: EditUpload;
}

async function uploadImage(comfyUrl: string, image: EditUpload): Promise<string> {
  const extension = image.mimeType === "image/jpeg" ? "jpg" : image.mimeType.split("/")[1];
  const form = new FormData();
  form.append(
    "image",
    new Blob([new Uint8Array(image.data)], { type: image.mimeType }),
    `imagegen-edit-${randomUUID()}.${extension}`,
  );
  form.append("type", "input");
  const response = await fetch(`${comfyUrl}/upload/image`, {
    method: "POST",
    body: form,
  });
  if (!response.ok) throw new Error("ComfyUI 이미지 업로드에 실패했습니다.");
  const result = await response.json();
  if (typeof result.name !== "string") {
    throw new Error("ComfyUI 이미지 업로드 응답이 올바르지 않습니다.");
  }
  return result.name;
}

function getPngDimensions(image: Buffer): { width: number; height: number } {
  if (image.length < 24 || image.toString("ascii", 1, 4) !== "PNG") {
    throw new Error("편집 결과가 PNG 형식이 아닙니다.");
  }
  return { width: image.readUInt32BE(16), height: image.readUInt32BE(20) };
}

function closestRatio(width: number, height: number): ImageRatio {
  const ratio = width / height;
  return (Object.values(ImageRatio) as ImageRatio[]).reduce((best, current) => {
    const [w, h] = current.split(":").map(Number);
    const [bestW, bestH] = best.split(":").map(Number);
    return Math.abs(ratio - w / h) < Math.abs(ratio - bestW / bestH)
      ? current
      : best;
  }, ImageRatio.RATIO_1_1);
}

export const qwenImageService = {
  async *editImageByQwenImage21Stream(
    request: EditImageRequest,
  ): AsyncGenerator<string | GenerateImageResponse, void, unknown> {
    const { prompt, userId, source, reference } = request;
    if (!prompt.trim()) {
      yield { success: false, error: "편집 지시문이 필요합니다." };
      return;
    }
    if (!reference && prompt.includes("<image2>")) {
      yield { success: false, error: "<image2>를 사용하려면 참고 이미지를 추가해주세요." };
      return;
    }

    const comfyUrl = process.env.COMFYUI_URL?.replace(/\/$/, "");
    if (!comfyUrl) {
      yield { success: false, error: "COMFYUI_URL이 설정되지 않았습니다." };
      return;
    }

    try {
      const creditSettings = await creditSettingsService.getCreditSettings();
      const creditCost = creditSettings.qwenImage21;
      const credit = await authService.getCreditById(userId);
      if (credit.credits < creditCost) {
        yield { success: false, error: "크레딧이 부족합니다." };
        return;
      }

      yield "원본 이미지를 ComfyUI에 업로드하는 중입니다...";
      const sourceName = await uploadImage(comfyUrl, source);
      const referenceName = reference
        ? await uploadImage(comfyUrl, reference)
        : undefined;

      const workflow = JSON.parse(await readFile(editWorkflowPath, "utf-8"));
      workflow["4"].inputs.image = sourceName;
      const editPrompt = prompt.includes("<image1>")
        ? prompt.trim()
        : `Edit <image1>: ${prompt.trim()}`;
      workflow["5"].inputs.prompt = referenceName && !editPrompt.includes("<image2>")
        ? `${editPrompt} Use <image2> as a visual reference.`
        : editPrompt;
      workflow["7"].inputs.seed = Math.floor(Math.random() * 2 ** 48);
      if (referenceName) {
        workflow["10"] = {
          class_type: "LoadImage",
          inputs: { image: referenceName },
        };
        workflow["5"].inputs["images.image_2"] = ["10", 0];
      }

      yield "Qwen Image 2.1 편집 작업을 등록하는 중입니다...";
      const promptResponse = await fetch(`${comfyUrl}/api/prompt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client_id: "imagegen-qwen-21-edit", prompt: workflow }),
      });
      const promptData = await promptResponse.json();
      if (!promptResponse.ok || !promptData.prompt_id) {
        console.error("Qwen Image edit prompt error:", promptData);
        throw new Error("ComfyUI가 편집 작업을 받지 못했습니다.");
      }

      const promptId = promptData.prompt_id as string;
      yield "Qwen Image 2.1로 이미지를 편집하는 중입니다...";
      let output: { filename: string; subfolder: string; type: string } | undefined;
      for (let attempt = 0; attempt < 300; attempt++) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const historyResponse = await fetch(`${comfyUrl}/api/history/${promptId}`);
        if (!historyResponse.ok) continue;
        const history = (await historyResponse.json()) as ComfyHistory;
        const result = history[promptId];
        if (result?.status?.status_str === "error") {
          console.error("Qwen Image edit execution error:", result.status);
          throw new Error("ComfyUI 편집 실행이 실패했습니다.");
        }
        output = result?.outputs?.["9"]?.images?.[0];
        if (output) break;
        if (attempt > 0 && attempt % 15 === 0) {
          yield `이미지 편집 중... (${attempt}초 경과)`;
        }
      }
      if (!output) throw new Error("이미지 편집 시간이 초과됐습니다.");

      yield "편집 결과를 저장하는 중입니다...";
      const imageUrl = new URL("/view", comfyUrl);
      imageUrl.searchParams.set("filename", output.filename);
      imageUrl.searchParams.set("subfolder", output.subfolder);
      imageUrl.searchParams.set("type", output.type);
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) throw new Error("편집 결과를 가져오지 못했습니다.");
      const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
      const { width, height } = getPngDimensions(imageBuffer);
      const savedImagePath = await imageGenerationService.saveImageBufferToFileSystem(
        imageBuffer,
        userId,
      );
      const ratio = closestRatio(width, height);
      const savedImage = await imageGenerationService.saveImageToDatabase({
        userId,
        prompt,
        imageUrl: savedImagePath,
        model: "Qwen-Image-2.1-Edit",
        size: `${width}x${height}`,
        ratio,
      });
      await authService.updateUserCredit(userId, -creditCost);

      yield {
        success: true,
        imageUrl: savedImagePath,
        id: savedImage.id,
        ratio,
      };
    } catch (error) {
      console.error("Qwen Image 2.1 edit error:", error);
      yield { success: false, error: "Qwen Image 2.1 편집에 실패했습니다." };
    }
  },

  async *generateImageByQwenImage21Stream(
    request: GenerateImageRequest,
  ): AsyncGenerator<string | GenerateImageResponse, void, unknown> {
    const {
      prompt,
      userId,
      ratio = ImageRatio.RATIO_1_1,
      categorySlugs,
    } = request;

    if (!prompt?.trim()) {
      yield { success: false, error: "프롬프트가 필요합니다." };
      return;
    }

    const comfyUrl = process.env.COMFYUI_URL?.replace(/\/$/, "");
    if (!comfyUrl) {
      yield {
        success: false,
        error: "ComfyUI 서버 URL이 설정되지 않았습니다. COMFYUI_URL을 확인해주세요.",
      };
      return;
    }

    try {
      const creditSettings = await creditSettingsService.getCreditSettings();
      const creditCost = creditSettings.qwenImage21;
      const credit = await authService.getCreditById(userId);
      if (credit.credits < creditCost) {
        yield { success: false, error: "크레딧이 부족합니다." };
        return;
      }

      const resolution = getResolution(Model.QWEN_IMAGE_21, ratio);
      const workflow = JSON.parse(await readFile(workflowPath, "utf-8"));
      workflow["4"].inputs.prompt = prompt.trim();
      workflow["5"].inputs.width = resolution.width;
      workflow["5"].inputs.height = resolution.height;
      workflow["6"].inputs.seed = Math.floor(Math.random() * 2 ** 48);

      yield "Qwen Image 2.1 작업을 등록하는 중입니다...";
      const promptResponse = await fetch(`${comfyUrl}/api/prompt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client_id: "imagegen-qwen-21", prompt: workflow }),
      });
      const promptData = await promptResponse.json();
      if (!promptResponse.ok || !promptData.prompt_id) {
        console.error("Qwen Image ComfyUI prompt error:", promptData);
        throw new Error("ComfyUI가 Qwen Image 2.1 작업을 받지 못했습니다.");
      }

      const promptId = promptData.prompt_id as string;
      yield "Qwen Image 2.1로 이미지를 생성하는 중입니다...";
      let image: { filename: string; subfolder: string; type: string } | undefined;

      for (let attempt = 0; attempt < 300; attempt++) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const historyResponse = await fetch(`${comfyUrl}/api/history/${promptId}`);
        if (!historyResponse.ok) continue;

        const history = (await historyResponse.json()) as ComfyHistory;
        const result = history[promptId];
        if (result?.status?.status_str === "error") {
          console.error("Qwen Image ComfyUI execution error:", result.status);
          throw new Error("ComfyUI에서 Qwen Image 2.1 실행이 실패했습니다.");
        }
        image = result?.outputs?.["8"]?.images?.[0];
        if (image) break;
        if (attempt > 0 && attempt % 15 === 0) {
          yield `이미지 생성 중... (${attempt}초 경과)`;
        }
      }

      if (!image) throw new Error("Qwen Image 2.1 이미지 생성 시간이 초과됐습니다.");

      yield "생성된 이미지를 저장하는 중입니다...";
      const imageUrl = new URL("/view", comfyUrl);
      imageUrl.searchParams.set("filename", image.filename);
      imageUrl.searchParams.set("subfolder", image.subfolder);
      imageUrl.searchParams.set("type", image.type);
      const savedImagePath = await imageGenerationService.saveImageToFileSystem(
        imageUrl.toString(),
        userId,
      );
      await authService.updateUserCredit(userId, -creditCost);
      const savedImage = await imageGenerationService.saveImageToDatabase({
        userId,
        prompt,
        imageUrl: savedImagePath,
        model: Model.QWEN_IMAGE_21,
        size: resolution.size,
        ratio,
        categorySlugs,
      });

      yield {
        success: true,
        imageUrl: savedImagePath,
        id: savedImage.id,
        ratio: savedImage.ratio as ImageRatio,
      };
    } catch (error) {
      console.error("Qwen Image 2.1 generation error:", error);
      yield { success: false, error: "Qwen Image 2.1 이미지 생성에 실패했습니다." };
    }
  },

  async qwenImage21HealthCheck(): Promise<boolean> {
    const comfyUrl = process.env.COMFYUI_URL?.replace(/\/$/, "");
    if (!comfyUrl) return false;
    try {
      const response = await fetch(`${comfyUrl}/object_info`, {
        signal: AbortSignal.timeout(5000),
      });
      if (!response.ok) return false;
      const nodes = await response.json();
      const models = nodes.UNETLoader?.input?.required?.unet_name?.[0];
      const clips = nodes.CLIPLoader?.input?.required?.clip_name?.[0];
      const vaes = nodes.VAELoader?.input?.required?.vae_name?.[0];
      return Boolean(
        nodes.TextEncodeQwenImage21 &&
          models?.includes("qwen_image_2.1_int8_convrot.safetensors") &&
          clips?.includes("qwen3vl_8b_int8_convrot.safetensors") &&
          vaes?.includes("qwen_image_2.1_vae_bf16.safetensors"),
      );
    } catch {
      return false;
    }
  },
};
