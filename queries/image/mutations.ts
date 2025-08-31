import {
  GenerateImageRequest,
  GenerateImageResponse,
} from "../../types/image.interfaces";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const imageMutations = {
  // 이미지 생성
  generateImage: async (
    request: GenerateImageRequest
  ): Promise<GenerateImageResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/generate-image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "이미지 생성에 실패했습니다.");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error generating image:", error);
      throw error;
    }
  },
};
