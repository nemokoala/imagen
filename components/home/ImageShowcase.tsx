"use client";

import { ImageCard } from "@/components/gallery/ImageCard";
import { Skeleton } from "@/components/ui/skeleton";
import { UseQueryResult } from "@tanstack/react-query";
import { LucideIcon } from "lucide-react";
import { Image } from "@/types/image.interfaces";
import { cn } from "@/lib/utils";

interface ImageShowcaseProps {
  title: string;
  icon: LucideIcon;
  iconBgClassName: string;
  iconClassName: string;
  titleGradientClassName: string;
  useQuery: (limit: number) => UseQueryResult<Image[]>;
  limit?: number;
  showRank?: boolean;
}

const rankStyles: Record<number, string> = {
  0: "bg-gradient-to-br from-yellow-400 to-amber-500 text-white shadow-lg shadow-yellow-500/30",
  1: "bg-gradient-to-br from-gray-300 to-gray-400 text-white shadow-lg shadow-gray-400/30",
  2: "bg-gradient-to-br from-amber-600 to-amber-700 text-white shadow-lg shadow-amber-700/30",
};

export function ImageShowcase({
  title,
  icon: Icon,
  iconBgClassName,
  iconClassName,
  titleGradientClassName,
  useQuery,
  limit = 4,
  showRank = false,
}: ImageShowcaseProps) {
  const { data: images, isLoading } = useQuery(limit);

  if (isLoading) {
    return (
      <div className="w-full py-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-[1fr_1fr] md:grid-cols-[2fr_1fr_1fr_1fr] gap-2">
          <Skeleton className="aspect-[3/4] rounded-xl md:row-span-3" />
          <Skeleton className="aspect-square rounded-xl hidden md:block" />
          <Skeleton className="aspect-square rounded-xl hidden md:block" />
          <Skeleton className="aspect-square rounded-xl hidden md:block" />
        </div>
      </div>
    );
  }

  if (!images || images.length === 0) return null;

  const [featured, ...rest] = images;

  return (
    <section className="w-full py-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-2 mb-5">
        <div className={`p-2 rounded-full ${iconBgClassName}`}>
          <Icon className={`w-5 h-5 ${iconClassName}`} />
        </div>
        <h2
          className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${titleGradientClassName}`}
        >
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-2">
        {/* 피처드 이미지 */}
        <div className="relative aspect-[3/4] md:row-span-3 col-span-1 md:col-span-1">
          {showRank && (
            <div className={cn("absolute top-2.5 left-2.5 z-30 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black", rankStyles[0] ?? "bg-black/50 text-white")}>
              1
            </div>
          )}
          <ImageCard image={featured} />
        </div>

        {/* 나머지 이미지 */}
        {rest.slice(0, 3).map((image, i) => (
          <div key={image.id} className="relative aspect-square col-span-1">
            {showRank && (
              <div className={cn("absolute top-2 left-2 z-30 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black", rankStyles[i + 1] ?? "bg-black/50 text-white")}>
                {i + 2}
              </div>
            )}
            <ImageCard image={image} />
          </div>
        ))}

        {/* md에서 피처드 이미지가 row-span-3이므로 나머지 slot은 비어도 됨 */}
        {rest.length < 3 &&
          Array.from({ length: 3 - rest.length }).map((_, i) => (
            <div key={`empty-${i}`} className="hidden md:block" />
          ))}
      </div>
    </section>
  );
}
