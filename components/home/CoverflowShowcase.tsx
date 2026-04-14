"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";
import { ImageCard } from "@/components/gallery/ImageCard";
import { Skeleton } from "@/components/ui/skeleton";
import { UseQueryResult } from "@tanstack/react-query";
import { Image } from "@/types/image.interfaces";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

interface CoverflowShowcaseProps {
  useQuery: (limit: number) => UseQueryResult<Image[]>;
  limit?: number;
}

export function CoverflowShowcase({
  useQuery,
  limit = 10,
}: CoverflowShowcaseProps) {
  const { data: images, isLoading } = useQuery(limit);

  if (isLoading) {
    return (
      <div className="w-full py-8 max-w-7xl mx-auto overflow-hidden">
        <div className="flex items-center gap-2 mb-6 px-2 md:px-0">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="flex justify-center items-center gap-4">
          <Skeleton className="w-[60%] md:w-[40%] aspect-[3/4] rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!images || images.length === 0) return null;

  return (
    <section className="w-full py-8 mx-[-8px]">
      <div className="relative w-full">
        {/* Swiper wrapper with specific styling for Coverflow */}
        <div className="w-full [&_.swiper-pagination-bullet-active]:bg-primary">
          <Swiper
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            initialSlide={Math.floor(images.length / 2)}
            coverflowEffect={{
              rotate: 20,
              stretch: 0,
              depth: 120,
              modifier: 1,
              slideShadows: true,
            }}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            modules={[EffectCoverflow, Pagination, Autoplay]}
            className="w-full pb-12 pt-4"
          >
            {images.map((image) => (
              <SwiperSlide
                key={image.id}
                className="max-w-[80%] sm:max-w-[400px] transition-transform duration-300"
              >
                <div className="w-full aspect-[3/4] relative rounded-2xl overflow-hidden shadow-md bg-background ">
                  <ImageCard image={image} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
