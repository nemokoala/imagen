import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Wand2, Images } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NeedLoginHandler } from "@/components/home/NeedLoginHandler";

export const metadata: Metadata = {
  title: "ImageGen - AI 이미지 생성 플랫폼",
  description:
    "DALL-E 3, Google Imagen, Stable Diffusion 등 다양한 AI 모델로 나만의 이미지를 생성하고 공유하세요.",
  openGraph: {
    title: "ImageGen - AI 이미지 생성 플랫폼",
    description:
      "DALL-E 3, Google Imagen, Stable Diffusion 등 다양한 AI 모델로 나만의 이미지를 생성하고 공유하세요.",
  },
};

export default function LandingPage() {
  return (
    <main className="relative min-h-[calc(100dvh-60px)] flex items-center justify-center overflow-hidden px-6">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_60%,transparent_100%)] pointer-events-none" />

      <NeedLoginHandler />

      <div className="relative z-10 text-center flex flex-col items-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 dark:bg-black/30 border border-purple-200 dark:border-purple-900/50 backdrop-blur-md mb-6">
          <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          <span className="text-xs font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
            AI Creative Studio
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-foreground mb-6 tracking-tight leading-tight">
          AI로 만드는
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 dark:from-purple-400 dark:via-indigo-400 dark:to-blue-400">
            특별한 사진
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
          DALL-E 3, Google Imagen 등 다양한 AI 모델로
          <br className="hidden md:block" />
          나만의 이미지를 생성하고 공유해보세요.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <div className="relative group/btn">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-40 group-hover/btn:opacity-60 transition-opacity duration-300" />
            <Link href="/auth/register" className="relative">
              <Button
                size="lg"
                className="text-white h-14 px-8 text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-none shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 rounded-xl"
              >
                <Wand2 className="w-5 h-5 mr-2" />
                무료로 시작하기
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
