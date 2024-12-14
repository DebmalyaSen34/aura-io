import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const token = request.cookies.get("auth_token")?.value;

  if (token) {
    if (
      request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/"
    ) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
  } else {
    if (
      request.nextUrl.pathname !== "/login" &&
      request.nextUrl.pathname !== "/"
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/protected/:path*",
    "/home",
    "/login",
    "/",
    "/user/:path*",
  ],
};
