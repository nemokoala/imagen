import { NextResponse } from "next/server";
import { authService } from "@/lib/services/auth/authService";
import { errorHandler } from "@/lib/errors/errorHandler";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  try {
    const userId = await authService.getUserIdFromCookie(cookieStore);
    const user = await authService.getUserInfoById(userId);
    return NextResponse.json(user);
  } catch (error) {
    return errorHandler(error);
  }
}
