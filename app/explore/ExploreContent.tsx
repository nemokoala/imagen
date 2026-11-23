"use client";

import { InfiniteImageGallery } from "@/components/gallery/InfiniteImageGallery";
import { Layout } from "@/components/layout/Layout";
import { ImageCreatButton } from "@/components/home/ImageCreatButton";
import { CoverflowShowcase } from "@/components/home/CoverflowShowcase";
import { useScrollVisibility } from "@/hooks/use-scroll-visibility";
import { useRef } from "react";

export function ExploreContent() {
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
      <CoverflowShowcase />
      <div className="mb-3 mt-1 w-full text-center">
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
      />
      <ImageCreatButton isVisible={isVisible} />
    </Layout.Content>
  );
}
