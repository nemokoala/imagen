"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FetchUtil } from "@/lib/Fetch.util";
import type {
  ResendVerificationResponse,
  VerifyEmailResponse,
} from "@/types/auth.interfaces";
import type { ErrorResponse } from "@/types/common.interfaces";

type VerifyStatus = "sent" | "verifying" | "verified" | "error";

export default function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const sent = searchParams.get("sent");
  const resent = searchParams.get("resent");

  const [status, setStatus] = useState<VerifyStatus>(
    token ? "verifying" : "sent",
  );
  const [message, setMessage] = useState(
    token
      ? "이메일 인증을 처리하고 있습니다."
      : resent
        ? "인증 메일을 다시 보냈습니다. 받은 편지함을 확인해주세요."
        : sent
          ? "인증 메일을 보냈습니다. 받은 편지함을 확인해주세요."
          : "이메일 인증을 진행해주세요.",
  );
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("sent");
      return;
    }

    const currentToken = token;
    let isMounted = true;

    async function verifyEmail() {
      try {
        const responseData = (await FetchUtil.get(
          `/api/auth/verify-email?token=${encodeURIComponent(currentToken)}`,
        )) as VerifyEmailResponse & ErrorResponse;

        if (!isMounted) {
          return;
        }

        setStatus("verified");
        setMessage(responseData.message);
        toast.success("이메일 인증 완료", {
          description: "이제 로그인할 수 있습니다.",
        });
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const errorMessage =
          error instanceof Error
            ? error.message
            : "이메일 인증에 실패했습니다.";

        setStatus("error");
        setMessage(errorMessage);
      }
    }

    verifyEmail();

    return () => {
      isMounted = false;
    };
  }, [token]);

  async function handleResend() {
    if (!email) {
      toast.error("재발송할 이메일 주소가 없습니다.");
      return;
    }

    setIsResending(true);

    try {
      const responseData = (await FetchUtil.post(
        "/api/auth/resend-verification",
        { email },
      )) as ResendVerificationResponse & ErrorResponse;

      setStatus("sent");
      setMessage(responseData.message);

      toast.success("인증 메일을 다시 보냈습니다", {
        description: "받은 편지함을 확인해주세요.",
      });

      router.replace(
        `/auth/verify-email?email=${encodeURIComponent(email)}&resent=1`,
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "인증 메일 재발송에 실패했습니다.";

      toast.error("재발송 실패", {
        description: errorMessage,
      });
    } finally {
      setIsResending(false);
    }
  }

  return (
    <Layout.Content className="flex items-center justify-center">
      <Card className="w-[380px]">
        <CardHeader>
          <CardTitle>
            {status === "verified" ? "이메일 인증 완료" : "이메일 인증"}
          </CardTitle>
          <CardDescription>
            {email
              ? `${email} 주소에 대한 인증을 진행합니다.`
              : "회원가입에 사용한 이메일 주소를 인증해주세요."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant={status === "error" ? "destructive" : "default"}>
            <AlertDescription>{message}</AlertDescription>
          </Alert>

          {status === "verifying" && (
            <div className="flex items-center justify-center py-4">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          {status !== "verified" && email && (
            <Button
              type="button"
              className="w-full"
              variant="gradient"
              disabled={isResending || status === "verifying"}
              onClick={handleResend}
            >
              {isResending ? "재발송 중..." : "인증 메일 다시 보내기"}
            </Button>
          )}

          {status === "verified" ? (
            <Button asChild className="w-full" variant="gradient">
              <Link href="/auth/login">로그인하러 가기</Link>
            </Button>
          ) : (
            <Button asChild className="w-full" variant="outline">
              <Link href="/auth/login">로그인 페이지로 이동</Link>
            </Button>
          )}

          <Button asChild className="w-full" variant="ghost">
            <Link href="/auth/register">회원가입으로 돌아가기</Link>
          </Button>
        </CardFooter>
      </Card>
    </Layout.Content>
  );
}
