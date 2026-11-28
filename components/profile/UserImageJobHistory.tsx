"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";
import { History, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type {
  ImageJob,
  ImageJobHistoryFilter,
  ImageJobHistorySummary,
} from "@/types/imageJob.interfaces";
import {
  useCancelImageJobMutation,
  useImageJobHistoryInfiniteQuery,
} from "@/queries/image/jobs";
import {
  IMAGE_JOB_STATUS_LABEL,
  ImageJobStatusIcon,
  describeImageJob,
  imageJobModelLabel,
} from "@/components/image-gen/imageJobStatus";

const FILTERS: {
  value: ImageJobHistoryFilter;
  label: string;
  count: (summary: ImageJobHistorySummary) => number;
}[] = [
  { value: "all", label: "전체", count: (s) => s.total },
  { value: "active", label: "진행 중", count: (s) => s.active },
  { value: "succeeded", label: "완성", count: (s) => s.succeeded },
  { value: "failed", label: "실패", count: (s) => s.failed },
  { value: "canceled", label: "취소", count: (s) => s.canceled },
];

const STATUS_BADGE_CLASS: Record<ImageJob["status"], string> = {
  PENDING: "border-border text-muted-foreground",
  RUNNING: "border-primary/40 text-primary",
  SUCCEEDED: "border-emerald-500/40 text-emerald-600 dark:text-emerald-400",
  FAILED: "border-destructive/40 text-destructive",
  EXPIRED: "border-destructive/40 text-destructive",
  CANCELED: "border-border text-muted-foreground",
};

function JobRow({ job }: { job: ImageJob }) {
  const { mutate: cancelJob, isPending: isCanceling } = useCancelImageJobMutation();

  const handleCancel = () =>
    cancelJob(job.id, {
      onSuccess: () => toast.success(`예약을 취소하고 ${job.creditCost} 크레딧을 돌려드렸어요.`),
      onError: (error) => toast.error(error.message),
    });

  return (
    <li className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex gap-4 p-4 sm:gap-5 sm:p-5">
        <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/50 bg-muted sm:size-20">
          {job.image ? (
            <Image
              src={job.image.imageUrl}
              alt="생성된 이미지"
              fill
              className="object-cover"
              sizes="80px"
              unoptimized
            />
          ) : (
            <ImageJobStatusIcon job={job} className="size-6" />
          )}
        </div>

        <div className="min-w-0 flex-1 self-center">
          <div className="mb-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            <span
              className={cn(
                "rounded-full border px-2 py-0.5 font-medium",
                STATUS_BADGE_CLASS[job.status],
              )}
            >
              {IMAGE_JOB_STATUS_LABEL[job.status]}
            </span>
            <span>{imageJobModelLabel(job)}</span>
            <span aria-hidden>·</span>
            <span>
              {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true, locale: ko })} 요청
            </span>
          </div>
          <p className="line-clamp-2 break-words text-sm leading-relaxed text-foreground sm:text-[15px]">
            {job.prompt}
          </p>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {job.status === "SUCCEEDED" && !job.image
              ? "이미지가 삭제됐어요"
              : describeImageJob(job)}
          </p>
        </div>

        <div className="flex shrink-0 items-center">
          {job.status === "PENDING" && (
            <Button
              size="sm"
              variant="ghost"
              className="text-muted-foreground hover:text-destructive"
              disabled={isCanceling}
              onClick={handleCancel}
            >
              취소
            </Button>
          )}
          {job.image && (
            <Button size="sm" variant="outline" asChild>
              <Link href={`/image/${job.image.id}`}>보기</Link>
            </Button>
          )}
        </div>
      </div>
    </li>
  );
}

/** 프로필의 생성 요청 탭. 로컬 모델로 보낸 요청 전체와 크레딧 사용·환불 내역을 보여준다. */
export function UserImageJobHistory() {
  const [filter, setFilter] = useState<ImageJobHistoryFilter>("all");
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useImageJobHistoryInfiniteQuery(filter);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView, hasNextPage, fetchNextPage]);

  const firstPage = data?.pages[0];
  const summary = firstPage?.summary;
  const jobs = data?.pages.flatMap((page) => page.jobs) ?? [];

  return (
    <div className="w-full">
      <div className="mb-6 w-full">
        <div className="mb-1 flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground">
            <History className="size-4" />
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">생성 요청</h2>
        </div>
        <p className="pl-[2.75rem] text-sm text-muted-foreground sm:text-base">
          로컬 모델로 보낸 요청과 크레딧 사용·환불 내역이에요.
        </p>
      </div>

      {summary && (
        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl border border-border bg-card px-4 py-3 text-sm">
          <span className="text-muted-foreground">
            사용 <span className="font-semibold text-foreground">{summary.spentCredits}</span>
          </span>
          <span className="text-muted-foreground">
            예약 중{" "}
            <span className="font-semibold text-foreground">{summary.reservedCredits}</span>
          </span>
          <span className="text-muted-foreground">
            환불{" "}
            <span className="font-semibold text-foreground">{summary.refundedCredits}</span>
          </span>
          <span className="text-xs text-muted-foreground">크레딧</span>
        </div>
      )}

      <div
        role="radiogroup"
        aria-label="요청 상태"
        className="mb-4 flex gap-1 overflow-x-auto rounded-lg bg-muted p-1"
      >
        {FILTERS.map((item) => (
          <button
            key={item.value}
            type="button"
            role="radio"
            aria-checked={filter === item.value}
            onClick={() => setFilter(item.value)}
            className={cn(
              "flex h-9 flex-1 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3 text-sm font-medium transition-colors",
              filter === item.value
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
            {summary && (
              <span className="text-xs tabular-nums opacity-70">{item.count(summary)}</span>
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <ul className="space-y-3" aria-busy="true" aria-label="요청 기록 로딩 중">
          {[...Array(4)].map((_, i) => (
            <li key={i} className="rounded-2xl border border-border/50 bg-card/40 p-4 sm:p-5">
              <div className="flex gap-4">
                <Skeleton className="size-16 shrink-0 rounded-xl sm:size-20" />
                <div className="flex-1 space-y-2 pt-1">
                  <Skeleton className="h-3 w-40" />
                  <Skeleton className="h-4 w-full max-w-md" />
                  <Skeleton className="h-3 w-56" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : isError ? (
        <Card className="border-destructive/30 bg-destructive/5 p-8 text-center">
          <p className="text-sm font-medium text-destructive">
            요청 기록을 불러오지 못했습니다.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">잠시 후 다시 시도해 주세요.</p>
        </Card>
      ) : jobs.length === 0 ? (
        <Card className="border border-border p-10 text-center shadow-none">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl border border-border bg-muted/50">
            <History className="size-6 text-muted-foreground" />
          </div>
          <p className="text-[15px] font-medium text-foreground/90">
            {filter === "all" ? "아직 로컬 모델로 요청한 이미지가 없어요." : "이 상태의 요청이 없어요."}
          </p>
          {filter === "all" && (
            <Button asChild className="mt-4">
              <Link href="/generate">이미지 생성하기</Link>
            </Button>
          )}
        </Card>
      ) : (
        <>
          <ul className="flex flex-col gap-3">
            {jobs.map((job) => (
              <JobRow key={job.id} job={job} />
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
        </>
      )}
    </div>
  );
}
