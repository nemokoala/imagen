"use client";

import { InfiniteImageGallery } from "@/components/gallery/InfiniteImageGallery";
import { WelcomeTitle } from "@/components/home/WelcomeTitle";
import { Layout } from "@/components/layout/Layout";
import { ImageCreatButton } from "@/components/home/ImageCreatButton";
import { useScrollVisibility } from "@/hooks/use-scroll-visibility";
import { useEffect } from "react";
import { toast } from "sonner";
import { useUrlParams } from "@/hooks/use-url-params";

export default function Home() {
  const { isVisible, handleScrollChange } = useScrollVisibility({
    threshold: 100,
  });

  const { getParam, setParam } = useUrlParams();
  const needLogin = getParam("needLogin");

  useEffect(() => {
    if (needLogin) {
      toast.error("로그인이 필요합니다.");
      setParam("needLogin", null);
    }
  }, [needLogin, setParam]);

  return (
    <Layout.Content className="h-[calc(100dvh-60px)] p-2">
      <WelcomeTitle />
      <InfiniteImageGallery onScrollChange={handleScrollChange} />
      <ImageCreatButton isVisible={isVisible} />
    </Layout.Content>
  );
}
