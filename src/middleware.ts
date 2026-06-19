import { NextRequest, NextResponse } from "next/server"

const protectedRoutes = ["/account", "/billing", "/wishlist"]
const authRoutes = ["/login", "/register"]

export function middleware(req: NextRequest) {
  const token = req.cookies.get("_medusa_jwt")?.value
  const { pathname } = req.nextUrl

  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r))
  const isAuthRoute = authRoutes.some((r) => pathname.startsWith(r))

  if (isProtected && !token) {
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("redirectTo", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/account/:path*",
    "/billing/:path*",
    "/login",
    "/register",
    "/wishlist",
  ],
}