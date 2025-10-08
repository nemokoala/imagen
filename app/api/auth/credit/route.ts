import { NextResponse } from "next/server";
import { authService } from "@/lib/services/auth/authService";
import { errorHandler } from "@/lib/errors/errorHandler";
import { cookies } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const maxDuration = 10;

export async function GET() {
  const cookieStore = await cookies();
  try {
    const userId = await authService.getUserIdFromCookie(cookieStore);
    const credit = await authService.getCreditById(userId);
    return NextResponse.json(credit);
  } catch (error) {
    return errorHandler(error);
  }
}
