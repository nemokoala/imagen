"use client";

import { Button } from "@/components/ui/button";

interface LoadMoreStatusProps {
  isFetchingNextPage: boolean;
  error: Error | null;
  hasNextPage: boolean;
  imagesLength: number;
  totalImages: number;
  onRetry: () => void;
  loadMoreRef: (node?: Element | null) => void;
  rowHeight: number;
}

export function LoadMoreStatus({
  isFetchingNextPage,
  error,
  hasNextPage,
  imagesLength,
  totalImages,
  onRetry,
  loadMoreRef,
  rowHeight,
}: LoadMoreStatusProps) {
  return (
    <>
      <div
        ref={loadMoreRef}
        style={{
          backgroundColor: "transparent",
          position: "absolute",
          height: `${rowHeight}px`,
          bottom: `${rowHeight * 6}px`, // 여유 있는 탐지 높이
          left: 0,
          right: 0,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingTop: "2rem",
          paddingBottom: "2rem",
          pointerEvents: "none",
        }}
        className="flex justify-center"
      >
        {isFetchingNextPage ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            <span>더 많은 이미지를 불러오는 중...</span>
          </div>
        ) : error ? (
          <div className="text-center">
            <p className="text-destructive mb-4">
              {error instanceof Error
                ? error.message
                : "이미지를 불러오는데 실패했습니다."}
            </p>
            <Button onClick={onRetry}>
              다시 시도
            </Button>
          </div>
        ) : !hasNextPage && imagesLength > 0 ? (
          <div className="text-center text-sm text-muted-foreground">
            <p>모든 이미지를 불러왔습니다.</p>
            <p className="text-xs mt-1">총 {totalImages}개의 이미지</p>
          </div>
        ) : null}
      </div>
    </>
  );
}
