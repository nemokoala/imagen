"use client";

import { useCallback, useRef, type MouseEvent } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ImageCard } from "@/components/gallery/ImageCard";
import { Skeleton } from "@/components/ui/skeleton";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { Button } from "../ui/button";
import { useGetTopLikedImagesQuery } from "@/queries/image/queries";

export function CoverflowShowcase() {
  const { data: images, isLoading } = useGetTopLikedImagesQuery(20);
  const swiperRef = useRef<SwiperClass | null>(null);

  const handleSlideClickCapture = useCallback(
    (event: MouseEvent<HTMLElement>, index: number) => {
      const swiper = swiperRef.current;

      if (!swiper || swiper.destroyed || swiper.realIndex === index) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (swiper.params.loop) {
        swiper.slideToLoop(index);
        return;
      }

      swiper.slideTo(index);
    },
    [],
  );

  const handlePrevClick = useCallback(() => {
    swiperRef.current?.slidePrev();
  }, []);

  const handleNextClick = useCallback(() => {
    swiperRef.current?.slideNext();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full py-8 mx-[-8px] overflow-hidden min-h-[630px]">
        <div className="flex justify-center items-center gap-4 pt-4 pb-20">
          <Skeleton className="hidden h-auto w-[22%] max-w-[320px] aspect-[3/4] rounded-2xl opacity-40 sm:block" />
          <Skeleton className="w-[80%] max-w-[400px] aspect-[3/4] rounded-2xl" />
          <Skeleton className="hidden h-auto w-[22%] max-w-[320px] aspect-[3/4] rounded-2xl opacity-40 sm:block" />
        </div>
        <div className="flex justify-center gap-2 -mt-4">
          <Skeleton className="h-2 w-2 rounded-full" />
          <Skeleton className="h-2 w-6 rounded-full" />
          <Skeleton className="h-2 w-2 rounded-full" />
        </div>
      </div>
    );
  }

  if (!images || images.length === 0) return null;

  const enableLoop = images.length > 2;

  return (
    <section className="w-full py-8 mx-[-8px]">
      <div className="relative w-full">
        {/* Swiper wrapper with specific styling for Coverflow */}
        <div className="w-full [&_.swiper-pagination-bullet-active]:bg-primary">
          <Swiper
            effect={"coverflow"}
            grabCursor={false}
            simulateTouch={false}
            centeredSlides={true}
            slidesPerView={"auto"}
            loop={enableLoop}
            initialSlide={Math.floor(images.length / 2)}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            onBeforeDestroy={() => {
              swiperRef.current = null;
            }}
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
            className="w-full !pb-16 !pt-4"
          >
            {images.map((image, index) => (
              <SwiperSlide
                key={image.id}
                onClickCapture={(event) =>
                  handleSlideClickCapture(event, index)
                }
                className="max-w-[80%] sm:max-w-[400px] transition-transform duration-300"
              >
                <div className="w-full aspect-[3/4] relative rounded-2xl overflow-hidden shadow-md bg-background ">
                  <ImageCard image={image} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <Button
            type="button"
            aria-label="이전 이미지"
            onClick={handlePrevClick}
            className="absolute left-4 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground shadow-md backdrop-blur transition-colors hover:bg-background [@media(hover:hover)_and_(pointer:fine)]:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            type="button"
            aria-label="다음 이미지"
            onClick={handleNextClick}
            className="absolute right-4 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground shadow-md backdrop-blur transition-colors hover:bg-background [@media(hover:hover)_and_(pointer:fine)]:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
