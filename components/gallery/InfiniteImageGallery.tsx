"use client";

import { Image } from "@/types/image.interfaces";
import { useGetGalleryImagesInfiniteQuery } from "@/queries/image/queries";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef, useEffect, useMemo, useState } from "react";
import { useScrollObserver } from "@/hooks/use-scroll-observer";
import { useWindowWidth } from "@/hooks/use-window-width";
import { ImageModal } from "./ImageModal";
import { downloadImage } from "@/lib/utils";
import { LoadingSpinner } from "./LoadingSpinner";
import { VirtualRow } from "./VirtualRow";
import { LoadMoreStatus } from "./LoadMoreStatus";

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

  const loadMoreRef = useRef<HTMLDivElement>(null);

  // 모든 페이지의 이미지를 하나의 배열로 합치기
  const images = useMemo(
    () => data?.pages.flatMap((page) => page.images) || [],
    [data?.pages]
  );
  const totalImages = data?.pages[0]?.totalCount || 0;

  const width = useWindowWidth();

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
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 350, // 초기 예상 높이 (실제 높이는 자동 측정됨)
    overscan: 10, // 화면 밖에 렌더링할 추가 행 수 (더 많이 유지하여 재로드 방지)
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

  // 컨테이너 높이 계산
  const baseHeight = rowVirtualizer.getTotalSize();
  const hasStatus =
    isFetchingNextPage || error || (!hasNextPage && images.length > 0);
  const containerHeight = baseHeight + (hasStatus ? 120 : 0);

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
                onImageClick={setSelectedImage}
                measureElement={rowVirtualizer.measureElement}
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
            topPosition={rowVirtualizer.getTotalSize()}
            loadMoreRef={loadMoreRef}
          />
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
