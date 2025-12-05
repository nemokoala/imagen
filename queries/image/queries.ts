import { FetchUtil } from "@/lib/Fetch.util";
import {
  GeneratedImage,
  GetUserImagesResponse,
  GetImageByIdResponse,
} from "../../types/image.interfaces";
import { HealthCheckResponse } from "../../types/common.interfaces";
import { GalleryResponse } from "../../components/gallery/types";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";

export const useGetUserImagesQuery = (userId: number) => {
  return useQuery({
    queryKey: ["userImages", userId],
    queryFn: async (): Promise<GeneratedImage[]> => {
      const response = (await FetchUtil.get(
        `/api/images/user?userId=${userId}`
      )) as GetUserImagesResponse;
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
        const response = (await FetchUtil.get(
          `/api/images/${id}`
        )) as GetImageByIdResponse;
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

export const useGetGalleryImagesInfiniteQuery = (limit: number = 20) => {
  return useInfiniteQuery({
    queryKey: ["galleryImagesInfinite", limit],
    queryFn: async ({ pageParam = 1 }) => {
      const response = (await FetchUtil.get(
        `/api/images?page=${pageParam}&limit=${limit}`
      )) as GalleryResponse;
      return response;
    },
    getNextPageParam: (lastPage: GalleryResponse) => {
      return lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

export const useHealthCheckQuery = ({ target }: { target: string }) => {
  return useQuery({
    queryKey: ["healthCheck", target],
    queryFn: async (): Promise<HealthCheckResponse> => {
      const response = await FetchUtil.get(`/api/health-check/${target}`);
      return response as HealthCheckResponse;
    },
    retry: false,
  });
};
