"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { useUserStore } from "@/stores/userStore";
import { Skeleton } from "../ui/skeleton";
import { Logo } from "./Logo";
import { useLogoutMutation } from "@/queries/auth/mutations";
import { toast } from "sonner";
import { ThemeToggle } from "./ThemeToggle";
import { NotificationPopover } from "./NotificationPopover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { User, LogOut, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileAvatar } from "../auth/ProfileAvatar";

export const Header = () => {
  const { isAuthenticated, isLoading, logout, user } = useUserStore();
  const pathname = usePathname();

  // 비로그인 상태에서 /generate 로 가면 프록시가 랜딩으로 돌려보내므로 로그인으로 바로 보낸다.
  const navItems = [
    { href: "/explore", label: "갤러리", active: pathname === "/explore" || pathname.startsWith("/image/") },
    {
      href: isAuthenticated ? "/generate" : "/auth/login",
      label: "이미지 생성",
      active: pathname === "/generate",
    },
  ];

  const logoutMutation = useLogoutMutation(
    () => {
      logout();
      toast.success("로그아웃이 완료되었습니다.");
      window.location.href = "/";
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
    <header className="sticky top-0 z-50 flex h-15 w-full items-center justify-between border-b border-border/70 bg-background/80 pl-4 pr-3 backdrop-blur-md sm:pl-5 sm:pr-4">
      <div className="flex items-center gap-6">
        <Link
          className="flex-shrink-0 cursor-pointer transition-opacity hover:opacity-80"
          href="/"
          aria-label="ImageGen 홈"
        >
          <Logo />
        </Link>

        <nav aria-label="주요 메뉴" className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                item.active
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        {isLoading ? (
          <Skeleton className="w-10 h-10 rounded-full" />
        ) : !isAuthenticated ? (
          <div className="flex items-center gap-2">
            {/* 테마 토글 */}
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm">
              <Link href="/auth/login">로그인</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/auth/register">
                <span className="hidden sm:inline">시작하기</span>
                <span className="sm:hidden">가입</span>
              </Link>
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {/* 데스크톱은 상단 메뉴로, 모바일은 아이콘 버튼으로 생성 페이지에 들어간다 */}
            <Button asChild size="icon" className="md:hidden" aria-label="이미지 생성">
              <Link href="/generate">
                <Sparkles className="h-4 w-4" />
              </Link>
            </Button>

            {/* 알림 */}
            <NotificationPopover />

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
