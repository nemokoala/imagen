"use client";

import { InfiniteImageGallery } from "@/components/gallery/InfiniteImageGallery";
import { Layout } from "@/components/layout/Layout";
import { ImageCreatButton } from "@/components/home/ImageCreatButton";
import { CoverflowShowcase } from "@/components/home/CoverflowShowcase";
import { LayoutGrid } from "lucide-react";
import { useScrollVisibility } from "@/hooks/use-scroll-visibility";
import { useRef } from "react";
import { DecorativeBackground } from "@/components/ui/decorative-background";

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
      <DecorativeBackground />
      <CoverflowShowcase />
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
