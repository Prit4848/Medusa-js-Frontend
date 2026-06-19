import { NextRequest, NextResponse } from "next/server"
import { AdapterFactory } from "@/middleware/factory/adapter.factory"
import { handleError } from "@/middleware/utils/error-handler"

export async function POST(request: NextRequest) {
  try {
    const { email, password, first_name, last_name } = await request.json()
    if (!email || !password || !first_name || !last_name) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const adapter = AdapterFactory.getAdapter()
    const { token, customer } = await adapter.registerCustomer({ email, password, first_name, last_name })

    const response = NextResponse.json({ success: true, customer })
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