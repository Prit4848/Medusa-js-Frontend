import { NextRequest, NextResponse } from "next/server"

const protectedRoutes = ["/account", "/billing", "/wishlist"]
const authRoutes = ["/login", "/register"]

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("_medusa_jwt")?.value
  const { pathname } = req.nextUrl

  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r))
  const isAuthRoute = authRoutes.some((r) => pathname.startsWith(r))

  // Check if token is expired by decoding JWT (no library needed)
  let isValidToken = false
  if (token) {
    try {
      const payload = JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString()
      )
      // exp is in seconds, Date.now() is in milliseconds
      isValidToken = payload.exp * 1000 > Date.now()
    } catch {
      isValidToken = false
    }
  }

  if (isProtected && !isValidToken) {
    // Clear expired cookie and redirect to login
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("redirectTo", pathname)
    const response = NextResponse.redirect(loginUrl)
    if (token && !isValidToken) {
      response.cookies.delete("_medusa_jwt")
    }
    return response
  }

  if (isAuthRoute && isValidToken) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/account/:path*",
    "/billing/:path*",
    "/wishlist",
    "/login",
    "/register",
  ],
}