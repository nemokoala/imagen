import z from "zod";

export const registerSchema = z.object({
  nickname: z
    .string()
    .min(2, "닉네임은 2자 이상이어야 합니다.")
    .max(50, "닉네임은 50자 이하여야 합니다."),
  email: z
    .string()
    .email("유효한 이메일 주소를 입력해주세요.")
    .min(1, "이메일을 입력해주세요."),
  password: z
    .string()
    .min(6, "비밀번호는 6자 이상이어야 합니다.")
    .max(100, "비밀번호는 100자 이하여야 합니다.")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "비밀번호는 대문자, 소문자, 숫자를 포함해야 합니다."
    ),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("유효한 이메일 주소를 입력해주세요."),
  password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다."),
});

export type LoginFormData = z.infer<typeof loginSchema>;
