import { hash, compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/errors/AppError";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { User } from "@/lib/generated/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

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

  async getUserIdFromCookie(
    cookieStore: Awaited<ReturnType<typeof cookies>>
  ): Promise<number> {
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

  async saveProfileImageToFileSystem(
    file: File,
    userId: number
  ): Promise<string> {
    try {
      // File 객체에서 ArrayBuffer로 변환
      const arrayBuffer = await file.arrayBuffer();
      const imageBuffer = Buffer.from(arrayBuffer);

      // 파일 확장자 추출 (원본 파일의 확장자 사용)
      const fileExtension = file.name.split(".").pop()?.toLowerCase() || "png";

      // 지원되는 이미지 형식인지 확인
      const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
      if (!allowedExtensions.includes(fileExtension)) {
        throw new ApiError(
          "지원되지 않는 이미지 형식입니다. (jpg, jpeg, png, gif, webp만 지원)",
          400
        );
      }

      // 파일 크기 확인 (5MB 제한)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new ApiError("파일 크기는 5MB를 초과할 수 없습니다.", 400);
      }

      // 프로필 이미지 저장할 디렉토리 생성
      const uploadDir = join(
        process.cwd(),
        "uploads",
        "profiles",
        userId.toString()
      );
      await mkdir(uploadDir, { recursive: true });

      // 파일명 생성 (timestamp + random string + 원본 확장자)
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileName = `profile_${timestamp}_${randomString}.${fileExtension}`;
      const filePath = join(uploadDir, fileName);

      // 파일 저장
      await writeFile(filePath, imageBuffer);

      // API 라우트를 통한 접근 경로 반환
      return `/api/uploads/profiles/${userId}/${fileName}`;
    } catch (error) {
      console.error("Error saving profile image to file system:", error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("프로필 이미지 파일 저장에 실패했습니다.", 500);
    }
  },

  async getCreditById(userId: number): Promise<{ credits: number }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        credits: true,
      },
    });
    if (!user) {
      throw new ApiError("사용자를 찾을 수 없습니다.", 404, "USER_NOT_FOUND");
    }
    return user;
  },

  async updateUserCredit(userId: number, amount: number): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { credits: { increment: amount } },
    });
  },

  async getUserInfoById(userId: number): Promise<Omit<User, "password">> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new ApiError("사용자를 찾을 수 없습니다.", 400, "USER_NOT_FOUND");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
};
