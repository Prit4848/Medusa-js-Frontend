"use client"

import { useParams, usePathname } from "next/navigation"
import { signout } from "@lib/data/customer"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import {
  IconLayoutDashboard,
  IconUser,
  IconHeart,
  IconShoppingBag,
  IconLogout,
} from "@tabler/icons-react"

const AccountNav = ({
  customer,
}: {
  customer: HttpTypes.StoreCustomer | null
}) => {
  const route = usePathname()
  const { countryCode } = useParams() as { countryCode: string }

  const handleLogout = async () => {
    await signout(countryCode)
  }

  const navItems = [
    {
      href: "/account",
      label: "Overview",
      icon: <IconLayoutDashboard size={18} />,
      exact: true,
    },
    {
      href: "/account/profile",
      label: "Profile",
      icon: <IconUser size={18} />,
      exact: false,
    },
    {
      href: "/wishlist",
      label: "Wishlist",
      icon: <IconHeart size={18} />,
      exact: false,
    },
    {
      href: "/account/orders",
      label: "Orders",
      icon: <IconShoppingBag size={18} />,
      exact: false,
    },
  ]

  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const currentPath = route.split(countryCode)[1] || route

        const isActive = item.exact
          ? currentPath === item.href
          : currentPath.startsWith(item.href)

        return (
          <LocalizedClientLink
            key={item.href}
            href={item.href}
            className={clx(
              "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors duration-150",
              isActive
                ? "bg-[#FAECE7] text-[#993C1D] font-medium"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </LocalizedClientLink>
        )
      })}

      <div className="mt-3 pt-3 border-t border-gray-100">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors duration-150"
          data-testid="logout-button"
        >
          <IconLogout size={18} />
          <span>Log out</span>
        </button>
      </div>
    </nav>
  )
}

export default AccountNav