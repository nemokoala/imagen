import { FetchUtil } from "@/lib/Fetch.util";
import { useQuery } from "@tanstack/react-query";
import { UsersListResponse } from "@/types/user.interfaces";

export const useGetUsersQuery = (
  page: number = 1,
  limit: number = 20,
  search: string = "",
  sortBy: string = "",
  order: string = "",
) => {
  return useQuery<UsersListResponse>({
    queryKey: ["admin", "users", page, limit, search, sortBy, order],
    queryFn: async (): Promise<UsersListResponse> => {
      let url = `/api/admin/users?page=${page}&limit=${limit}`;
      if (search) url += `&search=${search}`;
      if (sortBy) url += `&sortBy=${sortBy}`;
      if (order) url += `&order=${order}`;

      const response = await FetchUtil.get(url);
      return response as UsersListResponse;
    },
  });
};
