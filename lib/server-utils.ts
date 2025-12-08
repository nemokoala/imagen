"use server";

import { cookies } from "next/headers";
import { authService } from "@/lib/services/auth/authService";
import { ApiError } from "@/lib/errors/AppError";

export const hasCookie = async (key: string) => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(key);
  return !!cookie?.value;
};

export const checkAdminRole = async () => {
  const cookieStore = await cookies();
  const userId = await authService.getUserIdFromCookie(cookieStore);
  const user = await authService.findUserById(userId);
  
  if (!user) {
    throw new ApiError("사용자를 찾을 수 없습니다.", 404, "USER_NOT_FOUND");
  }
  
  if (user.role !== "admin") {
    throw new ApiError("관리자 권한이 필요합니다.", 403, "FORBIDDEN");
  }
  
  return user;
};
