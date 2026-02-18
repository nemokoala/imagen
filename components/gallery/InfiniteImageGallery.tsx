"use client";

import { Image } from "@/types/image.interfaces";
import {
  useGetGalleryImagesInfiniteQuery,
  useGetUserImagesInfiniteQuery,
} from "@/queries/image/queries";
import { useGetCategories } from "@/queries/category/queries";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef, useEffect, useMemo, useState, useCallback } from "react";
import { useWindowWidth } from "@/hooks/use-window-width";
import { VirtualRow } from "./VirtualRow";
import { LoadMoreStatus } from "./LoadMoreStatus";
import { useScrollStore } from "@/stores/scrollStore";
import { useScrollObserver } from "@/hooks/use-scroll-observer";
import { CategoryFilter } from "./CategoryFilter";
import { Skeleton } from "../ui/skeleton";
import { useUrlParams } from "@/hooks/use-url-params";
import { useInView } from "react-intersection-observer";

interface InfiniteImageGalleryProps {
  userId?: number;
  onScrollChange?: (scrollTop: number) => void;
  scrollElementRef?: React.RefObject<HTMLDivElement | null>;
  maintainScrollPosition?: boolean;
}

export function InfiniteImageGallery({
  userId,
  onScrollChange: _onScrollChange,
  scrollElementRef,
  maintainScrollPosition = false,
}: InfiniteImageGalleryProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const scrollElement = scrollElementRef || parentRef;

  const { getParam, setParam, removeParam } = useUrlParams();

  // URL에서 카테고리 상태 가져오기
  const categoryStr = getParam("categories");
  const selectedCategories = useMemo(
    () => categoryStr?.split(",").filter(Boolean) || [],
    [categoryStr],
  );

  // URL에서 검색어 상태 가져오기
  const search = getParam("search") || "";
  const setSearch = (value: string) => {
    if (value) {
      setParam("search", value);
    } else {
      removeParam("search");
    }
  };

  // 카테고리 목록 조회
  const { data: categories = [] } = useGetCategories();

  // 선택된 카테고리를 콤마로 구분된 문자열로 변환 (비어있으면 undefined)
  const categoryParam =
    selectedCategories.length > 0 ? selectedCategories.join(",") : undefined;

  const galleryQuery = useGetGalleryImagesInfiniteQuery(
    20,
    Boolean(!userId),
    categoryParam,
    search || undefined,
  );
  const userQuery = useGetUserImagesInfiniteQuery(
    userId || 0,
    20,
    categoryParam,
    search || undefined,
  );

  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = userId ? userQuery : galleryQuery;

  const { ref: inViewRef, inView } = useInView({
    root: scrollElement.current,
    rootMargin: "200px",
  });

  const containerRef = useRef<HTMLDivElement | null>(null);
  const { setScrollPos, scrollPos } = useScrollStore();
  const [containerWidth, setContainerWidth] = useState(0);

  // 모든 페이지의 이미지를 하나의 배열로 합치기
  const images = useMemo(
    () => data?.pages.flatMap((page) => page.images) || [],
    [data?.pages],
  );
  const totalImages = data?.pages[0]?.totalCount || 0;

  const width = useWindowWidth();

  const gap = 8;

  const columnCount = useMemo(() => {
    if (width === 0) return 4; // SSR 또는 초기 렌더링
    if (width >= 1280) return 4; // xl
    if (width >= 1024) return 3; // lg
    if (width >= 768) return 2; // md
    return 2;
  }, [width]);

  // 카테고리 토글 핸들러 (URL 업데이트)
  const handleToggleCategory = useCallback(
    (slug: string) => {
      const newCategories = selectedCategories.includes(slug)
        ? selectedCategories.filter((c) => c !== slug)
        : [...selectedCategories, slug];

      setParam("categories", newCategories.join(","));
    },
    [selectedCategories, setParam],
  );

  // 전체 선택 (초기화)
  const handleSelectAll = useCallback(() => {
    removeParam("categories");
  }, [removeParam]);

  // 카테고리, 검색어 변경 시 스크롤 위치 컨테이너 상단으로 이동
  useEffect(() => {
    if (selectedCategories.length > 0 || search) {
      scrollElement.current?.scrollTo({
        top: containerRef.current?.offsetTop,
        behavior: "smooth",
      });
    }
  }, [selectedCategories, search]);

  // ref callback - useCallback으로 메모이제이션하여 무한 루프 방지
  const containerRefCallback = useCallback((node: HTMLDivElement | null) => {
    containerRef.current = node;
    if (node) {
      // 마운트 시점에만 크기 측정 (이전 값과 다를 때만 업데이트)
      const measuredWidth = node.clientWidth;
      setContainerWidth((prev) =>
        measuredWidth !== prev ? measuredWidth : prev,
      );
    }
  }, []); // 빈 의존성 배열로 한 번만 생성

  // width나 columnCount 변경 시 크기 재측정
  useEffect(() => {
    if (containerRef.current) {
      const measuredWidth = containerRef.current.getBoundingClientRect().width;
      setContainerWidth((prev) =>
        measuredWidth !== prev ? measuredWidth : prev,
      );
    } else if (width > 0) {
      setContainerWidth((prev) => (width !== prev ? width : prev));
    }
  }, [width, columnCount, gap, images]);

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

  // 가상 스크롤 설정
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollElement.current,
    estimateSize: () => rowHeight,
    overscan: 40,
    gap,
    initialOffset: maintainScrollPosition ? scrollPos : undefined,
  });

  useScrollObserver(scrollElement, {
    onScrollChange: (scrollTop) => {
      setScrollPos(scrollTop);
    },
  });

  // 리사이즈 시 가상화 요소 재계산 및 측정값 초기화
  useEffect(() => {
    rowVirtualizer.measure();
  }, [width, rowHeight, rowVirtualizer]);

  // useInView로 다음 페이지 로드
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 가상화된 전체 높이
  const virtualTotalSize = rowVirtualizer.getTotalSize();
  const hasStatus =
    isFetchingNextPage || error || (!hasNextPage && images.length > 0);
  const containerHeight = virtualTotalSize + (hasStatus ? 150 : 50);

  // 공통 콘텐츠
  const content = (
    <div
      style={{
        height: `${containerHeight}px`,
        minHeight: "100dvh",
        width: "100%",
        position: "relative",
        marginTop: "0.5rem",
      }}
    >
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
          {[...Array(20)].map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-xl" />
          ))}
        </div>
      ) : (
        rowVirtualizer.getVirtualItems().map((virtualRow) => {
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
        })
      )}

      <LoadMoreStatus
        isFetchingNextPage={isFetchingNextPage}
        error={error}
        hasNextPage={hasNextPage}
        imagesLength={images.length}
        totalImages={totalImages}
        onRetry={refetch}
        loadMoreRef={inViewRef}
        rowHeight={rowHeight}
      />
    </div>
  );

  // 외부 스크롤 컨테이너를 사용하는 경우
  if (scrollElementRef) {
    return (
      <div className="w-full" ref={containerRefCallback}>
        <CategoryFilter
          categories={categories}
          selectedCategories={selectedCategories}
          handleSelectAll={handleSelectAll}
          handleToggleCategory={handleToggleCategory}
          search={search}
          setSearch={setSearch}
        />
        {content}
      </div>
    );
  }

  // 자체 스크롤 컨테이너를 사용하는 경우
  return (
    <div
      className="w-full flex flex-col flex-1 min-h-0 rounded-lg"
      ref={containerRefCallback}
    >
      <CategoryFilter
        categories={categories}
        selectedCategories={selectedCategories}
        handleSelectAll={handleSelectAll}
        handleToggleCategory={handleToggleCategory}
        search={search}
        setSearch={setSearch}
      />
      <div
        ref={parentRef}
        className="w-full flex-1 min-h-0 overflow-auto rounded-lg scrollbar-hide"
        style={{ contain: "strict" }}
      >
        {content}
      </div>
    </div>
  );
}
