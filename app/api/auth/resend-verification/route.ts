import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/services/auth/authService";
import { errorHandler } from "@/lib/errors/errorHandler";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin;
    const result = await authService.resendVerificationEmail(email, baseUrl);

    return NextResponse.json(
      {
        ...result,
        message: "인증 메일을 다시 보냈습니다. 받은 편지함을 확인해주세요.",
      },
      { status: 200 },
    );
  } catch (error) {
    return errorHandler(error);
  }
}
