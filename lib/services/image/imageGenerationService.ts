import OpenAI from "openai";
import { GoogleGenAI, PersonGeneration } from "@google/genai";
import { writeFile, mkdir, readFile } from "fs/promises";
import { join } from "path";
import mime from "mime";
import { prisma } from "../../prisma";
import { ollamaService } from "../ollamaService";
import { authService } from "../auth/authService";
import { creditSettingsService } from "../admin/creditSettingsService";
import { ApiError } from "@/lib/errors/AppError";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});
const nanoBananaAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export interface GenerateImageRequest {
  prompt: string;
  model: string;
  userId: number;
  negativePrompt?: string;
  width?: number;
  height?: number;
  steps?: number;
  cfg?: number;
  seed?: number;
  categorySlugs?: string[]; // 카테고리 slug 배열
}

export interface GenerateImageResponse {
  success: boolean;
  imageUrl?: string;
  id?: number;
  error?: string;
}

export const imageGenerationService = {
  async generateImageByOpenAI(
    request: GenerateImageRequest,
  ): Promise<GenerateImageResponse> {
    try {
      const { prompt, model, userId, categorySlugs } = request;

      if (!prompt) {
        return { success: false, error: "프롬프트가 필요합니다." };
      }

      const creditSettings = await creditSettingsService.getCreditSettings();
      const creditCost = creditSettings.dallE3;

      const credit = await authService.getCreditById(userId);
      if (credit.credits < creditCost) {
        return { success: false, error: "크레딧이 부족합니다." };
      }

      // OpenAI API로 이미지 생성
      const result = await client.images.generate({
        model,
        prompt,
        size: "1024x1024",
      });

      if (!result.data?.[0]?.url) {
        return { success: false, error: "이미지 생성에 실패했습니다." };
      }

      await authService.updateUserCredit(userId, -creditCost);

      const imageUrl = result.data[0].url;

      // 이미지를 파일시스템에 저장
      const savedImagePath = await imageGenerationService.saveImageToFileSystem(
        imageUrl,
        userId,
      );

      // 데이터베이스에 이미지 정보 저장
      const imageId = await imageGenerationService.saveImageToDatabase({
        userId,
        prompt,
        imageUrl: savedImagePath,
        model,
        size: "1024x1024",
        categorySlugs,
      });

      return {
        success: true,
        imageUrl: savedImagePath,
        id: imageId,
      };
    } catch (error: unknown) {
      console.error("Image generation error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "이미지 생성 중 오류가 발생했습니다.";
      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  async generateImageByStableDiffusion(
    request: GenerateImageRequest,
  ): Promise<GenerateImageResponse> {
    const generator = this.generateImageByStableDiffusionStream(request);
    let result: GenerateImageResponse = {
      success: false,
      error: "Unknown error occurred",
    };

    for await (const step of generator) {
      if (typeof step !== "string") {
        result = step;
      }
    }

    return result;
  },

  async *generateImageByStableDiffusionStream(
    request: GenerateImageRequest,
  ): AsyncGenerator<string | GenerateImageResponse, void, unknown> {
    try {
      const { prompt, model, userId, categorySlugs } = request;

      if (!prompt) {
        yield { success: false, error: "프롬프트가 필요합니다." };
        return;
      }

      const creditSettings = await creditSettingsService.getCreditSettings();
      const creditCost = creditSettings.stableDiffusionXl;

      const credit = await authService.getCreditById(userId);
      if (credit.credits < creditCost) {
        yield { success: false, error: "크레딧이 부족합니다." };
        return;
      }

      yield "프롬프트를 번역하고 분석하는 중입니다...";
      let translatedPrompt = prompt;
      try {
        translatedPrompt = await ollamaService.translateText(prompt);
      } catch {
        console.error("ollama service error");
        // Ollama 서비스가 사용 불가능한 경우 원본 프롬프트 사용 (에러 로그 제거)
        // 번역 실패는 치명적이지 않으므로 조용히 처리
      }

      yield "이미지 생성 중...";
      const token = btoa(`${process.env.STABLE_DIFFUSION_API_KEY}`);
      const requestBody = {
        prompt: translatedPrompt,
        negative_prompt: "blurry, low quality",
        steps: 24,
        cfg_scale: 7,
        width: 1024,
        height: 1024,
        sampler_index: "DPM++ 2M Karras",
        seed: -1,
        batch_size: 1,
        n_iter: 1,
        send_images: true,
        save_images: false,
      };

      const response = await fetch(
        `${process.env.STABLE_DIFFUSION_API_URL}/sdapi/v1/txt2img`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${token}`,
          },
          body: JSON.stringify(requestBody),
        },
      );

      if (!response.ok) {
        yield { success: false, error: "이미지 생성에 실패했습니다." };
        return;
      }

      yield "이미지 데이터를 처리하고 있습니다...";
      await authService.updateUserCredit(userId, -creditCost);

      const data = await response.json();

      const imageUrl = data.images[0];

      // Stable Diffusion API는 base64 문자열을 반환하므로 data URI 형식으로 변환
      const base64ImageUrl = imageUrl.startsWith("data:image/")
        ? imageUrl
        : `data:image/png;base64,${imageUrl}`;

      const savedImagePath = await imageGenerationService.saveImageToFileSystem(
        base64ImageUrl,
        userId,
      );

      const imageId = await imageGenerationService.saveImageToDatabase({
        userId,
        prompt,
        translatedPrompt:
          translatedPrompt !== prompt ? translatedPrompt : undefined,
        imageUrl: savedImagePath,
        model,
        size: "1024x1024",
        categorySlugs,
      });

      yield {
        success: true,
        imageUrl: savedImagePath,
        id: imageId,
      };
    } catch (error) {
      console.error("Error generating image by Stable Diffusion:", error);
      yield { success: false, error: "이미지 생성에 실패했습니다." };
    }
  },

  async generateImageByGoogleImagen(
    request: GenerateImageRequest,
  ): Promise<GenerateImageResponse> {
    try {
      const { prompt, model, userId, categorySlugs } = request;

      if (!prompt) {
        return { success: false, error: "프롬프트가 필요합니다." };
      }

      const creditSettings = await creditSettingsService.getCreditSettings();
      const creditCost = creditSettings.googleImagen;

      const credit = await authService.getCreditById(userId);
      if (credit.credits < creditCost) {
        return { success: false, error: "크레딧이 부족합니다." };
      }

      // Google Imagen API로 이미지 생성
      const response = await genAI.models.generateImages({
        model: "models/imagen-4.0-generate-001",
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: "image/jpeg",
          personGeneration: PersonGeneration.ALLOW_ALL,
          aspectRatio: "1:1",
          imageSize: "1K",
        },
      });

      if (!response?.generatedImages || response.generatedImages.length === 0) {
        return { success: false, error: "이미지 생성에 실패했습니다." };
      }

      const imageData = response.generatedImages[0]?.image?.imageBytes;
      if (!imageData) {
        return { success: false, error: "이미지 데이터를 가져올 수 없습니다." };
      }

      await authService.updateUserCredit(userId, -creditCost);

      // 이미지를 파일시스템에 저장
      const savedImagePath = await imageGenerationService.saveImageToFileSystem(
        `data:image/jpeg;base64,${imageData}`,
        userId,
      );

      // 데이터베이스에 이미지 정보 저장
      const imageId = await imageGenerationService.saveImageToDatabase({
        userId,
        prompt,
        imageUrl: savedImagePath,
        model,
        size: "1024x1024",
        categorySlugs,
      });

      return {
        success: true,
        imageUrl: savedImagePath,
        id: imageId,
      };
    } catch (error: unknown) {
      console.error("Error generating image by Google Imagen:", error);

      let errorMessage = "이미지 생성 중 오류가 발생했습니다.";

      if (error instanceof Error) {
        try {
          const parsedError = JSON.parse(error.message);
          console.log("parsedError", parsedError);
          errorMessage = parsedError?.error?.message || error.message;
        } catch {
          errorMessage = error.message;
        }
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  async generateImageByZImage(
    request: GenerateImageRequest,
  ): Promise<GenerateImageResponse> {
    const generator = this.generateImageByZImageStream(request);
    let result: GenerateImageResponse = {
      success: false,
      error: "Unknown error occurred",
    };

    for await (const step of generator) {
      if (typeof step !== "string") {
        result = step;
      }
    }

    return result;
  },

  async *generateImageByZImageStream(
    request: GenerateImageRequest,
  ): AsyncGenerator<string | GenerateImageResponse, void, unknown> {
    try {
      const {
        prompt,
        model,
        userId,
        negativePrompt,
        width = 1024,
        height = 1024,
        steps,
        cfg,
        seed,
        categorySlugs,
      } = request;

      if (!prompt) {
        yield { success: false, error: "프롬프트가 필요합니다." };
        return;
      }

      const creditSettings = await creditSettingsService.getCreditSettings();
      const creditCost = creditSettings.zImage;

      const credit = await authService.getCreditById(userId);
      if (credit.credits < creditCost) {
        yield { success: false, error: "크레딧이 부족합니다." };
        return;
      }

      const COMFY_URL = process.env.COMFYUI_URL;

      yield "프롬프트를 번역하고 분석하는 중입니다...";
      let translatedPrompt = prompt;
      try {
        translatedPrompt = await ollamaService.translateText(prompt);
        console.log("translatedPrompt", translatedPrompt);
      } catch {
        console.error("ollama service error");
        // Ollama 서비스가 사용 불가능한 경우 원본 프롬프트 사용
      }

      console.log("[1/6] 요청 받음:", {
        translatedPrompt,
        negativePrompt,
        width,
        height,
        steps,
        cfg,
        seed,
      });

      yield "이미지 생성 워크플로우를 구성하는 중입니다...";
      // workflow.json 파일 읽기
      const workflowPath = join(
        process.cwd(),
        "lib",
        "services",
        "image",
        "zimage-workflow.json",
      );
      const workflowContent = await readFile(workflowPath, "utf-8");
      const wf = JSON.parse(JSON.stringify(JSON.parse(workflowContent)));

      // 기본값 설정
      const defaultNegativePrompt = wf["7"]?.inputs?.text || "blurry ugly bad";
      const defaultWidth = width || wf["13"]?.inputs?.width;
      const defaultHeight = height || wf["13"]?.inputs?.height;
      const defaultSteps = steps || wf["3"]?.inputs?.steps;
      const defaultCfg = cfg || wf["3"]?.inputs?.cfg;

      // 1) 프롬프트 교체
      wf["6"].inputs.text = translatedPrompt || wf["6"].inputs.text;
      wf["7"].inputs.text = negativePrompt || defaultNegativePrompt;

      // 2) 해상도 옵션 (노드 13: EmptySD3LatentImage)
      wf["13"].inputs.width = width || defaultWidth;
      wf["13"].inputs.height = height || defaultHeight;

      // 3) 샘플러 옵션 (노드 3: KSampler)
      wf["3"].inputs.steps = steps || defaultSteps;
      wf["3"].inputs.cfg = cfg || defaultCfg;
      // seed가 -1이거나 제공되지 않으면 랜덤으로 설정
      if (typeof seed === "number" && seed !== -1) {
        wf["3"].inputs.seed = seed;
      } else {
        // 랜덤 seed 생성 (0 ~ 2^48 - 1 범위)
        wf["3"].inputs.seed = Math.floor(Math.random() * 2 ** 48);
      }

      console.log("[2/6] 워크플로우 설정 완료:", {
        prompt: wf["6"].inputs.text.substring(0, 50) + "...",
        negativePrompt: wf["7"].inputs.text.substring(0, 50) + "...",
        width: wf["13"].inputs.width,
        height: wf["13"].inputs.height,
        steps: wf["3"].inputs.steps,
        cfg: wf["3"].inputs.cfg,
        seed: wf["3"].inputs.seed,
      });

      yield "서버에 작업을 등록하고 있습니다...";
      // 4) ComfyUI에 작업 등록
      console.log("[3/6] ComfyUI에 작업 등록 중...");
      const promptRes = await fetch(`${COMFY_URL}/api/prompt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: "external-api",
          prompt: wf,
        }),
      });

      const responseData = await promptRes.json();
      console.log("[3/6] ComfyUI 응답:", JSON.stringify(responseData, null, 2));

      if (!promptRes.ok) {
        if (responseData.node_errors) {
          const errorNodes = Object.keys(responseData.node_errors);
          const errorMessages = errorNodes.map((nodeId) => {
            const errors = responseData.node_errors[nodeId].errors;
            return `노드 ${nodeId}: ${errors
              .map(
                (e: { message?: string; type?: string }) => e.message || e.type,
              )
              .join(", ")}`;
          });
          throw new Error(
            `ComfyUI API 오류: ${promptRes.status}\n` +
              `에러 노드: ${errorMessages.join("\n")}`,
          );
        }
        throw new Error(`ComfyUI API 오류: ${promptRes.status}`);
      }

      const prompt_id =
        responseData.prompt_id ||
        (Array.isArray(responseData) ? responseData[0]?.prompt_id : null);

      if (!prompt_id) {
        throw new Error("prompt_id를 찾을 수 없습니다.");
      }

      console.log("[4/6] 작업 등록 완료, prompt_id:", prompt_id);

      yield "이미지가 생성되는 중입니다. 잠시만 기다려주세요...";
      // 5) 결과 나올 때까지 폴링
      console.log("[5/6] 결과 대기 중 (폴링 시작)...");
      type HistoryResponse = Record<
        string,
        {
          outputs?: Record<
            string,
            {
              images: Array<{
                filename: string;
                subfolder: string;
                type: string;
              }>;
            }
          >;
        }
      >;
      let history: HistoryResponse | undefined;
      let pollCount = 0;
      const maxPolls = 300; // 최대 5분 대기

      while (pollCount < maxPolls) {
        pollCount++;

        // 사용자에게 진행 상태 업데이트 (매 2초 또는 적절한 간격으로)
        if (pollCount % 2 === 0) {
          // 약 2초마다
          yield `이미지 생성 중... (${pollCount}초 경과)`;
        }

        const hRes = await fetch(`${COMFY_URL}/api/history/${prompt_id}`, {
          method: "GET",
        });

        if (!hRes.ok) {
          await new Promise((r) => setTimeout(r, 1000));
          continue;
        }

        const historyData = (await hRes.json()) as HistoryResponse;
        history = historyData;

        if (historyData[prompt_id]?.outputs) {
          console.log(`[5/6] 결과 수신 완료 (${pollCount}번째 폴링)`);
          break;
        }

        await new Promise((r) => setTimeout(r, 1000));
      }

      if (pollCount >= maxPolls || !history) {
        throw new Error(`타임아웃: 결과를 받지 못했습니다.`);
      }

      yield "생성된 이미지를 처리하고 저장하는 중입니다...";
      // 6) SaveImage 노드(9) 출력에서 이미지 정보 추출
      const output = history[prompt_id]?.outputs?.["9"];
      if (!output) {
        throw new Error("이미지 출력을 찾을 수 없습니다.");
      }
      const images = output.images;
      const first = images[0];

      // ComfyUI 이미지 URL
      const imageUrl = `${COMFY_URL}/view?filename=${encodeURIComponent(
        first.filename,
      )}&subfolder=${encodeURIComponent(
        first.subfolder,
      )}&type=${encodeURIComponent(first.type)}`;

      // 이미지를 파일시스템에 저장
      const savedImagePath = await imageGenerationService.saveImageToFileSystem(
        imageUrl,
        userId,
      );

      // 크레딧 차감
      await authService.updateUserCredit(userId, -creditCost);

      // 데이터베이스에 이미지 정보 저장
      const imageId = await imageGenerationService.saveImageToDatabase({
        userId,
        prompt,
        translatedPrompt:
          translatedPrompt !== prompt ? translatedPrompt : undefined,
        imageUrl: savedImagePath,
        model,
        size: `${width || 1024}x${height || 1024}`,
        categorySlugs,
      });

      console.log("✅ 응답 전송 완료");

      yield {
        success: true,
        imageUrl: savedImagePath,
        id: imageId,
      };
    } catch (error: unknown) {
      console.error("❌ 에러 발생:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "이미지 생성 중 오류가 발생했습니다.";
      yield {
        success: false,
        error: errorMessage,
      };
    }
  },

  async generateImageByNanoBanana(
    request: GenerateImageRequest,
  ): Promise<GenerateImageResponse> {
    try {
      const { prompt, model, userId, categorySlugs } = request;

      if (!prompt) {
        return { success: false, error: "프롬프트가 필요합니다." };
      }

      const creditSettings = await creditSettingsService.getCreditSettings();
      const creditCost = creditSettings.nanoBanana;

      const credit = await authService.getCreditById(userId);
      if (credit.credits < creditCost) {
        return { success: false, error: "크레딧이 부족합니다." };
      }

      // 나노바나나 API로 이미지 생성
      const config = {
        responseModalities: ["IMAGE", "TEXT"],
      };

      const contents = [
        {
          role: "user",
          parts: [
            {
              text: `Create an image based on this prompt: ${prompt}`,
            },
          ],
        },
      ];

      const response = await nanoBananaAI.models.generateContentStream({
        model: "gemini-2.5-flash-image",
        config,
        contents,
      });

      let imageData: string | null = null;
      let fileExtension = "png";

      for await (const chunk of response) {
        if (
          !chunk.candidates ||
          !chunk.candidates[0].content ||
          !chunk.candidates[0].content.parts
        ) {
          continue;
        }

        if (chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
          const inlineData = chunk.candidates[0].content.parts[0].inlineData;
          fileExtension =
            mime.getExtension(inlineData.mimeType || "image/png") || "png";
          imageData = inlineData.data || "";
          break; // 첫 번째 이미지만 사용
        }
      }

      if (!imageData) {
        return { success: false, error: "이미지 생성에 실패했습니다." };
      }

      await authService.updateUserCredit(userId, -creditCost);

      // 이미지를 파일시스템에 저장
      const savedImagePath = await imageGenerationService.saveImageToFileSystem(
        `data:image/${fileExtension};base64,${imageData}`,
        userId,
      );

      // 데이터베이스에 이미지 정보 저장
      const imageId = await imageGenerationService.saveImageToDatabase({
        userId,
        prompt,
        imageUrl: savedImagePath,
        model,
        size: "1024x1024",
        categorySlugs,
      });

      return {
        success: true,
        imageUrl: savedImagePath,
        id: imageId,
      };
    } catch (error: unknown) {
      console.error("Error generating image by Nano Banana:", error);

      let errorMessage = "이미지 생성 중 오류가 발생했습니다.";

      if (error instanceof Error) {
        try {
          const parsedError = JSON.parse(error.message);
          console.log("parsedError", parsedError);
          errorMessage = parsedError?.error?.message || error.message;
        } catch {
          errorMessage = error.message;
        }
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  async saveImageToFileSystem(
    imageUrl: string,
    userId: number,
  ): Promise<string> {
    try {
      let imageBuffer: Buffer;
      // 이미지 URL에서 이미지 데이터 가져오기
      if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
        const response = await fetch(imageUrl);
        if (!response.ok) {
          throw new ApiError(
            `이미지 다운로드 실패: ${response.status} ${response.statusText}`,
            response.status,
          );
        }
        imageBuffer = Buffer.from(await response.arrayBuffer());
      } else if (imageUrl.startsWith("data:image/")) {
        const base64Image = imageUrl.replace(/^data:image\/[a-z]+;base64,/, "");
        imageBuffer = Buffer.from(base64Image, "base64");
      } else {
        throw new ApiError(`지원하지 않는 이미지 URL 형식: ${imageUrl}`, 400);
      }

      // 저장할 디렉토리 생성 (환경 변수 우선, 기본값 process.cwd()/uploads)
      const uploadBaseDir =
        process.env.UPLOAD_PATH || join(process.cwd(), "uploads");

      const uploadDir = join(uploadBaseDir, "images", userId.toString());
      await mkdir(uploadDir, { recursive: true });

      // 파일명 생성 (timestamp + random string)
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileName = `${timestamp}_${randomString}.png`;
      const filePath = join(uploadDir, fileName);

      // 파일 저장
      await writeFile(filePath, Buffer.from(imageBuffer));
      console.log("🔍 [DEBUG] Saved file to:", filePath);
      // API 라우트를 통한 접근 경로 반환
      return `/api/uploads/images/${userId}/${fileName}`;
    } catch (error) {
      console.error("Error saving image to file system:", error);
      if (error instanceof ApiError) throw error;
      throw new ApiError("이미지 파일 저장에 실패했습니다.", 500);
    }
  },

  async saveImageToDatabase(imageData: {
    userId: number;
    prompt: string;
    translatedPrompt?: string; // 번역된 프롬프트 (번역이 된 경우에만)
    imageUrl: string;
    model: string;
    size: string;
    categorySlugs?: string[]; // 카테고리 slug 배열 (선택)
  }): Promise<number> {
    try {
      const { categorySlugs, ...imageInfo } = imageData;

      // 카테고리가 있으면 연결 데이터 구성
      const categoryConnect =
        categorySlugs && categorySlugs.length > 0
          ? {
              categories: {
                connect: categorySlugs.map((slug) => ({ slug })),
              },
            }
          : {};

      const newImage = await prisma.generatedImage.create({
        data: {
          ...imageInfo,
          ...categoryConnect,
        },
      });

      return newImage.id;
    } catch (error) {
      console.error("Error saving image to database:", error);
      throw new ApiError("이미지 정보 저장에 실패했습니다.", 500);
    }
  },

  async stableHealthCheck(): Promise<boolean> {
    try {
      const response = await fetch(
        `${process.env.STABLE_DIFFUSION_API_URL}/user`,
        { signal: AbortSignal.timeout(3000) },
      );

      if (!response.ok) {
        throw new ApiError("Failed to check stable health", response.status);
      }

      return response.ok;
    } catch (error) {
      console.error("Error checking stable health:", error);
      if (error instanceof ApiError) throw error;
      throw new ApiError("Failed to check stable health", 500);
    }
  },

  async comfyUIHealthCheck(): Promise<boolean> {
    try {
      const COMFY_URL = process.env.COMFYUI_URL || "http://127.0.0.1:8188";

      // ComfyUI의 system_stats 엔드포인트로 헬스체크
      const response = await fetch(`${COMFY_URL}/system_stats`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(2000),
      });

      if (!response.ok) {
        throw new ApiError(
          `ComfyUI health check failed: ${response.status}`,
          response.status,
        );
      }

      return response.ok;
    } catch (error) {
      console.error("Error checking ComfyUI health:", error);
      if (error instanceof ApiError) throw error;
      throw new ApiError("Failed to check ComfyUI health", 500);
    }
  },
};
