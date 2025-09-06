"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Download } from "lucide-react";
import Image from "next/image";

interface Image {
  id: number;
  prompt: string;
  imageUrl: string;
  model: string;
  size: string;
  createdAt: string;
  user: {
    id: number;
    nickname: string;
  };
}

interface ImageCardProps {
  image: Image;
  onImageClick: (image: Image) => void;
  onDownload: (imageUrl: string, prompt: string) => void;
}

export function ImageCard({ image, onImageClick, onDownload }: ImageCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card
      className="overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:scale-105 gap-1 p-0"
      onClick={() => onImageClick(image)}
    >
      <div className="relative h-64">
        <Image
          src={image.imageUrl}
          alt={image.prompt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          unoptimized
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

      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-sm line-clamp-2 mb-2 text-gray-800">
          {image.prompt}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span>{image.user.nickname}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(image.createdAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
