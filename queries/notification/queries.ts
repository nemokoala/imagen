import { useQuery } from "@tanstack/react-query";
import { FetchUtil } from "@/lib/Fetch.util";
import { NotificationsResponse } from "@/types/notification.interfaces";

export const useGetNotificationsQuery = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async (): Promise<NotificationsResponse> => {
      const response = await FetchUtil.get("/api/notifications");
      return response as NotificationsResponse;
    },
    refetchInterval: 60000, // 60초마다 폴링
  });
};
