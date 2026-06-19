import { sdk } from "@lib/config"
import { getAuthHeaders } from "@lib/data/cookies"
import { HttpTypes } from "@medusajs/types"
import Link from "next/link"
import { notFound } from "next/navigation"

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

export default async function OrderConfirmedPage({
  params,
}: {
  params: { id: string }
}) {
  const order = await getOrder(params.id)
  if (!order) return notFound()

  const subtotal = order.item_subtotal ?? 0
  const shipping = order.shipping_total ?? 0
  const tax = order.tax_total ?? 0
  const total = order.total ?? 0

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-4">

        {/* Success header */}
        <div className="bg-white border border-gray-100 rounded-xl px-8 py-10 text-center mb-6">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "#EAF3DE" }}
          >
            <svg
              width="28"
              height="28"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#3B6D11"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-sm text-gray-400">
            Thank you for your purchase. Your order has been placed
            successfully.
          </p>
          <div
            className="inline-block mt-4 px-4 py-1.5 rounded-full text-xs font-medium"
            style={{ background: "#EAF3DE", color: "#3B6D11" }}
          >
            Order #{order.display_id}
          </div>
        </div>

        {/* Items */}
        <div className="bg-white border border-gray-100 rounded-xl px-6 py-5 mb-6">
          <p className="text-sm font-semibold text-gray-900 mb-4">
            Items ordered
          </p>
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

        {/* Summary */}
        <div className="bg-white border border-gray-100 rounded-xl px-6 py-5 mb-6">
          <p className="text-sm font-semibold text-gray-900 mb-4">
            Order summary
          </p>
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

        {/* Shipping address */}
        {order.shipping_address && (
          <div className="bg-white border border-gray-100 rounded-xl px-6 py-5 mb-6">
            <p className="text-sm font-semibold text-gray-900 mb-3">
              Shipping to
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

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            href="/account/orders"
            className="flex-1 text-center py-3 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition"
          >
            View all orders
          </Link>
          <Link
            href="/shop"
            className="flex-1 text-center py-3 rounded-lg text-sm text-white font-medium hover:opacity-90 transition"
            style={{ background: "#c97a4a" }}
          >
            Continue shopping
          </Link>
        </div>

      </div>
    </div>
  )
}