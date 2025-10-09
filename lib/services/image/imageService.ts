import OpenAI from "openai";
import { GoogleGenAI, PersonGeneration } from "@google/genai";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import mime from "mime";
import { prisma } from "../../prisma";
import { ollamaService } from "../ollamaService";
import { authService } from "../auth/authService";
import { creditConstants } from "@/constants/credit.constants";

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
}

export interface GenerateImageResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

export const imageService = {
  async generateImageByOpenAI(
    request: GenerateImageRequest
  ): Promise<GenerateImageResponse> {
    try {
      const { prompt, model, userId } = request;

      if (!prompt) {
        return { success: false, error: "프롬프트가 필요합니다." };
      }

      const credit = await authService.getCreditById(userId);
      if (credit.credits < creditConstants.DALL_E_3) {
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

      await authService.updateUserCredit(userId, -creditConstants.DALL_E_3);

      const imageUrl = result.data[0].url;

      // 이미지를 파일시스템에 저장
      const savedImagePath = await imageService.saveImageToFileSystem(
        imageUrl,
        userId
      );

      // 데이터베이스에 이미지 정보 저장
      await imageService.saveImageToDatabase({
        userId,
        prompt,
        imageUrl: savedImagePath,
        model,
        size: "1024x1024",
      });

      return {
        success: true,
        imageUrl: savedImagePath,
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
    request: GenerateImageRequest
  ): Promise<GenerateImageResponse> {
    try {
      const { prompt, model, userId } = request;

      if (!prompt) {
        return { success: false, error: "프롬프트가 필요합니다." };
      }

      const credit = await authService.getCreditById(userId);
      if (credit.credits < creditConstants.STABLE_DIFFUSION_XL) {
        return { success: false, error: "크레딧이 부족합니다." };
      }

      let translatedPrompt = prompt;
      try {
        translatedPrompt = await ollamaService.translateText(prompt);
      } catch (error) {
        console.error("Error translating prompt:", error);
      }

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
        }
      );

      if (!response.ok) {
        return { success: false, error: "이미지 생성에 실패했습니다." };
      }

      await authService.updateUserCredit(
        userId,
        -creditConstants.STABLE_DIFFUSION_XL
      );

      const data = await response.json();

      const imageUrl = data.images[0];

      const savedImagePath = await imageService.saveImageToFileSystem(
        imageUrl,
        userId
      );

      await imageService.saveImageToDatabase({
        userId,
        prompt,
        imageUrl: savedImagePath,
        model,
        size: "1024x1024",
      });

      return {
        success: true,
        imageUrl: savedImagePath,
      };
    } catch (error) {
      console.error("Error generating image by Stable Diffusion:", error);
      return { success: false, error: "이미지 생성에 실패했습니다." };
    }
  },

  async generateImageByGoogleImagen(
    request: GenerateImageRequest
  ): Promise<GenerateImageResponse> {
    try {
      const { prompt, model, userId } = request;

      if (!prompt) {
        return { success: false, error: "프롬프트가 필요합니다." };
      }

      const credit = await authService.getCreditById(userId);
      if (credit.credits < creditConstants.GOOGLE_IMAGEN) {
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

      await authService.updateUserCredit(
        userId,
        -creditConstants.GOOGLE_IMAGEN
      );

      // 이미지를 파일시스템에 저장
      const savedImagePath = await imageService.saveImageToFileSystem(
        `data:image/jpeg;base64,${imageData}`,
        userId
      );

      // 데이터베이스에 이미지 정보 저장
      await imageService.saveImageToDatabase({
        userId,
        prompt,
        imageUrl: savedImagePath,
        model,
        size: "1024x1024",
      });

      return {
        success: true,
        imageUrl: savedImagePath,
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
    request: GenerateImageRequest
  ): Promise<GenerateImageResponse> {
    try {
      const { prompt, model, userId } = request;

      if (!prompt) {
        return { success: false, error: "프롬프트가 필요합니다." };
      }

      const credit = await authService.getCreditById(userId);
      if (credit.credits < creditConstants.NANO_BANANA) {
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

      await authService.updateUserCredit(userId, -creditConstants.NANO_BANANA);

      // 이미지를 파일시스템에 저장
      const savedImagePath = await imageService.saveImageToFileSystem(
        `data:image/${fileExtension};base64,${imageData}`,
        userId
      );

      // 데이터베이스에 이미지 정보 저장
      await imageService.saveImageToDatabase({
        userId,
        prompt,
        imageUrl: savedImagePath,
        model,
        size: "1024x1024",
      });

      return {
        success: true,
        imageUrl: savedImagePath,
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
    userId: number
  ): Promise<string> {
    try {
      let imageBuffer: Buffer;
      // 이미지 URL에서 이미지 데이터 가져오기
      if (imageUrl.includes("https://")) {
        const response = await fetch(imageUrl);
        imageBuffer = Buffer.from(await response.arrayBuffer());
      } else {
        const base64Image = imageUrl.replace(/^data:image\/[a-z]+;base64,/, "");
        imageBuffer = Buffer.from(base64Image, "base64");
      }

      // 저장할 디렉토리 생성
      const uploadDir = join(
        process.cwd(),
        "uploads",
        "images",
        userId.toString()
      );
      await mkdir(uploadDir, { recursive: true });

      // 파일명 생성 (timestamp + random string)
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileName = `${timestamp}_${randomString}.png`;
      const filePath = join(uploadDir, fileName);

      // 파일 저장
      await writeFile(filePath, Buffer.from(imageBuffer));

      // API 라우트를 통한 접근 경로 반환
      return `/api/uploads/images/${userId}/${fileName}`;
    } catch (error) {
      console.error("Error saving image to file system:", error);
      throw new Error("이미지 파일 저장에 실패했습니다.");
    }
  },

  async saveImageToDatabase(imageData: {
    userId: number;
    prompt: string;
    imageUrl: string;
    model: string;
    size: string;
  }) {
    try {
      await prisma.generatedImage.create({
        data: imageData,
      });
    } catch (error) {
      console.error("Error saving image to database:", error);
      throw new Error("이미지 정보 저장에 실패했습니다.");
    }
  },

  async getUserImages(userId: number) {
    try {
      return await prisma.generatedImage.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
    } catch (error: unknown) {
      console.error("Error fetching user images:", error);
      throw new Error("사용자 이미지 조회에 실패했습니다.");
    }
  },

  async getImageById(id: number) {
    try {
      return await prisma.generatedImage.findUnique({
        where: { id },
        include: { user: { select: { nickname: true } } },
      });
    } catch (error: unknown) {
      console.error("Error fetching image by id:", error);
      throw new Error("이미지 조회에 실패했습니다.");
    }
  },

  async getAllImages(page: number = 1, limit: number = 20) {
    try {
      const skip = (page - 1) * limit;

      const [images, totalCount] = await Promise.all([
        prisma.generatedImage.findMany({
          include: {
            user: {
              select: {
                id: true,
                nickname: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        prisma.generatedImage.count(),
      ]);

      return {
        images,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPrevPage: page > 1,
      };
    } catch (error: unknown) {
      console.error("Error fetching all images:", error);
      throw new Error("모든 이미지 조회에 실패했습니다.");
    }
  },

  async stableHealthCheck(): Promise<boolean> {
    try {
      const response = await fetch(
        `${process.env.STABLE_DIFFUSION_API_URL}/user`
      );
      if (!response.ok) {
        throw new Error("Failed to check stable health");
      }

      return response.ok;
    } catch (error) {
      console.error("Error checking stable health:", error);
      throw new Error("Failed to check stable health");
    }
  },
};
