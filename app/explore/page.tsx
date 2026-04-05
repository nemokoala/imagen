"use client";

import { InfiniteImageGallery } from "@/components/gallery/InfiniteImageGallery";
import { Layout } from "@/components/layout/Layout";
import { ImageCreatButton } from "@/components/home/ImageCreatButton";
import { ImageShowcase } from "@/components/home/ImageShowcase";
import { useGetTopLikedImagesQuery } from "@/queries/image/queries";
import { useGetMonthlyRankingQuery } from "@/queries/image/queries";
import { Flame, Trophy, LayoutGrid } from "lucide-react";
import { useScrollVisibility } from "@/hooks/use-scroll-visibility";
import { useRef } from "react";
import { DecorativeBackground } from "@/components/ui/decorative-background";

export default function ExplorePage() {
  const { isVisible, handleScrollChange } = useScrollVisibility({
    threshold: 100,
  });

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  return (
    <Layout.Content
      className="h-[calc(100dvh-60px)] px-2"
      ref={scrollContainerRef}
      onScrollChange={handleScrollChange}
    >
      <DecorativeBackground />
      <ImageShowcase
        title="인기 작품"
        icon={Flame}
        iconBgClassName="bg-red-100 dark:bg-red-900/30"
        iconClassName="text-red-500 dark:text-red-400 fill-red-500/20"
        titleGradientClassName="from-red-500 to-orange-500"
        useQuery={useGetTopLikedImagesQuery}
      />
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent max-w-7xl mx-auto w-full" />
      <ImageShowcase
        title="이달의 랭킹"
        icon={Trophy}
        iconBgClassName="bg-yellow-100 dark:bg-yellow-900/30"
        iconClassName="text-yellow-500 dark:text-yellow-400 fill-yellow-500/20"
        titleGradientClassName="from-yellow-500 to-amber-500"
        useQuery={useGetMonthlyRankingQuery}
        showRank={true}
      />
      <div className="relative flex items-center gap-3 max-w-7xl mx-auto w-full my-2">
        <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border bg-background/50 backdrop-blur-sm shrink-0">
          <LayoutGrid className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            전체 갤러리
          </span>
        </div>
        <div className="flex-1 h-px bg-gradient-to-l from-border to-transparent" />
      </div>
      <InfiniteImageGallery
        maintainScrollPosition={true}
        scrollElementRef={scrollContainerRef}
      />
      <ImageCreatButton isVisible={isVisible} />
    </Layout.Content>
  );
}
