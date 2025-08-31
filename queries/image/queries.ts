import { GeneratedImage } from "../../types/image.interfaces";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const imageQueries = {
  // 사용자별 이미지 목록 조회
  getUserImages: async (userId: number): Promise<GeneratedImage[]> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/images/user?userId=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("이미지 조회에 실패했습니다.");
      }

      const data = await response.json();
      return data.images || [];
    } catch (error) {
      console.error("Error fetching user images:", error);
      throw error;
    }
  },

  // 개별 이미지 조회
  getImageById: async (id: number): Promise<GeneratedImage | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/images/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error("이미지 조회에 실패했습니다.");
      }

      const data = await response.json();
      return data.image || null;
    } catch (error) {
      console.error("Error fetching image by id:", error);
      throw error;
    }
  },
};
