"use client";

import { useGetTopLikedImagesQuery } from "@/queries/image/queries";
import { ImageCard } from "@/components/gallery/ImageCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Flame } from "lucide-react";

export function FeaturedImages() {
  const { data: images, isLoading } = useGetTopLikedImagesQuery(4);

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
        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
          <Flame className="w-5 h-5 text-red-500 dark:text-red-400 fill-red-500/20" />
        </div>
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
          인기 작품
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
