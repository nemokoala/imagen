import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NeedLoginHandler } from "@/components/home/NeedLoginHandler";
import { imageService } from "@/lib/services/image/imageService";
import { MODEL_CREDIT_SETTINGS } from "@/constants/credit.constants";
import { Model } from "@/types/model.interfaces";
import type { Image as ImageType } from "@/types/image.interfaces";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "ImageGen - AI 이미지 생성 플랫폼",
  description:
    "DALL-E 3, Google Imagen, Stable Diffusion 등 다양한 AI 모델로 나만의 이미지를 생성하고 공유하세요.",
  openGraph: {
    title: "ImageGen - AI 이미지 생성 플랫폼",
    description:
      "DALL-E 3, Google Imagen, Stable Diffusion 등 다양한 AI 모델로 나만의 이미지를 생성하고 공유하세요.",
  },
};

/** 데스크톱 콜라주에 쓰는 이미지 수 */
const HERO_COLLAGE_COUNT = 3;
/** 모바일 부채형 카드에 쓰는 이미지 수 */
const HERO_FAN_COUNT = 5;

const SUPPORTED_MODEL_LABELS = [
  "DALL-E 3",
  "Imagen",
  "Nano Banana",
  "SDXL",
  "Z-Image",
  "Qwen",
];

/**
 * 부채형 카드 배치 (탐색 페이지 캐러셀과 같은 규칙).
 * 가운데에서 떨어진 칸 수별 크기, 중심 위치(가운데 카드 폭 대비), 배경색으로 덮는 정도.
 */
const FAN_SCALE = [1, 0.84, 0.7];
const FAN_SHIFT = [0, 0.458, 0.843];
const FAN_VEIL = [0, 0.2, 0.4];
/** 이미지 순서 → 가운데에서의 위치 (1위 가운데, 2·3위 양옆, 4·5위 바깥) */
const FAN_OFFSETS = [0, -1, 1, -2, 2];
// 높이가 낮은 휴대폰(예: 667px)에서도 버튼까지 한 화면에 들어오도록 화면 높이로도 크기를 제한한다
const FAN_CARD_CLASS =
  "aspect-[4/5] w-[min(62vw,300px,calc((100dvh-440px)*0.8))]";

function getModelLabel(model: string) {
  return MODEL_CREDIT_SETTINGS[model as Model]?.label ?? model;
}

async function getHeroImages(): Promise<ImageType[]> {
  // 빌드 시점이 아니라 요청 시점에 DB를 읽도록 동적 렌더링으로 둔다.
  await connection();
  try {
    return await imageService.getTopLikedImages(
      Math.max(HERO_COLLAGE_COUNT, HERO_FAN_COUNT),
    );
  } catch {
    // 이미지를 못 불러와도 랜딩 문구와 버튼은 그대로 보여준다.
    return [];
  }
}

/** 1위 이미지를 크게 흐려 깐 배경. 이미지 색이 은은하게 번져 흰 배경이 밋밋하지 않게 한다. */
function AmbientBackdrop({ image }: { image: ImageType }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <Image
        src={image.imageUrl}
        alt=""
        fill
        sizes="160px"
        priority
        className="scale-125 object-cover opacity-55 blur-3xl saturate-150 dark:opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/45 to-background" />
    </div>
  );
}

/** 모바일 · 태블릿 첫 화면의 주인공: 인기 이미지를 부채처럼 겹쳐 크게 보여준다 */
function HeroFan({ images }: { images: ImageType[] }) {
  const [main] = images;

  return (
    <div className="relative w-full">
      {/* 보이지 않는 자리 표시 요소가 높이를 잡고, 카드는 그 위에 겹친다 */}
      <div aria-hidden className={cn("invisible mx-auto", FAN_CARD_CLASS)} />
      {images.map((image, index) => {
        const offset = FAN_OFFSETS[index];
        const distance = Math.abs(offset);
        const isMain = distance === 0;
        return (
          <Link
            key={image.id}
            href={`/image/${image.id}`}
            prefetch={false}
            aria-label={isMain ? image.prompt : `${index + 1}위 이미지 보기`}
            className={cn(
              "absolute left-1/2 top-0 overflow-hidden rounded-3xl bg-background-plus shadow-2xl shadow-black/25 ring-1 ring-white/10",
              FAN_CARD_CLASS,
            )}
            style={{
              transform: `translateX(calc(-50% + ${Math.sign(offset) * FAN_SHIFT[distance] * 100}%)) scale(${FAN_SCALE[distance]})`,
              zIndex: 10 - distance,
            }}
          >
            <Image
              src={image.imageUrl}
              alt=""
              fill
              priority={distance <= 1}
              sizes="280px"
              className="object-cover"
            />
            {!isMain && (
              <span
                aria-hidden
                className="absolute inset-0 bg-background"
                style={{ opacity: FAN_VEIL[distance] }}
              />
            )}
          </Link>
        );
      })}

      {/* 가운데 카드 아래쪽에 프롬프트를 붙여 "글 → 이미지"를 보여준다 */}
      <div
        className={cn(
          "pointer-events-none absolute left-1/2 top-0 z-20 -translate-x-1/2",
          FAN_CARD_CLASS,
        )}
      >
        <span className="absolute left-3 top-3 rounded-full bg-black/45 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
          #1
        </span>
        <div className="absolute inset-x-3 bottom-3 rounded-xl bg-black/50 px-3 py-2 text-white backdrop-blur-md">
          <div className="mb-0.5 flex items-center justify-between gap-2 text-[10px] font-medium uppercase tracking-[0.08em] text-white/70">
            <span>Prompt</span>
            <span className="truncate normal-case tracking-normal">
              {getModelLabel(main.model)}
            </span>
          </div>
          <p className="line-clamp-2 break-keep text-xs leading-snug">
            {main.prompt}
          </p>
        </div>
      </div>
    </div>
  );
}

function HeroCollage({ images }: { images: ImageType[] }) {
  const [main, ...rest] = images;

  return (
    <div
      className={cn(
        "hidden h-[460px] gap-3 lg:grid",
        rest.length > 0 ? "grid-cols-[1.35fr_1fr] grid-rows-2" : "grid-cols-1",
      )}
    >
      <Link
        href={`/image/${main.id}`}
        className="group relative row-span-2 overflow-hidden rounded-2xl bg-background-plus shadow-xl shadow-black/10"
      >
        <Image
          src={main.imageUrl}
          alt={main.prompt}
          fill
          priority
          sizes="(max-width: 1024px) 60vw, 30vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-x-3 bottom-3 rounded-xl bg-black/55 px-3.5 py-3 text-white backdrop-blur-md">
          <div className="mb-1 flex items-center justify-between gap-3 text-[10.5px] font-medium uppercase tracking-[0.08em] text-white/70">
            <span>Prompt</span>
            <span className="truncate normal-case tracking-normal">
              {getModelLabel(main.model)}
            </span>
          </div>
          <p className="line-clamp-2 break-keep text-sm leading-snug">
            {main.prompt}
          </p>
        </div>
      </Link>

      {rest.map((image) => (
        <Link
          key={image.id}
          href={`/image/${image.id}`}
          className={cn(
            "group relative overflow-hidden rounded-2xl bg-background-plus shadow-xl shadow-black/10",
            rest.length === 1 && "row-span-2",
          )}
        >
          <Image
            src={image.imageUrl}
            alt={image.prompt}
            fill
            sizes="(max-width: 1024px) 40vw, 20vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </Link>
      ))}
    </div>
  );
}

export default async function LandingPage() {
  const heroImages = await getHeroImages();
  const hasImages = heroImages.length > 0;

  return (
    // 흐린 배경이 헤더 뒤까지 이어지도록 헤더 높이(60px)만큼 위로 끌어올린다
    <div className="relative isolate -mt-15 overflow-hidden">
      {hasImages && <AmbientBackdrop image={heroImages[0]} />}

      <main className="mx-auto flex min-h-dvh w-full max-w-6xl items-start px-5 pb-10 pt-[84px] md:px-8 lg:items-center lg:pb-16 lg:pt-[124px]">
        <NeedLoginHandler />

        <div
          className={cn(
            "grid w-full min-w-0 grid-cols-1 items-center gap-10 lg:gap-14",
            hasImages && "lg:grid-cols-[1.05fr_1fr]",
          )}
        >
          {/* 모바일 · 태블릿에서는 화면 높이(위 84px · 아래 40px 여백 제외)를 채운다 */}
          <div className="flex min-h-[calc(100dvh-124px)] min-w-0 flex-col lg:block lg:min-h-0">
            {hasImages && (
              <div className="flex flex-1 items-center pb-8 lg:hidden">
                <HeroFan images={heroImages.slice(0, HERO_FAN_COUNT)} />
              </div>
            )}

            <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              <span className="size-1.5 rounded-full bg-primary" />
              AI Image Studio
            </span>

            <h1 className="mt-3 break-keep text-[34px] font-bold leading-[1.15] tracking-tight text-foreground sm:text-[40px] lg:text-[52px] lg:leading-[1.1]">
              AI로 만드는
              <br />
              <span className="text-primary">특별한 사진</span>
            </h1>

            <p className="mt-4 max-w-md break-keep text-base leading-relaxed text-muted-foreground sm:mt-5 sm:text-lg">
              여러 AI 모델로 원하는 이미지를 만들고,{" "}
              <br className="hidden sm:block" />
              갤러리에 공유해 좋아요와 댓글을 받아 보세요.
            </p>

            <div className="mt-7 flex gap-3 sm:mt-8">
              <Button asChild size="lg" className="flex-1 sm:flex-none">
                <Link href="/auth/register">
                  무료로 시작하기
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-background/70 backdrop-blur"
              >
                <Link href="/explore">
                  <span className="sm:hidden">갤러리</span>
                  <span className="hidden sm:inline">갤러리 둘러보기</span>
                </Link>
              </Button>
            </div>

            <div className="mt-10 hidden flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-5 text-sm text-muted-foreground sm:flex">
              <span>지원 모델</span>
              {SUPPORTED_MODEL_LABELS.map((label) => (
                <span key={label} className="font-medium text-foreground">
                  {label}
                </span>
              ))}
            </div>
            </div>
          </div>

          {hasImages && (
            <HeroCollage images={heroImages.slice(0, HERO_COLLAGE_COUNT)} />
          )}
        </div>
      </main>
    </div>
  );
}
