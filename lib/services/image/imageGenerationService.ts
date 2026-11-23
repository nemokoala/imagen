import OpenAI from "openai";
import { GoogleGenAI, PersonGeneration } from "@google/genai";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import mime from "mime";
import { prisma } from "../../prisma";
import { authService } from "../auth/authService";
import { creditSettingsService } from "../admin/creditSettingsService";
import { ApiError } from "@/lib/errors/AppError";
import { ImageRatio } from "@/types/image.interfaces";
import { MODEL_RATIO_CONFIG, getResolution } from "@/constants/model.constants";
import { Model } from "@/types/model.interfaces";

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
  ratio?: ImageRatio;
  categorySlugs?: string[]; // 카테고리 slug 배열
}

export interface GenerateImageResponse {
  success: boolean;
  imageUrl?: string;
  id?: number;
  ratio?: ImageRatio;
  error?: string;
}

export const imageGenerationService = {
  async generateImageByOpenAI(
    request: GenerateImageRequest,
  ): Promise<GenerateImageResponse> {
    try {
      const {
        prompt,
        model,
        userId,
        categorySlugs,
        ratio = ImageRatio.RATIO_1_1,
      } = request;

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
      const resolution = getResolution(Model.DALL_E_3, ratio);
      const result = await client.images.generate({
        model,
        prompt,
        size: resolution.size as "1024x1024" | "1024x1792" | "1792x1024",
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
      const savedImage = await imageGenerationService.saveImageToDatabase({
        userId,
        prompt,
        imageUrl: savedImagePath,
        model,
        size: resolution.size,
        ratio,
        categorySlugs: categorySlugs,
      });

      return {
        success: true,
        imageUrl: savedImagePath,
        id: savedImage.id,
        ratio: savedImage.ratio as ImageRatio,
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

  async generateImageByGoogleImagen(
    request: GenerateImageRequest,
  ): Promise<GenerateImageResponse> {
    try {
      const {
        prompt,
        model,
        userId,
        categorySlugs,
        ratio = ImageRatio.RATIO_1_1,
      } = request;

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
          aspectRatio:
            MODEL_RATIO_CONFIG[Model.GOOGLE_IMAGEN].aspectRatioMap?.[ratio] ??
            "1:1",
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
      const savedImage = await imageGenerationService.saveImageToDatabase({
        userId,
        prompt,
        imageUrl: savedImagePath,
        model,
        size: getResolution(Model.GOOGLE_IMAGEN, ratio).size,
        ratio,
        categorySlugs,
      });

      return {
        success: true,
        imageUrl: savedImagePath,
        id: savedImage.id,
        ratio: savedImage.ratio as ImageRatio,
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

  async generateImageByNanoBanana(
    request: GenerateImageRequest,
  ): Promise<GenerateImageResponse> {
    try {
      const {
        prompt,
        model,
        userId,
        categorySlugs,
        ratio = ImageRatio.RATIO_1_1,
      } = request;

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

      // 데이터베이스에 이미지 정보 저장 (Nano Banana는 1:1 고정 출력)
      const savedImage = await imageGenerationService.saveImageToDatabase({
        userId,
        prompt,
        imageUrl: savedImagePath,
        model,
        size: "1024x1024",
        ratio,
        categorySlugs,
      });

      return {
        success: true,
        imageUrl: savedImagePath,
        id: savedImage.id,
        ratio: savedImage.ratio as ImageRatio,
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

      // 버퍼를 파일로 저장
      return await imageGenerationService.saveImageBufferToFileSystem(
        imageBuffer,
        userId,
      );
    } catch (error) {
      console.error("Error saving image to file system:", error);
      if (error instanceof ApiError) throw error;
      throw new ApiError("이미지 파일 저장에 실패했습니다.", 500);
    }
  },

  /**
   * 이미지 버퍼를 파일 시스템에 저장하고 접근 경로를 반환한다.
   * (FormData 업로드 등 이미 버퍼를 가진 경우 직접 사용)
   */
  async saveImageBufferToFileSystem(
    imageBuffer: Buffer,
    userId: number,
  ): Promise<string> {
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
    await writeFile(filePath, imageBuffer);
    console.log("🔍 [DEBUG] Saved file to:", filePath);
    // API 라우트를 통한 접근 경로 반환
    return `/api/uploads/images/${userId}/${fileName}`;
  },

  async saveImageToDatabase(imageData: {
    userId: number;
    prompt: string;
    translatedPrompt?: string; // 번역된 프롬프트 (번역이 된 경우에만)
    imageUrl: string;
    model: string;
    size: string;
    ratio: ImageRatio;
    categorySlugs?: string[]; // 카테고리 slug 배열 (선택)
  }) {
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

      return newImage;
    } catch (error) {
      console.error("Error saving image to database:", error);
      throw new ApiError("이미지 정보 저장에 실패했습니다.", 500);
    }
  },

  /**
   * 편집기에서 수정한 이미지를 저장한다.
   * - editData: fabric 캔버스 JSON (재편집용)
   * - editedImageBuffer: 캔버스 렌더 결과 PNG 버퍼 (파일로 저장 후 editedImageUrl 갱신)
   * 본인 이미지일 때만 수정 가능하다.
   */
  async updateImageEdit(params: {
    imageId: number;
    userId: number;
    editData: string;
    editedImageBuffer: Buffer;
  }) {
    const { imageId, userId, editData, editedImageBuffer } = params;

    const image = await prisma.generatedImage.findUnique({
      where: { id: imageId },
      select: { id: true, userId: true },
    });

    if (!image) {
      throw new ApiError("이미지를 찾을 수 없습니다.", 404, "IMAGE_NOT_FOUND");
    }

    if (image.userId !== userId) {
      throw new ApiError("이미지를 편집할 권한이 없습니다.", 403, "FORBIDDEN");
    }

    // 캔버스 렌더 결과를 파일로 저장
    const editedImageUrl =
      await imageGenerationService.saveImageBufferToFileSystem(
        editedImageBuffer,
        userId,
      );

    const updated = await prisma.generatedImage.update({
      where: { id: imageId },
      data: { editData, editedImageUrl },
    });

    return updated;
  },

  // 모델 서버가 꺼져 있는 것은 정상적인 상태이므로 throw하지 않고 false를 반환한다
  async stableHealthCheck(): Promise<boolean> {
    try {
      const response = await fetch(
        `${process.env.STABLE_DIFFUSION_API_URL}/user`,
        { signal: AbortSignal.timeout(3000) },
      );

      return response.ok;
    } catch {
      return false;
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

      return response.ok;
    } catch {
      return false;
    }
  },
};
