"use client";

import { useGetMonthlyRankingQuery } from "@/queries/image/queries";
import { ImageCard } from "@/components/gallery/ImageCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy } from "lucide-react";

export function MonthlyRanking() {
  const { data: images, isLoading } = useGetMonthlyRankingQuery(4);

  if (isLoading) {
    return (
      <div className="w-full py-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!images || images.length === 0) return null;

  return (
    <section className="w-full py-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
          <Trophy className="w-5 h-5 text-yellow-500 dark:text-yellow-400 fill-yellow-500/20" />
        </div>
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-amber-500">
          이달의 랭킹
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {images.map((image) => (
          <ImageCard key={image.id} image={image} />
        ))}
      </div>
    </section>
  );
}
