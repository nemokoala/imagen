"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { ChevronDown, ChevronUp, PanelRightClose, PanelRightOpen, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ImageJob } from "@/types/imageJob.interfaces";
import { useCancelImageJobMutation, useImageJobsQuery } from "@/queries/image/jobs";
import {
  ImageJobStatusIcon,
  describeImageJob,
  imageJobModelLabel,
  isActiveImageJob,
} from "./imageJobStatus";

const COLLAPSED_STORAGE_KEY = "imageJobQueue.collapsed";

function JobThumbnail({ job, className }: { job: ImageJob; className?: string }) {
  return (
    <div
      className={cn(
        "relative flex flex-shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted",
        className,
      )}
    >
      {job.image ? (
        <Image src={job.image.imageUrl} alt="" fill className="object-cover" unoptimized />
      ) : (
        <ImageJobStatusIcon job={job} />
      )}
    </div>
  );
}

/**
 * 로컬 모델 생성 대기열. 진행 중인 작업과 최근 24시간 안에 끝난 작업을 보여준다.
 * 데스크톱에서는 결과 캔버스 오른쪽 컬럼에 놓여 목록이 길어져도 캔버스를 줄이지 않고,
 * 접으면 썸네일만 남은 좁은 레일이 된다. 모바일에서는 캔버스 아래에 쌓이고 접으면 머리글만 남는다.
 */
export function ImageJobQueue() {
  const { data: jobs = [] } = useImageJobsQuery();
  const { mutate: cancelJob, isPending: isCanceling, variables: cancelingId } =
    useCancelImageJobMutation();
  const [collapsed, setCollapsed] = useState(false);

  // 서버 렌더와 첫 렌더를 맞추려고 저장된 값은 마운트 뒤에 읽는다. 저장소가 막혀 있으면 펼친 채로 둔다.
  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(COLLAPSED_STORAGE_KEY) === "1");
    } catch {}
  }, []);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    try {
      localStorage.setItem(COLLAPSED_STORAGE_KEY, next ? "1" : "0");
    } catch {}
  };

  if (jobs.length === 0) return null;

  const activeCount = jobs.filter(isActiveImageJob).length;
  const summary = activeCount > 0 ? `진행 중 ${activeCount}개` : "최근 24시간";

  const handleCancel = (job: ImageJob) => {
    cancelJob(job.id, {
      onSuccess: () => toast.success(`예약을 취소하고 ${job.creditCost} 크레딧을 돌려드렸어요.`),
      onError: (error) => toast.error(error.message),
    });
  };

  return (
    <aside
      aria-label="내 대기열"
      className={cn(
        "flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card lg:min-h-0 lg:transition-[width] lg:duration-200",
        collapsed ? "lg:w-16" : "lg:w-64 xl:w-80",
      )}
    >
      {collapsed && (
        // 데스크톱 레일: 펼치기 버튼과 작업별 썸네일만 세로로 보여준다.
        <div className="hidden min-h-0 flex-1 flex-col items-center gap-2 py-3 lg:flex">
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleCollapsed}
            aria-label="대기열 펼치기"
            aria-expanded={false}
            className="text-muted-foreground hover:text-foreground"
          >
            <PanelRightOpen className="size-4" />
          </Button>
          {activeCount > 0 && (
            <span
              className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold leading-none text-primary-foreground"
              title={summary}
            >
              {activeCount}
            </span>
          )}
          <ul className="flex min-h-0 flex-1 flex-col items-center gap-1.5 overflow-y-auto border-t border-border px-2 pt-2">
            {jobs.map((job) => (
              <li key={job.id}>
                <button
                  type="button"
                  onClick={toggleCollapsed}
                  title={`${job.prompt}\n${describeImageJob(job)}`}
                  aria-label={`${job.prompt} — ${describeImageJob(job)}`}
                  className="block cursor-pointer rounded-md ring-primary transition-shadow hover:ring-2"
                >
                  <JobThumbnail job={job} className="size-10" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 머리글: 펼쳤을 때는 항상, 접었을 때는 모바일에서만 보인다 */}
      <div
        className={cn(
          "flex items-center justify-between gap-2 px-4 py-3",
          collapsed ? "lg:hidden" : "border-b border-border",
        )}
      >
        <div className="flex min-w-0 items-baseline gap-2">
          <h3 className="text-sm font-semibold text-foreground">내 대기열</h3>
          <span className="truncate text-xs text-muted-foreground">{summary}</span>
        </div>
        <div className="flex flex-shrink-0 items-center gap-1">
          {!collapsed && (
            <Link
              href="/profile?tab=jobs"
              className="px-1 text-xs font-medium text-primary hover:underline"
            >
              전체 기록
            </Link>
          )}
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleCollapsed}
            aria-label={collapsed ? "대기열 펼치기" : "대기열 접기"}
            aria-expanded={!collapsed}
            className="size-8 text-muted-foreground hover:text-foreground"
          >
            {collapsed ? (
              <ChevronDown className="size-4" />
            ) : (
              <>
                <ChevronUp className="size-4 lg:hidden" />
                <PanelRightClose className="hidden size-4 lg:block" />
              </>
            )}
          </Button>
        </div>
      </div>

      {!collapsed && (
        <ul className="max-h-80 space-y-1 overflow-y-auto p-2 lg:max-h-none lg:min-h-0 lg:flex-1">
          {jobs.map((job) => {
            const content = (
              <>
                <JobThumbnail job={job} className="size-11" />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm leading-snug text-foreground">
                    {job.prompt}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {imageJobModelLabel(job)} · {describeImageJob(job)}
                  </p>
                </div>
              </>
            );

            return (
              <li
                key={job.id}
                className="flex items-center gap-1 rounded-lg transition-colors hover:bg-muted/60"
              >
                {/* 완성된 작업은 줄 전체가 게시물 링크다. 좁은 컬럼이라 별도 「보기」 버튼을 두지 않는다. */}
                {job.image ? (
                  <Link
                    href={`/image/${job.image.id}`}
                    className="flex min-w-0 flex-1 items-center gap-3 px-2 py-1.5"
                  >
                    {content}
                  </Link>
                ) : (
                  <div className="flex min-w-0 flex-1 items-center gap-3 px-2 py-1.5">
                    {content}
                  </div>
                )}

                {job.status === "PENDING" && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="mr-1 size-8 flex-shrink-0 text-muted-foreground hover:text-destructive"
                    disabled={isCanceling && cancelingId === job.id}
                    onClick={() => handleCancel(job)}
                    aria-label="예약 취소"
                    title="예약 취소"
                  >
                    <X className="size-4" />
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}
