import { NextResponse } from "next/server";
import { errorHandler } from "@/lib/errors/errorHandler";
import {
  validateRegisterData,
  checkExistingUser,
  createUser,
} from "@/lib/services/auth/register";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    await validateRegisterData(data);
    await checkExistingUser(data.email, data.nickname);
    await createUser(data);

    return NextResponse.json(
      {
        message: "회원가입이 완료되었습니다.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("회원가입 에러:", error);
    return errorHandler(error);
  }
}
