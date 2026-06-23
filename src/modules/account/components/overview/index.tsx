import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import Link from "next/link"

type OverviewProps = {
  customer: HttpTypes.StoreCustomer | null
  orders: HttpTypes.StoreOrder[] | null
}

export default function Overview({ customer, orders }: OverviewProps) {
  const VISIBLE_RECENT_ORDERS = 5

  return (
    <div className="flex flex-col gap-5">

      {/* Welcome banner */}
      <div className="bg-white border border-gray-100 rounded-xl px-6 py-5">
        <p className="text-xl font-semibold text-gray-900">
          Hello, {customer?.first_name}
        </p>
        <p className="text-sm text-gray-400 mt-1">
          Signed in as {customer?.email}
        </p>
      </div>

      {/* Recent orders */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-900">Recent orders</p>
          <div className="flex items-center gap-3">
            {orders && orders.length > VISIBLE_RECENT_ORDERS && (
              <span className="text-xs text-gray-500">
                Showing {VISIBLE_RECENT_ORDERS} of {orders.length} orders
              </span>
            )}
            {orders && orders.length > 0 && (
              <Link href="/account/orders" className="text-xs text-[#c97a4a] hover:underline">
                View all
              </Link>
            )}
          </div>
        </div>

        {orders && orders.length > 0 ? (
          <div className="px-4 divide-y divide-gray-50">
            {orders.slice(0, VISIBLE_RECENT_ORDERS).map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/details/${order.id}`}
                className="flex items-center gap-4 py-4 hover:bg-gray-50 transition-colors px-2 -mx-2 rounded-lg"
              >
                {/* Icon */}
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#9ca3af" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {order.items?.map((i) => i.title).join(", ")}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {order.items?.reduce((acc, i) => acc + i.quantity, 0)} items
                    · {new Date(order.created_at).toDateString()}
                  </p>
                </div>

                {/* Status + amount */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span
                    className="text-xs px-2.5 py-1 rounded-full capitalize font-medium"
                    style={{
                      background: order.status === "completed" ? "#EAF3DE" : "#FAEEDA",
                      color: order.status === "completed" ? "#3B6D11" : "#854F0B",
                    }}
                  >
                    {order.status}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {convertToLocale({
                      amount:
                        order.summary?.total ??
                        order.total ??
                        order.items?.reduce(
                          (acc, i) => acc + i.unit_price * i.quantity,
                          0
                        ) ??
                        0,
                      currency_code: order.currency_code ?? "USD",
                    })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-300" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="text-sm text-gray-400">No orders yet</p>
            <Link href="/shop" className="text-xs text-[#c97a4a] hover:underline mt-1">
              Start shopping →
            </Link>
          </div>
        )}
      </div>

      {/* Bottom quick links */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/account/addresses"
          className="bg-white border border-gray-100 rounded-xl px-5 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
        >
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "#FAECE7" }}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#993C1D" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Manage addresses</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {customer?.addresses?.length || 0} saved location{(customer?.addresses?.length || 0) !== 1 ? "s" : ""}
            </p>
          </div>
        </Link>

        <Link
          href="/contact"
          className="bg-white border border-gray-100 rounded-xl px-5 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
        >
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "#E1F5EE" }}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#0F6E56" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Need help?</p>
            <p className="text-xs text-gray-400 mt-0.5">Contact support</p>
          </div>
        </Link>
      </div>
    </div>
  )
}