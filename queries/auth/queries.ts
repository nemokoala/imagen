import { FetchUtil } from "@/lib/Fetch.util";
import { useQuery } from "@tanstack/react-query";
import { PublicUser, User } from "@/types/user.interfaces";

export const useGetUserCredit = () => {
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

export const useGetUserInfo = ({ enabled }: { enabled: boolean }) => {
  return useQuery<User>({
    queryKey: ["userInfo"],
    queryFn: async (): Promise<User> => {
      const response = await FetchUtil.get("/api/auth/user");
      return response as User;
    },
    enabled,
  });
};

export const useGetPublicUserById = (userId: number | null) => {
  return useQuery<PublicUser>({
    queryKey: ["user", userId],
    queryFn: async (): Promise<PublicUser> => {
      const response = await FetchUtil.get(`/api/auth/user/${userId}`);
      return response as PublicUser;
    },
    enabled: !!userId,
  });
};
