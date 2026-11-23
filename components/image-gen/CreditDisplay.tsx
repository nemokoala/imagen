"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Coins } from "lucide-react";

interface CreditDisplayProps {
  credit: number;
  isLoading: boolean;
}

/** 생성 페이지 제목 옆에 두는 보유 크레딧 배지. 부족하면 아래에 안내 문구를 띄운다. */
export function CreditDisplay({ credit, isLoading }: CreditDisplayProps) {
  const isInsufficient = credit !== undefined && credit < 1 && !isLoading;

  return (
    <div className="flex flex-col items-start gap-1.5 sm:items-end">
      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm shadow-xs">
        <Coins className="h-4 w-4 text-primary" />
        <span className="text-muted-foreground">보유 크레딧</span>
        <motion.span
          key={credit}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="font-semibold tabular-nums text-foreground"
        >
          {isLoading ? (
            <span className="animate-pulse opacity-50">...</span>
          ) : (
            credit?.toLocaleString()
          )}
        </motion.span>
      </div>

      <AnimatePresence>
        {isInsufficient && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1.5 text-xs font-medium text-destructive"
          >
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            크레딧이 부족합니다. 다음 충전일까지 기다려주세요.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
