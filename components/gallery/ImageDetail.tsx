"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Sparkles,
  MessageCircle,
  Trash2,
  ArrowLeft,
  Languages,
  Tag,
  Cpu,
  Maximize2,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import { useMarkAsReadByImageIdMutation } from "@/queries/notification/mutations";
import { ImageFullscreenViewer } from "@/components/common/ImageFullscreenViewer";

/** 세로가 긴 이미지가 화면을 넘지 않도록 비율별 최대 너비를 정한다 */
const IMAGE_MAX_WIDTH: Record<ImageRatio, string> = {
  [ImageRatio.RATIO_1_1]: "min(100%, 76dvh)",
  [ImageRatio.RATIO_9_16]: "min(100%, calc(76dvh * 9 / 16))",
  [ImageRatio.RATIO_16_9]: "100%",
};

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

  console.log(imageData);
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

  const title = imageData.prompt
    ? imageData.prompt.length > 60
      ? imageData.prompt.substring(0, 60) + "..."
      : imageData.prompt
    : "AI 생성 이미지";

  return (
    <Layout.Content className="px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto w-full max-w-6xl">
        {/* 뒤로가기 버튼 */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="-ml-2 mb-4 text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          뒤로가기
        </Button>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-10">
          {/* 이미지 */}
          <div className="lg:sticky lg:top-0 lg:self-start">
            <div className="flex justify-center rounded-2xl bg-muted/60 p-2 ring-1 ring-border md:p-3">
              <div
                className={cn(
                  "relative w-full cursor-zoom-in overflow-hidden rounded-xl",
                  getRatio(imageData.ratio),
                )}
                style={{
                  maxWidth:
                    IMAGE_MAX_WIDTH[imageData.ratio] ??
                    IMAGE_MAX_WIDTH[ImageRatio.RATIO_1_1],
                }}
                onClick={() => setIsFullscreenOpen(true)}
              >
                <Image
                  src={imageData.imageUrl}
                  alt={imageData.prompt || "AI 생성 이미지"}
                  title={imageData.prompt || "AI 생성 이미지"}
                  fill
                  className="object-contain"
                  unoptimized
                  priority
                  itemProp="image"
                />
              </div>
            </div>
            <ImageFullscreenViewer
              open={isFullscreenOpen}
              onOpenChange={setIsFullscreenOpen}
              src={imageData.imageUrl}
              alt={imageData.prompt || "AI 생성 이미지"}
              ratio={imageData.ratio}
            />
          </div>

          {/* 정보 · 댓글 */}
          <div className="flex min-w-0 flex-col gap-6">
            <div className="space-y-4">
              {/* 헤더 - 페이지별 고유 h1 */}
              <h1 className="break-keep text-2xl font-bold leading-snug tracking-tight text-foreground md:text-3xl">
                {title}
              </h1>

              {/* 생성자 */}
              <Link
                href={`/profile/${imageData.user.id}`}
                className="flex w-fit items-center gap-2.5 rounded-lg transition-opacity hover:opacity-80"
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

              {/* 액션 */}
              <div className="flex flex-wrap items-center gap-2">
                <LikeButton imageId={imageData.id} />
                <div className="flex h-10 items-center gap-2 px-2 text-sm text-muted-foreground">
                  <MessageCircle className="h-5 w-5" />
                  <span>{comments.length}</span>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <Button
                    onClick={() =>
                      downloadImage(imageData.imageUrl, imageData.prompt)
                    }
                    variant="outline"
                  >
                    <Download className="h-4 w-4" />
                    다운로드
                  </Button>
                  {canDelete && (
                    <Button
                      variant="ghost"
                      onClick={showDeleteModal}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      삭제
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* 프롬프트 */}
            <section className="space-y-2">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Sparkles className="h-4 w-4" />
                프롬프트
              </h2>
              <p className="rounded-xl border border-border bg-card p-4 leading-relaxed text-foreground">
                {imageData.prompt}
              </p>
            </section>

            {/* 번역된 프롬프트 */}
            {imageData.translatedPrompt && (
              <section className="space-y-2">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <Languages className="h-4 w-4" />
                  번역된 프롬프트
                </h2>
                <p className="rounded-xl border border-border bg-muted/50 p-4 text-sm leading-relaxed text-subtitle">
                  {imageData.translatedPrompt}
                </p>
              </section>
            )}

            {/* 이미지 정보 */}
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 rounded-xl border border-border bg-card p-4 text-sm">
              <div className="space-y-1.5">
                <dt className="flex items-center gap-1.5 text-muted-foreground">
                  <Cpu className="h-3.5 w-3.5" />
                  모델
                </dt>
                <dd>
                  <Badge
                    variant="secondary"
                    className="border-transparent bg-primary-soft text-primary-soft-foreground"
                  >
                    {imageData.model}
                  </Badge>
                </dd>
              </div>
              <div className="space-y-1.5">
                <dt className="flex items-center gap-1.5 text-muted-foreground">
                  <Maximize2 className="h-3.5 w-3.5" />
                  크기
                </dt>
                <dd className="font-medium text-foreground">
                  {imageData.size}
                </dd>
              </div>
              {imageData.categories && imageData.categories.length > 0 && (
                <div className="col-span-2 space-y-1.5">
                  <dt className="flex items-center gap-1.5 text-muted-foreground">
                    <Tag className="h-3.5 w-3.5" />
                    카테고리
                  </dt>
                  <dd className="flex flex-wrap gap-1.5">
                    {imageData.categories.map((category) => (
                      <Badge
                        key={category.id}
                        variant="outline"
                        className="bg-background text-subtitle"
                      >
                        {category.name}
                      </Badge>
                    ))}
                  </dd>
                </div>
              )}
            </dl>

            <Separator />

            {/* 댓글 섹션 */}
            <section className="space-y-4">
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

        {/* 이전/다음 이미지 섹션 */}
        {(prevImages.length > 0 || nextImages.length > 0) && (
          <div className="mt-14 space-y-10 border-t border-border pt-10">
            {/* 이전글 */}
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

            {/* 다음글 */}
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
