"use client";

import {
  useGetGalleryImagesInfiniteQuery,
  useGetUserImagesInfiniteQuery,
} from "@/queries/image/queries";
import { useGetCategories } from "@/queries/category/queries";
import { useRef, useEffect, useMemo, useState, useCallback } from "react";
import { useWindowWidth } from "@/hooks/use-window-width";
import { MasonryColumn, MasonryColumnItem } from "./MasonryColumn";
import { LoadMoreStatus } from "./LoadMoreStatus";
import { useScrollStore } from "@/stores/scrollStore";
import { useScrollObserver } from "@/hooks/use-scroll-observer";
import { CategoryFilter } from "./CategoryFilter";
import { Skeleton } from "../ui/skeleton";
import { useUrlParams } from "@/hooks/use-url-params";
import { useInView } from "react-intersection-observer";
import { Search } from "lucide-react";

/** "WxH" 형태의 size 문자열에서 가로/세로 비율(w/h) 파싱 */
function parseAspectRatio(size: string): number {
  const match = size.match(/(\d+)\s*[x×]\s*(\d+)/i);
  if (match) {
    const w = parseInt(match[1]);
    const h = parseInt(match[2]);
    if (w > 0 && h > 0) return w / h;
  }
  return 1; // 기본 1:1
}

interface InfiniteImageGalleryProps {
  userId?: number;
  onScrollChange?: (scrollTop: number) => void;
  scrollElementRef?: React.RefObject<HTMLDivElement | null>;
  maintainScrollPosition?: boolean;
}

export function InfiniteImageGallery({
  userId,
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

  const containerRef = useRef<HTMLDivElement | null>(null);
  const { setScrollPos, scrollPos } = useScrollStore();
  const [containerWidth, setContainerWidth] = useState(0);
  const [scrollEl, setScrollEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setScrollEl(scrollElement.current);
  }, [scrollElement]);

  const { ref: inViewRef, inView } = useInView({
    root: scrollEl,
    rootMargin: "200px",
  });

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
      const newCategories = selectedCategories.includes(slug) ? [] : [slug];
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
    if (selectedCategories.length > 0)
      scrollElement.current?.scrollTo({
        top: containerRef.current?.offsetTop,
        behavior: "instant",
      });
  }, [selectedCategories, search, scrollElement]);

  // ref callback - useCallback으로 메모이제이션하여 무한 루프 방지
  const containerRefCallback = useCallback((node: HTMLDivElement | null) => {
    containerRef.current = node;
    if (node) {
      const measuredWidth = node.clientWidth;
      setContainerWidth((prev) =>
        measuredWidth !== prev ? measuredWidth : prev,
      );
    }
  }, []);

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

  // 컬럼 너비 계산
  const columnWidth = useMemo(() => {
    if (containerWidth === 0) return 0;
    const totalGap = gap * (columnCount - 1);
    return (containerWidth - totalGap) / columnCount;
  }, [containerWidth, columnCount, gap]);

  // 이미지를 컬럼별로 분배 (가장 짧은 컬럼에 배치)
  const columns = useMemo(() => {
    if (columnWidth === 0) return [];
    const cols: MasonryColumnItem[][] = Array.from(
      { length: columnCount },
      () => [],
    );
    const colHeights = new Array(columnCount).fill(0);

    images.forEach((image, index) => {
      const aspectRatio = parseAspectRatio(image.size);
      const itemHeight = Math.round(columnWidth / aspectRatio);
      const shortestCol = colHeights.indexOf(Math.min(...colHeights));
      cols[shortestCol].push({
        image,
        height: itemHeight,
        originalIndex: index,
      });
      colHeights[shortestCol] += itemHeight + gap;
    });

    return cols;
  }, [images, columnCount, columnWidth, gap]);

  // 전체 높이 계산 (가장 긴 컬럼 기준)
  const maxColumnHeight = useMemo(() => {
    if (columns.length === 0) return 0;
    return Math.max(
      ...columns.map((col) =>
        col.reduce((sum, item) => sum + item.height + gap, 0),
      ),
    );
  }, [columns, gap]);

  useScrollObserver(scrollElement, {
    onScrollChange: (scrollTop) => {
      setScrollPos(scrollTop);
    },
  });

  // useInView로 다음 페이지 로드
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // LoadMore 감지용 기본 높이
  const loadMoreDetectHeight = useMemo(() => {
    if (columnWidth === 0) return 350;
    return Math.floor(columnWidth);
  }, [columnWidth]);

  const hasStatus =
    isFetchingNextPage || error || (!hasNextPage && images.length > 0);
  const containerHeight = maxColumnHeight + (hasStatus ? 150 : 50);

  // 공통 콘텐츠
  const content = (
    <div
      style={{
        height: `${containerHeight}px`,
        minHeight: "100dvh",
        width: "100%",
        position: "relative",
        marginTop: "0.7rem",
      }}
    >
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
          {[...Array(20)].map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-xl" />
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="relative mb-6">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur opacity-25"></div>
            <div className="relative p-6 rounded-full bg-white dark:bg-gray-900 shadow-xl">
              <Search className="w-12 h-12 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            이미지를 찾지 못했어요
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
            {search ? (
              <>
                <span className="font-semibold text-purple-600">
                  &ldquo;{search}&rdquo;
                </span>
                에 대한 검색 결과가 없습니다.
                <br />
                다른 검색어나 카테고리를 선택해보세요.
              </>
            ) : selectedCategories.length > 0 ? (
              "선택한 카테고리에 해당하는 이미지가 없습니다. 다른 카테고리를 선택해보세요."
            ) : (
              "표시할 이미지가 아직 없습니다. 첫 번째 이미지를 생성해보는 건 어떨까요?"
            )}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", gap: `${gap}px` }}>
          {columns.map((colItems, colIndex) => (
            <MasonryColumn
              key={colIndex}
              items={colItems}
              scrollElement={scrollElement}
              gap={gap}
              columnWidth={columnWidth}
              initialOffset={maintainScrollPosition ? scrollPos : undefined}
            />
          ))}
        </div>
      )}

      <LoadMoreStatus
        isFetchingNextPage={isFetchingNextPage}
        error={error}
        hasNextPage={hasNextPage}
        imagesLength={images.length}
        totalImages={totalImages}
        onRetry={refetch}
        loadMoreRef={inViewRef}
        rowHeight={loadMoreDetectHeight}
      />
    </div>
  );

  // 외부 스크롤 컨테이너를 사용하는 경우
  if (scrollElementRef) {
    return (
      <div className="w-full relative" ref={containerRefCallback}>
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
