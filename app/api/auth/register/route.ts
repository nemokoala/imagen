import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/services/auth/authService";
import { errorHandler } from "@/lib/errors/errorHandler";
import { discordService } from "@/lib/services/logs/logService";

interface CreateUserData {
  email: string;
  password: string;
  nickname: string;
}

export async function POST(req: NextRequest) {
  try {
    const data: CreateUserData = await req.json();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin;
    const result = await authService.register(data, baseUrl);

    discordService.sendLog(`register success: ${JSON.stringify(result.user)}`);

    return NextResponse.json(
      {
        message: "회원가입이 완료되었습니다. 인증 메일을 확인해주세요.",
        ...result,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("register error:", error);
    return errorHandler(error);
  }
}
