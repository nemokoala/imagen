import type { ImageJobKind } from "@/lib/generated/prisma";
import { getResolution, type LocalModel } from "@/constants/model.constants";
import { ImageRatio } from "@/types/image.interfaces";
import { Model } from "@/types/model.interfaces";
import { llmService } from "../../llmService";
import {
  getComfyUrl,
  loadWorkflow,
  randomSeed,
  runComfyWorkflow,
  uploadComfyImage,
} from "./comfyClient";
import { loadEditInputs, parseEditInputs } from "./jobInputs";
import { GenerationFailedError, localFetch, readLocalJson } from "./localServer";

export interface LocalRunInput {
  kind: ImageJobKind;
  model: LocalModel;
  prompt: string;
  ratio: ImageRatio;
  /** 편집 작업의 입력 파일 정보(ImageJob.inputs) */
  inputs: unknown;
}

export interface LocalRunContext {
  externalId: string | null;
  onSubmitted: (externalId: string) => Promise<void>;
  onProgress: (message: string) => Promise<void>;
}

export interface LocalRunResult {
  buffer: Buffer;
  size: string;
  translatedPrompt?: string;
  /** 결과 비율이 요청과 다를 때(편집은 원본 비율을 따른다) */
  ratio?: ImageRatio;
  /** 갤러리에 저장할 모델 이름이 작업 모델과 다를 때 */
  model?: string;
}

// 번역 LLM(Ollama)도 같은 AI 서버에 있으므로 접수할 때가 아니라 실행할 때 번역한다.
async function translate(
  prompt: string,
  onProgress: LocalRunContext["onProgress"],
): Promise<string> {
  await onProgress("프롬프트를 번역하는 중입니다...");
  try {
    return await llmService.translateText(prompt);
  } catch {
    // 번역 실패는 치명적이지 않으므로 원문으로 생성한다.
    console.error("[image-job] 프롬프트 번역 실패, 원문 사용");
    return prompt;
  }
}

async function runZImage(
  input: LocalRunInput,
  ctx: LocalRunContext,
): Promise<LocalRunResult> {
  const resolution = getResolution(Model.Z_IMAGE, input.ratio);
  let translatedPrompt: string | undefined;

  const buffer = await runComfyWorkflow({
    ...ctx,
    clientId: "imagegen-zimage",
    outputNodeId: "9",
    buildWorkflow: async () => {
      const translated = await translate(input.prompt, ctx.onProgress);
      if (translated !== input.prompt) translatedPrompt = translated;

      const workflow = await loadWorkflow("zimage-workflow.json");
      workflow["6"].inputs.text = translated;
      workflow["13"].inputs.width = resolution.width;
      workflow["13"].inputs.height = resolution.height;
      workflow["3"].inputs.steps = 6;
      workflow["3"].inputs.seed = randomSeed();
      return workflow;
    },
  });

  return { buffer, size: resolution.size, translatedPrompt };
}

async function runQwenImage21(
  input: LocalRunInput,
  ctx: LocalRunContext,
): Promise<LocalRunResult> {
  const resolution = getResolution(Model.QWEN_IMAGE_21, input.ratio);

  const buffer = await runComfyWorkflow({
    ...ctx,
    clientId: "imagegen-qwen-21",
    outputNodeId: "8",
    buildWorkflow: async () => {
      const workflow = await loadWorkflow("qwen-image-21-workflow.json");
      workflow["4"].inputs.prompt = input.prompt.trim();
      workflow["5"].inputs.width = resolution.width;
      workflow["5"].inputs.height = resolution.height;
      workflow["6"].inputs.seed = randomSeed();
      return workflow;
    },
  });

  return { buffer, size: resolution.size };
}

// A1111은 요청 하나가 끝날 때까지 응답하지 않는다. 중간에 끊기면 이어 받을 방법이 없어 다시 제출한다.
async function runStableDiffusionXl(
  input: LocalRunInput,
  ctx: LocalRunContext,
): Promise<LocalRunResult> {
  const baseUrl = process.env.STABLE_DIFFUSION_API_URL?.replace(/\/$/, "");
  if (!baseUrl) {
    throw new GenerationFailedError("Stable Diffusion 서버 주소가 설정되지 않았습니다.");
  }

  const resolution = getResolution(Model.STABLE_DIFFUSION_XL, input.ratio);
  const translated = await translate(input.prompt, ctx.onProgress);

  await ctx.onProgress("이미지를 생성하는 중입니다...");
  const response = await localFetch(`${baseUrl}/sdapi/v1/txt2img`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${btoa(`${process.env.STABLE_DIFFUSION_API_KEY}`)}`,
    },
    body: JSON.stringify({
      prompt: translated,
      negative_prompt: "blurry, low quality",
      steps: 24,
      cfg_scale: 7,
      width: resolution.width,
      height: resolution.height,
      sampler_index: "DPM++ 2M Karras",
      seed: -1,
      batch_size: 1,
      n_iter: 1,
      send_images: true,
      save_images: false,
    }),
    timeoutMs: 10 * 60_000,
  });
  if (!response.ok) {
    console.error("[sdxl] 생성 실패:", response.status);
    throw new GenerationFailedError("이미지 생성에 실패했습니다.");
  }

  const data = await readLocalJson<{ images?: string[] }>(response);
  const base64 = data.images?.[0];
  if (!base64) throw new GenerationFailedError("생성된 이미지가 없습니다.");

  return {
    buffer: Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), "base64"),
    size: resolution.size,
    translatedPrompt: translated !== input.prompt ? translated : undefined,
  };
}

function getPngDimensions(image: Buffer): { width: number; height: number } {
  if (image.length < 24 || image.toString("ascii", 1, 4) !== "PNG") {
    throw new GenerationFailedError("편집 결과가 PNG 형식이 아닙니다.");
  }
  return { width: image.readUInt32BE(16), height: image.readUInt32BE(20) };
}

function closestRatio(width: number, height: number): ImageRatio {
  const ratio = width / height;
  return (Object.values(ImageRatio) as ImageRatio[]).reduce((best, current) => {
    const [w, h] = current.split(":").map(Number);
    const [bestW, bestH] = best.split(":").map(Number);
    return Math.abs(ratio - w / h) < Math.abs(ratio - bestW / bestH) ? current : best;
  }, ImageRatio.RATIO_1_1);
}

// 편집 지시문 변환 LLM과 ComfyUI 업로드 모두 AI 서버가 켜져 있어야 하므로 새로 제출할 때만 한다.
async function runQwenImage21Edit(
  input: LocalRunInput,
  ctx: LocalRunContext,
): Promise<LocalRunResult> {
  const stored = parseEditInputs(input.inputs);
  if (!stored) throw new GenerationFailedError("편집 입력 정보가 올바르지 않습니다.");

  const buffer = await runComfyWorkflow({
    ...ctx,
    clientId: "imagegen-qwen-21-edit",
    outputNodeId: "9",
    buildWorkflow: async () => {
      const { source, references, mask } = await loadEditInputs(stored);
      const comfyUrl = getComfyUrl();

      await ctx.onProgress("편집 지시문을 정리하는 중입니다...");
      let instruction = input.prompt.trim();
      try {
        instruction = await llmService.translateEditInstruction(instruction, Boolean(mask));
      } catch {
        // 변환 실패는 치명적이지 않으므로 원문 지시문을 그대로 사용한다.
        console.error("[image-job] 편집 지시문 변환 실패, 원문 사용");
      }

      await ctx.onProgress("편집할 이미지를 AI 서버에 올리는 중입니다...");
      const sourceName = await uploadComfyImage(comfyUrl, source);
      const referenceNames: string[] = [];
      for (const reference of references) {
        referenceNames.push(await uploadComfyImage(comfyUrl, reference));
      }
      const maskName = mask ? await uploadComfyImage(comfyUrl, mask) : undefined;

      const workflow = await loadWorkflow(
        maskName ? "qwen-image-21-mask-edit-workflow.json" : "qwen-image-21-edit-workflow.json",
      );
      workflow["4"].inputs.image = sourceName;
      const editPrompt = instruction.includes("<image1>")
        ? instruction
        : `Edit <image1>: ${instruction}`;
      // 지시문이 언급하지 않은 참고 이미지는 모델이 무시하기 쉬우므로 한 줄로 덧붙인다.
      const unusedSlots = referenceNames
        .map((_, index) => `<image${index + 2}>`)
        .filter((slot) => !editPrompt.includes(slot));
      workflow["5"].inputs.prompt = unusedSlots.length
        ? `${editPrompt} Use ${unusedSlots.join(" and ")} as visual references.`
        : editPrompt;
      workflow["7"].inputs.seed = randomSeed();
      if (maskName) workflow["12"].inputs.image = maskName;

      referenceNames.forEach((name, index) => {
        // 기존 워크플로 노드 번호와 겹치지 않도록 참고 이미지는 100번대를 쓴다.
        const loadId = String(100 + index);
        workflow[loadId] = { class_type: "LoadImage", inputs: { image: name } };
        let outputId = loadId;
        if (maskName) {
          // 마스크 워크플로는 원본을 1MP·32 배수로 맞추므로 참고 이미지도 같은 기준으로 줄인다.
          outputId = String(200 + index);
          workflow[outputId] = {
            class_type: "ImageScaleToTotalPixels",
            inputs: {
              image: [loadId, 0],
              upscale_method: "lanczos",
              megapixels: 1.0,
              resolution_steps: 32,
            },
          };
        }
        workflow["5"].inputs[`images.image_${index + 2}`] = [outputId, 0];
      });
      return workflow;
    },
  });

  const { width, height } = getPngDimensions(buffer);
  return {
    buffer,
    size: `${width}x${height}`,
    ratio: closestRatio(width, height),
    model: "Qwen-Image-2.1-Edit",
  };
}

const GENERATE_RUNNERS: Record<
  LocalModel,
  (input: LocalRunInput, ctx: LocalRunContext) => Promise<LocalRunResult>
> = {
  [Model.Z_IMAGE]: runZImage,
  [Model.QWEN_IMAGE_21]: runQwenImage21,
  [Model.STABLE_DIFFUSION_XL]: runStableDiffusionXl,
};

export function runLocalModel(input: LocalRunInput, ctx: LocalRunContext) {
  if (input.kind === "EDIT") {
    if (input.model !== Model.QWEN_IMAGE_21) {
      throw new GenerationFailedError("편집을 지원하지 않는 모델입니다.");
    }
    return runQwenImage21Edit(input, ctx);
  }
  return GENERATE_RUNNERS[input.model](input, ctx);
}
