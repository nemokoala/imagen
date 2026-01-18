"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useUserStore } from "@/stores/userStore";
import { useGetUserInfo } from "@/queries/auth/queries";
import { Layout } from "@/components/layout/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Suspense } from "react";

function KakaoCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useUserStore();
  const kakaoLogin = searchParams.get("kakao_login");
  const error = searchParams.get("error");

  const { data: userInfo } = useGetUserInfo({
    enabled: kakaoLogin === "success" && !error,
  });

  useEffect(() => {
    // 에러가 있는 경우
    if (error) {
      toast.error("로그인 실패", {
        description: decodeURIComponent(error),
      });
      setTimeout(() => {
        router.replace("/auth/login");
      }, 2000);
      return;
    }

    // 성공한 경우
    if (kakaoLogin === "success" && userInfo) {
      setUser(userInfo);
      toast.success("카카오 로그인이 완료되었습니다!", {
        description: "환영합니다!",
      });
      setTimeout(() => {
        router.replace("/");
      }, 500);
    }
  }, [kakaoLogin, userInfo, error, setUser, router]);

  // 에러 표시
  if (error) {
    return (
      <Layout.Content className="flex items-center justify-center">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>로그인 실패</CardTitle>
            <CardDescription>
              카카오 로그인 중 오류가 발생했습니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertDescription>{decodeURIComponent(error)}</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </Layout.Content>
    );
  }

  // 로딩 중
  return (
    <Layout.Content className="flex items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>로그인 처리 중...</CardTitle>
          <CardDescription>
            카카오 로그인을 처리하고 있습니다. 잠시만 기다려주세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    </Layout.Content>
  );
}

export default function KakaoCallbackPage() {
  return (
    <Suspense
      fallback={
        <Layout.Content className="flex items-center justify-center">
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>로그인 처리 중...</CardTitle>
              <CardDescription>
                카카오 로그인을 처리하고 있습니다. 잠시만 기다려주세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            </CardContent>
          </Card>
        </Layout.Content>
      }
    >
      <KakaoCallbackContent />
    </Suspense>
  );
}
