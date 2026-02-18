import { FetchUtil } from "@/lib/Fetch.util";
import { useInfiniteQuery } from "@tanstack/react-query";

import { UserCommentsResponse } from "@/types/user.interfaces";

export const useGetUserCommentsInfiniteQuery = (
  userId: number,
  limit: number = 10,
) => {
  return useInfiniteQuery({
    queryKey: ["userCommentsInfinite", userId, limit],
    queryFn: async ({ pageParam = 1 }): Promise<UserCommentsResponse> => {
      const response = await FetchUtil.get(
        `/api/users/${userId}/comments?page=${pageParam}&limit=${limit}`,
      );
      return response as UserCommentsResponse;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!userId,
  });
};
