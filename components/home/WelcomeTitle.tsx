"use client";

import { Button } from "../ui/button";
import Link from "next/link";
import { useUserStore } from "@/stores/userStore";
import { X } from "lucide-react";
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
        "mx-auto px-6 py-8 w-full p-4 rounded-3xl mb-4 relative shadow-lg",
        isLoading ? "opacity-0" : ""
      )}
    >
      <X
        className="absolute top-4 right-4 size-6 cursor-pointer"
        onClick={() => setIsCollapsed(true)}
      />
      <div className="text-center">
        <h1 className="text-5xl font-bold text-foreground mb-6">
          AI로 만드는
          <br />
          <span className="gradient-purple-text">특별한 사진</span>
        </h1>
        <p className="text-xl text-subtitle mb-8 max-w-2xl mx-auto">
          ImageGen와 함께 AI 이미지를 생성해보세요. 당신의 상상력을 현실로
          구현합니다.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/auth/register">
            <Button
              variant="gradient"
              size="lg"
              className="font-bold w-full sm:w-auto"
            >
              무료로 시작하기
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
