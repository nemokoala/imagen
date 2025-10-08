import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/services/auth/authService";
import { errorHandler } from "@/lib/errors/errorHandler";

interface CreateUserData {
  email: string;
  password: string;
  nickname: string;
}

export async function POST(req: NextRequest) {
  try {
    const data: CreateUserData = await req.json();

    const user = await authService.register(data);

    return NextResponse.json(
      {
        message: "회원가입이 완료되었습니다.",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("회원가입 에러:", error);
    return errorHandler(error);
  }
}
