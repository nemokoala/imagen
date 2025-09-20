import { FetchUtil } from "@/lib/Fetch.util";
import { useQuery } from "@tanstack/react-query";

export const useGetUserCreditQuery = () => {
  return useQuery({
    queryKey: ["credit"],
    queryFn: async () => {
      const response = await FetchUtil.get("/api/auth/credit");
      return response.credits;
    },
  });
};
