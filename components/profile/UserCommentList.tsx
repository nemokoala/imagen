"use client";

import { useGetUserCommentsInfiniteQuery } from "@/queries/user/queries";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MessageSquare,
  Image as ImageIcon,
  Loader2,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";

interface UserCommentListProps {
  userId: number;
  /** 빈 목록 시 문구 (본인/타인 구분) */
  nickname?: string;
  isOwnProfile?: boolean;
}

export function UserCommentList({
  userId,
  nickname,
  isOwnProfile = true,
}: UserCommentListProps) {
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
      <ul className="space-y-3" aria-busy="true" aria-label="댓글 로딩 중">
        {[...Array(5)].map((_, i) => (
          <li key={i}>
            <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/40 p-4 sm:p-5">
              <div className="flex gap-4 sm:gap-5">
                <Skeleton className="size-20 shrink-0 rounded-xl sm:size-24" />
                <div className="min-w-0 flex-1 space-y-3 pt-0.5">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-4 w-full max-w-md" />
                  <Skeleton className="h-4 w-4/5 max-w-lg" />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  if (isError) {
    return (
      <Card className="border-destructive/30 bg-destructive/5 p-8 text-center">
        <p className="text-sm font-medium text-destructive">
          댓글을 불러오는 중 오류가 발생했습니다.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          잠시 후 다시 시도해 주세요.
        </p>
      </Card>
    );
  }

  const comments = data?.pages.flatMap((page) => page.comments) || [];

  if (comments.length === 0) {
    const emptyText = isOwnProfile
      ? "아직 작성한 댓글이 없습니다."
      : `${nickname ?? "이 사용자"}님이 작성한 댓글이 없습니다.`;

    return (
      <Card className="relative overflow-hidden border border-white/20 p-10 text-center shadow-md backdrop-blur-sm dark:border-white/10 sm:p-12">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 dark:from-purple-600/20 dark:to-blue-600/15"
          aria-hidden
        />
        <div className="relative">
          <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl border border-border/50 bg-background/60 shadow-inner">
            <MessageSquare className="size-7 text-muted-foreground" />
          </div>
          <p className="text-foreground/90 text-[15px] font-medium leading-relaxed">
            {emptyText}
          </p>
          {isOwnProfile ? (
            <p className="text-muted-foreground mt-2 text-sm">
              갤러리에서 마음에 드는 이미지에 댓글을 남겨 보세요.
            </p>
          ) : (
            <p className="text-muted-foreground mt-2 text-sm">
              이 사용자는 아직 다른 이미지에 댓글을 남기지 않았어요.
            </p>
          )}
        </div>
      </Card>
    );
  }

  return (
    <div className="w-full">
      <ul className="flex flex-col gap-3" role="list">
        {comments.map((comment) => (
          <li key={comment.id}>
            <Link
              href={`/image/${comment.imageId}`}
              className="group block outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-2xl"
            >
              <div
                className={cn(
                  "relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/50 shadow-sm",
                  "transition-all duration-200",
                  "hover:border-purple-500/35 hover:shadow-md",
                  "dark:from-card/50 dark:to-card/30",
                )}
              >
                <div
                  className="absolute top-0 left-0 h-full w-1 origin-top scale-y-0 bg-gradient-to-b from-purple-500 to-blue-500 opacity-0 transition-transform duration-200 group-hover:scale-y-100 group-hover:opacity-100"
                  aria-hidden
                />
                <div className="flex gap-4 p-4 sm:gap-5 sm:p-5 pl-4 sm:pl-5">
                  <div
                    className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-border/50 bg-muted shadow-inner ring-1 ring-black/5 sm:size-24 dark:ring-white/5"
                    style={{ aspectRatio: "1" }}
                  >
                    {comment.image ? (
                      <Image
                        src={comment.image.imageUrl}
                        alt="댓글이 달린 이미지"
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 80px, 96px"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-muted-foreground">
                        <ImageIcon className="size-7 opacity-60" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 self-center pr-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2 sm:mb-1.5">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                        <Sparkles className="size-3.5 shrink-0 text-purple-500/80" />
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                          locale: ko,
                        })}
                      </span>
                    </div>
                    <p className="text-foreground/95 line-clamp-3 break-words text-sm leading-relaxed sm:text-[15px]">
                      {comment.content}
                    </p>
                    <p className="text-muted-foreground mt-2 text-xs sm:inline-flex sm:items-center sm:gap-1">
                      <span>원본 이미지 보기</span>
                      <ArrowUpRight className="ml-0.5 inline size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </p>
                  </div>

                  <div className="hidden shrink-0 self-center sm:flex">
                    <span
                      className={cn(
                        "flex size-9 items-center justify-center rounded-full border border-border/60",
                        "bg-background/80 text-muted-foreground transition-all",
                        "group-hover:border-purple-500/40 group-hover:text-purple-600",
                        "dark:group-hover:text-purple-400",
                      )}
                    >
                      <ArrowUpRight className="size-4" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {hasNextPage && (
        <div ref={ref} className="flex justify-center py-8">
          {isFetchingNextPage ? (
            <Loader2 className="size-6 animate-spin text-primary" />
          ) : (
            <div className="h-6" />
          )}
        </div>
      )}
    </div>
  );
}
