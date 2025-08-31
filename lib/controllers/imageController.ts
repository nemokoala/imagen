import { NextRequest, NextResponse } from "next/server";
import { imageService } from "../services/image/imageService";
import { authService } from "../services/auth/authService";
import { cookies } from "next/headers";
import { errorHandler } from "../errors/errorHandler";

export const imageController = {
  async generateImage(req: NextRequest) {
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

      const result = await imageService.generateImage({
        prompt,
        model,
        userId,
      });

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 });
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
  },

  async getUserImages(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const userId = searchParams.get("userId");

      if (!userId) {
        return NextResponse.json(
          { error: "사용자 ID가 필요합니다." },
          { status: 400 }
        );
      }

      const images = await imageService.getUserImages(parseInt(userId));

      return NextResponse.json(
        {
          success: true,
          images,
        },
        { status: 200 }
      );
    } catch (error: unknown) {
      console.error("Get user images error:", error);
      return errorHandler(error);
    }
  },

  async getImageById(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");

      if (!id) {
        return NextResponse.json(
          { error: "이미지 ID가 필요합니다." },
          { status: 400 }
        );
      }

      const image = await imageService.getImageById(parseInt(id));

      if (!image) {
        return NextResponse.json(
          { error: "이미지를 찾을 수 없습니다." },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          image,
        },
        { status: 200 }
      );
    } catch (error: unknown) {
      console.error("Get image by id error:", error);
      return errorHandler(error);
    }
  },

  async getAllImages(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const page = parseInt(searchParams.get("page") || "1");
      const limit = parseInt(searchParams.get("limit") || "20");

      const result = await imageService.getAllImages(page, limit);

      return NextResponse.json(
        {
          success: true,
          ...result,
        },
        { status: 200 }
      );
    } catch (error: unknown) {
      console.error("Get all images error:", error);
      return errorHandler(error);
    }
  },
};
