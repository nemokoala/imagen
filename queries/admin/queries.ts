import { FetchUtil } from "@/lib/Fetch.util";
import { useQuery } from "@tanstack/react-query";
import { UsersListResponse } from "@/types/user.interfaces";

export const useGetUsersQuery = (page: number = 1, limit: number = 20, search: string = "") => {
  return useQuery<UsersListResponse>({
    queryKey: ["admin", "users", page, limit, search],
    queryFn: async (): Promise<UsersListResponse> => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (search) {
        params.append("search", search);
      }
      const response = await FetchUtil.get(`/api/admin/users?${params.toString()}`);
      return response as UsersListResponse;
    },
  });
};

