"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
import { Share2, Heart, MessageCircle } from "lucide-react";
import Image from "next/image";
import { Image as ImageType } from "@/types/image.interfaces";
import { Skeleton } from "../ui/skeleton";
import { useToggleLikeMutation } from "@/queries/image/mutations";
import { useUserStore } from "@/stores/userStore";
import { toast } from "sonner";

interface ImageCardProps {
  image: ImageType;
  index?: number;
}

export function ImageCard({ image }: ImageCardProps) {
  const router = useRouter();
  const prefetchedRef = useRef(false); // 중복 prefetch 방지
  const [isLoaded, setIsLoaded] = useState(false);
  const { isAuthenticated } = useUserStore();

  const likeMutation = useToggleLikeMutation(image.id);

  const [liked, setLiked] = useState(image.isLiked);
  const [likeCount, setLikeCount] = useState(image.likeCount);

  // props가 변경되면 상태 동기화 (예: 리스트 새로고침 시)
  useEffect(() => {
    setLiked(image.isLiked);
    setLikeCount(image.likeCount);
  }, [image.isLiked, image.likeCount]);

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

    // 낙관적 업데이트
    const prevLiked = liked;
    const prevCount = likeCount;

    setLiked(!prevLiked);
    setLikeCount(prevLiked ? prevCount - 1 : prevCount + 1);

    try {
      const response = await likeMutation.mutateAsync();
      if (!response.success) {
        // 실패 시 롤백
        setLiked(prevLiked);
        setLikeCount(prevCount);
        toast.error(response.message || "좋아요 처리에 실패했습니다.");
      }
    } catch (error: unknown) {
      // 에러 시 롤백
      setLiked(prevLiked);
      setLikeCount(prevCount);
      const message =
        error instanceof Error
          ? error.message
          : "좋아요 처리 중 오류가 발생했습니다.";
      toast.error(message);
    }
  };

  return (
    <div className="h-full">
      <Link
        href={`/image/${image.id}`}
        prefetch={false}
        onMouseEnter={handleMouseEnter}
        className="block h-full"
      >
        <Card
          className="overflow-hidden cursor-pointer group bg-background-plus border-0 gap-1 p-0 transform-gpu h-full"
          style={{
            WebkitBackfaceVisibility: "hidden",
            backfaceVisibility: "hidden",
          }}
        >
          <div className="relative h-full">
            {!isLoaded && <Skeleton className="absolute inset-0 z-10" />}
            <Image
              src={image.imageUrl}
              alt={image.prompt}
              fill
              className="object-cover transition-transform duration-300"
              loading="eager"
              priority={true}
              sizes="(max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              onLoad={() => setIsLoaded(true)}
            />

            {/* 모델 종류 */}
            {/* <div className="absolute top-2 right-2 z-20 flex flex-col gap-2">
              <Badge
                variant="secondary"
                className="text-xs bg-foreground/50 text-background border-0 shadow-lg self-end"
              >
                {image.model}
              </Badge>
            </div> */}

            {/* 하단 그라데이션 오버레이 */}
            <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/60 to-transparent z-10 pointer-events-none" />

            {/* 좋아요, 댓글, 공유 */}
            <div className="absolute bottom-0 inset-x-0 z-20 flex items-center justify-between px-2.5 pb-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLike}
                  className="flex items-center gap-1 text-white/90 hover:text-white transition-colors hover:cursor-pointer"
                >
                  <Heart
                    className={`h-3.5 w-3.5 ${liked ? "fill-red-500 text-red-500" : ""}`}
                  />
                  <span className="text-xs font-medium">{likeCount}</span>
                </button>
                <div className="flex items-center gap-1 text-white/90 hover:cursor-pointer">
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">
                    {image.commentCount}
                  </span>
                </div>
              </div>
              <button
                className="text-white/70 hover:text-white transition-colors hover:cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  navigator.clipboard.writeText(
                    `${window.location.origin}/image/${image.id}`,
                  );
                  toast.success("링크가 복사되었습니다.");
                }}
              >
                <Share2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
}
