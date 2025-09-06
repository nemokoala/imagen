"use client";

import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Grid3X3 } from "lucide-react";

interface LoadingSkeletonProps {
  count?: number;
}

export function LoadingSkeleton({ count = 8 }: LoadingSkeletonProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4">
          <Grid3X3 className="h-8 w-8 text-purple-600" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            이미지 갤러리
          </h1>
        </div>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          AI가 생성한 아름다운 이미지들을 감상해보세요
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <Card
            key={i}
            className="overflow-hidden shadow-xl border-0 bg-white/80 backdrop-blur-sm"
          >
            <Skeleton className="h-64 w-full" />
            <CardHeader className="p-4">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2" />
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
