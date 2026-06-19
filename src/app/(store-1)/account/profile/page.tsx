import { Metadata } from "next"
import { retrieveCustomerFresh } from "@lib/data/customer"
import AccountLayout from "@modules/account/templates/account-layout"
import ProfileName from "@modules/account/components/profile-name"
import ProfileEmail from "@modules/account/components/profile-email"
import ProfilePhone from "@modules/account/components/profile-phone"
import ProfilePassword from "@modules/account/components/profile-password"
import { notFound, redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Profile",
  description: "View and edit your profile info.",
}

export default async function ProfilePage() {
  const customer = await retrieveCustomerFresh()

  if (!customer) {
    redirect("/login")
  }

  return (
    <AccountLayout customer={customer as any}>
      <div className="w-full" data-testid="profile-page-wrapper">
        <div className="mb-8 flex flex-col gap-y-4">
          <h1 className="text-2xl-semi">Profile</h1>
          <p className="text-base-regular">
            View and update your profile information, including your name, email,
            and phone number. You can also update your password.
          </p>
        </div>
        <div className="flex flex-col gap-y-8 w-full">
          <ProfileName customer={customer as any} />
          <Divider />
          <ProfileEmail customer={customer as any} />
          <Divider />
          <ProfilePhone customer={customer as any} />
        </div>
      </div>
    </AccountLayout>
  )
}

const Divider = () => <div className="w-full h-px bg-gray-200" />
