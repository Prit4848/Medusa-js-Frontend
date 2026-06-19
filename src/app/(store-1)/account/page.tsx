import { Metadata } from "next"
import { retrieveCustomerFresh } from "@lib/data/customer"
import { listOrders } from "@lib/data/orders"
import AccountLayout from "@modules/account/templates/account-layout"
import Overview from "@modules/account/components/overview"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Account",
  description: "Overview of your account.",
}

export default async function AccountPage() {
  const customer = await retrieveCustomerFresh()

  if (!customer) {
    redirect("/login")
  }

  const orders = await listOrders(5)

  return (
    <AccountLayout customer={customer as any}>
      <Overview customer={customer as any} orders={orders} />
    </AccountLayout>
  )
}