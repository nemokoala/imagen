import { FetchUtil } from "@/lib/Fetch.util";
import { GeneratedImage } from "../../types/image.interfaces";
import { useQuery } from "@tanstack/react-query";

export const useGetUserImagesQuery = (userId: number) => {
  return useQuery({
    queryKey: ["userImages", userId],
    queryFn: async (): Promise<GeneratedImage[]> => {
      const response = await FetchUtil.get(`/api/images/user?userId=${userId}`);
      return response.images || [];
    },
    enabled: !!userId,
  });
};

export const useGetImageByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ["image", id],
    queryFn: async (): Promise<GeneratedImage | null> => {
      try {
        const response = await FetchUtil.get(`/api/images/${id}`);
        return response.image || null;
      } catch (error: unknown) {
        if (
          error &&
          typeof error === "object" &&
          "status" in error &&
          error.status === 404
        ) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!id,
  });
};

export const useGetGalleryImagesQuery = (
  page: number = 1,
  limit: number = 20
) => {
  return useQuery({
    queryKey: ["galleryImages", page, limit],
    queryFn: async () => {
      const response = await FetchUtil.get(
        `/api/images?page=${page}&limit=${limit}`
      );
      return response;
    },
  });
};

export const useHealthCheckQuery = () => {
  return useQuery({
    queryKey: ["healthCheck"],
    queryFn: async () => {
      const response = await FetchUtil.get("/api/health-check/stable");
      return response;
    },
  });
};
