"use client";

import { motion } from "framer-motion";
import { Coins } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreditDisplayProps {
  credit: number;
  isLoading: boolean;
}

/** 생성 패널 머리에 두는 보유 크레딧 배지. 부족하면 경고색으로 바뀐다. */
export function CreditDisplay({ credit, isLoading }: CreditDisplayProps) {
  const isInsufficient = credit !== undefined && credit < 1 && !isLoading;

  return (
    <div
      title="보유 크레딧"
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-sm",
        isInsufficient
          ? "border-destructive/40 text-destructive"
          : "border-border bg-background",
      )}
    >
      <Coins
        className={cn(
          "h-3.5 w-3.5",
          isInsufficient ? "text-destructive" : "text-primary",
        )}
      />
      <span className="sr-only">보유 크레딧</span>
      <motion.span
        key={credit}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="font-semibold tabular-nums"
      >
        {isLoading ? (
          <span className="animate-pulse opacity-50">...</span>
        ) : (
          credit?.toLocaleString()
        )}
      </motion.span>
      <span className="text-xs text-muted-foreground">크레딧</span>
    </div>
  );
}
