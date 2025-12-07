"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";
import Image from "next/image";
import { Image as ImageType } from "@/types/types";

interface ImageCardProps {
  image: ImageType;
  onImageClick: (image: ImageType) => void;
  onDownload: (imageUrl: string, prompt: string) => void;
}

export function ImageCard({ image, onImageClick, onDownload }: ImageCardProps) {
  return (
    <Card
      className="overflow-hidden hover:shadow-2xl aspect-square transition-all duration-300 cursor-pointer group bg-white/80 backdrop-blur-sm border-0 shadow-xl gap-1 p-0"
      onClick={() => onImageClick(image)}
    >
      <div className="relative h-full">
        <Image
          src={image.imageUrl}
          alt={image.prompt}
          fill
          className="object-cover transition-transform duration-300 aspect-square"
          loading="lazy"
          unoptimized
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        />
        <div className="absolute top-3 right-3">
          <Badge
            variant="secondary"
            className="text-xs gradient-purple-bg text-white backdrop-blur-sm border-0 shadow-lg"
          >
            {image.model}
          </Badge>
        </div>
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 bg-white/90 backdrop-blur-sm border-0 shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              onDownload(image.imageUrl, image.prompt);
            }}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
