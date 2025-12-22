import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const cookie = req.cookies.get("tinashaii_user");
  const isLoggedIn = !!cookie;

  if (
    isLoggedIn &&
    (pathname.startsWith("/auth/login") || pathname.startsWith("/auth/signup"))
  ) {
    const url = req.nextUrl.clone();

    url.pathname = "/";

    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/auth/:path*"],
};
