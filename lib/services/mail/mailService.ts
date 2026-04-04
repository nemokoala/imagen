import nodemailer from "nodemailer";
import { ApiError } from "@/lib/errors/AppError";

interface VerificationEmailInput {
  to: string;
  nickname: string;
  verificationUrl: string;
}

let cachedTransporter: nodemailer.Transporter | null = null;

function getMailConfig() {
  return {
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT ?? 465),
    secure: process.env.MAIL_SECURE !== "false",
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
    from: process.env.MAIL_FROM || process.env.MAIL_USER,
  };
}

function hasMailConfig() {
  const { host, port, user, password, from } = getMailConfig();
  return Boolean(host && port && user && password && from);
}

function getTransporter() {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  const { host, port, secure, user, password } = getMailConfig();

  if (!host || !user || !password) {
    throw new ApiError(
      "메일 서버 설정이 완료되지 않았습니다.",
      500,
      "MAIL_NOT_CONFIGURED",
    );
  }

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass: password,
    },
  });

  return cachedTransporter;
}

function buildVerificationEmailHtml({
  nickname,
  verificationUrl,
}: VerificationEmailInput) {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827; padding: 24px;">
      <h1 style="font-size: 24px; margin-bottom: 16px;">ImageGen 이메일 인증</h1>
      <p style="margin-bottom: 12px;">${nickname}님, 안녕하세요.</p>
      <p style="margin-bottom: 24px;">
        아래 버튼을 눌러 회원가입에 사용한 이메일 주소를 인증해주세요.
      </p>
      <a
        href="${verificationUrl}"
        style="display: inline-block; padding: 12px 20px; border-radius: 9999px; background: linear-gradient(90deg, #4f46e5, #2563eb); color: #ffffff; text-decoration: none; font-weight: 700;"
      >
        이메일 인증하기
      </a>
      <p style="margin-top: 24px; font-size: 14px; color: #4b5563;">
        버튼이 열리지 않으면 아래 링크를 브라우저에 붙여넣어 주세요.
      </p>
      <p style="word-break: break-all; font-size: 14px; color: #2563eb;">
        ${verificationUrl}
      </p>
      <p style="margin-top: 24px; font-size: 14px; color: #6b7280;">
        이 링크는 24시간 동안 유효합니다.
      </p>
    </div>
  `;
}

function buildVerificationEmailText({
  nickname,
  verificationUrl,
}: VerificationEmailInput) {
  return [
    `${nickname}님, 안녕하세요.`,
    "",
    "아래 링크를 열어 이메일 인증을 완료해주세요.",
    verificationUrl,
    "",
    "이 링크는 24시간 동안 유효합니다.",
  ].join("\n");
}

export const mailService = {
  async sendVerificationEmail(
    input: VerificationEmailInput,
  ): Promise<void> {
    if (!hasMailConfig()) {
      throw new ApiError(
        "메일 서버 설정이 완료되지 않았습니다.",
        500,
        "MAIL_NOT_CONFIGURED",
      );
    }

    try {
      const transporter = getTransporter();
      const { from } = getMailConfig();

      await transporter.sendMail({
        from,
        to: input.to,
        subject: "[ImageGen] 이메일 인증을 완료해주세요",
        html: buildVerificationEmailHtml(input),
        text: buildVerificationEmailText(input),
      });
    } catch (error) {
      console.error("Failed to send verification email:", error);

      throw new ApiError(
        "인증 메일 전송에 실패했습니다. 메일 설정을 확인해주세요.",
        500,
        "MAIL_SEND_FAILED",
      );
    }
  },
};
