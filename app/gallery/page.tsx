"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Calendar, User, X } from "lucide-react";

interface Image {
  id: number;
  prompt: string;
  imageUrl: string;
  model: string;
  size: string;
  createdAt: string;
  user: {
    id: number;
    nickname: string;
  };
}

interface GalleryResponse {
  success: boolean;
  images: Image[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  error?: string;
}

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading && images.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">이미지 갤러리</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-64 w-full" />
              <CardHeader className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">이미지 갤러리</h1>
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => fetchImages(1)}>다시 시도</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">이미지 갤러리</h1>

      {/* 이미지 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {images.map((image) => (
          <Card
            key={image.id}
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleImageClick(image)}
          >
            <div className="relative">
              <img
                src={image.imageUrl}
                alt={image.prompt}
                className="w-full h-64 object-cover"
                loading="lazy"
              />
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="text-xs">
                  {image.model}
                </Badge>
              </div>
            </div>

            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm line-clamp-2 mb-2">
                {image.prompt}
              </CardTitle>
            </CardHeader>

            <CardContent className="p-4 pt-0">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{image.user.nickname}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(image.createdAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!hasPrevPage}
          >
            <ChevronLeft className="w-4 h-4" />
            이전
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNum)}
                  className="w-8 h-8 p-0"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!hasNextPage}
          >
            다음
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* 페이지 정보 */}
      <div className="text-center text-sm text-muted-foreground mt-4">
        {totalPages > 0 && (
          <p>
            {currentPage} / {totalPages} 페이지 (총 {images.length}개 이미지)
          </p>
        )}
      </div>

      {/* 이미지 상세 모달 */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>이미지 상세 정보</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeModal}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          {selectedImage && (
            <div className="space-y-6">
              {/* 이미지 */}
              <div className="flex justify-center">
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.prompt}
                  className="max-w-full max-h-96 object-contain rounded-lg shadow-lg"
                />
              </div>

              {/* 프롬프트 */}
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">프롬프트</h3>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                  {selectedImage.prompt}
                </p>
              </div>

              {/* 이미지 정보 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">생성자</h3>
                  <p className="text-gray-700">{selectedImage.user.nickname}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">모델</h3>
                  <p className="text-gray-700">{selectedImage.model}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">크기</h3>
                  <p className="text-gray-700">{selectedImage.size}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">생성일</h3>
                  <p className="text-gray-700">
                    {formatDate(selectedImage.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
