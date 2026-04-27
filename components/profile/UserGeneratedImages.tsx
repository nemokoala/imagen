"use client";

import { User as UserIcon } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InfiniteImageGallery } from "@/components/gallery/InfiniteImageGallery";
import { PublicUser, User } from "@/types/user.interfaces";

interface UserGeneratedImagesProps {
  userInfo: User | PublicUser;
  isOwnProfile: boolean;
  userImagesData: any;
  imagesLoading: boolean;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}

export function UserGeneratedImages({
  userInfo,
  isOwnProfile,
  userImagesData,
  imagesLoading,
  scrollContainerRef,
}: UserGeneratedImagesProps) {
  return (
    <div className="w-full">
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
        <div className="w-full flex-shrink-0">
          <Card className="p-12 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
            <UserIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {isOwnProfile
                ? "아직 생성한 이미지가 없습니다."
                : `${userInfo.nickname}님이 아직 생성한 이미지가 없습니다.`}
            </p>
            {isOwnProfile && (
              <Link href="/generate">
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
  );
}
