"use client";

import { Button } from "@/components/ui/button";

interface LoadMoreStatusProps {
  isFetchingNextPage: boolean;
  error: Error | null;
  hasNextPage: boolean;
  imagesLength: number;
  totalImages: number;
  onRetry: () => void;
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
}

export function LoadMoreStatus({
  isFetchingNextPage,
  error,
  hasNextPage,
  imagesLength,
  totalImages,
  onRetry,
  loadMoreRef,
}: LoadMoreStatusProps) {
  return (
    <div
      ref={loadMoreRef}
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingTop: "2rem",
        paddingBottom: "2rem",
      }}
      className="flex justify-center"
    >
      {isFetchingNextPage ? (
        <div className="flex items-center gap-2 text-purple-600">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
          <span>더 많은 이미지를 불러오는 중...</span>
        </div>
      ) : error ? (
        <div className="text-center">
          <p className="text-red-500 mb-4">
            {error instanceof Error
              ? error.message
              : "이미지를 불러오는데 실패했습니다."}
          </p>
          <Button
            onClick={onRetry}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          >
            다시 시도
          </Button>
        </div>
      ) : !hasNextPage && imagesLength > 0 ? (
        <div className="text-center text-gray-500">
          <p>모든 이미지를 불러왔습니다.</p>
          <p className="text-sm mt-1">총 {totalImages}개의 이미지</p>
        </div>
      ) : null}
    </div>
  );
}
