"use client";

import { Button } from "../ui/button";
import Link from "next/link";
import { useUserStore } from "@/stores/userStore";
import { X, Sparkles, Wand2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function WelcomeTitle() {
  const { user, isLoading } = useUserStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isLoggedIn = !!user;

  if (isLoggedIn || isCollapsed) {
    return null;
  }

  return (
    <main
      className={cn(
        "mx-auto max-w-7xl px-6 py-10 w-full min-h-fit flex-shrink-0 rounded-[2rem] relative shadow-md overflow-hidden group my-2",
        "bg-gradient-to-br from-white/90 via-purple-50/50 to-blue-50/90 dark:from-zinc-950/90 dark:via-zinc-900/50 dark:to-zinc-950/90",
        "backdrop-blur-3xl border border-white/40 dark:border-white/10",
        "animate-in fade-in slide-in-from-bottom-5 duration-500",
        isLoading ? "opacity-0" : "",
      )}
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/30 rounded-full blur-[60px] md:blur-[100px] -translate-x-1/2 -translate-y-1/2 group-hover:bg-purple-500/40 transition-colors duration-700 transform-gpu will-change-transform" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/30 rounded-full blur-[60px] md:blur-[100px] translate-x-1/2 translate-y-1/2 group-hover:bg-blue-500/40 transition-colors duration-700 transform-gpu will-change-transform" />
      <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[80px] md:blur-[120px] -translate-x-1/2 -translate-y-1/2 transform-gpu will-change-transform" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <X
        className="absolute top-6 right-6 size-5 cursor-pointer text-muted-foreground hover:text-foreground transition-colors z-10"
        onClick={() => setIsCollapsed(true)}
      />

      <div className="relative z-10 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background/50 border border-purple-200 dark:border-purple-900/50 backdrop-blur-md mb-6 animate-in zoom-in-95 fade-in duration-500 delay-200 fill-mode-both">
          <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          <span className="text-xs font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
            AI Creative Studio
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-foreground mb-6 tracking-tight leading-tight">
          AI로 만드는
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 dark:from-purple-400 dark:via-indigo-400 dark:to-blue-400 animate-gradient-x">
            특별한 사진
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-subtitle mb-10 max-w-2xl mx-auto leading-relaxed font-light">
          ImageGen와 함께 AI 이미지를 생성해보세요.
        </p>

        <div className="flex gap-4 justify-center relative group/btn">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-40 group-hover/btn:opacity-60 transition-opacity duration-300" />
          <Link href="/auth/register" className="relative">
            <Button
              variant="gradient"
              size="lg"
              className="text-white h-14 px-8 text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-none shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 rounded-xl"
            >
              <Wand2 className="w-5 h-5 mr-2 animate-pulse text-white" />
              무료로 시작하기
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
