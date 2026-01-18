"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { useUserStore } from "@/stores/userStore";
import { Skeleton } from "../ui/skeleton";
import Image from "next/image";
import { useLogoutMutation } from "@/queries/auth/mutations";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { User, LogOut, Sparkles } from "lucide-react";
import { ProfileAvatar } from "../auth/ProfileAvatar";

export const Header = () => {
  const { isAuthenticated, isLoading, logout, user } = useUserStore();
  const router = useRouter();

  const logoutMutation = useLogoutMutation(
    () => {
      logout();
      toast.success("로그아웃이 완료되었습니다.");
      router.push("/");
    },
    (error) => {
      toast.error("로그아웃 중 오류가 발생했습니다.");
      console.error("로그아웃 에러:", error);
    },
  );

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="sticky h-15 top-0 z-50 w-full flex items-center justify-between px-2">
      <Link
        className="relative w-32 h-9 flex-shrink-0 cursor-pointer transition-opacity hover:opacity-80"
        href="/"
      >
        <Image
          src="/images/logo.png"
          alt="ImageGen"
          fill
          className="object-contain"
          priority
        />
      </Link>

      <div className="flex items-center gap-2 sm:gap-4 mr-2">
        {isLoading ? (
          <Skeleton className="w-10 h-10 rounded-full" />
        ) : !isAuthenticated ? (
          <div className="flex items-center gap-2">
            {/* 테마 토글 */}
            <ThemeToggle />
            <Link href="/auth/login">
              <Button variant="outline" className="hidden sm:flex">
                로그인
              </Button>
              <Button variant="outline" size="sm" className="flex sm:hidden">
                로그인
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="gradient" className="hidden sm:flex">
                회원가입
              </Button>
              <Button variant="gradient" size="sm" className="flex sm:hidden">
                가입
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/image-gen">
              <Button
                variant="gradient"
                className="hidden sm:flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>이미지 생성</span>
              </Button>
              <Button
                variant="gradient"
                size="icon"
                className="flex sm:hidden h-9 w-9"
              >
                <Sparkles className="w-4 h-4" />
              </Button>
            </Link>

            {/* 테마 토글 */}
            <ThemeToggle />

            {/* 유저 드롭다운 메뉴 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full ring-2 ring-transparent hover:ring-primary/20 transition-all"
                >
                  <ProfileAvatar
                    profileImageUrl={user?.profileImageUrl || ""}
                    nickname={user?.nickname || ""}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center gap-3 p-2">
                  <ProfileAvatar
                    profileImageUrl={user?.profileImageUrl || ""}
                    nickname={user?.nickname || ""}
                    size="small"
                  />
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.nickname}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground truncate max-w-[150px]">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>프로필</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>
                    {logoutMutation.isPending ? "로그아웃 중..." : "로그아웃"}
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </header>
  );
};
