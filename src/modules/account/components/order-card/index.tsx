import { useMemo } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type OrderCardProps = {
  order: HttpTypes.StoreOrder
}

const OrderCard = ({ order }: OrderCardProps) => {
  const numberOfLines = useMemo(() => {
    return (
      order.items?.reduce((acc, item) => {
        return acc + item.quantity
      }, 0) ?? 0
    )
  }, [order])

  const totalAmount = useMemo(() => {
    return (
      order.summary?.total ??
      order.total ??
      order.items?.reduce((acc, i) => acc + i.unit_price * i.quantity, 0) ??
      0
    )
  }, [order])

  const shippingName = useMemo(() => {
    const f = order.shipping_address?.first_name || ""
    const l = order.shipping_address?.last_name || ""
    if (f.toLowerCase() === l.toLowerCase()) return f
    return `${f} ${l}`.trim()
  }, [order.shipping_address])

  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-sm transition-shadow duration-200" data-testid="order-card">
      <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-0.5">Order Placed</p>
            <p className="text-sm font-medium text-gray-900">
              {new Date(order.created_at).toDateString()}
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-0.5">Total</p>
            <p className="text-sm font-medium text-gray-900">
              {convertToLocale({
                amount: totalAmount,
                currency_code: order.currency_code ?? "USD",
              })}
            </p>
          </div>
          <div className="hidden sm:block">
            <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-0.5">Ship To</p>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                {shippingName || "N/A"}
              </p>
              <p className="text-[11px] text-gray-400 truncate max-w-[150px] uppercase">
                {order.shipping_address?.city}{order.shipping_address?.city && ","} {order.shipping_address?.country_code}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <LocalizedClientLink 
            href={`/account/orders/details/${order.id}`}
            className="text-xs text-[#c97a4a] hover:underline font-medium"
          >
            View order details
          </LocalizedClientLink>
        </div>
      </div>

      <div className="px-6 py-5">
        <div className="flex items-center gap-3 mb-4">
           <span
            className="text-[11px] px-2.5 py-1 rounded-full font-medium capitalize"
            style={{
              background: order.status === "completed" ? "#EAF3DE" : "#FAECE7",
              color: order.status === "completed" ? "#3B6D11" : "#993C1D",
            }}
          >
            {order.status}
          </span>
          <p className="text-sm text-gray-500">
            {numberOfLines} {numberOfLines === 1 ? "item" : "items"}
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          {order.items?.slice(0, 4).map((i) => (
            <div key={i.id} className="group relative">
              <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 transition-colors group-hover:border-gray-200">
                {i.thumbnail ? (
                  <img
                    src={i.thumbnail}
                    alt={i.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              {i.quantity > 1 && (
                <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {i.quantity}
                </span>
              )}
            </div>
          ))}
          {order.items && order.items.length > 4 && (
            <div className="w-20 h-20 rounded-lg border border-dashed border-gray-200 flex flex-col items-center justify-center bg-gray-50/50">
              <span className="text-sm font-semibold text-gray-400">
                +{order.items.length - 4}
              </span>
              <span className="text-[10px] text-gray-400 uppercase tracking-tighter">More</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderCard
