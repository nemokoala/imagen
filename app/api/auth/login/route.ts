import { errorHandler } from "@/lib/errors/errorHandler";
import {
  checkEmailAndPassword,
  createAccessToken,
  createLoginAttempt,
} from "@/lib/services/auth/login";
import { validateLoginData } from "@/lib/services/auth/login";
import { ApiError } from "@/lib/errors/AppError";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  try {
    await validateLoginData({ email, password });
    const user = await checkEmailAndPassword(email, password);
    await createAccessToken(user);

    return NextResponse.json(
      {
        message: "로그인 성공!",
      },
      { status: 200 }
    );
  } catch (error) {
    if (
      error instanceof ApiError &&
      (error as ApiError).code === "INVALID_PASSWORD"
    ) {
      createLoginAttempt(email, req);
    }
    console.error("로그인 에러:", error);
    return errorHandler(error);
  }
}
