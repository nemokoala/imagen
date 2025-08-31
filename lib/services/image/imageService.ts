import OpenAI from "openai";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { prisma } from "../../prisma";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const defaultModel = "dall-e-3";

export interface GenerateImageRequest {
  prompt: string;
  model?: string;
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
      const { prompt, model = defaultModel, userId } = request;

      if (!prompt) {
        return { success: false, error: "프롬프트가 필요합니다." };
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
      const { prompt, model = defaultModel, userId } = request;

      if (!prompt) {
        return { success: false, error: "프롬프트가 필요합니다." };
      }

      const token = btoa(`${process.env.STABLE_DIFFUSION_API_KEY}`);
      const requestBody = {
        prompt: prompt,
        negative_prompt: "blurry, low quality",
        steps: 24,
        cfg_scale: 7,
        width: 768,
        height: 768,
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
        size: "768x768",
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
};
