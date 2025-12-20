"use client";

import { InfiniteImageGallery } from "@/components/gallery/InfiniteImageGallery";
import { WelcomeTitle } from "@/components/home/WelcomeTitle";
import { Layout } from "@/components/layout/Layout";
import { ImageCreatButton } from "@/components/home/ImageCreatButton";
import { useScrollVisibility } from "@/hooks/use-scroll-visibility";

export default function Home() {
  const { isVisible, handleScrollChange } = useScrollVisibility({
    threshold: 100,
  });

  return (
    <Layout.Content className="h-[calc(100dvh-60px)] p-2">
      <WelcomeTitle />
      <InfiniteImageGallery onScrollChange={handleScrollChange} />
      <ImageCreatButton isVisible={isVisible} />
    </Layout.Content>
  );
}
