"use client";

import { Image } from "@/types/image.interfaces";
import { useGetGalleryImagesInfiniteQuery } from "@/queries/image/queries";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef, useEffect, useMemo } from "react";
import { useWindowWidth } from "@/hooks/use-window-width";
import { LoadingSpinner } from "./LoadingSpinner";
import { VirtualRow } from "./VirtualRow";
import { LoadMoreStatus } from "./LoadMoreStatus";
import { useScrollStore } from "@/stores/scrollStore";
import { useScrollObserver } from "@/hooks/use-scroll-observer";

interface InfiniteImageGalleryProps {
  onScrollChange?: (scrollTop: number) => void;
}

export function InfiniteImageGallery({
  onScrollChange: _onScrollChange,
}: InfiniteImageGalleryProps) {
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

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { scrollPos, setScrollPos } = useScrollStore();

  // 모든 페이지의 이미지를 하나의 배열로 합치기
  const images = useMemo(
    () => data?.pages.flatMap((page) => page.images) || [],
    [data?.pages]
  );
  const totalImages = data?.pages[0]?.totalCount || 0;

  const width = useWindowWidth();

  const gap = 8;
  const containerWidth = useMemo(() => width - gap * 2, [gap, width]);

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

  // 행 높이 직접 계산 (aspect-square 이미지: 너비 = 높이)
  const rowHeight = useMemo(() => {
    if (containerWidth === 0) return 350; // 초기값
    const totalGap = gap * (columnCount - 1);
    const cardWidth = (containerWidth - totalGap) / columnCount;
    return Math.floor(cardWidth); // 소수점 제거로 정확한 픽셀 계산
  }, [containerWidth, columnCount]);

  // 가상 스크롤 설정 - 높이 직접 계산 (measureElement 제거로 떨림 방지)
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan: 10,
    gap,
    initialOffset: scrollPos,
  });

  useScrollObserver(parentRef, {
    onScrollChange: (scrollTop) => {
      setScrollPos(scrollTop);
    },
  });

  // 리사이즈 시 가상화 요소 재계산 및 측정값 초기화
  useEffect(() => {
    rowVirtualizer.measure();
  }, [width, rowHeight, rowVirtualizer]);

  // IntersectionObserver로 다음 페이지 로드
  useEffect(() => {
    const sentinel = loadMoreRef.current;
    const scrollElement = parentRef.current;
    if (!sentinel || !scrollElement || !hasNextPage || isFetchingNextPage)
      return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: scrollElement,
        rootMargin: "200px", // 뷰포트 끝에서 200px 전에 미리 로드
        threshold: 0,
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, rows.length]);

  // 가상화된 전체 높이
  const virtualTotalSize = rowVirtualizer.getTotalSize();
  const hasStatus =
    isFetchingNextPage || error || (!hasNextPage && images.length > 0);
  const containerHeight = virtualTotalSize + (hasStatus ? 150 : 50);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full flex flex-col flex-1 min-h-0 rounded-lg">
      <div
        ref={parentRef}
        className="w-full flex-1 min-h-0 overflow-auto rounded-lg scrollbar-hide"
        style={{ contain: "strict" }}
      >
        <div
          style={{
            height: `${containerHeight}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index];
            if (!row) return null;

            return (
              <VirtualRow
                key={virtualRow.key}
                virtualRow={virtualRow}
                row={row}
                columnCount={columnCount}
              />
            );
          })}

          <LoadMoreStatus
            isFetchingNextPage={isFetchingNextPage}
            error={error}
            hasNextPage={hasNextPage}
            imagesLength={images.length}
            totalImages={totalImages}
            onRetry={refetch}
            loadMoreRef={loadMoreRef}
          />
        </div>
      </div>
    </div>
  );
}
