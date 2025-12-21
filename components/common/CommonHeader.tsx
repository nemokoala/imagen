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
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { User, LogOut } from "lucide-react";

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
    }
  );

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <>
      <nav className="flex items-center justify-between h-15 px-2 sticky top-0 z-50 bg-purple-50 dark:bg-gray-800 border-b border-border">
        <Link
          className="relative w-32 h-9 flex-shrink-0 cursor-pointer"
          href="/"
        >
          <Image
            src="/images/logo.png"
            alt="Imagen"
            fill
            className="object-contain"
            priority
          />
        </Link>
        <div className="flex items-center gap-2.5 mr-1 h-full">
          <ThemeToggle />
          {isLoading ? (
            <Skeleton className="w-10 h-10" />
          ) : !isAuthenticated ? (
            <>
              <Link href="/auth/login">
                <Button variant="outline">로그인</Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="gradient">회원가입</Button>
              </Link>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={user?.profileImageUrl || undefined}
                      alt={user?.nickname || "User"}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white">
                      {user?.nickname?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user?.profileImageUrl || undefined}
                      alt={user?.nickname || "User"}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white text-sm">
                      {user?.nickname?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.nickname}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
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
                  className="cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>
                    {logoutMutation.isPending ? "로그아웃 중..." : "로그아웃"}
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </nav>
    </>
  );
};
