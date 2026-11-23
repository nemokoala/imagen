import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { Ban, CheckCircle2, Clock, Loader2, PowerOff, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ImageJob, ImageJobStatus } from "@/types/imageJob.interfaces";

export const isActiveImageJob = (job: ImageJob) =>
  job.status === "PENDING" || job.status === "RUNNING";

export const IMAGE_JOB_STATUS_LABEL: Record<ImageJobStatus, string> = {
  PENDING: "대기",
  RUNNING: "생성 중",
  SUCCEEDED: "완성",
  FAILED: "실패",
  CANCELED: "취소",
  EXPIRED: "만료",
};

/** 대기열 패널과 프로필 기록에서 함께 쓰는 한 줄 상태 설명 */
export function describeImageJob(job: ImageJob): string {
  switch (job.status) {
    case "PENDING":
      if (job.waitingForServer) return "AI 서버가 켜지면 자동으로 생성돼요";
      return job.position ? `앞에 ${job.position}개 작업이 있어요` : "곧 시작해요";
    case "RUNNING":
      return job.progress ?? "생성 중이에요";
    case "SUCCEEDED":
      return job.finishedAt
        ? `${formatDistanceToNow(new Date(job.finishedAt), { addSuffix: true, locale: ko })} 완성`
        : "완성";
    case "CANCELED":
      return `취소됨 · ${job.creditCost} 크레딧 환불`;
    case "FAILED":
    case "EXPIRED":
      return `${job.error ?? "생성 실패"} · ${job.creditCost} 크레딧 환불`;
  }
}

export function ImageJobStatusIcon({
  job,
  className = "size-4",
}: {
  job: ImageJob;
  className?: string;
}) {
  switch (job.status) {
    case "PENDING":
      return job.waitingForServer ? (
        <PowerOff className={cn(className, "text-amber-500")} />
      ) : (
        <Clock className={cn(className, "text-muted-foreground")} />
      );
    case "RUNNING":
      return <Loader2 className={cn(className, "animate-spin text-primary")} />;
    case "SUCCEEDED":
      return <CheckCircle2 className={cn(className, "text-emerald-500")} />;
    case "CANCELED":
      return <Ban className={cn(className, "text-muted-foreground")} />;
    case "FAILED":
    case "EXPIRED":
      return <XCircle className={cn(className, "text-destructive")} />;
  }
}
