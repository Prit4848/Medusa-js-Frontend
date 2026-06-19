import { Metadata } from "next"
import { retrieveCustomerFresh } from "@lib/data/customer"
import { listOrders } from "@lib/data/orders"
import AccountLayout from "@modules/account/templates/account-layout"
import OrderOverview from "@modules/account/components/order-overview"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Orders",
  description: "Overview of your previous orders.",
}

export default async function OrdersPage() {
  const customer = await retrieveCustomerFresh()

  if (!customer) {
    redirect("/login")
  }

  const orders = await listOrders()

  return (
    <AccountLayout customer={customer as any}>
      <div className="w-full" data-testid="orders-page-wrapper">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Orders</h1>
        </div>
        <div>
          <OrderOverview orders={orders || []} />
        </div>
      </div>
    </AccountLayout>
  )
}