import { getResolution, type LocalModel } from "@/constants/model.constants";
import { ImageRatio } from "@/types/image.interfaces";
import { Model } from "@/types/model.interfaces";
import { llmService } from "../../llmService";
import { loadWorkflow, randomSeed, runComfyWorkflow } from "./comfyClient";
import { GenerationFailedError, localFetch, readLocalJson } from "./localServer";

export interface LocalRunInput {
  model: LocalModel;
  prompt: string;
  ratio: ImageRatio;
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

const RUNNERS: Record<
  LocalModel,
  (input: LocalRunInput, ctx: LocalRunContext) => Promise<LocalRunResult>
> = {
  [Model.Z_IMAGE]: runZImage,
  [Model.QWEN_IMAGE_21]: runQwenImage21,
  [Model.STABLE_DIFFUSION_XL]: runStableDiffusionXl,
};

export const runLocalModel = (input: LocalRunInput, ctx: LocalRunContext) =>
  RUNNERS[input.model](input, ctx);
