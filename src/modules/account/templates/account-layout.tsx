import React from "react"
import { HttpTypes } from "@medusajs/types"
import AccountNav from "../components/account-nav"
import Link from "next/link"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({ customer, children }) => {
  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-[220px_1fr] gap-6 items-start">

          {/* Sidebar */}
          <div className="bg-white border border-gray-100 rounded-xl p-4 sticky top-24">
            {/* Avatar + name */}
            {customer && (
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
                  style={{ background: "#FAECE7", color: "#993C1D" }}
                >
                  {customer.first_name?.[0]}{customer.last_name?.[0]}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {customer.first_name} {customer.last_name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{customer.email}</p>
                </div>
              </div>
            )}

            {customer && <AccountNav customer={customer} />}
          </div>

          {/* Main content */}
          <div>{children}</div>
        </div>

        {/* Footer strip */}
        <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-gray-900">Got questions?</p>
          </div>
          <Link
            href="/contact"
            className="text-sm text-[#c97a4a] hover:underline"
          >
            Contact Us →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout