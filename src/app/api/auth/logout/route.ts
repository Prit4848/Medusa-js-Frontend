import { NextResponse } from "next/server"

export async function POST() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete("_medusa_jwt")
  response.cookies.delete("_medusa_cart_id")
  return response
}