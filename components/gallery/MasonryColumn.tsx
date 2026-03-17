"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import { ImageCard } from "./ImageCard";
import { Image as ImageType } from "@/types/image.interfaces";
import { RefObject, useEffect } from "react";

export interface MasonryColumnItem {
  image: ImageType;
  height: number;
  originalIndex: number;
}

interface MasonryColumnProps {
  items: MasonryColumnItem[];
  scrollElement: RefObject<HTMLElement | null>;
  gap: number;
  columnWidth: number;
  initialOffset?: number;
}

export function MasonryColumn({
  items,
  scrollElement,
  gap,
  columnWidth,
  initialOffset,
}: MasonryColumnProps) {
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scrollElement.current,
    estimateSize: (index) => items[index].height,
    overscan: 10,
    gap,
    initialOffset,
  });

  // columnWidth 또는 items 변경 시 virtualizer 캐시 리셋 (높이 재계산)
  // virtualizer는 매 렌더마다 새 객체이므로 deps에서 제외
  useEffect(() => {
    virtualizer.measure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnWidth, items]);

  return (
    <div
      style={{
        width: `${columnWidth}px`,
        position: "relative",
        height: `${virtualizer.getTotalSize()}px`,
      }}
    >
      {virtualizer.getVirtualItems().map((virtualItem) => {
        const item = items[virtualItem.index];
        return (
          <div
            key={item.image.id}
            data-index={virtualItem.index}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
              willChange: "transform",
            }}
          >
            <ImageCard image={item.image} index={item.originalIndex} />
          </div>
        );
      })}
    </div>
  );
}
