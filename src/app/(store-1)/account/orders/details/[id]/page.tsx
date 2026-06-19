import { sdk } from "@lib/config"
import { getAuthHeaders } from "@lib/data/cookies"
import { retrieveCustomerFresh } from "@lib/data/customer"
import { HttpTypes } from "@medusajs/types"
import AccountLayout from "@modules/account/templates/account-layout"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"

async function getOrder(id: string) {
  const headers = await getAuthHeaders()
  try {
    const { order } = await sdk.client.fetch<{ order: HttpTypes.StoreOrder }>(
      `/store/orders/${id}`,
      {
        method: "GET",
        query: {
          fields:
            "*items,*items.variant,*items.product,*shipping_address,*billing_address,*payment_collections",
        },
        headers,
        cache: "no-store",
      }
    )
    return order
  } catch {
    return null
  }
}

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const customer = await retrieveCustomerFresh()
  if (!customer) redirect("/login")

  const order = await getOrder(params.id)
  if (!order) return notFound()

  const subtotal = order.item_subtotal ?? 0
  const shipping = order.shipping_total ?? 0
  const tax = order.tax_total ?? 0
  const total = order.total ?? 0

  const statusColor =
    {
      completed: { bg: "#EAF3DE", text: "#3B6D11" },
      pending: { bg: "#FAEEDA", text: "#854F0B" },
      cancelled: { bg: "#FCEBEB", text: "#A32D2D" },
    }[order.status] ?? { bg: "#F1EFE8", text: "#5F5E5A" }

  return (
    <AccountLayout customer={customer as any}>
      <div className="flex flex-col gap-5">

        {/* Header */}
        <div className="bg-white border border-gray-100 rounded-xl px-6 py-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <Link
                href="/account/orders"
                className="text-xs text-gray-400 hover:text-gray-600 mb-1 inline-block"
              >
                Back to orders
              </Link>
              <p className="text-xs text-gray-400 mt-0.5">
                Placed on {new Date(order.created_at).toDateString()}
              </p>
            </div>
            <span
              className="text-xs font-medium px-3 py-1 rounded-full capitalize"
              style={{ background: statusColor.bg, color: statusColor.text }}
            >
              {order.status}
            </span>
          </div>
        </div>

        {/* Items */}
        <div className="bg-white border border-gray-100 rounded-xl px-6 py-5">
          <p className="text-sm font-semibold text-gray-900 mb-4">Items</p>
          <div className="flex flex-col gap-4">
            {order.items?.map((item: any) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                  {item.thumbnail && (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.product_title || item.title}
                  </p>
                  <p className="text-xs text-gray-400">
                    {item.variant_title} × {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-semibold text-gray-900 flex-shrink-0">
                  ${(item.unit_price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Summary + Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-100 rounded-xl px-6 py-5">
            <p className="text-sm font-semibold text-gray-900 mb-4">Summary</p>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-100 mt-2 pt-3 flex justify-between font-semibold text-gray-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {order.shipping_address && (
            <div className="bg-white border border-gray-100 rounded-xl px-6 py-5">
              <p className="text-sm font-semibold text-gray-900 mb-4">
                Shipping address
              </p>
              <div className="text-sm text-gray-500 flex flex-col gap-1">
                <p>
                  {order.shipping_address.first_name}{" "}
                  {order.shipping_address.last_name}
                </p>
                <p>{order.shipping_address.address_1}</p>
                {order.shipping_address.address_2 && (
                  <p>{order.shipping_address.address_2}</p>
                )}
                <p>
                  {order.shipping_address.city},{" "}
                  {order.shipping_address.postal_code}
                </p>
                <p className="uppercase">
                  {order.shipping_address.country_code}
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </AccountLayout>
  )
}