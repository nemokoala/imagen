import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/errors/AppError";

interface RegisterData {
  email: string;
  password: string;
  nickname: string;
}

export async function validateRegisterData(data: RegisterData) {
  const { email, password, nickname } = data;

  if (!email || !password || !nickname) {
    throw new ApiError("이메일, 비밀번호, 닉네임은 필수 입력 항목입니다.", 400);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError("유효한 이메일 주소를 입력해주세요.", 400);
  }

  if (password.length < 6) {
    throw new ApiError("비밀번호는 최소 6자 이상이어야 합니다.", 400);
  }
}

export async function checkExistingUser(email: string, nickname: string) {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ApiError("이미 사용 중인 이메일입니다.", 409);
  }

  const existingNickname = await prisma.user.findFirst({
    where: { nickname },
  });

  if (existingNickname) {
    throw new ApiError("이미 사용 중인 닉네임입니다.", 409);
  }
}

export async function createUser(data: RegisterData) {
  const { email, password, nickname } = data;
  const hashedPassword = await hash(password, 12);

  return await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      nickname,
    },
  });
}
