import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host");

  // www가 붙어있으면 non-www로 리다이렉트
  if (host && host.startsWith("www.")) {
    const url = request.nextUrl.clone();
    url.host = host.replace(/^www\./, "");
    return NextResponse.redirect(url, 301);
  }

  const accessToken = request.cookies.get("accessToken");
  const refreshToken = request.cookies.get("refreshToken");
  const notLogin = !accessToken && !refreshToken;
  const notLoginDeniedPath = ["/image-gen", "/profile"];

  if (notLogin) {
    if (notLoginDeniedPath.includes(pathname)) {
      return NextResponse.redirect(new URL("/?needLogin=true", request.url));
    }
  }

  if (
    pathname.startsWith("/auth") &&
    !pathname.includes("callback") &&
    !notLogin
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * Note: API routes are now included for CORS handling
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|public).*)",
  ],
};
