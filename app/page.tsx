import { InfiniteImageGallery } from "@/components/gallery/InfiniteImageGallery";
import { WelcomeTitle } from "@/components/home/WelcomeTitle";
import { Layout } from "@/components/layout/Layout";

export default function Home() {
  return (
    <Layout.Content className="h-[calc(100dvh-60px)] p-4">
      <WelcomeTitle />
      <InfiniteImageGallery />
    </Layout.Content>
  );
}
