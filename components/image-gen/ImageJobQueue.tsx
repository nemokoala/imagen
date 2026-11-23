"use client";

import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MODEL_CREDIT_SETTINGS } from "@/constants/credit.constants";
import { Model } from "@/types/model.interfaces";
import type { ImageJob } from "@/types/imageJob.interfaces";
import { useCancelImageJobMutation, useImageJobsQuery } from "@/queries/image/jobs";
import { ImageJobStatusIcon, describeImageJob, isActiveImageJob } from "./imageJobStatus";

/** 로컬 모델 생성 대기열. 진행 중인 작업과 최근 24시간 안에 끝난 작업을 보여준다. */
export function ImageJobQueue() {
  const { data: jobs = [] } = useImageJobsQuery();
  const { mutate: cancelJob, isPending: isCanceling, variables: cancelingId } =
    useCancelImageJobMutation();

  if (jobs.length === 0) return null;

  const activeCount = jobs.filter(isActiveImageJob).length;

  const handleCancel = (job: ImageJob) => {
    cancelJob(job.id, {
      onSuccess: () => toast.success(`예약을 취소하고 ${job.creditCost} 크레딧을 돌려드렸어요.`),
      onError: (error) => toast.error(error.message),
    });
  };

  return (
    <div className="border-t border-border px-5 py-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground">내 대기열</h3>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{activeCount > 0 ? `진행 중 ${activeCount}개` : "최근 24시간"}</span>
          <Link href="/profile?tab=jobs" className="font-medium text-primary hover:underline">
            전체 기록
          </Link>
        </div>
      </div>

      <ul className="mt-2 max-h-48 space-y-1 overflow-y-auto">
        {jobs.map((job) => (
          <li
            key={job.id}
            className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted/60"
          >
            <div className="relative flex size-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
              {job.image ? (
                <Image src={job.image.imageUrl} alt="" fill className="object-cover" unoptimized />
              ) : (
                <ImageJobStatusIcon job={job} />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-foreground">{job.prompt}</p>
              <p className="truncate text-xs text-muted-foreground">
                {MODEL_CREDIT_SETTINGS[job.model as Model]?.label ?? job.model} · {describeImageJob(job)}
              </p>
            </div>

            {job.status === "PENDING" && (
              <Button
                size="sm"
                variant="ghost"
                className="flex-shrink-0 text-muted-foreground hover:text-destructive"
                disabled={isCanceling && cancelingId === job.id}
                onClick={() => handleCancel(job)}
              >
                취소
              </Button>
            )}
            {job.image && (
              <Button size="sm" variant="outline" className="flex-shrink-0" asChild>
                <Link href={`/image/${job.image.id}`}>보기</Link>
              </Button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
