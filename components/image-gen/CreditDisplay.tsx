"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Coins } from "lucide-react";

interface CreditDisplayProps {
  credit: number;
  isLoading: boolean;
}

export function CreditDisplay({ credit, isLoading }: CreditDisplayProps) {
  return (
    <motion.div layout transition={{ duration: 0.3, ease: "easeInOut" }}>
      <div className="overflow-hidden rounded-xl border border-border/70 bg-background/85 shadow-sm ring-1 ring-black/5 backdrop-blur-sm dark:ring-white/10">
        <div className="flex items-center justify-between gap-3 px-4 py-3 md:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-500 ring-1 ring-purple-100 dark:bg-purple-950/40 dark:text-purple-300 dark:ring-purple-900/50">
              <Coins className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold leading-tight text-foreground">
                보유 크레딧
              </p>
              <p className="text-xs leading-tight text-muted-foreground">
                이미지 생성에 사용됩니다
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-baseline gap-1.5">
            <motion.span
              key={credit}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-2xl font-black leading-none text-purple-600 dark:text-purple-300"
            >
              {isLoading ? (
                <span className="text-xl opacity-50 animate-pulse">...</span>
              ) : (
                credit?.toLocaleString()
              )}
            </motion.span>
            <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              CR
            </span>
          </div>
        </div>

        <AnimatePresence>
          {credit !== undefined && credit < 1 && !isLoading && (
            <motion.div
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              className="overflow-hidden border-t border-red-200/70 bg-red-50/80 dark:border-red-900/50 dark:bg-red-950/30"
            >
              <div className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 dark:text-red-200 md:px-5">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>크레딧이 부족합니다. 다음 충전일까지 기다려주세요.</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
