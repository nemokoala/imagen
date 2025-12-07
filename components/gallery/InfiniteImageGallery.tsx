"use client";

import { ImageCard } from "@/components/gallery/ImageCard";
import { Image } from "@/types/types";
import { useGetGalleryImagesInfiniteQuery } from "@/queries/image/queries";
import { Button } from "@/components/ui/button";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef, useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { useScrollObserver } from "@/hooks/use-scroll-observer";
import { useWindowWidth } from "@/hooks/use-window-width";
import { ImageModal } from "./ImageModal";
import { downloadImage } from "@/lib/utils";

interface InfiniteImageGalleryProps {
  onScrollChange?: (scrollTop: number) => void;
}

export function InfiniteImageGallery({
  onScrollChange,
}: InfiniteImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useGetGalleryImagesInfiniteQuery(20);

  // 모든 페이지의 이미지를 하나의 배열로 합치기
  const images = useMemo(
    () => data?.pages.flatMap((page) => page.images) || [],
    [data?.pages]
  );
  const totalImages = data?.pages[0]?.totalCount || 0;

  // 윈도우 너비 가져오기
  const width = useWindowWidth();

  // 반응형 컬럼 수 계산
  const columnCount = useMemo(() => {
    if (width === 0) return 4; // SSR 또는 초기 렌더링
    if (width >= 1280) return 4; // xl
    if (width >= 1024) return 3; // lg
    if (width >= 768) return 2; // md
    return 2;
  }, [width]);

  // 컬럼별로 이미지를 그룹화
  const rows = useMemo(() => {
    const rows: Image[][] = [];
    for (let i = 0; i < images.length; i += columnCount) {
      rows.push(images.slice(i, i + columnCount));
    }
    return rows;
  }, [images, columnCount]);

  // 가상 스크롤 설정 - 동적 높이 측정
  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 350, // 초기 예상 높이 (실제 높이는 자동 측정됨)
    overscan: 5, // 화면 밖에 렌더링할 추가 행 수 (더 많이 유지하여 재로드 방지)
    gap: width < 768 ? 8 : 16,
    measureElement:
      typeof window !== "undefined" &&
      navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined, // Firefox는 자동 측정 사용
  });

  // 스크롤 이벤트 감지
  useScrollObserver(parentRef, {
    onScrollChange,
  });

  // 스크롤이 끝에 가까워지면 다음 페이지 로드
  useEffect(() => {
    const virtualItems = rowVirtualizer.getVirtualItems();
    const [lastItem] = [...virtualItems].reverse();
    if (!lastItem) return;

    if (
      lastItem.index >= rows.length - 2 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    rowVirtualizer,
    rows.length,
  ]);

  if (isLoading) {
    return (
      <div className="h-[100dvh] fixed inset-0 flex justify-center items-center">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col flex-1 min-h-0 rounded-lg">
      {/* 가상 스크롤 컨테이너 */}
      <div
        ref={parentRef}
        className="w-full flex-1 min-h-0 overflow-auto rounded-lg scrollbar-hide"
        style={{
          contain: "strict",
        }}
      >
        <div
          style={{
            height: `${
              rowVirtualizer.getTotalSize() +
              (isFetchingNextPage ||
              error ||
              (!hasNextPage && images.length > 0)
                ? 120
                : 0)
            }px`,
            width: "100%",
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index];
            if (!row) return null;

            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={rowVirtualizer.measureElement}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-4 gap-2">
                  {row.map((image: Image) => (
                    <ImageCard
                      key={image.id}
                      image={image}
                      onImageClick={() => setSelectedImage(image)}
                      onDownload={() => downloadImage(image.imageUrl)}
                    />
                  ))}
                  {/* 빈 공간 채우기 (마지막 행이 컬럼 수보다 적을 때) */}
                  {row.length < columnCount &&
                    Array.from({ length: columnCount - row.length }).map(
                      (_, idx) => <div key={`empty-${idx}`} />
                    )}
                </div>
              </div>
            );
          })}

          {/* 로딩 및 에러 상태 - 컨테이너 내부에 배치 */}
          <div
            style={{
              position: "absolute",
              top: `${rowVirtualizer.getTotalSize()}px`,
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
                  onClick={() => refetch()}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  다시 시도
                </Button>
              </div>
            ) : !hasNextPage && images.length > 0 ? (
              <div className="text-center text-gray-500">
                <p>모든 이미지를 불러왔습니다.</p>
                <p className="text-sm mt-1">총 {totalImages}개의 이미지</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <ImageModal
        image={selectedImage}
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        onDownload={downloadImage}
      />
    </div>
  );
}
