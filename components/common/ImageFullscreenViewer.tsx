"use client";

import Image from "next/image";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn, getRatio } from "@/lib/utils";
import { ImageRatio } from "@/types/image.interfaces";

interface ImageFullscreenViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  src: string;
  alt?: string;
  ratio?: ImageRatio;
  className?: string;
}

export function ImageFullscreenViewer({
  open,
  onOpenChange,
  src,
  alt = "이미지 전체보기",
  ratio = ImageRatio.RATIO_1_1,
  className,
}: ImageFullscreenViewerProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "top-0 left-0 h-dvh w-screen max-w-none translate-x-0 translate-y-0 rounded-none border-0 bg-black/95 p-0",
          "[&>button]:hidden",
          className,
        )}
      >
        <DialogTitle className="sr-only">전체화면 이미지 보기</DialogTitle>
        <DialogDescription className="sr-only">
          ESC 또는 닫기 버튼으로 종료할 수 있습니다.
        </DialogDescription>

        <div className="relative flex h-full w-full items-center justify-center p-4 md:p-8">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 z-20 text-white hover:bg-white/10 hover:text-white"
            aria-label="닫기"
          >
            <X className="h-6 w-6" />
          </Button>

          <div
            className={cn(
              "relative h-full w-full max-h-[92dvh] max-w-[92vw]",
              getRatio(ratio),
            )}
          >
            <Image
              src={src}
              alt={alt}
              fill
              unoptimized
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
