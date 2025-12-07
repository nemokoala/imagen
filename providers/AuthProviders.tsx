"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/stores/userStore";
import { useGetUserInfoQuery } from "@/queries/auth/queries";
import { hasCookie } from "@/lib/server-utils";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, setUser } = useUserStore();
  const [hasAccessToken, setHasAccessToken] = useState(false);
  const { data: userInfo } = useGetUserInfoQuery({
    enabled: !user && !isLoading && hasAccessToken,
  });

  useEffect(() => {
    const checkAccessToken = async () => {
      const hasAccessToken = await hasCookie("accessToken");
      const hasRefreshToken = await hasCookie("refreshToken");
      setHasAccessToken(hasAccessToken || hasRefreshToken);
    };
    checkAccessToken();
  }, []);

  useEffect(() => {
    if (userInfo) {
      setUser(userInfo);
    }
  }, [userInfo, user, setUser]);
  return <>{children}</>;
}
