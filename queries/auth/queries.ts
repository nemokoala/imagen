import { FetchUtil } from "@/lib/Fetch.util";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/types/user.interfaces";

export const useGetUserCreditQuery = () => {
  return useQuery({
    queryKey: ["credit"],
    queryFn: async () => {
      const response = (await FetchUtil.get("/api/auth/credit")) as {
        credits: number;
      };
      return response.credits;
    },
  });
};

export const useGetUserInfoQuery = ({ enabled }: { enabled: boolean }) => {
  return useQuery<User>({
    queryKey: ["userInfo"],
    queryFn: async (): Promise<User> => {
      const response = await FetchUtil.get("/api/auth/user");
      return response as User;
    },
    enabled,
  });
};
