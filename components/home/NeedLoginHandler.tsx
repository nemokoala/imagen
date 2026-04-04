"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useUserStore } from "@/stores/userStore";
import { useUrlParams } from "@/hooks/use-url-params";

export function NeedLoginHandler() {
  const { logout } = useUserStore();
  const { getParam, removeParam } = useUrlParams();
  const needLogin = getParam("needLogin");

  useEffect(() => {
    // 랜딩 페이지를 한 번 봤으면 다음 방문부터는 갤러리로 바로 이동
    document.cookie = "visited=1; max-age=2592000; path=/"; // 30일
  }, []);

  useEffect(() => {
    if (needLogin) {
      logout();
      toast.error("로그인이 필요합니다.");
      removeParam("needLogin");
    }
  }, [needLogin, removeParam, logout]);

  return null;
}
