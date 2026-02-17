import { FetchUtil } from "@/lib/Fetch.util";
import {
  GeneratedImage,
  GetUserImagesResponse,
  GetImageByIdResponse,
  Image,
} from "../../types/image.interfaces";
import { HealthCheckResponse } from "../../types/common.interfaces";
import { GalleryResponse } from "../../types/image.interfaces";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { Comment } from "@/types/image.interfaces";

export const useGetUserImagesQuery = (
  userId: number,
  page: number = 1,
  limit: number = 20,
  search?: string,
) => {
  return useQuery({
    queryKey: ["userImages", userId, page, limit, search],
    queryFn: async (): Promise<GetUserImagesResponse> => {
      const searchParam = search ? `&search=${search}` : "";
      const response = (await FetchUtil.get(
        `/api/images?userId=${userId}&page=${page}&limit=${limit}${searchParam}`,
      )) as GetUserImagesResponse;
      return response;
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
          `/api/images/${id}`,
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
  limit: number = 20,
  search?: string,
) => {
  return useQuery({
    queryKey: ["galleryImages", page, limit, search],
    queryFn: async () => {
      const searchParam = search ? `&search=${search}` : "";
      const response = (await FetchUtil.get(
        `/api/images?page=${page}&limit=${limit}${searchParam}`,
      )) as GalleryResponse;
      return response;
    },
  });
};

export const useGetGalleryImagesInfiniteQuery = (
  limit: number = 20,
  enabled: boolean = true,
  category?: string,
  search?: string,
) => {
  return useInfiniteQuery({
    queryKey: ["galleryImagesInfinite", limit, category, search],
    queryFn: async ({ pageParam = 1 }) => {
      const categoryParam = category ? `&category=${category}` : "";
      const searchParam = search ? `&search=${search}` : "";
      const response = (await FetchUtil.get(
        `/api/images?page=${pageParam}&limit=${limit}${categoryParam}${searchParam}`,
      )) as GalleryResponse;
      return response;
    },
    getNextPageParam: (lastPage: GalleryResponse) => {
      return lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    enabled,
  });
};

export const useGetUserImagesInfiniteQuery = (
  userId: number,
  limit: number = 20,
  category?: string,
  search?: string,
) => {
  return useInfiniteQuery({
    queryKey: ["userImagesInfinite", userId, limit, category, search],
    queryFn: async ({ pageParam = 1 }) => {
      const categoryParam = category ? `&category=${category}` : "";
      const searchParam = search ? `&search=${search}` : "";
      const response = (await FetchUtil.get(
        `/api/images?userId=${userId}&page=${pageParam}&limit=${limit}${categoryParam}${searchParam}`,
      )) as GetUserImagesResponse;
      return response;
    },
    getNextPageParam: (lastPage: GetUserImagesResponse) => {
      return lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!userId,
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

export const useGetLikeStatusQuery = (
  imageId: number | null,
  initialData?: { success: boolean; likeCount: number; liked: boolean },
) => {
  return useQuery({
    queryKey: ["likeStatus", imageId],
    queryFn: async () => {
      if (!imageId) return null;
      const response = (await FetchUtil.get(`/api/images/${imageId}/like`)) as {
        success: boolean;
        likeCount: number;
        liked: boolean;
      };
      return response.success ? response : null;
    },
    enabled: !!imageId,
    initialData: initialData,
  });
};

export const useGetCommentsQuery = (imageId: number | null) => {
  return useQuery<Comment[]>({
    queryKey: ["comments", imageId],
    queryFn: async (): Promise<Comment[]> => {
      if (!imageId) return [];
      const response = (await FetchUtil.get(
        `/api/images/${imageId}/comments`,
      )) as { success: boolean; comments: Comment[] };
      return response.success ? response.comments : [];
    },
    enabled: !!imageId,
  });
};

export const useGetTopLikedImagesQuery = (limit: number = 10) => {
  return useQuery({
    queryKey: ["topLikedImages", limit],
    queryFn: async () => {
      const response = (await FetchUtil.get(
        `/api/images/ranking/top-liked?limit=${limit}`,
      )) as { success: boolean; images: Image[] };
      return response.images;
    },
  });
};

export const useGetMonthlyRankingQuery = (limit: number = 10) => {
  return useQuery({
    queryKey: ["monthlyRanking", limit],
    queryFn: async () => {
      const response = (await FetchUtil.get(
        `/api/images/ranking/monthly?limit=${limit}`,
      )) as { success: boolean; images: Image[] };
      return response.images;
    },
  });
};
