"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetTopLikedImagesQuery } from "@/queries/image/queries";
import {
  MOBILE_SHOWCASE_COUNT,
  SHOWCASE_IMAGE_LIMIT,
} from "@/constants/image.constants";
import type { Image as ImageType } from "@/types/image.interfaces";
import { cn } from "@/lib/utils";

/** 데스크톱 그리드에 보여줄 타일 수 (큰 타일 1 + 작은 타일 6) */
const DESKTOP_TILE_COUNT = 7;
/** 태블릿 그리드에 보여줄 타일 수 (큰 타일 1 + 작은 타일 2) */
const TABLET_TILE_COUNT = 3;

/**
 * 모바일: 옆으로 넘기는 카드 목록
 * 태블릿: 3열 2행 (큰 타일 1 + 작은 타일 2)
 * 데스크톱: 5열 2행 (큰 타일 1 + 작은 타일 6)
 * 한 번만 렌더링하고 화면 폭에 따라 배치와 노출 개수만 바꾼다.
 */
const GRID_CLASS =
  "flex snap-x snap-mandatory gap-3 overflow-x-auto scrollbar-hide md:grid md:h-[min(62vh,560px)] md:grid-cols-3 md:grid-rows-2 md:overflow-visible lg:grid-cols-5";

function tileVisibility(index: number) {
  return cn(
    index >= MOBILE_SHOWCASE_COUNT && "hidden",
    index >= TABLET_TILE_COUNT && "md:hidden",
    index < DESKTOP_TILE_COUNT ? "lg:block" : "lg:hidden",
  );
}

function FeaturedTile({ image, rank }: { image: ImageType; rank: number }) {
  const isHero = rank === 1;

  return (
    <Link
      href={`/image/${image.id}`}
      prefetch={false}
      className={cn(
        "group relative block aspect-[4/5] w-[78%] shrink-0 snap-start overflow-hidden rounded-2xl bg-background-plus sm:w-[46%] md:aspect-auto md:w-auto",
        isHero && "md:col-span-2 md:row-span-2",
        tileVisibility(rank - 1),
      )}
    >
      <Image
        src={image.imageUrl}
        alt={image.prompt}
        fill
        priority={rank <= 3}
        sizes={
          isHero
            ? "(max-width: 768px) 80vw, 40vw"
            : "(max-width: 768px) 80vw, 20vw"
        }
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />

      {/* 순위 */}
      <span className="absolute left-3 top-3 z-10 rounded-full bg-black/45 px-2.5 py-1 text-xs font-semibold tabular-nums text-white backdrop-blur-md">
        #{rank}
      </span>

      {/* 하단 정보: 큰 타일과 터치 기기에서는 항상, 나머지는 호버·포커스 때만 보인다 */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/75 via-black/35 to-transparent text-white transition-opacity duration-300",
          isHero ? "px-5 pb-5 pt-20" : "px-3.5 pb-3 pt-12",
          !isHero &&
            "[@media(hover:hover)]:opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100",
        )}
      >
        <p
          className={cn(
            "font-medium leading-snug",
            isHero ? "line-clamp-2 text-lg" : "line-clamp-1 text-sm",
          )}
        >
          {image.prompt}
        </p>
        <div className="mt-1.5 flex items-center justify-between gap-3 text-xs text-white/75">
          <span className="truncate">{image.user.nickname}</span>
          <span className="flex shrink-0 items-center gap-1">
            <Heart className="h-3.5 w-3.5" />
            {image.likeCount}
          </span>
        </div>
      </div>
    </Link>
  );
}

function FeaturedSkeleton() {
  return (
    <div className={GRID_CLASS}>
      {Array.from({ length: DESKTOP_TILE_COUNT }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn(
            "aspect-[4/5] w-[78%] shrink-0 rounded-2xl sm:w-[46%] md:aspect-auto md:w-auto",
            index === 0 && "md:col-span-2 md:row-span-2",
            tileVisibility(index),
          )}
        />
      ))}
    </div>
  );
}

/** 탐색 페이지 상단: 좋아요를 가장 많이 받은 이미지 */
export function FeaturedShowcase() {
  // 서버에서 같은 키로 미리 채워 두므로 첫 화면에서 다시 요청하지 않는다.
  const { data: images, isLoading } =
    useGetTopLikedImagesQuery(SHOWCASE_IMAGE_LIMIT);

  if (!isLoading && (!images || images.length === 0)) return null;

  return (
    <section aria-labelledby="featured-heading" className="pb-10 pt-6">
      <div className="mb-4 px-1">
        <h2
          id="featured-heading"
          className="text-2xl font-bold tracking-tight text-foreground"
        >
          인기 이미지
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          좋아요를 가장 많이 받은 작품이에요
        </p>
      </div>

      {isLoading || !images ? (
        <FeaturedSkeleton />
      ) : (
        <div className={GRID_CLASS}>
          {images.map((image, index) => (
            <FeaturedTile key={image.id} image={image} rank={index + 1} />
          ))}
        </div>
      )}
    </section>
  );
}
