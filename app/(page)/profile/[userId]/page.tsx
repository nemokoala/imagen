"use client";

import { ProfileContent } from "@/components/profile/ProfileContent";
import { useParams } from "next/navigation";

export default function UserProfilePage() {
  const params = useParams();
  const userIdParam = params.userId as string | undefined;
  const userId = userIdParam ? parseInt(userIdParam, 10) : null;

  if (userIdParam && isNaN(userId || 0)) {
    return <ProfileContent targetUserId={null} />;
  }

  return <ProfileContent targetUserId={userId} />;
}
