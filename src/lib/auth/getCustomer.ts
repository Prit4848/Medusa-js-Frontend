import { cookies } from "next/headers"
import { AdapterFactory } from "@/middleware/factory/adapter.factory"

export async function getCustomer() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("_medusa_jwt")?.value
    if (!token) return null

    const adapter = AdapterFactory.getAdapter()
    const customer = await adapter.getCustomerWithToken(token)

    // If token exists but customer fetch failed — cookie is expired
    // Clear it so middleware stops treating user as logged in
    if (!customer) {
      cookieStore.delete("_medusa_jwt")
    }

    return customer
  } catch {
    return null
  }
}