"use client";

import {
  useGetGalleryImagesInfiniteQuery,
  useGetUserImagesInfiniteQuery,
} from "@/queries/image/queries";
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
import { cn } from "@/lib/utils";

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

/** 갤러리 카드 목표 폭(px)과 열 개수 범위 */
const TARGET_COLUMN_WIDTH = 300;
const MIN_COLUMNS = 2;
const MAX_COLUMNS = 5;

interface InfiniteImageGalleryProps {
  userId?: number;
  onScrollChange?: (scrollTop: number) => void;
  scrollElementRef?: React.RefObject<HTMLDivElement | null>;
  maintainScrollPosition?: boolean;
  /** 필터 툴바에 덧붙일 클래스 (예: 스크롤 컨테이너 여백만큼 넓히기) */
  filterClassName?: string;
}

export function InfiniteImageGallery({
  userId,
  scrollElementRef,
  maintainScrollPosition = false,
  filterClassName,
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

  // URL에서 비율 필터 상태 가져오기
  const ratio = getParam("ratio") || undefined;
  const handleToggleRatio = useCallback(
    (value: string) => {
      if (ratio === value) {
        removeParam("ratio");
      } else {
        setParam("ratio", value);
      }
    },
    [ratio, setParam, removeParam],
  );

  // 선택된 카테고리를 콤마로 구분된 문자열로 변환 (비어있으면 undefined)
  const categoryParam =
    selectedCategories.length > 0 ? selectedCategories.join(",") : undefined;

  const galleryQuery = useGetGalleryImagesInfiniteQuery(
    20,
    Boolean(!userId),
    categoryParam,
    search || undefined,
    ratio,
  );
  const userQuery = useGetUserImagesInfiniteQuery(
    userId || 0,
    20,
    categoryParam,
    search || undefined,
    ratio,
  );

  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPlaceholderData,
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

  // 열 개수는 창 폭이 아니라 갤러리 폭으로 정한다. 어느 페이지에 들어가도
  // 카드가 비슷한 크기(TARGET_COLUMN_WIDTH 근처)가 되도록 2~5열 사이에서 고른다.
  const columnCount = useMemo(() => {
    if (containerWidth === 0) return 4; // 첫 측정 전
    const fit = Math.floor(
      (containerWidth + gap) / (TARGET_COLUMN_WIDTH + gap),
    );
    return Math.min(MAX_COLUMNS, Math.max(MIN_COLUMNS, fit));
  }, [containerWidth, gap]);

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

  // 필터(카테고리 · 검색어 · 비율)가 바뀌었을 때 스크롤 처리.
  // - 갤러리 시작점보다 위를 보고 있으면 스크롤을 건드리지 않는다.
  // - 아래를 보고 있으면 결과 영역만 잠깐 감춘 사이에 갤러리 시작점으로 옮긴다.
  //   필터 툴바는 상단에 붙어 있어 제자리에 보이므로 화면이 튀어 보이지 않는다.
  //   (부드러운 스크롤은 결과가 바뀔 때 가상 스크롤이 위치를 다시 잡으면서 끊긴다)
  const filterKey = `${categoryParam ?? ""}|${search}|${ratio ?? ""}`;
  const prevFilterKeyRef = useRef(filterKey);
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (prevFilterKeyRef.current === filterKey) return;
    prevFilterKeyRef.current = filterKey;

    const scroller = scrollElement.current;
    const container = containerRef.current;
    if (!scroller || !container) return;

    const galleryTop =
      container.getBoundingClientRect().top -
      scroller.getBoundingClientRect().top +
      scroller.scrollTop;
    if (scroller.scrollTop <= galleryTop + 1) return;

    const contentEl = contentRef.current;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!contentEl || reduceMotion) {
      scroller.scrollTo({ top: galleryTop });
      return;
    }

    contentEl.style.opacity = "0";
    const timer = window.setTimeout(() => {
      scroller.scrollTo({ top: galleryTop });
      contentEl.style.opacity = "";
    }, 180);
    return () => {
      window.clearTimeout(timer);
      contentEl.style.opacity = "";
    };
  }, [filterKey, scrollElement]);

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
  // 이전 필터 결과를 보여주는 동안에는 다음 페이지를 불러오지 않는다.
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && !isPlaceholderData) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, isPlaceholderData, fetchNextPage]);

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
      ref={contentRef}
      aria-busy={isPlaceholderData}
      className={cn(
        "transition-opacity duration-[180ms] ease-out",
        // 새 필터 결과를 받는 동안 이전 결과를 흐리게 남겨 둔다
        isPlaceholderData && "pointer-events-none opacity-40",
      )}
      style={{
        height: `${containerHeight}px`,
        minHeight: "100dvh",
        width: "100%",
        position: "relative",
        marginTop: "0.7rem",
      }}
    >
      {isLoading ? (
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {[...Array(20)].map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-xl" />
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="mb-6 flex size-20 items-center justify-center rounded-2xl border border-border bg-card">
            <Search className="size-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            이미지를 찾지 못했어요
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
            {search ? (
              <>
                <span className="font-semibold text-foreground">
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
          selectedCategories={selectedCategories}
          handleSelectAll={handleSelectAll}
          handleToggleCategory={handleToggleCategory}
          search={search}
          setSearch={setSearch}
          selectedRatio={ratio}
          onToggleRatio={handleToggleRatio}
          className={filterClassName}
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
        selectedCategories={selectedCategories}
        handleSelectAll={handleSelectAll}
        handleToggleCategory={handleToggleCategory}
        search={search}
        setSearch={setSearch}
        className={filterClassName}
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
