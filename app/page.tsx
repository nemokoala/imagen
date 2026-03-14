"use client";

import { InfiniteImageGallery } from "@/components/gallery/InfiniteImageGallery";
import { WelcomeTitle } from "@/components/home/WelcomeTitle";
import { Layout } from "@/components/layout/Layout";
import { ImageCreatButton } from "@/components/home/ImageCreatButton";
import { ImageShowcase } from "@/components/home/ImageShowcase";
import { useGetTopLikedImagesQuery } from "@/queries/image/queries";
import { useGetMonthlyRankingQuery } from "@/queries/image/queries";
import { Flame, Trophy } from "lucide-react";
import { useScrollVisibility } from "@/hooks/use-scroll-visibility";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useUrlParams } from "@/hooks/use-url-params";
import { useUserStore } from "@/stores/userStore";

export default function Home() {
  const { isVisible, handleScrollChange } = useScrollVisibility({
    threshold: 100,
  });

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
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
    <Layout.Content
      className="h-[calc(100dvh-60px)] px-2"
      ref={scrollContainerRef}
    >
      <WelcomeTitle />
      <ImageShowcase
        title="인기 작품"
        icon={Flame}
        iconBgClassName="bg-red-100 dark:bg-red-900/30"
        iconClassName="text-red-500 dark:text-red-400 fill-red-500/20"
        titleGradientClassName="from-red-500 to-orange-500"
        useQuery={useGetTopLikedImagesQuery}
      />
      <ImageShowcase
        title="이달의 랭킹"
        icon={Trophy}
        iconBgClassName="bg-yellow-100 dark:bg-yellow-900/30"
        iconClassName="text-yellow-500 dark:text-yellow-400 fill-yellow-500/20"
        titleGradientClassName="from-yellow-500 to-amber-500"
        useQuery={useGetMonthlyRankingQuery}
      />
      <InfiniteImageGallery
        onScrollChange={handleScrollChange}
        maintainScrollPosition={true}
        scrollElementRef={scrollContainerRef}
      />
      <ImageCreatButton isVisible={isVisible} />
    </Layout.Content>
  );
}
