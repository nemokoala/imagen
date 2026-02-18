"use client";

import { useRef, useState } from "react";
import { useUserStore } from "@/stores/userStore";
import { useGetUserInfo, useGetPublicUserById } from "@/queries/auth/queries";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User as UserIcon, Pencil } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InfiniteImageGallery } from "@/components/gallery/InfiniteImageGallery";
import { useGetUserImagesInfiniteQuery } from "@/queries/image/queries";
import { ProfileAvatar } from "../auth/ProfileAvatar";
import { ProfileEditDialog } from "./ProfileEditDialog";
import { UserCommentList } from "./UserCommentList";
import { useGetUserCommentsInfiniteQuery } from "@/queries/user/queries";

interface ProfileContentProps {
  targetUserId?: number | null;
}

export function ProfileContent({ targetUserId }: ProfileContentProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { user: storeUser, isLoading: storeLoading } = useUserStore();

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
      <Layout.Content className="flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="w-32 h-32 rounded-full" />
          <Skeleton className="w-48 h-8" />
          <Skeleton className="w-64 h-4" />
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
      className="h-[calc(100dvh-60px)] items-center"
    >
      <div className="container flex flex-col items-center mx-auto px-4 pt-8 max-w-6xl">
        {/* 프로필 헤더 */}
        <Card className="flex flex-col justify-center items-center p-8 mb-8 bg-background gap-4 w-[calc(100%-2rem)] max-w-sm">
          <ProfileAvatar
            profileImageUrl={userInfo.profileImageUrl || ""}
            nickname={userInfo.nickname || ""}
            size="large"
          />
          <h1 className="text-2xl font-bold text-foreground mb-1 text-center">
            {userInfo.nickname}
          </h1>
          {isOwnProfile && (
            <Button variant="gradient" onClick={() => setIsEditOpen(true)}>
              <Pencil className="w-4 h-4" />
              프로필 수정
            </Button>
          )}
        </Card>

        <Tabs
          defaultValue="images"
          className="w-full flex flex-col items-center"
        >
          <TabsList className="w-full max-w-md bg-gray-100 dark:bg-gray-800 p-1 h-auto mb-8">
            <TabsTrigger value="images" className="flex-1 py-2">
              생성한 이미지
            </TabsTrigger>
            <TabsTrigger value="comments" className="flex-1 py-2">
              작성한 댓글
            </TabsTrigger>
          </TabsList>

          <TabsContent value="images" className="w-full max-w-6xl px-2 pb-8">
            <div className="container mx-auto px-2 max-w-6xl">
              <div className="mb-4 self-start w-full">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  유저가 생성한 이미지
                </h2>
                <p className="text-gray-600 dark:text-gray-400 ">
                  총 {userImagesData?.pages[0]?.totalCount || 0}개의 이미지
                </p>
              </div>

              {!imagesLoading &&
              userImagesData &&
              userImagesData.pages[0]?.images.length === 0 ? (
                <div className="container mx-auto max-w-6xl flex-shrink-0">
                  <Card className="p-12 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
                    <UserIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {isOwnProfile
                        ? "아직 생성한 이미지가 없습니다."
                        : `${userInfo.nickname}님이 아직 생성한 이미지가 없습니다.`}
                    </p>
                    {isOwnProfile && (
                      <Link href="/image-gen">
                        <Button variant="gradient">이미지 생성하기</Button>
                      </Link>
                    )}
                  </Card>
                </div>
              ) : (
                <InfiniteImageGallery
                  userId={userInfo?.id}
                  scrollElementRef={scrollContainerRef}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="comments" className="w-full max-w-6xl px-2 pb-8">
            <div className="container mx-auto px-2 max-w-6xl">
              <div className="mb-4 self-start w-full">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  유저가 작성한 댓글
                </h2>
                <p className="text-gray-600 dark:text-gray-400 ">
                  {userCommentsData?.pages[0]?.totalCount
                    ? `총 ${userCommentsData.pages[0].totalCount}개의 댓글`
                    : "작성한 댓글 목록"}
                </p>
              </div>
              <UserCommentList userId={userInfo.id} />
            </div>
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
