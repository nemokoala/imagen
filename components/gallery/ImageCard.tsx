"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, Heart, MessageCircle } from "lucide-react";
import Image from "next/image";
import { Image as ImageType } from "@/types/image.interfaces";
import { Skeleton } from "../ui/skeleton";
import { useGetLikeStatusQuery } from "@/queries/image/queries";
import { useToggleLikeMutation } from "@/queries/image/mutations";
import { useUserStore } from "@/stores/userStore";
import { toast } from "sonner";

interface ImageCardProps {
  image: ImageType;
}

export function ImageCard({ image }: ImageCardProps) {
  const router = useRouter();
  const prefetchedRef = useRef(false); // 중복 prefetch 방지
  const [isLoaded, setIsLoaded] = useState(false);
  const { isAuthenticated } = useUserStore();

  const { data: likeStatus } = useGetLikeStatusQuery(image.id, {
    success: true,
    likeCount: image.likeCount,
    liked: image.isLiked,
  });
  const likeMutation = useToggleLikeMutation(image.id);

  const likeCount = likeStatus?.likeCount ?? 0;
  const liked = likeStatus?.liked ?? false;

  // 호버 시 router.prefetch 호출 - App Router에서 동적 라우트도 정상 동작
  const handleMouseEnter = useCallback(() => {
    if (!prefetchedRef.current) {
      router.prefetch(`/image/${image.id}`);
      prefetchedRef.current = true;
    }
  }, [router, image.id]);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await likeMutation.mutateAsync();
      if (response.success) {
        toast.success(response.message);
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "좋아요 처리 중 오류가 발생했습니다.";
      toast.error(message);
    }
  };

  return (
    <Link
      href={`/image/${image.id}`}
      prefetch={false}
      onMouseEnter={handleMouseEnter}
      className="block"
    >
      <Card className="overflow-hidden aspect-square transition-all duration-300 cursor-pointer group bg-background backdrop-blur-sm border-0 gap-1 p-0">
        <div className="relative h-full">
          {!isLoaded && <Skeleton className="absolute inset-0 z-10" />}
          <Image
            src={image.imageUrl}
            alt={image.prompt}
            fill
            className="object-cover transition-transform duration-300 aspect-square"
            loading="eager"
            priority={true}
            sizes="33vw"
            onLoad={() => setIsLoaded(true)}
          />

          {/* 모델 종류 */}
          <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
            <Badge
              variant="secondary"
              className="text-xs gradient-purple-bg text-white backdrop-blur-sm border-0 shadow-lg self-end"
            >
              {image.model}
            </Badge>
          </div>

          {/* 좋아요, 댓글*/}
          <div className="flex gap-2 absolute bottom-2 left-2 z-20">
            <Button
              className={`flex items-center gap-1.5 cursor-pointer rounded-full backdrop-blur-md transition-all duration-300 bg-black/30 border border-white/10`}
              onClick={handleLike}
              size="sm"
            >
              <Heart
                className={`h-3.5 w-3.5 ${
                  liked ? "fill-red-500 text-red-500" : "text-white"
                }`}
              />
              <span
                className={`text-xs font-medium ${
                  liked ? "text-red-200" : "text-white"
                }`}
              >
                {likeCount}
              </span>
            </Button>
            <Button
              className="flex items-center gap-1.5 px-2 py-3 rounded-full backdrop-blur-md border bg-black/30 border-white/10"
              size="sm"
            >
              <MessageCircle className="h-3.5 w-3.5 text-white" />
              <span className="text-xs font-medium text-white">
                {image.commentCount}
              </span>
            </Button>
          </div>

          {/* 공유 */}
          <div className="absolute bottom-2 right-2 z-20">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 text-white shadow-sm"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                navigator.clipboard.writeText(
                  `${window.location.origin}/image/${image.id}`,
                );
                toast.success("링크가 복사되었습니다.");
              }}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
}
