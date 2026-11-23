import type { Metadata } from "next";
import Link from "next/link";
import { Home, Images } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없습니다 - ImageGen",
  description: "요청하신 페이지가 존재하지 않거나 이동되었습니다.",
};

export default function NotFound() {
  return (
    <main className="relative min-h-[calc(100dvh-60px)] flex items-center justify-center px-6">
      <div className="text-center flex flex-col items-center max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-2 mb-6 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          <span className="size-1.5 rounded-full bg-primary" />
          Page Not Found
        </span>

        <h1 className="text-7xl md:text-9xl font-extrabold tracking-tight leading-none mb-6 text-foreground">
          404
        </h1>

        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 tracking-tight">
          페이지를 찾을 수 없습니다
        </h2>

        <p className="text-base md:text-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
          요청하신 페이지가 존재하지 않거나
          <br className="hidden md:block" />
          이동되었을 수 있어요.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg">
            <Link href="/">
              <Home className="size-5" />
              홈으로 이동
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/explore">
              <Images className="size-5" />
              갤러리 구경하기
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
