"use client";

import { useGetUserCommentsInfiniteQuery } from "@/queries/user/queries";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, Image as ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

interface UserCommentListProps {
  userId: number;
}

export function UserCommentList({ userId }: UserCommentListProps) {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetUserCommentsInfiniteQuery(userId, 10);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex gap-4">
              <Skeleton className="w-16 h-16 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-red-500">
        댓글을 불러오는 중 오류가 발생했습니다.
      </div>
    );
  }

  const comments = data?.pages.flatMap((page) => page.comments) || [];

  if (comments.length === 0) {
    return (
      <Card className="p-12 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
        <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          작성한 댓글이 없습니다.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className="flex flex-col gap-4">
        {comments.map((comment) => (
          <Link
            href={`/image/${comment.imageId}`}
            key={comment.id}
            className="block transition-transform hover:scale-[1.01]"
          >
            <Card className="p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex gap-4 items-start">
                {/* Image Preview */}
                <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700">
                  {comment.image ? (
                    <Image
                      src={comment.image.imageUrl}
                      alt="Commented image"
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                </div>

                {/* Comment Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                        locale: ko,
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-2 break-all">
                    {comment.content}
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Infinite Scroll Trigger */}
      {hasNextPage && (
        <div ref={ref} className="flex justify-center py-8">
          {isFetchingNextPage ? (
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          ) : (
            <div className="h-6" /> // Spacer for trigger
          )}
        </div>
      )}
    </div>
  );
}
