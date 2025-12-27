import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/services/auth/authService";
import { discordService } from "@/lib/services/logs/logService";

interface KakaoTokenResponse {
  access_token: string;
  token_type: string;
  refresh_token?: string;
  expires_in: number;
  scope?: string;
  refresh_token_expires_in?: number;
}

interface KakaoUserInfo {
  id: number;
  kakao_account: {
    email?: string;
    profile?: {
      nickname?: string;
      profile_image_url?: string;
      thumbnail_image_url?: string;
    };
  };
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    // 에러 처리
    if (error) {
      return NextResponse.redirect(
        new URL(
          `/auth/login?error=${encodeURIComponent(
            "카카오 로그인이 취소되었습니다."
          )}`,
          req.url
        )
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL(
          "/auth/login?error=" +
            encodeURIComponent("인증 코드를 받을 수 없습니다."),
          req.url
        )
      );
    }

    const kakaoClientId = process.env.KAKAO_CLIENT_ID;
    const kakaoClientSecret = process.env.KAKAO_CLIENT_SECRET;
    const kakaoRedirectUri = process.env.KAKAO_REDIRECT_URI;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin;

    if (!kakaoClientId || !kakaoClientSecret || !kakaoRedirectUri) {
      return NextResponse.redirect(
        new URL(
          "/auth/login?error=" +
            encodeURIComponent("카카오 OAuth 설정이 완료되지 않았습니다."),
          req.url
        )
      );
    }

    // 1. 카카오 액세스 토큰 받기
    const tokenResponse = await fetch("https://kauth.kakao.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: kakaoClientId,
        client_secret: kakaoClientSecret,
        redirect_uri: kakaoRedirectUri,
        code: code,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error("카카오 토큰 요청 실패:", errorData);
      return NextResponse.redirect(
        new URL(
          "/auth/login?error=" +
            encodeURIComponent("카카오 토큰을 받을 수 없습니다."),
          req.url
        )
      );
    }

    const tokenData: KakaoTokenResponse = await tokenResponse.json();

    // 2. 카카오 사용자 정보 가져오기
    const userInfoResponse = await fetch("https://kapi.kakao.com/v2/user/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userInfoResponse.ok) {
      const errorData = await userInfoResponse.text();
      console.error("카카오 사용자 정보 요청 실패:", errorData);
      return NextResponse.redirect(
        new URL(
          "/auth/login?error=" +
            encodeURIComponent("카카오 사용자 정보를 가져올 수 없습니다."),
          req.url
        )
      );
    }

    const kakaoUserInfo: KakaoUserInfo = await userInfoResponse.json();

    // 3. 카카오 로그인 처리 (사용자 생성 또는 업데이트, 토큰 발급)
    const user = await authService.loginWithKakao({
      kakaoId: kakaoUserInfo.id.toString(),
      email:
        kakaoUserInfo.kakao_account.email ||
        `kakao_${kakaoUserInfo.id}@kakao.com`,
      nickname:
        kakaoUserInfo.kakao_account.profile?.nickname ||
        `카카오사용자_${kakaoUserInfo.id}`,
      profileImageUrl:
        kakaoUserInfo.kakao_account.profile?.profile_image_url || null,
    });

    // Discord 로그 전송 (비동기, 응답 대기 안 함)
    discordService.sendLog(`카카오 로그인 성공: ${JSON.stringify(user)}`);

    // 4. 로그인 성공 시 콜백 페이지로 리다이렉트
    // 쿠키는 authService에서 설정되므로, 프론트엔드에서 사용자 정보를 받을 수 있도록 쿼리 파라미터로 전달
    return NextResponse.redirect(
      new URL(
        `/auth/kakao/callback?kakao_login=success&user_id=${user.id}`,
        baseUrl
      )
    );
  } catch (error) {
    console.error("카카오 로그인 콜백 오류:", error);
    return NextResponse.redirect(
      new URL(
        "/auth/login?error=" +
          encodeURIComponent("카카오 로그인 중 오류가 발생했습니다."),
        req.url
      )
    );
  }
}
