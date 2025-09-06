"use client";

import { Image as ImageIcon } from "lucide-react";

interface GalleryHeaderProps {
  title?: string;
  description?: string;
}

export function GalleryHeader({
  title = "이미지 갤러리",
  description = "AI가 생성한 아름다운 이미지들을 감상해보세요",
}: GalleryHeaderProps) {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center gap-2 mb-4">
        <ImageIcon className="h-8 w-8 text-purple-600" />
        <h1 className="text-4xl font-bold gradient-purple-text">{title}</h1>
      </div>
      <p className="text-gray-600 text-lg max-w-2xl mx-auto">{description}</p>
    </div>
  );
}
