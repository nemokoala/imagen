"use client";

import { InfiniteImageGallery } from "@/components/gallery/InfiniteImageGallery";
import { Layout } from "@/components/layout/Layout";
import { ImageCreatButton } from "@/components/home/ImageCreatButton";
import { FeaturedSpotlight } from "@/components/home/FeaturedSpotlight";
import { useScrollVisibility } from "@/hooks/use-scroll-visibility";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import {
  WIDE_CONTAINER,
  WIDE_PAGE_BLEED,
  WIDE_PAGE_GUTTER,
} from "@/constants/layout.constants";

export function ExploreContent() {
  const { isVisible, handleScrollChange } = useScrollVisibility({
    threshold: 100,
  });

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  return (
    <Layout.Content
      className={cn("h-[calc(100dvh-60px)]", WIDE_PAGE_GUTTER)}
      ref={scrollContainerRef}
      onScrollChange={handleScrollChange}
    >
      <FeaturedSpotlight />
      <div className={WIDE_CONTAINER}>
        <div className="mb-1 px-1">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            갤러리
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            커뮤니티가 만든 이미지를 둘러보세요
          </p>
        </div>
        <InfiniteImageGallery
          maintainScrollPosition={true}
          scrollElementRef={scrollContainerRef}
          filterClassName={WIDE_PAGE_BLEED}
        />
      </div>
      <ImageCreatButton isVisible={isVisible} />
    </Layout.Content>
  );
}
