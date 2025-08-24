import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/errors/AppError";
import { compare } from "bcryptjs";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { User } from "@/lib/generated/prisma";

interface LoginDTO {
  email: string;
  password: string;
}

export async function validateLoginData(data: LoginDTO) {
  const { email, password } = data;

  if (!email || !password) {
    throw new ApiError("이메일과 비밀번호는 필수 입력 항목입니다.", 400);
  }
}

export async function checkEmailAndPassword(email: string, password: string) {
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    throw new ApiError("존재하지 않는 이메일입니다.", 400);
  }

  const isPasswordValid = await compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(
      "비밀번호가 일치하지 않습니다.",
      400,
      "INVALID_PASSWORD"
    );
  }

  return user;
}

export async function createLoginAttempt(
  email: string,
  req: Request
): Promise<void> {
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    throw new ApiError("존재하지 않는 이메일입니다.", 400);
  }

  await prisma.loginAttempt.create({
    data: {
      userId: user.id,
      userAgent: req.headers.get("user-agent") || "unknown",
      failedAt: new Date(),
      ipAddress:
        req.headers.get("x-forwarded-for") ||
        req.headers.get("x-real-ip") ||
        "unknown",
    },
  });
}

export async function createAccessToken(user: User): Promise<void> {
  const accessToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET as string,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );

  const cookieStore = await cookies();
  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60,
  });

  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
  });
}
