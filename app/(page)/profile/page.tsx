"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/userStore";
import { useGetUserInfoQuery } from "@/queries/auth/queries";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User as UserIcon, Mail, Coins, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { InfiniteImageGallery } from "@/components/gallery/InfiniteImageGallery";
import { useGetUserImagesInfiniteQuery } from "@/queries/image/queries";

export default function ProfilePage() {
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { user: storeUser, isLoading: storeLoading } = useUserStore();
  const { data: userInfo, isLoading: userInfoLoading } = useGetUserInfoQuery({
    enabled: !!storeUser,
  });
  const { data: userImagesData, isLoading: imagesLoading } =
    useGetUserImagesInfiniteQuery(userInfo?.id || 0, 20);

  useEffect(() => {
    if (!storeLoading && !storeUser) {
      router.push("/auth/login");
    }
  }, [storeUser, storeLoading, router]);

  if (storeLoading || userInfoLoading) {
    return (
      <Layout.Content className="flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="w-32 h-32 rounded-full" />
          <Skeleton className="w-48 h-8" />
          <Skeleton className="w-64 h-4" />
        </div>
      </Layout.Content>
    );
  }

  if (!storeUser || !userInfo) {
    return null;
  }

  return (
    <Layout.Content
      ref={scrollContainerRef}
      className="h-[calc(100dvh-60px)] items-center"
    >
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* 프로필 헤더 */}
        <Card className="p-6 mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="w-32 h-32 border-4 border-purple-200 dark:border-purple-800">
              <AvatarImage
                src={userInfo.profileImageUrl || undefined}
                alt={userInfo.nickname}
              />
              <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white text-2xl">
                {userInfo.nickname.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {userInfo.nickname}
                </h1>
                {userInfo.role === "admin" && (
                  <Badge variant="secondary" className="w-fit">
                    관리자
                  </Badge>
                )}
                {userInfo.provider === "kakao" && (
                  <Badge variant="outline" className="w-fit">
                    카카오 로그인
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{userInfo.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Coins className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-semibold">
                    {userInfo.credits.toLocaleString()} 크레딧
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    {new Date(userInfo.createdAt).toLocaleDateString("ko-KR")}{" "}
                    가입
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 이미지 갤러리 헤더 */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            내가 생성한 이미지
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            총 {userImagesData?.pages[0]?.totalCount || 0}개의 이미지
          </p>
        </div>
      </div>

      {/* 이미지 갤러리 */}
      {!imagesLoading &&
      userImagesData &&
      userImagesData.pages[0]?.images.length === 0 ? (
        <div className="container mx-auto px-4 max-w-6xl flex-shrink-0">
          <Card className="p-12 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
            <UserIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              아직 생성한 이미지가 없습니다.
            </p>
            <Link href="/image-gen">
              <Button variant="gradient">이미지 생성하기</Button>
            </Link>
          </Card>
        </div>
      ) : (
        <div className="px-2 pb-8 w-full max-w-6xl">
          <InfiniteImageGallery
            userId={userInfo?.id}
            scrollElementRef={
              scrollContainerRef as React.RefObject<HTMLDivElement>
            }
          />
        </div>
      )}
    </Layout.Content>
  );
}
