"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Heart, MessageCircle } from "lucide-react";
import Image from "next/image";
import { Image as ImageType } from "@/types/image.interfaces";
import { downloadImage } from "@/lib/utils";

interface ImageCardProps {
  image: ImageType;
}

export function ImageCard({ image }: ImageCardProps) {
  const router = useRouter();
  const prefetchedRef = useRef(false); // 중복 prefetch 방지

  // 호버 시 router.prefetch 호출 - App Router에서 동적 라우트도 정상 동작
  const handleMouseEnter = useCallback(() => {
    if (!prefetchedRef.current) {
      router.prefetch(`/image/${image.id}`);
      prefetchedRef.current = true;
    }
  }, [router, image.id]);

  return (
    <Link
      href={`/image/${image.id}`}
      prefetch={false}
      onMouseEnter={handleMouseEnter}
      className="block"
    >
      <Card className="overflow-hidden hover:shadow-2xl aspect-square transition-all duration-300 cursor-pointer group bg-white/80 backdrop-blur-sm border-0 shadow-xl gap-1 p-0">
        <div className="relative h-full">
          <Image
            src={image.imageUrl}
            alt={image.prompt}
            fill
            className="object-cover transition-transform duration-300 aspect-square"
            loading="eager"
            priority={true}
            sizes="33vw"
          />
          <div className="absolute top-3 right-3">
            <Badge
              variant="secondary"
              className="text-xs gradient-purple-bg text-white backdrop-blur-sm border-0 shadow-lg"
            >
              {image.model}
            </Badge>
          </div>
          <div className="flex gap-2 absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background rounded-full p-2 shadow-lg">
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4 text-red-500 fill-red-500" />
              <span className="text-xs text-foreground">{image.likeCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4 text-blue-500 fill-blue-500" />
              <span className="text-xs text-foreground">
                {image.commentCount}
              </span>
            </div>
          </div>
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 bg-background/90 backdrop-blur-sm border-0 shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                downloadImage(image.imageUrl, image.prompt);
              }}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
}
