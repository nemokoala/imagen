"use client";

import { useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, MessageCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileAvatar } from "@/components/auth/ProfileAvatar";
import { useGetTopLikedImagesQuery } from "@/queries/image/queries";
import { SHOWCASE_IMAGE_LIMIT } from "@/constants/image.constants";
import { cn } from "@/lib/utils";
import {
  WIDE_CONTAINER,
  WIDE_PAGE_BLEED,
} from "@/constants/layout.constants";

/** 캐러셀에서 돌아가며 보여줄 상위 이미지 수 */
const SPOTLIGHT_COUNT = 10;
/** 가운데 카드 크기 (4:5) */
const CARD_CLASS = "aspect-[4/5] w-[min(64vw,300px)] md:w-[340px]";

/** 가운데에서 떨어진 칸 수(0~4)별 카드 크기와, 카드를 배경색으로 덮는 정도 */
const CARD_SCALE = [1, 0.84, 0.7, 0.58, 0.48];
const CARD_VEIL = [0, 0.22, 0.42, 0.58, 0.7];
/** 넓은 화면에서 가운데 양옆으로 보여줄 카드 수 */
const MAX_VISIBLE_DISTANCE = CARD_SCALE.length - 1;

/**
 * 칸별 카드 중심 위치(가운데 카드 폭 대비). 바깥 카드가 바로 안쪽 카드에 겹쳐
 * 부채처럼 이어지도록, 각 카드가 안쪽 카드 밖으로 자기 폭의 45%만 드러나게 쌓는다.
 */
const CARD_SHIFT = CARD_SCALE.reduce<{ shifts: number[]; edge: number }>(
  (acc, scale, distance) => {
    if (distance === 0) return { shifts: [0], edge: 0.5 };
    const edge = acc.edge + 0.45 * scale;
    return { shifts: [...acc.shifts, edge - scale / 2], edge };
  },
  { shifts: [], edge: 0 },
).shifts;

function cardStyle(offset: number) {
  const distance = Math.min(Math.abs(offset), MAX_VISIBLE_DISTANCE);
  const shift = Math.sign(offset) * CARD_SHIFT[distance] * 100;
  return {
    transform: `translateX(calc(-50% + ${shift}%)) scale(${CARD_SCALE[distance]})`,
    opacity: Math.abs(offset) > MAX_VISIBLE_DISTANCE ? 0 : 1,
    zIndex: 20 - Math.abs(offset),
  };
}

/** 화면이 좁을수록 바깥 카드를 감춘다: 모바일 1장, 태블릿 2장, 노트북 3장, 넓은 화면 4장 */
function visibilityClass(distance: number) {
  return cn(
    distance >= 2 && "max-md:pointer-events-none max-md:opacity-0!",
    distance >= 3 && "max-lg:pointer-events-none max-lg:opacity-0!",
    distance >= 4 && "max-xl:pointer-events-none max-xl:opacity-0!",
    distance > MAX_VISIBLE_DISTANCE && "pointer-events-none",
  );
}

/**
 * 탐색 페이지 상단: 인기 이미지 시네마틱 캐러셀
 * - 가운데 큰 카드 하나와 양옆 카드가 보이고, 지금 카드를 크게 흐려 섹션 배경에 깐다.
 * - 아래 점의 진행 막대가 끝나면 다음 카드로 넘어간다. 마우스를 올려 막대를 멈추면
 *   넘김도 멈추고, 움직임 줄이기 설정에서는 막대가 움직이지 않아 넘기지 않는다.
 */
export function FeaturedSpotlight() {
  const { data: images, isLoading } =
    useGetTopLikedImagesQuery(SHOWCASE_IMAGE_LIMIT);
  const [active, setActive] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);

  if (isLoading || !images) {
    return (
      <section className={cn("shrink-0 pb-10 pt-6", WIDE_CONTAINER)}>
        <Skeleton className="mb-6 h-8 w-56 rounded-lg" />
        <Skeleton className={cn("mx-auto rounded-3xl", CARD_CLASS)} />
      </section>
    );
  }
  if (images.length === 0) return null;

  const spotlight = images.slice(0, SPOTLIGHT_COUNT);
  const count = spotlight.length;
  const current = spotlight[Math.min(active, count - 1)];

  const go = (index: number) => setActive(((index % count) + count) % count);

  // 가운데에서의 거리: 양쪽으로 가까운 쪽을 택해 끝과 처음이 이어지게 한다
  const offsetOf = (index: number) => {
    let offset = (((index - active) % count) + count) % count;
    if (offset > count / 2) offset -= count;
    return offset;
  };

  const handleCardClick = (event: MouseEvent, index: number) => {
    if (index === active) return; // 가운데 카드는 상세 페이지로 이동
    event.preventDefault();
    go(index);
  };

  return (
    <section
      aria-labelledby="featured-heading"
      aria-roledescription="carousel"
      className={cn(
        "relative isolate shrink-0 overflow-hidden pb-10 pt-6",
        WIDE_PAGE_BLEED,
      )}
    >
      {/* 앰비언트 배경: 가운데 카드 이미지를 크게 흐려 깐다 */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {spotlight.map((image, index) => (
          <div
            key={image.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000",
              index === active ? "opacity-100" : "opacity-0",
            )}
          >
            <Image
              src={image.imageUrl}
              alt=""
              fill
              sizes="160px"
              loading="eager"
              className="scale-125 object-cover opacity-55 blur-3xl saturate-150 dark:opacity-60"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/45 to-background" />
      </div>

      <div className={WIDE_CONTAINER}>
      <div className="mb-6 flex items-end justify-between gap-4 px-1">
        <div>
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" />
            Top {count}
          </span>
          <h2
            id="featured-heading"
            className="mt-1 text-2xl font-bold tracking-tight text-foreground md:text-3xl"
          >
            지금 가장 사랑받는 이미지
          </h2>
        </div>
        {count > 1 && (
          <div className="flex gap-2">
            {[
              { label: "이전 이미지", step: -1, Icon: ChevronLeft },
              { label: "다음 이미지", step: 1, Icon: ChevronRight },
            ].map(({ label, step, Icon }) => (
              <button
                key={label}
                type="button"
                aria-label={label}
                onClick={() => go(active + step)}
                className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-card/70 text-foreground ring-1 ring-border backdrop-blur transition-colors hover:bg-card"
              >
                <Icon className="size-4" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchStartX.current;
          touchStartX.current = null;
          if (Math.abs(dx) > 40) go(active + (dx < 0 ? 1 : -1));
        }}
      >
        {/* 카드 트랙: 보이지 않는 자리 표시 요소가 높이를 잡고, 카드는 그 위에 겹친다 */}
        <div className="relative">
          <div aria-hidden className={cn("invisible mx-auto", CARD_CLASS)} />
          {spotlight.map((image, index) => {
            const offset = offsetOf(index);
            const isActive = offset === 0;
            return (
              <Link
                key={image.id}
                href={`/image/${image.id}`}
                prefetch={false}
                onClick={(e) => handleCardClick(e, index)}
                aria-label={isActive ? image.prompt : `${index + 1}위 이미지 보기`}
                aria-current={isActive || undefined}
                style={cardStyle(offset)}
                className={cn(
                  "absolute left-1/2 top-0 overflow-hidden rounded-3xl bg-background-plus shadow-2xl shadow-black/30 ring-1 ring-white/10 transition-[transform,opacity,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  CARD_CLASS,
                  !isActive && "saturate-[0.75]",
                  visibilityClass(Math.abs(offset)),
                )}
              >
                <Image
                  src={image.imageUrl}
                  alt=""
                  fill
                  priority={index === 0}
                  sizes="(max-width: 768px) 64vw, 340px"
                  className={cn(
                    "object-cover",
                    isActive &&
                      "motion-safe:animate-[spotlight-zoom_7s_ease-out_forwards]",
                  )}
                />
                <span className="absolute left-3 top-3 rounded-full bg-black/45 px-2.5 py-1 text-xs font-semibold tabular-nums text-white backdrop-blur-md">
                  #{index + 1}
                </span>
                {/* 바깥 카드일수록 배경색으로 덮어 뒤로 물러나 보이게 한다 (투명하게 비치지 않음) */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-background transition-opacity duration-700"
                  style={{
                    opacity:
                      CARD_VEIL[Math.min(Math.abs(offset), MAX_VISIBLE_DISTANCE)],
                  }}
                />
              </Link>
            );
          })}
        </div>

        {/* 캡션 */}
        <div className="mx-auto mt-6 max-w-2xl px-4 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                No.{active + 1}
              </span>
              <Link
                href={`/image/${current.id}`}
                prefetch={false}
                className="mt-1.5 block line-clamp-1 text-lg font-bold tracking-tight text-foreground hover:underline md:text-xl"
              >
                {current.prompt}
              </Link>
              <div className="mt-2 flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <ProfileAvatar
                    profileImageUrl={current.user.profileImageUrl}
                    nickname={current.user.nickname}
                    size="icon"
                  />
                  <span className="font-medium text-foreground">
                    {current.user.nickname}
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="size-4" />
                  {current.likeCount}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="size-4" />
                  {current.commentCount}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 진행 점: 가운데 점의 막대가 다 차면 다음으로 넘어간다 */}
        {count > 1 && (
          <div className="mt-5 flex justify-center gap-1.5">
            {spotlight.map((image, index) => {
              const isActive = index === active;
              return (
                <button
                  key={image.id}
                  type="button"
                  aria-label={`${index + 1}위로 이동`}
                  onClick={() => go(index)}
                  className={cn(
                    "relative h-2 cursor-pointer overflow-hidden rounded-full bg-foreground/20 transition-[width] duration-300",
                    isActive ? "w-9" : "w-2 hover:bg-foreground/35",
                  )}
                >
                  {isActive && (
                    <span
                      key={active}
                      onAnimationEnd={() => go(active + 1)}
                      className="absolute inset-0 origin-left scale-x-0 rounded-full bg-primary motion-safe:animate-[spotlight-progress_6s_linear_forwards]"
                      style={{
                        animationPlayState: isHovered ? "paused" : "running",
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
      </div>
    </section>
  );
}
