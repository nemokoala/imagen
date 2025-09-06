"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { ImageCard } from "@/components/gallery/ImageCard";
import { Pagination } from "@/components/gallery/Pagination";
import { ImageModal } from "@/components/gallery/ImageModal";
import { LoadingSkeleton } from "@/components/gallery/LoadingSkeleton";
import { GalleryHeader } from "@/components/gallery/GalleryHeader";
import { PageInfo } from "@/components/gallery/PageInfo";
import { Image, GalleryResponse } from "@/components/gallery/types";

export default function GalleryPage() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchImages = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/images?page=${page}&limit=20`);
      const data: GalleryResponse = await response.json();

      if (data.success) {
        setImages(data.images);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
        setHasNextPage(data.hasNextPage);
        setHasPrevPage(data.hasPrevPage);
      } else {
        setError(data.error || "이미지를 불러오는데 실패했습니다.");
      }
    } catch (err) {
      setError("서버 오류가 발생했습니다.");
      console.error("Error fetching images:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages(1);
  }, []);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchImages(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

  if (loading && images.length === 0) {
    return (
      <Layout.Content className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <LoadingSkeleton />
      </Layout.Content>
    );
  }

  if (error) {
    return (
      <Layout.Content className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <GalleryHeader />
          <div className="text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 max-w-md mx-auto shadow-xl">
              <p className="text-red-500 mb-4">{error}</p>
              <Button
                onClick={() => fetchImages(1)}
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
      <div className="container mx-auto px-4 py-8">
        <GalleryHeader />

        {/* 이미지 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {images.map((image) => (
            <ImageCard
              key={image.id}
              image={image}
              onImageClick={handleImageClick}
              onDownload={handleDownload}
            />
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
          onPageChange={handlePageChange}
        />

        <PageInfo
          currentPage={currentPage}
          totalPages={totalPages}
          imageCount={images.length}
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
