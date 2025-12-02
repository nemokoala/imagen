import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  try {
    const kakaoClientId = process.env.KAKAO_CLIENT_ID;
    const kakaoRedirectUri = process.env.KAKAO_REDIRECT_URI;

    if (!kakaoClientId || !kakaoRedirectUri) {
      return NextResponse.json(
        { error: "카카오 OAuth 설정이 완료되지 않았습니다." },
        { status: 500 }
      );
    }

    // 카카오 OAuth 인증 URL 생성
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoClientId}&redirect_uri=${encodeURIComponent(
      kakaoRedirectUri
    )}&response_type=code`;

    // 카카오 인증 페이지로 리다이렉트
    return NextResponse.redirect(kakaoAuthUrl);
  } catch (error) {
    console.error("카카오 로그인 시작 오류:", error);
    return NextResponse.json(
      { error: "카카오 로그인을 시작할 수 없습니다." },
      { status: 500 }
    );
  }
}
