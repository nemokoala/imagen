"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, AlertCircle, Sparkles } from "lucide-react";

interface CreditDisplayProps {
  credit: number;
  isLoading: boolean;
}

export function CreditDisplay({ credit, isLoading }: CreditDisplayProps) {
  return (
    <motion.div layout transition={{ duration: 0.3, ease: "easeInOut" }}>
      <Card className="relative overflow-hidden border-none bg-gradient-to-br from-purple-50/90 via-white/60 to-purple-50/90 dark:from-purple-950/40 dark:via-gray-900/60 dark:to-purple-950/40 backdrop-blur-xl shadow-lg ring-1 ring-black/5 dark:ring-white/10 group hover:scale-[1.005] transition-transform duration-300">
        {/* Shine Effect Overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[200%] group-hover:animate-shine skew-x-12" />
        </div>

        {/* Decorative background blobs */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-400/20 rounded-full blur-3xl" />

        <CardContent className="relative z-10 p-5 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                <div className="relative p-2.5 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl shadow-inner border border-white/20">
                  <Coins className="h-5 w-5 text-white drop-shadow-sm" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-purple-600/70 dark:text-purple-400/70 tracking-widest uppercase mb-0.5">
                  My Credits
                </span>
                <h3 className="font-bold text-gray-800 dark:text-gray-100 text-base flex items-center gap-1.5">
                  보유 크레딧
                  <Sparkles className="w-3 h-3 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity delay-100" />
                </h3>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-baseline gap-1.5">
                <motion.span
                  key={credit}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-600 dark:from-purple-400 dark:to-purple-400 filter drop-shadow-sm"
                >
                  {isLoading ? (
                    <span className="opacity-50 text-2xl animate-pulse">
                      ...
                    </span>
                  ) : (
                    credit?.toLocaleString()
                  )}
                </motion.span>
                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                  CR
                </span>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {credit !== undefined && credit < 1 && !isLoading && (
              <motion.div
                layout
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                className="overflow-hidden"
              >
                <div className="rounded-xl bg-red-50/90 dark:bg-red-950/40 border border-red-200/60 dark:border-red-900/40 p-3.5 backdrop-blur-md shadow-sm">
                  <div className="flex gap-4 items-center">
                    <div className="flex-shrink-0 w-8 h-8 mt-0.5 p-1 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center">
                      <AlertCircle className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-red-800 dark:text-red-200">
                        크레딧이 부족해요
                      </span>
                      <span className="text-xs text-red-600/80 dark:text-red-300/80 leading-relaxed font-medium">
                        매월 1일에 자동으로 충전됩니다.
                        <br />
                        다음 충전일까지 조금만 기다려주세요!
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
