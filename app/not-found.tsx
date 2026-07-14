import type { Metadata } from "next";
import Link from "next/link";
import { Home, Images, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DecorativeBackground } from "@/components/ui/decorative-background";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없습니다 - ImageGen",
  description: "요청하신 페이지가 존재하지 않거나 이동되었습니다.",
};

export default function NotFound() {
  return (
    <main className="relative min-h-[calc(100dvh-60px)] flex items-center justify-center px-6">
      <DecorativeBackground />

      <div className="relative z-10 text-center flex flex-col items-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background/50 border border-purple-200 dark:border-purple-900/50 backdrop-blur-md mb-6">
          <Compass className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          <span className="text-xs font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
            Page Not Found
          </span>
        </div>

        <h1 className="text-7xl md:text-9xl font-black tracking-tight leading-none mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 dark:from-purple-400 dark:via-indigo-400 dark:to-blue-400">
          404
        </h1>

        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 tracking-tight">
          페이지를 찾을 수 없습니다
        </h2>

        <p className="text-lg md:text-xl text-subtitle mb-10 max-w-xl mx-auto leading-relaxed font-light">
          요청하신 페이지가 존재하지 않거나
          <br className="hidden md:block" />
          이동되었을 수 있어요.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <div className="relative group/btn">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-40 group-hover/btn:opacity-60 transition-opacity duration-300" />
            <Link href="/" className="relative">
              <Button
                size="lg"
                className="text-white h-14 px-8 text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-none shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 rounded-xl"
              >
                <Home className="w-5 h-5 mr-2" />
                홈으로 이동
              </Button>
            </Link>
          </div>
          <Link href="/explore">
            <Button
              variant="outline"
              size="lg"
              className="h-14 px-8 text-lg font-semibold hover:-translate-y-0.5 transition-all duration-300 rounded-xl"
            >
              <Images className="w-5 h-5 mr-2" />
              갤러리 구경하기
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
