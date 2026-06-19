import { NextRequest, NextResponse } from "next/server"
import { AdapterFactory } from "@/middleware/factory/adapter.factory"
import { handleError } from "@/middleware/utils/error-handler"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("_medusa_jwt")?.value
    if (!token) return NextResponse.json({ customer: null })

    const adapter = AdapterFactory.getAdapter()
    const customer = await adapter.getCustomerWithToken(token)
    return NextResponse.json({ customer })
  } catch (error) {
    return handleError(error)
  }
}