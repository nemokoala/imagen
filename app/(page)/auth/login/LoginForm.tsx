"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import Link from "next/link";
import { loginSchema, type LoginFormData } from "@/schemas/auth";
import { toast } from "sonner";
import { useUserStore } from "@/stores/userStore";
import { Layout } from "@/components/layout/Layout";
import { useLoginMutation } from "@/queries/auth/mutations";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const { login } = useUserStore();
  const searchParams = useSearchParams();
  const socialLoginError = searchParams.get("error");

  const { mutate: loginMutation, isPending } = useLoginMutation(
    (data) => {
      login(data.user);
      // 로그인 성공 시 토스트 메시지 표시
      toast.success("로그인이 완료되었습니다!", {
        description: "환영합니다!",
      });

      // 잠시 후 메인 페이지로 이동
      setTimeout(() => {
        router.push("/");
      }, 100);
    },
    (error) => {
      const errorMessage = error?.message || "로그인 중 오류가 발생했습니다.";

      toast.error("오류 발생", {
        description: errorMessage,
      });
      setError(errorMessage);
    }
  );

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setError("");
    loginMutation(data);
  };

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
            계정에 로그인하여 서비스를 이용해보세요.
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
                        disabled={isPending}
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
                      <Input
                        type="password"
                        placeholder="••••••"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 mt-8">
              <Button
                type="submit"
                className="w-full"
                disabled={isPending}
                variant="gradient"
              >
                {isPending ? "로그인 중..." : "로그인"}
              </Button>

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

              <Button
                type="button"
                onClick={() => {
                  window.location.href = "/api/auth/kakao";
                }}
                className="w-full bg-[#FEE500] text-[#000000] hover:bg-[#FEE500]/90"
                disabled={isPending}
              >
                <svg
                  className="mr-2 h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z" />
                </svg>
                카카오로 로그인
              </Button>

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
