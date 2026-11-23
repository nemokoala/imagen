"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const STAGES = ["준비", "생성", "저장"] as const;

/**
 * 서버가 보내는 진행 문장을 준비(0) · 생성(1) · 저장(2) 단계로 나눈다.
 * 진행 문장이 없는 모델(DALL-E 등)은 생성 단계로 본다.
 */
export function getGenerationStage(message: string | null): number {
  if (!message) return 1;
  if (/저장|처리/.test(message)) return 2;
  if (/(생성|편집)(되는|하는)? 중/.test(message)) return 1;
  return 0;
}

function formatElapsed(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}

interface GenerationLoaderProps {
  /** 서버 진행 문장 (없으면 기본 문구) */
  message: string | null;
  mode: "generate" | "edit";
  className?: string;
  style?: React.CSSProperties;
}

/** 생성 결과가 들어올 틀 안에서 보여주는 로딩 화면 */
export function GenerationLoader({
  message,
  mode,
  className,
  style,
}: GenerationLoaderProps) {
  // 마운트 시점(생성 시작)부터 초를 센다. 서버 문장의 "(N초 경과)"는 대신 지운다.
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  const stage = getGenerationStage(message);
  const label =
    message?.replace(/\s*\(\d+초 경과\)/, "") ??
    (mode === "edit"
      ? "이미지를 편집하는 중입니다"
      : "이미지를 생성하는 중입니다");

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "relative overflow-hidden rounded-2xl bg-card ring-1 ring-border",
        className,
      )}
      style={style}
    >
      <div aria-hidden className="gen-glow absolute inset-0" />
      <div aria-hidden className="gen-glow-2 absolute inset-0" />
      <div aria-hidden className="gen-sweep absolute inset-0" />
      <div aria-hidden className="gen-grain absolute inset-0" />

      {/* 가운데 표식: 아래 상태 패널과 겹치지 않도록 패널 위 영역 가운데에 둔다 */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 bottom-24 flex items-center justify-center"
      >
        <span className="relative flex size-11 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-xl bg-primary/20 [animation-duration:2.4s]" />
          <span className="relative flex size-11 items-center justify-center rounded-xl bg-background/70 ring-1 ring-border backdrop-blur-sm">
            <Sparkles className="size-5 text-primary" />
          </span>
        </span>
      </div>

      <div className="absolute inset-x-3 bottom-3 rounded-xl bg-background/80 p-3 ring-1 ring-border backdrop-blur-md">
        <div className="flex items-center justify-between gap-3 text-xs">
          <span className="truncate font-medium text-foreground">{label}</span>
          <span className="shrink-0 tabular-nums text-muted-foreground">
            {formatElapsed(elapsed)}
          </span>
        </div>

        <ol className="mt-2.5 grid grid-cols-3 gap-1.5">
          {STAGES.map((name, index) => (
            <li key={name} className="flex flex-col gap-1">
              <span className="relative h-1 overflow-hidden rounded-full bg-muted">
                {index < stage && (
                  <span className="absolute inset-0 rounded-full bg-primary" />
                )}
                {index === stage && (
                  <span className="gen-indeterminate absolute inset-y-0 left-0 w-1/2 rounded-full bg-primary" />
                )}
              </span>
              <span
                className={cn(
                  "text-[11px]",
                  index <= stage ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {name}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
