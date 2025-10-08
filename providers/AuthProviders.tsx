"use client";

import { useEffect } from "react";
import { useUserStore } from "@/stores/userStore";
import { useGetUserInfoQuery } from "@/queries/auth/queries";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading, setUser } = useUserStore();
  const { data: userInfo } = useGetUserInfoQuery();

  useEffect(() => {
    if (userInfo && !isAuthenticated) {
      setUser(userInfo);
    }
  }, [isAuthenticated, isLoading, user, userInfo, setUser]);
  return <>{children}</>;
}
