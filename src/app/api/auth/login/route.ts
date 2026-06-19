import { NextRequest, NextResponse } from "next/server"
import { AdapterFactory } from "@/middleware/factory/adapter.factory"
import { handleError } from "@/middleware/utils/error-handler"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const adapter = AdapterFactory.getAdapter()
    const { token } = await adapter.loginCustomer(email, password)

    const response = NextResponse.json({ success: true })
    response.cookies.set("_medusa_jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })
    return response
  } catch (error) {
    return handleError(error)
  }
}