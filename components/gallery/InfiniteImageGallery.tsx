"use client";

import { ImageCard } from "@/components/gallery/ImageCard";
import { Image } from "@/components/gallery/types";
import { useGetGalleryImagesInfiniteQuery } from "@/queries/image/queries";
import { Button } from "@/components/ui/button";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef, useEffect, useMemo, useState } from "react";

interface InfiniteImageGalleryProps {
  onImageClick?: (image: Image) => void;
  onDownload?: (imageUrl: string, prompt: string) => void;
}

export function InfiniteImageGallery({
  onImageClick,
  onDownload,
}: InfiniteImageGalleryProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const {
    data,
    error,
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

  // 반응형 컬럼 수 계산
  const getColumnCount = () => {
    if (typeof window === "undefined") return 4;
    const width = window.innerWidth;
    if (width >= 1280) return 4; // xl
    if (width >= 1024) return 3; // lg
    if (width >= 768) return 2; // md
    return 1; // sm
  };

  const [columnCount, setColumnCount] = useState(getColumnCount);

  useEffect(() => {
    const handleResize = () => {
      setColumnCount(getColumnCount());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 컬럼별로 이미지를 그룹화
  const rows = useMemo(() => {
    const rows: Image[][] = [];
    for (let i = 0; i < images.length; i += columnCount) {
      rows.push(images.slice(i, i + columnCount));
    }
    return rows;
  }, [images, columnCount]);

  // 가상 스크롤 설정 - 동적 높이 측정
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 350, // 초기 예상 높이 (실제 높이는 자동 측정됨)
    overscan: 5, // 화면 밖에 렌더링할 추가 행 수 (더 많이 유지하여 재로드 방지)
    gap: 16,
    measureElement:
      typeof window !== "undefined" &&
      navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined, // Firefox는 자동 측정 사용
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-1">
                  {row.map((image: Image) => (
                    <ImageCard
                      key={image.id}
                      image={image}
                      onImageClick={onImageClick ?? (() => {})}
                      onDownload={onDownload ?? (() => {})}
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
    </div>
  );
}
