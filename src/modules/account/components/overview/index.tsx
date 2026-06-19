import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import Link from "next/link"

type OverviewProps = {
  customer: HttpTypes.StoreCustomer | null
  orders: HttpTypes.StoreOrder[] | null
}

const getProfileCompletion = (customer: HttpTypes.StoreCustomer | null) => {
  if (!customer) return 0
  let count = 0
  if (customer.first_name && customer.last_name) count++
  if (customer.phone) count++
  if (customer.addresses && customer.addresses.length > 0) count++
  return Math.round((count / 3) * 100)
}

export default function Overview({ customer, orders }: OverviewProps) {
  const completion = getProfileCompletion(customer)

  return (
    <div className="flex flex-col gap-5">

      {/* Welcome banner */}
      <div className="bg-white border border-gray-100 rounded-xl px-6 py-5">
        <p className="text-xl font-semibold text-gray-900">
          Hello, {customer?.first_name}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {/* Profile completion */}
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-2">
            Profile
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-semibold text-gray-900">
              {completion}%
            </span>
            <span className="text-xs text-gray-400">completed</span>
          </div>
          <div className="mt-3 h-1 bg-gray-200 rounded-full">
            <div
              className="h-full bg-[#c97a4a] rounded-full transition-all"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>

        {/* Addresses */}
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-2">
            Addresses
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-semibold text-gray-900">
              {customer?.addresses?.length || 0}
            </span>
            <span className="text-xs text-gray-400">saved</span>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-2">
            Orders
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-semibold text-gray-900">
              {orders?.length || 0}
            </span>
            <span className="text-xs text-gray-400">total</span>
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white border border-gray-100 rounded-xl px-6 py-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-gray-900">Recent orders</p>
          {orders && orders.length > 0 && (
            <Link
              href="/account/orders"
              className="text-xs text-[#c97a4a] hover:underline"
            >
              View all
            </Link>
          )}
        </div>

        {orders && orders.length > 0 ? (
          <div className="flex flex-col gap-2">
            {orders.slice(0, 5).map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/details/${order.id}`}
                className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                    {order.items?.map((i) => i.title).join(", ")}
                  </span>
                  <span className="text-xs text-gray-400">
                    {order.items?.reduce((acc, i) => acc + i.quantity, 0)} items
                    • {new Date(order.created_at).toDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="text-xs px-2 py-1 rounded-md capitalize"
                    style={{
                      background:
                        order.status === "completed" ? "#EAF3DE" : "#FAECE7",
                      color:
                        order.status === "completed" ? "#3B6D11" : "#993C1D",
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
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-300" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="text-sm text-gray-400">No orders yet</p>
            <Link
              href="/shop"
              className="text-xs text-[#c97a4a] hover:underline mt-1"
            >
              Start shopping →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}