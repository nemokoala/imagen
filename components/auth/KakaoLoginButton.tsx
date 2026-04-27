"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface KakaoLoginButtonProps {
  disabled?: boolean;
  className?: string;
  isRegister?: boolean;
}

export function KakaoLoginButton({
  disabled = false,
  isRegister = false,
  className,
}: KakaoLoginButtonProps) {
  const handleKakaoLogin = () => {
    window.location.href = "/api/auth/kakao";
  };

  return (
    <Button
      type="button"
      onClick={handleKakaoLogin}
      className={cn(
        "w-full rounded-full bg-[#FEE500] text-[#000000] hover:bg-[#FEE500]/90",
        className,
      )}
      disabled={disabled}
    >
      <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z" />
      </svg>
      {isRegister ? "카카오로 시작하기" : "카카오로 로그인"}
    </Button>
  );
}
