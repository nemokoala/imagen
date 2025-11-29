"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, AlertCircle } from "lucide-react";

interface CreditDisplayProps {
  credit: number;
  isLoading: boolean;
}

export function CreditDisplay({ credit, isLoading }: CreditDisplayProps) {
  return (
    <motion.div layout transition={{ duration: 0.3, ease: "easeInOut" }}>
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 dark:from-amber-800/20 dark:to-orange-800/20 dark:border-amber-800/50">
        <CardContent className="px-4 gap-0 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-full dark:bg-amber-900/50">
                <Coins className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="font-semibold text-black dark:text-white">
                  보유 크레딧
                </h3>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {credit}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  크레딧
                </span>
              </div>
            </div>
          </div>

          {/* 크레딧 부족 경고 */}
          <AnimatePresence>
            {credit !== undefined && credit < 1 && !isLoading && (
              <motion.div
                layout
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg mt-2 dark:bg-red-950/30 dark:border-red-800/50">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500 dark:text-red-400" />
                    <span className="text-sm text-red-700 dark:text-red-300">
                      크레딧이 부족합니다.
                      <br />
                      크레딧은 매월 1일에 충전됩니다.
                    </span>
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
