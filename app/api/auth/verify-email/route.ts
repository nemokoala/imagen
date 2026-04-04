import { NextRequest, NextResponse } from "next/server";
import { errorHandler } from "@/lib/errors/errorHandler";
import { emailVerificationService } from "@/lib/services/auth/emailVerificationService";

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token") ?? "";
    const user = await emailVerificationService.verifyEmail(token);

    return NextResponse.json(
      {
        message: "이메일 인증이 완료되었습니다. 이제 로그인할 수 있습니다.",
        email: user.email,
      },
      { status: 200 },
    );
  } catch (error) {
    return errorHandler(error);
  }
}
