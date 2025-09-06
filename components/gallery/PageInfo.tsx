"use client";

interface PageInfoProps {
  currentPage: number;
  totalPages: number;
  imageCount: number;
}

export function PageInfo({
  currentPage,
  totalPages,
  imageCount,
}: PageInfoProps) {
  if (totalPages <= 0) return null;

  return (
    <div className="text-center text-sm text-gray-500 mb-8">
      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 max-w-md mx-auto shadow-lg">
        <p className="font-medium">
          {currentPage} / {totalPages} 페이지
        </p>
        <p className="text-xs text-gray-400 mt-1">총 {imageCount}개의 이미지</p>
      </div>
    </div>
  );
}

