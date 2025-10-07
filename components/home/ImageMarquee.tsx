"use client";

import { useGetGalleryImagesQuery } from "@/queries/image/queries";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { GeneratedImage } from "@/types/image.interfaces";
import Image from "next/image";
import Marquee from "react-fast-marquee";

export function ImageMarquee() {
  const { data: galleryData, isLoading } = useGetGalleryImagesQuery(1, 10);

  if (isLoading) {
    return (
      <div className="relative w-full h-80 bg-gray-100 rounded-2xl overflow-hidden">
        <div className="absolute top-4 right-4 z-10">
          <Link href="/gallery">
            <Button
              size="sm"
              variant="outline"
              className="bg-white/90 backdrop-blur-sm"
            >
              더보기 <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500">이미지를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  const images = galleryData?.images || [];

  if (images.length === 0) {
    return (
      <div className="relative w-full h-80 bg-gray-100 rounded-2xl overflow-hidden">
        <div className="absolute top-4 right-4 z-10">
          <Link href="/gallery">
            <Button
              size="sm"
              variant="outline"
              className="bg-white/90 backdrop-blur-sm"
            >
              더보기 <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500">아직 생성된 이미지가 없습니다</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex relative w-full h-80 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl overflow-hidden">
      {/* 더보기 버튼 */}
      <div className="absolute top-4 right-4 z-10">
        <Link href="/gallery">
          <Button
            size="sm"
            variant="outline"
            className="bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white"
          >
            더보기 <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>

      {/* Marquee 컨테이너 */}
      <div className="flex h-full w-full items-center overflow-hidden">
        <Marquee className="" speed={30}>
          {images.map((image: GeneratedImage) => (
            <div
              key={`marquee-${image.id}`}
              className="flex-shrink-0 relative w-64 h-64 mr-4 rounded-lg overflow-hidden"
            >
              <Image src={image.imageUrl} alt={image.prompt} fill />
            </div>
          ))}
        </Marquee>
      </div>

      {/* 그라데이션 오버레이 (양쪽 끝에 페이드 효과) */}
      <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-blue-50 to-transparent z-5"></div>
      <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-purple-50 to-transparent z-5"></div>
    </div>
  );
}
