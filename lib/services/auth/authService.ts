import { hash, compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/errors/AppError";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { User } from "@/lib/generated/prisma";

interface CreateUserData {
  email: string;
  password: string;
  nickname: string;
}

interface LoginDTO {
  email: string;
  password: string;
}

export const authService = {
  async validateRegisterData(data: CreateUserData): Promise<void> {
    const { email, password, nickname } = data;

    if (!email || !password || !nickname) {
      throw new ApiError(
        "이메일, 비밀번호, 닉네임은 필수 입력 항목입니다.",
        400
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ApiError("유효한 이메일 주소를 입력해주세요.", 400);
    }

    if (password.length < 6) {
      throw new ApiError("비밀번호는 최소 6자 이상이어야 합니다.", 400);
    }
  },

  async checkExistingUser(email: string, nickname: string): Promise<void> {
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
  },

  async register(
    data: CreateUserData
  ): Promise<Omit<CreateUserData, "password">> {
    // 데이터 검증
    await this.validateRegisterData(data);

    // 기존 사용자 확인
    await this.checkExistingUser(data.email, data.nickname);

    // 비밀번호 해싱
    const hashedPassword = await hash(data.password, 12);

    // 사용자 생성
    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    // 비밀번호를 제외한 사용자 정보 반환
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async validateLoginData(data: LoginDTO): Promise<void> {
    const { email, password } = data;

    if (!email || !password) {
      throw new ApiError("이메일과 비밀번호는 필수 입력 항목입니다.", 400);
    }
  },

  async checkEmailAndPassword(email: string, password: string): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { email },
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
  },

  async createAccessToken(user: User): Promise<void> {
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
  },

  async findUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  },

  async findUserById(id: number) {
    return await prisma.user.findUnique({
      where: { id },
    });
  },

  async verifyTokenAndGetUserId(token: string): Promise<number> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        userId: number;
      };
      return decoded.userId;
    } catch {
      throw new ApiError("유효하지 않은 토큰입니다.", 401, "INVALID_TOKEN");
    }
  },

  async getUserIdFromCookie(cookieStore: any): Promise<number> {
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      throw new ApiError("액세스 토큰이 없습니다.", 401, "NO_ACCESS_TOKEN");
    }

    return await this.verifyTokenAndGetUserId(accessToken);
  },

  async verifyRefreshToken(refreshToken: string): Promise<{ userId: number }> {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_SECRET as string
      ) as {
        userId: number;
      };
      return decoded;
    } catch {
      throw new ApiError(
        "유효하지 않은 리프레시 토큰입니다.",
        401,
        "INVALID_REFRESH_TOKEN"
      );
    }
  },

  async createNewAccessToken(userId: number): Promise<string> {
    return jwt.sign({ userId }, process.env.JWT_SECRET as string, {
      expiresIn: "15m",
    });
  },

  async refreshAccessToken(refreshToken: string): Promise<string> {
    // 리프레시 토큰 검증
    const decoded = await this.verifyRefreshToken(refreshToken);

    // 사용자 존재 확인
    const user = await this.findUserById(decoded.userId);
    if (!user) {
      throw new ApiError("사용자를 찾을 수 없습니다.", 404, "USER_NOT_FOUND");
    }

    // 새로운 액세스 토큰 생성
    const newAccessToken = await this.createNewAccessToken(user.id);

    // 새로운 액세스 토큰을 쿠키에 설정
    const cookieStore = await cookies();
    cookieStore.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60,
    });

    return newAccessToken;
  },

  async login(
    email: string,
    password: string
  ): Promise<Omit<User, "password">> {
    // 로그인 데이터 검증
    await this.validateLoginData({ email, password });

    // 이메일과 비밀번호 확인
    const user = await this.checkEmailAndPassword(email, password);

    // 액세스 토큰 생성 및 쿠키 설정
    await this.createAccessToken(user);

    // 비밀번호를 제외한 사용자 정보 반환
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async logout(): Promise<void> {
    const cookieStore = await cookies();

    // 쿠키에서 토큰 제거
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
  },
};
