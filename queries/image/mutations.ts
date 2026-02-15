import { FetchUtil } from "@/lib/Fetch.util";
import {
  GenerateImageRequest,
  GenerateImageResponse,
} from "@/types/image.interfaces";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ErrorResponse } from "@/types/common.interfaces";
import { Comment } from "@/types/image.interfaces";

export const useGenerateImageMutation = (
  onSuccess: (data: GenerateImageResponse) => void,
  onError: (error: ErrorResponse) => void,
) => {
  return useMutation({
    mutationFn: async (
      data: GenerateImageRequest,
    ): Promise<GenerateImageResponse> => {
      const response = await FetchUtil.post<GenerateImageRequest>(
        "/api/generate-image",
        data,
      );
      return response as GenerateImageResponse;
    },
    onSuccess: (response) => onSuccess(response),
    onError: (error) => onError(error as ErrorResponse),
  });
};

export const useToggleLikeMutation = (imageId: number | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<{
      success: boolean;
      liked: boolean;
      message: string;
    }> => {
      if (!imageId) throw new Error("이미지 ID가 필요합니다.");
      const response = await FetchUtil.post<Record<string, never>>(
        `/api/images/${imageId}/like`,
        {},
      );
      return response as { success: boolean; liked: boolean; message: string };
    },
    onMutate: async () => {
      if (!imageId) return;
      // 낙관적 업데이트를 덮어쓰지 않도록 기존 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ["likeStatus", imageId] });

      // 이전 상태 스냅샷 저장
      const previousLikeStatus = queryClient.getQueryData([
        "likeStatus",
        imageId,
      ]);

      // 새로운 값으로 낙관적 업데이트
      queryClient.setQueryData(
        ["likeStatus", imageId],
        (old: { success: boolean; likeCount: number; liked: boolean }) => {
          if (!old) return old;
          const newLiked = !old.liked;
          return {
            ...old,
            liked: newLiked,
            likeCount: newLiked ? old.likeCount + 1 : old.likeCount - 1,
          };
        },
      );

      // 스냅샷된 값을 컨텍스트로 반환
      return { previousLikeStatus };
    },
    onError: (err, newTodo, context) => {
      // 에러 발생 시 onMutate에서 반환된 컨텍스트를 사용하여 롤백
      if (context?.previousLikeStatus) {
        queryClient.setQueryData(
          ["likeStatus", imageId],
          context.previousLikeStatus,
        );
      }
    },
    onSettled: () => {
      // 성공/실패 여부와 관계없이 항상 최신 데이터로 갱신
      if (imageId) {
        queryClient.invalidateQueries({ queryKey: ["likeStatus", imageId] });
      }
    },
  });
};

export const useCreateCommentMutation = (imageId: number | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      content: string;
      parentId?: number;
    }): Promise<{ success: boolean; comment: Comment; message: string }> => {
      if (!imageId) throw new Error("이미지 ID가 필요합니다.");
      const response = await FetchUtil.post<{
        content: string;
        parentId?: number;
      }>(`/api/images/${imageId}/comments`, data);
      return response as {
        success: boolean;
        comment: Comment;
        message: string;
      };
    },
    onSuccess: () => {
      // 댓글 목록 쿼리 무효화 및 재조회
      if (imageId) {
        queryClient.invalidateQueries({ queryKey: ["comments", imageId] });
      }
    },
  });
};

export const useUpdateCommentMutation = (imageId: number | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      commentId: number;
      content: string;
    }): Promise<{ success: boolean; comment: Comment; message: string }> => {
      if (!imageId) throw new Error("이미지 ID가 필요합니다.");
      const response = await FetchUtil.put<{ content: string }>(
        `/api/images/${imageId}/comments/${data.commentId}`,
        { content: data.content },
      );
      return response as {
        success: boolean;
        comment: Comment;
        message: string;
      };
    },
    onSuccess: () => {
      // 댓글 목록 쿼리 무효화 및 재조회
      if (imageId) {
        queryClient.invalidateQueries({ queryKey: ["comments", imageId] });
      }
    },
  });
};

export const useDeleteCommentMutation = (imageId: number | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      commentId: number,
    ): Promise<{ success: boolean; message: string }> => {
      if (!imageId) throw new Error("이미지 ID가 필요합니다.");
      const response = await FetchUtil.delete<Record<string, never>>(
        `/api/images/${imageId}/comments/${commentId}`,
        {},
      );
      return response as { success: boolean; message: string };
    },
    onSuccess: () => {
      // 댓글 목록 쿼리 무효화 및 재조회
      if (imageId) {
        queryClient.invalidateQueries({ queryKey: ["comments", imageId] });
      }
    },
  });
};

export const useDeleteImageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      imageId: number,
    ): Promise<{ success: boolean; message: string }> => {
      const response = await FetchUtil.delete<Record<string, never>>(
        `/api/images/${imageId}`,
        {},
      );
      return response as { success: boolean; message: string };
    },
    onSuccess: () => {
      // 갤러리 이미지 쿼리 무효화 및 재조회
      queryClient.invalidateQueries({ queryKey: ["galleryImages"] });
      queryClient.invalidateQueries({ queryKey: ["galleryImagesInfinite"] });
    },
  });
};
