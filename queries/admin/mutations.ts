import { FetchUtil } from "@/lib/Fetch.util";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "@/types/user.interfaces";

export const useUpdateUserCreditMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      credits,
    }: {
      userId: number;
      credits: number;
    }): Promise<User> => {
      const response = await FetchUtil.patch(
        `/api/admin/users/${userId}/credit`,
        {
          credits,
        }
      );
      return response as User;
    },
    onSuccess: () => {
      // 유저 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
};
