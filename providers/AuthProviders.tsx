"use client";

import { useEffect } from "react";
import { useUserStore } from "@/stores/userStore";
import { useGetUserInfoQuery } from "@/queries/auth/queries";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, setUser } = useUserStore();
  const { data: userInfo } = useGetUserInfoQuery({
    enabled: !user && !isLoading,
  });

  useEffect(() => {
    if (userInfo) {
      setUser(userInfo);
    }
  }, [userInfo, user, setUser]);
  return <>{children}</>;
}
