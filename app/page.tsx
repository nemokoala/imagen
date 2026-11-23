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

const HERO_IMAGE_COUNT = 3;

const SUPPORTED_MODEL_LABELS = [
  "DALL-E 3",
  "Imagen",
  "Nano Banana",
  "SDXL",
  "Z-Image",
  "Qwen",
];

function getModelLabel(model: string) {
  return MODEL_CREDIT_SETTINGS[model as Model]?.label ?? model;
}

async function getHeroImages(): Promise<ImageType[]> {
  // 빌드 시점이 아니라 요청 시점에 DB를 읽도록 동적 렌더링으로 둔다.
  await connection();
  try {
    return await imageService.getTopLikedImages(HERO_IMAGE_COUNT);
  } catch {
    // 이미지를 못 불러와도 랜딩 문구와 버튼은 그대로 보여준다.
    return [];
  }
}

function HeroCollage({ images }: { images: ImageType[] }) {
  const [main, ...rest] = images;

  return (
    <div
      className={cn(
        "grid h-[320px] gap-3 sm:h-[400px] lg:h-[460px]",
        rest.length > 0 ? "grid-cols-[1.35fr_1fr] grid-rows-2" : "grid-cols-1",
      )}
    >
      <Link
        href={`/image/${main.id}`}
        className="group relative row-span-2 overflow-hidden rounded-2xl bg-background-plus"
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
          <p className="line-clamp-2 text-sm leading-snug">{main.prompt}</p>
        </div>
      </Link>

      {rest.map((image) => (
        <Link
          key={image.id}
          href={`/image/${image.id}`}
          className={cn(
            "group relative overflow-hidden rounded-2xl bg-background-plus",
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

  return (
    <main className="mx-auto flex min-h-[calc(100dvh-60px)] w-full max-w-6xl items-center px-5 py-12 md:px-8 md:py-16">
      <NeedLoginHandler />

      <div
        className={cn(
          "grid w-full items-center gap-10 lg:gap-14",
          heroImages.length > 0 && "lg:grid-cols-[1.05fr_1fr]",
        )}
      >
        <div>
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" />
            AI Image Studio
          </span>

          <h1 className="mt-4 text-5xl font-extrabold leading-[1.08] tracking-tight text-foreground md:text-6xl">
            AI로 만드는
            <br />
            <span className="text-primary">특별한 사진</span>
          </h1>

          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
            여러 AI 모델로 원하는 이미지를 만들고,
            <br className="hidden sm:block" />
            갤러리에 공유해 좋아요와 댓글을 받아 보세요.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/auth/register">
                무료로 시작하기
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/explore">갤러리 둘러보기</Link>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-5 text-sm text-muted-foreground">
            <span>지원 모델</span>
            {SUPPORTED_MODEL_LABELS.map((label) => (
              <span key={label} className="font-medium text-foreground">
                {label}
              </span>
            ))}
          </div>
        </div>

        {heroImages.length > 0 && <HeroCollage images={heroImages} />}
      </div>
    </main>
  );
}
