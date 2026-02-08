import { ApiError } from "@/lib/errors/AppError";
import { errorHandler } from "@/lib/errors/errorHandler";
import { fcmService } from "@/lib/services/notification/fcmService";
import { authService } from "@/lib/services/auth/authService";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    const cookieStore = await cookies();
    const userId = await authService.getUserIdFromCookie(cookieStore);

    if (!token) {
      throw new ApiError("토큰이 없습니다.", 400);
    }

    fcmService.updateFCMToken(userId, token);

    return NextResponse.json({ success: true });
  } catch (error) {
    errorHandler(error);
  }
}
