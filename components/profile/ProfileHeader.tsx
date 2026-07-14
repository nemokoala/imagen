"use client";

import { Pencil } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProfileAvatar } from "../auth/ProfileAvatar";
import { User, PublicUser } from "@/types/user.interfaces";
import Link from "next/link";

interface ProfileHeaderProps {
  userInfo: User | PublicUser;
  isOwnProfile: boolean;
  userImagesCount: number;
  userCommentsCount: number;
  setIsEditOpen: (open: boolean) => void;
}

export function ProfileHeader({
  userInfo,
  isOwnProfile,
  userImagesCount,
  userCommentsCount,
  setIsEditOpen,
}: ProfileHeaderProps) {
  return (
    <Card className="relative w-full overflow-hidden mb-12 border border-white/20 dark:border-white/10 shadow-md bg-gradient-to-br from-purple-600/20 via-blue-600/10 to-transparent dark:from-purple-600/40 dark:via-blue-600/20 dark:to-transparent backdrop-blur-2xl py-0">
      <div className="relative flex flex-col md:flex-row items-center md:items-end gap-6 px-8 py-8">
        {/* Avatar Section */}
        <div className="relative group my-auto">
          <div className="relative p-1 rounded-full bg-card shadow-xl transition-transform duration-500 group-hover:scale-105">
            <ProfileAvatar
              profileImageUrl={userInfo.profileImageUrl || ""}
              nickname={userInfo.nickname || ""}
              size="large"
            />
          </div>
        </div>

        {/* User Info & Stats */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
                {userInfo.nickname}
              </h1>
              {"role" in userInfo && userInfo.role === "admin" && (
                <Link href="/admin">
                  <div className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500 text-white rounded-full uppercase tracking-widest">
                    Admin
                  </div>
                </Link>
              )}
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              {isOwnProfile
                ? (userInfo as User).email
                : "AI 이미지 생성 크리에이터"}
            </p>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <div className="flex flex-col items-center md:items-start">
              <p className="text-xl font-extrabold text-foreground">
                {userImagesCount}
              </p>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                Images
              </p>
            </div>
            <div className="h-8 w-px bg-border/50" />
            <div className="flex flex-col items-center md:items-start">
              <p className="text-xl font-extrabold text-foreground">
                {userCommentsCount}
              </p>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                Comments
              </p>
            </div>
            {isOwnProfile && "credits" in userInfo && (
              <>
                <div className="h-8 w-px bg-border/50" />
                <div className="flex flex-col items-center md:items-start">
                  <p className="text-xl font-extrabold text-foreground">
                    {(userInfo as User).credits.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                    Credits
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {isOwnProfile && (
          <div className="pt-4 md:pt-0">
            <Button
              variant="gradient"
              onClick={() => setIsEditOpen(true)}
              className="rounded-full px-8 py-6 text-base font-bold shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(99,102,241,0.3)] hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 group-active:scale-95"
            >
              <Pencil className="w-5 h-5" />
              프로필 수정
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
