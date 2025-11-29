"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect는 클라이언트에서만 실행되므로 hydration 이후에 mounted가 true가 됨
  useEffect(() => {
    setMounted(true);
  }, []);

  // 마운트 전에는 아이콘 없이 빈 버튼만 렌더링 (서버/클라이언트 일치)
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-10 h-10">
        <span className="h-5 w-5" />
        <span className="sr-only">테마 전환</span>
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="w-10 h-10"
    >
      {resolvedTheme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
      <span className="sr-only">테마 전환</span>
    </Button>
  );
}
