import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FetchUtil } from "@/lib/Fetch.util";

export const useMarkAllAsReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return FetchUtil.patch("/api/notifications", undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export const useMarkAsReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      return FetchUtil.patch(`/api/notifications/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
