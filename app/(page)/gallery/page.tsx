"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { ImageModal } from "@/components/gallery/ImageModal";
import { LoadingSkeleton } from "@/components/gallery/LoadingSkeleton";
import { GalleryHeader } from "@/components/gallery/GalleryHeader";
import { InfiniteImageGallery } from "@/components/gallery/InfiniteImageGallery";
import { Image } from "@/components/gallery/types";
import { useGetGalleryImagesInfiniteQuery } from "@/queries/image/queries";

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, error, refetch } =
    useGetGalleryImagesInfiniteQuery(20);

  // 모든 페이지의 이미지를 하나의 배열로 합치기
  const images = data?.pages.flatMap((page) => page.images) || [];

  const handleImageClick = (image: Image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const handleDownload = (imageUrl: string, prompt: string) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `gallery-image-${prompt
      .slice(0, 20)
      .replace(/[^a-zA-Z0-9]/g, "-")}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading && images.length === 0) {
    return (
      <Layout.Content className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <LoadingSkeleton />
      </Layout.Content>
    );
  }

  // 에러가 있지만 이미지가 있는 경우는 계속 표시
  if (error && images.length === 0) {
    return (
      <Layout.Content className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <GalleryHeader />
          <div className="text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 max-w-md mx-auto shadow-xl">
              <p className="text-red-500 mb-4">
                {error instanceof Error
                  ? error.message
                  : "이미지를 불러오는데 실패했습니다."}
              </p>
              <Button
                onClick={() => refetch()}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                다시 시도
              </Button>
            </div>
          </div>
        </div>
      </Layout.Content>
    );
  }

  return (
    <Layout.Content className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 flex flex-col h-full min-h-0">
        <GalleryHeader />

        <InfiniteImageGallery
          onImageClick={handleImageClick}
          onDownload={handleDownload}
        />

        <ImageModal
          isOpen={isModalOpen}
          onClose={closeModal}
          image={selectedImage}
          onDownload={handleDownload}
        />
      </div>
    </Layout.Content>
  );
}
