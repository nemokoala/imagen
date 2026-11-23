"use client";

import { Button } from "@/components/ui/button";
import {
  Download,
  Trash2,
  ArrowLeft,
  Languages,
  Cpu,
  Maximize2,
  Copy,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState, type CSSProperties } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { CommentSection } from "./comment/CommentSection";
import { useGetCommentsQuery } from "@/queries/image/queries";
import { LikeButton } from "./LikeButton";
import { useDeleteImageMutation } from "@/queries/image/mutations";
import { useUserStore } from "@/stores/userStore";
import { toast } from "sonner";
import { useModal } from "@/providers/ModalProvider";
import { useRouter } from "next/navigation";
import { cn, downloadImage, getRatio } from "@/lib/utils";
import { ImageRatio, Image as ImageType } from "@/types/image.interfaces";
import { Layout } from "../layout/Layout";
import Link from "next/link";
import { ProfileAvatar } from "../auth/ProfileAvatar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ImageCard } from "./ImageCard";
import { useMarkAsReadByImageIdMutation } from "@/queries/notification/mutations";
import { ImageFullscreenViewer } from "@/components/common/ImageFullscreenViewer";
import { MODEL_CREDIT_SETTINGS } from "@/constants/credit.constants";
import { Model } from "@/types/model.interfaces";

/** 비율별 가로/세로 값. 이미지가 화면 높이를 넘지 않도록 최대 너비 계산에 쓴다 */
const RATIO_VALUE: Record<ImageRatio, number> = {
  [ImageRatio.RATIO_1_1]: 1,
  [ImageRatio.RATIO_9_16]: 9 / 16,
  [ImageRatio.RATIO_16_9]: 16 / 9,
};

/** 제목으로 보여줄 프롬프트 최대 길이 (넘으면 아래에 전체 프롬프트를 따로 보여준다) */
const TITLE_MAX_LENGTH = 60;

interface ImageDetailProps {
  image: ImageType;
  prevImages?: ImageType[];
  nextImages?: ImageType[];
}

export function ImageDetail({
  image: initialImage,
  prevImages = [],
  nextImages = [],
}: ImageDetailProps) {
  const router = useRouter();
  const [imageData, setImageData] = useState<ImageType>(initialImage);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const { changeModalContent } = useModal();
  const { user } = useUserStore();

  // image prop이 변경될 때만 업데이트
  useEffect(() => {
    if (initialImage) {
      setImageData(initialImage);
    }
  }, [initialImage]);

  // 이미지 상세 페이지 진입 시 관련 알림 읽음 처리
  useEffect(() => {
    if (imageData?.id && user) {
      markAsReadByImageIdMutation.mutate(imageData.id, {
        onError: (error) => {
          // 알림 읽음 처리 실패는 조용히 처리 (사용자 경험에 영향 없음)
          console.error("알림 읽음 처리 실패:", error);
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageData?.id, user?.id]);

  // TanStack Query hooks
  const { data: comments = [] } = useGetCommentsQuery(imageData?.id ?? null);
  const deleteImageMutation = useDeleteImageMutation();
  const markAsReadByImageIdMutation = useMarkAsReadByImageIdMutation();

  // 삭제 권한 확인: 본인 이미지이거나 어드민인 경우
  const canDelete =
    imageData &&
    user &&
    (imageData.user.id === user.id || user.role === "admin");

  const showDeleteModal = () => {
    changeModalContent(
      {
        title: "이미지 삭제 확인",
        content:
          "정말로 이 이미지를 삭제하시겠습니까? 이 작업은 되돌릴 수 없으며, 관련된 좋아요와 댓글도 함께 삭제됩니다.",
        cancelable: true,
        confirmText: "삭제",
      },
      handleDelete,
    );
  };

  const handleDelete = async () => {
    if (!imageData) return;
    try {
      await deleteImageMutation.mutateAsync(imageData.id);
      toast.success("이미지가 삭제되었습니다.");
      router.push("/"); // 홈으로 이동
    } catch (error) {
      console.error(error);
      toast.error("이미지 삭제에 실패했습니다.");
    }
  };

  if (!imageData) return null;

  const prompt = imageData.prompt || "";
  const isTitleTruncated = prompt.length > TITLE_MAX_LENGTH;
  const title = prompt
    ? isTitleTruncated
      ? prompt.substring(0, TITLE_MAX_LENGTH) + "..."
      : prompt
    : "AI 생성 이미지";
  const modelLabel =
    MODEL_CREDIT_SETTINGS[imageData.model as Model]?.label ?? imageData.model;

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      toast.success("프롬프트를 복사했어요.");
    } catch {
      toast.error("프롬프트를 복사하지 못했어요.");
    }
  };

  return (
    <Layout.Content className="px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto w-full max-w-6xl">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="-ml-2 mb-4 text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          뒤로가기
        </Button>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-12">
          {/* 이미지: 틀 없이 화면 높이에 맞춰 보여준다 */}
          <div className="lg:sticky lg:top-0 lg:self-start">
            <button
              type="button"
              onClick={() => setIsFullscreenOpen(true)}
              aria-label="이미지 크게 보기"
              className={cn(
                "group relative mx-auto block w-full max-w-[min(100%,calc(65dvh*var(--r)))] cursor-zoom-in overflow-hidden rounded-2xl bg-muted shadow-xl shadow-black/10 lg:max-w-[min(100%,calc((100dvh-190px)*var(--r)))] dark:shadow-black/40",
                getRatio(imageData.ratio),
              )}
              style={
                {
                  "--r": RATIO_VALUE[imageData.ratio] ?? 1,
                } as CSSProperties
              }
            >
              <Image
                src={imageData.imageUrl}
                alt={prompt || "AI 생성 이미지"}
                title={prompt || "AI 생성 이미지"}
                fill
                className="object-contain"
                unoptimized
                priority
                itemProp="image"
              />
              <span className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-md transition-opacity [@media(hover:hover)]:opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100">
                <Maximize2 className="size-4" />
              </span>
            </button>
            <ImageFullscreenViewer
              open={isFullscreenOpen}
              onOpenChange={setIsFullscreenOpen}
              src={imageData.imageUrl}
              alt={prompt || "AI 생성 이미지"}
              ratio={imageData.ratio}
            />
          </div>

          {/* 정보 · 댓글: 구분선 없이 간격으로만 나눈다 */}
          <div className="flex min-w-0 flex-col">
            <h1 className="break-keep text-2xl font-bold leading-snug tracking-tight text-foreground md:text-[28px]">
              {title}
            </h1>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <Link
                href={`/profile/${imageData.user.id}`}
                className="flex items-center gap-2.5 rounded-lg transition-opacity hover:opacity-80"
              >
                <ProfileAvatar
                  profileImageUrl={imageData.user.profileImageUrl || ""}
                  nickname={imageData.user.nickname || ""}
                  size="small"
                />
                <span className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">
                    {imageData.user.nickname}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(imageData.createdAt), "yy.MM.dd HH:mm", {
                      locale: ko,
                    })}
                  </span>
                </span>
              </Link>

              <div className="flex items-center gap-1.5">
                <LikeButton imageId={imageData.id} />
                {prompt && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyPrompt}
                    aria-label="프롬프트 복사"
                    title="프롬프트 복사"
                    className="size-10"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => downloadImage(imageData.imageUrl, prompt)}
                  aria-label="다운로드"
                  title="다운로드"
                  className="size-10"
                >
                  <Download className="h-4 w-4" />
                </Button>
                {canDelete && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={showDeleteModal}
                    aria-label="이미지 삭제"
                    title="삭제"
                    className="size-10 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* 프롬프트: 제목에서 잘린 경우에만 전체를 다시 보여준다 */}
            {(isTitleTruncated || imageData.translatedPrompt) && (
              <div className="mt-7 space-y-3">
                {isTitleTruncated && (
                  <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-subtitle">
                    {prompt}
                  </p>
                )}
                {imageData.translatedPrompt && (
                  <details className="group">
                    <summary className="flex w-fit cursor-pointer list-none items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground [&::-webkit-details-marker]:hidden">
                      <Languages className="h-4 w-4" />
                      모델에 전달된 영문 프롬프트
                      <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {imageData.translatedPrompt}
                    </p>
                  </details>
                )}
              </div>
            )}

            {/* 모델 · 크기 · 카테고리 */}
            <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-2.5 py-1 font-medium text-primary-soft-foreground">
                <Cpu className="h-3.5 w-3.5" />
                {modelLabel}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 tabular-nums text-muted-foreground">
                <Maximize2 className="h-3.5 w-3.5" />
                {imageData.size}
              </span>
              {imageData.categories?.map((category) => (
                <Link
                  key={category.id}
                  href={`/explore?categories=${category.slug}`}
                  className="rounded-full bg-muted px-2.5 py-1 text-muted-foreground transition-colors hover:text-foreground"
                >
                  #{category.name}
                </Link>
              ))}
            </div>

            {/* 댓글 */}
            <section className="mt-10 space-y-4">
              <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
                댓글
                <span className="font-medium text-muted-foreground">
                  {comments.length}
                </span>
              </h2>
              <CommentSection imageId={imageData.id} />
            </section>
          </div>
        </div>

        {/* 이전/다음 이미지 */}
        {(prevImages.length > 0 || nextImages.length > 0) && (
          <div className="mt-16 space-y-10">
            {prevImages.length > 0 && (
              <div className="space-y-4">
                <h2 className="flex items-center gap-1.5 text-lg font-semibold text-foreground">
                  <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                  이전글
                </h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {prevImages.map((prevImage) => (
                    <div className="aspect-square" key={prevImage.id}>
                      <ImageCard image={prevImage} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {nextImages.length > 0 && (
              <div className="space-y-4">
                <h2 className="flex items-center gap-1.5 text-lg font-semibold text-foreground">
                  다음글
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {nextImages.map((nextImage) => (
                    <div className="aspect-square" key={nextImage.id}>
                      <ImageCard image={nextImage} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout.Content>
  );
}
