"use client";

import { useRef, useState } from "react";
import { useUserStore } from "@/stores/userStore";
import { useGetUserInfo, useGetPublicUserById } from "@/queries/auth/queries";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetUserImagesInfiniteQuery } from "@/queries/image/queries";
import { ProfileEditDialog } from "./ProfileEditDialog";
import { UserCommentList } from "./UserCommentList";
import { useGetUserCommentsInfiniteQuery } from "@/queries/user/queries";
import { ProfileHeader } from "./ProfileHeader";
import { UserGeneratedImages } from "./UserGeneratedImages";
import { useUrlParams } from "@/hooks/use-url-params";
import { MessageSquare } from "lucide-react";
import { DecorativeBackground } from "../ui/decorative-background";

interface ProfileContentProps {
  targetUserId?: number | null;
}

export function ProfileContent({ targetUserId }: ProfileContentProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { user: storeUser, isLoading: storeLoading } = useUserStore();
  const { getParam, setParam } = useUrlParams();
  const activeTab = getParam("tab") || "images";

  const handleTabChange = (value: string) => {
    setParam("tab", value);
  };

  // 본인 프로필인지 확인
  const isOwnProfile = !targetUserId || targetUserId === storeUser?.id;

  // 본인 프로필이면 useGetUserInfo 사용, 다른 사용자면 useGetPublicUserById 사용
  const { data: ownUserInfo, isLoading: ownUserInfoLoading } = useGetUserInfo({
    enabled: isOwnProfile && !!storeUser,
  });
  const { data: otherUserInfo, isLoading: otherUserInfoLoading } =
    useGetPublicUserById(isOwnProfile ? null : targetUserId);

  // 표시할 사용자 정보 결정
  const userInfo = isOwnProfile ? ownUserInfo : otherUserInfo;
  const userInfoLoading = isOwnProfile
    ? ownUserInfoLoading
    : otherUserInfoLoading;

  const { data: userImagesData, isLoading: imagesLoading } =
    useGetUserImagesInfiniteQuery(userInfo?.id || 0, 20);

  // 댓글 쿼리 (탭이 'comments'일 때만 fetching)
  const { data: userCommentsData } = useGetUserCommentsInfiniteQuery(
    userInfo?.id || 0,
    10,
  );

  if ((isOwnProfile && storeLoading) || userInfoLoading) {
    return (
      <Layout.Content className="flex items-center px-2">
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center pt-8">
          <Card className="relative w-full overflow-hidden mb-12 border-none shadow-xl bg-muted/20">
            <div className="h-32 bg-muted/10" />
            <div className="relative flex flex-col md:flex-row items-center md:items-end gap-6 px-8 pb-8 pt-16">
              <div className="p-1 rounded-full bg-background shadow-xl scale-110">
                <Skeleton className="w-24 h-24 rounded-full" />
              </div>
              <div className="flex-1 flex flex-col items-center md:items-start space-y-4">
                <div className="space-y-2">
                  <Skeleton className="w-48 h-10" />
                  <Skeleton className="w-32 h-4" />
                </div>
                <div className="flex gap-6">
                  <Skeleton className="w-16 h-12" />
                  <Skeleton className="w-16 h-12" />
                  <Skeleton className="w-16 h-12" />
                </div>
              </div>
              <Skeleton className="w-40 h-14 rounded-full" />
            </div>
          </Card>
        </div>
      </Layout.Content>
    );
  }

  // 본인 프로필일 때만 storeUser 체크
  if (isOwnProfile && !storeUser) {
    return null;
  }

  if (!userInfo) {
    return (
      <Layout.Content className="flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <p className="text-gray-600 dark:text-gray-400">
            사용자를 찾을 수 없습니다.
          </p>
          <Link href="/">
            <Button variant="outline">홈으로 돌아가기</Button>
          </Link>
        </div>
      </Layout.Content>
    );
  }

  return (
    <Layout.Content
      ref={scrollContainerRef}
      className="h-[calc(100dvh-60px)] items-center px-2"
    >
      <DecorativeBackground />
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center pt-8 z-10">
        {/* 프로필 헤더 */}
        <ProfileHeader
          userInfo={userInfo}
          isOwnProfile={isOwnProfile}
          userImagesCount={userImagesData?.pages[0]?.totalCount || 0}
          userCommentsCount={userCommentsData?.pages[0]?.totalCount || 0}
          setIsEditOpen={setIsEditOpen}
        />

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full flex flex-col items-center"
        >
          <TabsList className="w-full max-w-md bg-gray-100 dark:bg-gray-800 p-1 h-auto mb-8">
            <TabsTrigger
              value="images"
              className="flex-1 py-2 hover:cursor-pointer"
            >
              생성한 이미지
            </TabsTrigger>
            <TabsTrigger
              value="comments"
              className="flex-1 py-2 hover:cursor-pointer"
            >
              작성한 댓글
            </TabsTrigger>
          </TabsList>

          <TabsContent value="images" className="w-full max-w-6xl pb-8">
            <UserGeneratedImages
              userInfo={userInfo}
              isOwnProfile={isOwnProfile}
              userImagesData={userImagesData}
              imagesLoading={imagesLoading}
              scrollContainerRef={scrollContainerRef}
            />
          </TabsContent>

          <TabsContent value="comments" className="w-full max-w-6xl pb-8">
            <div className="mb-6 self-start w-full">
              <div className="mb-1 flex items-center gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-xl border border-border/60 bg-gradient-to-br from-purple-500/15 to-blue-500/10 text-purple-600 dark:text-purple-400">
                  <MessageSquare className="size-4" />
                </span>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  {isOwnProfile
                    ? "작성한 댓글"
                    : `${userInfo.nickname}님의 댓글`}
                </h2>
              </div>
              <p className="text-muted-foreground pl-[2.75rem] text-sm sm:text-base">
                {userCommentsData?.pages[0]?.totalCount != null
                  ? `총 ${userCommentsData.pages[0].totalCount}개`
                  : "댓글을 불러오는 중…"}
              </p>
            </div>
            <UserCommentList
              userId={userInfo.id}
              nickname={userInfo.nickname}
              isOwnProfile={isOwnProfile}
            />
          </TabsContent>
        </Tabs>
      </div>
      {ownUserInfo && isOwnProfile && (
        <ProfileEditDialog
          user={ownUserInfo}
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
        />
      )}
    </Layout.Content>
  );
}
