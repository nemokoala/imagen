import { useQuery, useMutation } from "@tanstack/react-query";
import { FetchUtil } from "@/lib/Fetch.util";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

interface SuggestCategoriesResponse {
  success: boolean;
  data: string[];
}

/**
 * 모든 카테고리 조회
 */
export function useGetCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = (await FetchUtil.get(
        "/api/categories",
      )) as CategoriesResponse;
      return response.data;
    },
    staleTime: 1000 * 60 * 60, // 1시간 캐시 (카테고리는 자주 안 바뀜)
  });
}

/**
 * 프롬프트 기반 카테고리 추천 (Mutation으로 사용)
 */
export function useSuggestCategories() {
  return useMutation({
    mutationFn: async (prompt: string) => {
      const response = (await FetchUtil.post("/api/categories/suggest", {
        prompt,
      })) as SuggestCategoriesResponse;
      return response.data;
    },
  });
}
