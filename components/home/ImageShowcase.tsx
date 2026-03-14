"use client";

import { ImageCard } from "@/components/gallery/ImageCard";
import { Skeleton } from "@/components/ui/skeleton";
import { UseQueryResult } from "@tanstack/react-query";
import { LucideIcon } from "lucide-react";
import { Image } from "@/types/image.interfaces";

interface ImageShowcaseProps {
  title: string;
  icon: LucideIcon;
  iconBgClassName: string;
  iconClassName: string;
  titleGradientClassName: string;
  useQuery: (limit: number) => UseQueryResult<Image[]>;
  limit?: number;
}

export function ImageShowcase({
  title,
  icon: Icon,
  iconBgClassName,
  iconClassName,
  titleGradientClassName,
  useQuery,
  limit = 4,
}: ImageShowcaseProps) {
  const { data: images, isLoading } = useQuery(limit);

  if (isLoading) {
    return (
      <div className="w-full py-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[...Array(limit)].map((_, i) => (
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
        <div className={`p-2 rounded-full ${iconBgClassName}`}>
          <Icon className={`w-5 h-5 ${iconClassName}`} />
        </div>
        <h2
          className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${titleGradientClassName}`}
        >
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 min-h-[400px]">
        {images.map((image) => (
          <ImageCard key={image.id} image={image} />
        ))}
      </div>
    </section>
  );
}
