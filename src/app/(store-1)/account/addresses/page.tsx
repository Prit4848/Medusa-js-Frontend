import { Metadata } from "next"
import { retrieveCustomerFresh } from "@lib/data/customer"
import { getRegion } from "@lib/data/regions"
import AccountLayout from "@modules/account/templates/account-layout"
import AddressBook from "@modules/account/components/address-book"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Addresses",
  description: "View and edit your addresses.",
}

export default async function AddressesPage() {
  const customer = await retrieveCustomerFresh()
  const region = await getRegion(
    process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"
  )

  if (!customer || !region) {
    redirect("/login")
  }

  return (
    <AccountLayout customer={customer as any}>
      <div className="w-full" data-testid="addresses-page-wrapper">
        <div className="mb-8 flex flex-col gap-y-4">
          <h1 className="text-2xl-semi">Shipping Addresses</h1>
          <p className="text-base-regular">
            View and update your shipping addresses, you can add as many as you
            like. Saving your addresses will make them available during
            checkout.
          </p>
        </div>
        <AddressBook customer={customer as any} region={region as any} />
      </div>
    </AccountLayout>
  )
}