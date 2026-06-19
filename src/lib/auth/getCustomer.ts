import { cookies } from "next/headers"
import { AdapterFactory } from "@/middleware/factory/adapter.factory"

export async function getCustomer() {
  const cookieStore = await cookies()
  const token = cookieStore.get("_medusa_jwt")?.value
  if (!token) return null

  try {
    const adapter = AdapterFactory.getAdapter()
    return await adapter.getCustomerWithToken(token)
  } catch {
    return null
  }
}