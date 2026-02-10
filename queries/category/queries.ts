import { useQuery } from "@tanstack/react-query";
import { FetchUtil } from "@/lib/Fetch.util";
import { Category } from "@/types/image.interfaces";

interface CategoriesResponse {
  success: boolean;
  data: Category[];
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
