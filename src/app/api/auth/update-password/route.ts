import { NextRequest, NextResponse } from "next/server"

const BACKEND = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
const PUB_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!

export async function POST(request: NextRequest) {
  try {
    const { email, old_password, new_password } = await request.json()

    if (!email || !old_password || !new_password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    // Step 1 — verify old password + get fresh token
    const loginRes = await fetch(`${BACKEND}/auth/customer/emailpass`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": PUB_KEY,
      },
      body: JSON.stringify({ email, password: old_password }),
    })

    if (!loginRes.ok) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 401 }
      )
    }

    const { token: freshToken } = await loginRes.json()

    console.log("Fresh token from login:", freshToken ? "exists" : "missing")

    // Step 2 — update password using the FRESH token from step 1
    const updateRes = await fetch(
      `${BACKEND}/auth/customer/emailpass/update`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": PUB_KEY,
          Authorization: `Bearer ${freshToken}`,
        },
        body: JSON.stringify({ password: new_password }),
      }
    )

    const updateBody = await updateRes.json()
    console.log("UPDATE STATUS:", updateRes.status, "BODY:", updateBody)

    if (!updateRes.ok) {
      return NextResponse.json(
        { error: updateBody?.message || "Failed to update password" },
        { status: 400 }
      )
    }

    // Step 3 — re-login with new password to get updated token
    const reLoginRes = await fetch(`${BACKEND}/auth/customer/emailpass`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": PUB_KEY,
      },
      body: JSON.stringify({ email, password: new_password }),
    })

    const response = NextResponse.json({ success: true })

    if (reLoginRes.ok) {
      const { token: newToken } = await reLoginRes.json()
      response.cookies.set("_medusa_jwt", newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      })
    }

    return response
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "An unexpected error occurred" },
      { status: 500 }
    )
  }
}