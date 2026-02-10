import { useMutation } from "@tanstack/react-query";
import { FetchUtil } from "@/lib/Fetch.util";

interface SuggestCategoriesResponse {
  success: boolean;
  data: string[];
}

/**
 * 프롬프트 기반 카테고리 추천 (Mutation으로 사용)
 */
export function useSuggestCategories(
  successCallback?: (data: string[]) => void,
) {
  return useMutation({
    mutationFn: async (prompt: string) => {
      const response = (await FetchUtil.post("/api/categories/suggest", {
        prompt,
      })) as SuggestCategoriesResponse;
      return response.data;
    },
    onSuccess: (data) => {
      successCallback?.(data);
    },
  });
}
