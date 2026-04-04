import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Cookies
  const dataCookie = req.cookies.get("userdata-tina-user");
  const isLoggedIn = !!dataCookie;

  const statusCookie = req.cookies.get("userstatus-tina-user");
  const status = statusCookie ? statusCookie.value.toLowerCase() : "free";

  // Only ACTIVE premium users
  const isPremium = status !== "free";

  const isAuthRoute = pathname.startsWith("/auth");

  // ==============================
  // 1. NOT LOGGED IN USER
  // ==============================
  if (!isLoggedIn) {
    // Block protected routes
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/premium")) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // Allow "/", "/auth"
    return NextResponse.next();
  }

  // ==============================
  // 2. LOGGED IN USER
  // ==============================

  // Prevent access to "/auth"
  if (isAuthRoute) {
    return NextResponse.redirect(
      new URL(isPremium ? "/premium" : "/", req.url),
    );
  }

  // Handle Root "/"
  if (pathname === "/") {
    // If premium, go to premium home, else stay on landing page
    if (isPremium) {
      return NextResponse.redirect(new URL("/premium", req.url));
    }
    return NextResponse.next();
  }

  // ==============================
  // 3. DASHBOARD ACCESS
  // ==============================
  if (pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  // ==============================
  // 4. PREMIUM ACCESS
  // ==============================
  if (pathname.startsWith("/premium")) {
    // Block non-premium users from /premium routes
    if (!isPremium) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/auth/:path*", "/dashboard/:path*", "/premium/:path*"],
};
