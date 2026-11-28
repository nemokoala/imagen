import { FetchUtil } from "@/lib/Fetch.util";
import {
  GeneratedImage,
  GetUserImagesResponse,
  GetImageByIdResponse,
  Image,
} from "../../types/image.interfaces";
import { LocalModelHealthResponse } from "../../types/common.interfaces";
import { GalleryResponse } from "../../types/image.interfaces";
import {
  keepPreviousData,
  useQuery,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { Comment } from "@/types/image.interfaces";
import { topLikedImagesQueryKey } from "@/constants/image.constants";

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
  sortBy?: string,
  order?: string,
) => {
  return useQuery({
    queryKey: ["galleryImages", page, limit, search, sortBy, order],
    queryFn: async () => {
      let url = `/api/images?page=${page}&limit=${limit}`;
      if (search) url += `&search=${search}`;
      if (sortBy) url += `&sortBy=${sortBy}`;
      if (order) url += `&order=${order}`;

      const response = (await FetchUtil.get(url)) as GalleryResponse;
      return response;
    },
  });
};

export const useGetGalleryImagesInfiniteQuery = (
  limit: number = 20,
  enabled: boolean = true,
  category?: string,
  search?: string,
  ratio?: string,
) => {
  return useInfiniteQuery({
    queryKey: ["galleryImagesInfinite", limit, category, search, ratio],
    queryFn: async ({ pageParam = 1 }) => {
      const categoryParam = category ? `&category=${category}` : "";
      const searchParam = search ? `&search=${search}` : "";
      const ratioParam = ratio ? `&ratio=${ratio}` : "";
      const response = (await FetchUtil.get(
        `/api/images?page=${pageParam}&limit=${limit}${categoryParam}${searchParam}${ratioParam}`,
      )) as GalleryResponse;
      return response;
    },
    getNextPageParam: (lastPage: GalleryResponse) => {
      return lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    enabled,
    // 필터를 바꾸는 동안 이전 결과를 남겨 두어 목록 높이가 갑자기 줄지 않게 한다.
    placeholderData: keepPreviousData,
  });
};

export const useGetUserImagesInfiniteQuery = (
  userId: number,
  limit: number = 20,
  category?: string,
  search?: string,
  ratio?: string,
) => {
  return useInfiniteQuery({
    queryKey: ["userImagesInfinite", userId, limit, category, search, ratio],
    queryFn: async ({ pageParam = 1 }) => {
      const categoryParam = category ? `&category=${category}` : "";
      const searchParam = search ? `&search=${search}` : "";
      const ratioParam = ratio ? `&ratio=${ratio}` : "";
      const response = (await FetchUtil.get(
        `/api/images?userId=${userId}&page=${pageParam}&limit=${limit}${categoryParam}${searchParam}${ratioParam}`,
      )) as GetUserImagesResponse;
      return response;
    },
    getNextPageParam: (lastPage: GetUserImagesResponse) => {
      return lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!userId,
    // 같은 사용자의 필터를 바꿀 때만 이전 결과를 남긴다 (다른 프로필로 옮기면 비운다).
    placeholderData: (previousData, previousQuery) =>
      previousQuery?.queryKey[1] === userId ? previousData : undefined,
  });
};

// 로컬 모델 상태는 한 번의 요청으로 모두 받는다. 서버가 모델마다 병렬로 확인한다.
export const useLocalModelHealthQuery = () => {
  return useQuery({
    queryKey: ["localModelHealth"],
    queryFn: async (): Promise<LocalModelHealthResponse> => {
      const response = await FetchUtil.get("/api/health-check", {
        signal: AbortSignal.timeout(10000),
      });
      return response as LocalModelHealthResponse;
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
    queryKey: topLikedImagesQueryKey(limit),
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
