"use client";

import { ImageCard } from "@/components/gallery/ImageCard";
import { Image } from "@/types/image.interfaces";
import { VirtualItem } from "@tanstack/react-virtual";
import { downloadImage } from "@/lib/utils";

interface VirtualRowProps {
  virtualRow: VirtualItem;
  row: Image[];
  columnCount: number;
}

export function VirtualRow({ virtualRow, row, columnCount }: VirtualRowProps) {
  return (
    <div
      key={virtualRow.key}
      data-index={virtualRow.index}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: `${virtualRow.size}px`,
        transform: `translateY(${virtualRow.start}px)`,
      }}
    >
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
        {row.map((image: Image) => (
          <ImageCard
            key={image.id}
            image={image}
            onDownload={(imageUrl, prompt) => downloadImage(imageUrl, prompt)}
          />
        ))}
        {/* 빈 공간 채우기 (마지막 행이 컬럼 수보다 적을 때) */}
        {row.length < columnCount &&
          Array.from({ length: columnCount - row.length }).map((_, idx) => (
            <div key={`empty-${idx}`} />
          ))}
      </div>
    </div>
  );
}
