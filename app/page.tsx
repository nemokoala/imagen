"use client";

import { InfiniteImageGallery } from "@/components/gallery/InfiniteImageGallery";
import { WelcomeTitle } from "@/components/home/WelcomeTitle";
import { Layout } from "@/components/layout/Layout";
import { ImageCreatButton } from "@/components/home/ImageCreatButton";
import { useScrollVisibility } from "@/hooks/use-scroll-visibility";
import { useEffect } from "react";
import { toast } from "sonner";
import { useUrlParams } from "@/hooks/use-url-params";
import { useUserStore } from "@/stores/userStore";

export default function Home() {
  const { isVisible, handleScrollChange } = useScrollVisibility({
    threshold: 100,
  });

  const { logout } = useUserStore();
  const { getParam, removeParam } = useUrlParams();
  const needLogin = getParam("needLogin");

  useEffect(() => {
    if (needLogin) {
      logout();
      toast.error("로그인이 필요합니다.");
      removeParam("needLogin");
    }
  }, [needLogin, removeParam, logout]);

  return (
    <Layout.Content className="h-[calc(100dvh-60px)] p-2">
      <WelcomeTitle />
      <InfiniteImageGallery
        onScrollChange={handleScrollChange}
        maintainScrollPosition={true}
      />
      <ImageCreatButton isVisible={isVisible} />
    </Layout.Content>
  );
}
