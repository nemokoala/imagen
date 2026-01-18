"use client";

import { useState, useRef, useEffect } from "react";
import { User } from "@/types/user.interfaces";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProfileAvatar } from "../auth/ProfileAvatar";
import { useUpdateProfile } from "@/queries/auth/mutations";
import { Camera, Loader2 } from "lucide-react";

interface ProfileEditDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileEditDialog({
  user,
  open,
  onOpenChange,
}: ProfileEditDialogProps) {
  // Add fallback for user which might be null/undefined initially in parent
  const [nickname, setNickname] = useState(user?.nickname || "");
  const [previewImage, setPreviewImage] = useState<string | null>(
    user?.profileImageUrl || null,
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: updateProfile, isPending } = useUpdateProfile(
    () => {
      onOpenChange(false);
      // Optional: Success feedback
    },
    (error) => {
      alert(error.message);
    },
  );

  useEffect(() => {
    if (open && user) {
      setNickname(user.nickname);
      setPreviewImage(user.profileImageUrl);
      setImageFile(null);
    }
  }, [open, user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("이미지 크기는 5MB 이하여야 합니다.");
        return;
      }
      setImageFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);

      // Clean up object URL on component unmount or next change is handled by React's state update but manual revoke is good practice if we were doing it a lot
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("nickname", nickname);
    if (imageFile) {
      formData.append("image", imageFile);
    }
    updateProfile(formData);
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background">
        <DialogHeader>
          <DialogTitle>프로필 수정</DialogTitle>
          <DialogDescription>
            프로필 정보를 수정합니다. 변경사항을 저장하려면 저장 버튼을
            눌러주세요.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          <div className="flex flex-col items-center gap-4">
            <div
              className="relative group cursor-pointer rounded-full overflow-hidden"
              onClick={() => fileInputRef.current?.click()}
            >
              <ProfileAvatar
                profileImageUrl={previewImage || ""}
                nickname={user.nickname}
                size="large"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
            <Label
              className="text-sm text-center text-muted-foreground cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              클릭하여 이미지 변경
            </Label>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="nickname">닉네임</Label>
            <Input
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임을 입력하세요"
            />
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              취소
            </Button>
            <Button type="submit" variant="gradient" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              저장
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
