"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { KakaoLoginButton } from "@/components/auth/KakaoLoginButton";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { loginSchema, type LoginFormData } from "@/schemas/auth";
import { useUserStore } from "@/stores/userStore";
import { Layout } from "@/components/layout/Layout";
import { useLoginMutation } from "@/queries/auth/mutations";
import { FetchUtil } from "@/lib/Fetch.util";
import type { ErrorResponse } from "@/types/common.interfaces";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [errorCode, setErrorCode] = useState<string | undefined>();
  const [isResending, setIsResending] = useState(false);
  const { login } = useUserStore();
  const searchParams = useSearchParams();
  const socialLoginError = searchParams.get("error");

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const emailValue = form.watch("email");

  const { mutate: loginMutation, isPending } = useLoginMutation(
    (data) => {
      setError("");
      setErrorCode(undefined);
      login(data.user);
      toast.success("로그인이 완료되었습니다", {
        description: "환영합니다.",
      });
      router.push("/");
    },
    (loginError: ErrorResponse) => {
      const errorMessage =
        loginError?.message || "로그인 중 오류가 발생했습니다.";

      toast.error("오류 발생", {
        description: errorMessage,
      });
      setError(errorMessage);
      setErrorCode(loginError?.code);
    },
  );

  const onSubmit = (data: LoginFormData) => {
    setError("");
    setErrorCode(undefined);
    loginMutation(data);
  };

  async function handleResendVerification() {
    if (!emailValue) {
      toast.error("이메일을 먼저 입력해주세요.");
      return;
    }

    setIsResending(true);

    try {
      await FetchUtil.post("/api/auth/resend-verification", {
        email: emailValue,
      });

      toast.success("인증 메일을 다시 보냈습니다", {
        description: "받은 편지함을 확인해주세요.",
      });

      router.push(
        `/auth/verify-email?email=${encodeURIComponent(emailValue)}&resent=1`,
      );
    } catch (resendError) {
      const message =
        resendError instanceof Error
          ? resendError.message
          : "인증 메일 재발송에 실패했습니다.";

      toast.error("재발송 실패", {
        description: message,
      });
    } finally {
      setIsResending(false);
    }
  }

  useEffect(() => {
    if (socialLoginError) {
      toast.error("로그인 실패", {
        description: decodeURIComponent(socialLoginError),
      });
    }
  }, [socialLoginError]);

  return (
    <Layout.Content className="flex items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>로그인</CardTitle>
          <CardDescription>
            계정으로 로그인하고 서비스를 이어서 이용해보세요.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이메일</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="example@email.com"
                        disabled={isPending || isResending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="비밀번호"
                        disabled={isPending || isResending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="mt-8 flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isPending || isResending}
                variant="gradient"
              >
                {isPending ? "로그인 중..." : "로그인"}
              </Button>

              {errorCode === "EMAIL_NOT_VERIFIED" && (
                <Button
                  type="button"
                  className="w-full"
                  variant="outline"
                  disabled={isPending || isResending}
                  onClick={handleResendVerification}
                >
                  {isResending ? "재발송 중..." : "인증 메일 다시 보내기"}
                </Button>
              )}

              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    또는
                  </span>
                </div>
              </div>

              <KakaoLoginButton disabled={isPending || isResending} />

              <div className="text-sm text-muted-foreground text-center">
                계정이 없으신가요?{" "}
                <Link
                  href="/auth/register"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  회원가입
                </Link>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </Layout.Content>
  );
}
