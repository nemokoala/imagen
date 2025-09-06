"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { useUserStore } from "@/stores/userStore";
import { Skeleton } from "../ui/skeleton";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const Header = () => {
  const { isAuthenticated, isLoading } = useUserStore();
  const router = useRouter();
  return (
    <>
      <nav className="flex items-center justify-between h-[60px] p-2 sticky top-0 z-50 bg-white">
        <button
          className="relative w-32 h-9 flex-shrink-0"
          onClick={() => router.push("/")}
        >
          <Image
            src="/images/logo.png"
            alt="Imagen"
            fill
            className="object-contain"
            priority
          />
        </button>
        <div className="flex gap-4">
          {isLoading ? (
            <Skeleton className="w-10 h-10" />
          ) : !isAuthenticated ? (
            <>
              <Link href="/auth/login">
                <Button variant="ghost">로그인</Button>
              </Link>
              <Link href="/auth/register">
                <Button>회원가입</Button>
              </Link>
            </>
          ) : (
            <Link href="/auth/logout">
              <Button variant="ghost">로그아웃</Button>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};
