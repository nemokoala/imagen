import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { User } from "@/lib/generated/prisma";
import { ApiError } from "@/lib/errors/AppError";
import { mailService } from "@/lib/services/mail/mailService";

const EMAIL_VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000;

export interface VerificationDispatchResult {
  email: string;
}

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function buildVerificationUrl(baseUrl: string, token: string) {
  return new URL(`/auth/verify-email?token=${token}`, baseUrl).toString();
}

export const emailVerificationService = {
  async createVerificationToken(userId: number) {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + EMAIL_VERIFICATION_TTL_MS);

    await prisma.emailVerificationToken.deleteMany({
      where: { userId },
    });

    await prisma.emailVerificationToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
      },
    });

    return {
      rawToken,
      expiresAt,
    };
  },

  async sendVerificationEmail(
    user: Pick<User, "id" | "email" | "nickname">,
    baseUrl: string,
  ): Promise<VerificationDispatchResult> {
    const { rawToken } = await this.createVerificationToken(user.id);
    const verificationUrl = buildVerificationUrl(baseUrl, rawToken);

    await mailService.sendVerificationEmail({
      to: user.email,
      nickname: user.nickname,
      verificationUrl,
    });

    return {
      email: user.email,
    };
  },

  async verifyEmail(token: string) {
    if (!token) {
      throw new ApiError(
        "이메일 인증 토큰이 없습니다.",
        400,
        "EMAIL_VERIFICATION_TOKEN_REQUIRED",
      );
    }

    const tokenHash = hashToken(token);
    const verificationToken = await prisma.emailVerificationToken.findUnique({
      where: { tokenHash },
      include: {
        user: true,
      },
    });

    if (!verificationToken) {
      throw new ApiError(
        "유효하지 않은 이메일 인증 링크입니다.",
        400,
        "INVALID_EMAIL_VERIFICATION_TOKEN",
      );
    }

    if (verificationToken.expiresAt < new Date()) {
      await prisma.emailVerificationToken.delete({
        where: { id: verificationToken.id },
      });

      throw new ApiError(
        "이메일 인증 링크가 만료되었습니다. 다시 인증 메일을 요청해주세요.",
        400,
        "EXPIRED_EMAIL_VERIFICATION_TOKEN",
      );
    }

    if (!verificationToken.user.emailVerified) {
      await prisma.user.update({
        where: { id: verificationToken.user.id },
        data: {
          emailVerified: true,
          emailVerifiedAt: new Date(),
        },
      });
    }

    await prisma.emailVerificationToken.deleteMany({
      where: { userId: verificationToken.user.id },
    });

    return {
      id: verificationToken.user.id,
      email: verificationToken.user.email,
      nickname: verificationToken.user.nickname,
    };
  },
};
