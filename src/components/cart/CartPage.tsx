"use client";

import Image from "next/image";
import { X, Loader2 } from "lucide-react";
import { updateLineItem, deleteLineItem } from "@lib/data/cart";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext"

interface CartPageProps {
  cart: any;
}

export default function CartPage({ cart }: CartPageProps) {
  const router = useRouter();
  const [loadingAction, setLoadingAction] = useState<{ id: string, type: 'update' | 'delete' } | null>(null);
  const { customer } = useAuth();
  const handleCheckout = () => {
    if (!customer) {
      router.push("/login?redirectTo=/billing")
    } else {
      router.push("/billing")
    }
  }

  // Handle null cart safely
  if (!cart) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#222] mb-4">
            Cart Not Found
          </h1>

          <p className="text-[#888]">
            Please add items to your cart.
          </p>
        </div>
      </section>
    );
  }

  const cartItems =
    cart.items?.map((item: any) => ({
      lineId: item.id,
      name: item.product_title || item.title || "Product",
      category: item.variant_title || "",
      price: (item.unit_price || 0),
      quantity: item.quantity,
      image: item.thumbnail || "/placeholder-product.jpg",
    })) || [];

  const subtotal = (cart.subtotal || 0);

  const increaseQuantity = async (
    lineId: string,
    currentQty: number
  ) => {
    try {
      setLoadingAction({ id: lineId, type: 'update' });

      await updateLineItem({
        lineId,
        quantity: currentQty + 1,
      });

      router.refresh();
    } catch (error) {
      console.error("Increase Error:", error);
    } finally {
      setLoadingAction(null);
    }
  };

  const decreaseQuantity = async (
    lineId: string,
    currentQty: number
  ) => {
    try {
      if (currentQty <= 1) return;

      setLoadingAction({ id: lineId, type: 'update' });

      await updateLineItem({
        lineId,
        quantity: currentQty - 1,
      });

      router.refresh();
    } catch (error) {
      console.error("Decrease Error:", error);
    } finally {
      setLoadingAction(null);
    }
  };

  const removeItem = async (
    lineId: string
  ) => {
    try {
      setLoadingAction({ id: lineId, type: 'delete' });

      await deleteLineItem(lineId);

      router.refresh();
    } catch (error) {
      console.error("Delete Error:", error);
    } finally {
      setLoadingAction(null);
    }
  };

  if (!cartItems.length) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#222] mb-4">
            Your Cart is Empty
          </h1>

          <p className="text-[#888]">
            Add products to continue shopping
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white min-h-screen py-10 lg:py-20">
      <div className="max-w-[1320px] mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 lg:gap-16">
          {/* LEFT */}
          <div>
            <h1 className="text-[32px] lg:text-[54px] font-bold text-[#222] mb-10 lg:mb-16">
              Shopping Cart
            </h1>

            <div className="hidden lg:grid lg:grid-cols-[1fr_220px_120px] border-b border-[#e5e5e5] pb-5 text-[15px] font-semibold text-[#3a4651]">
              <div>PRODUCT</div>
              <div>QUANTITY</div>
              <div>PRICE</div>
            </div>

            {cartItems.map((item: any) => (
              <div
                key={item.lineId}
                className="flex flex-col lg:grid lg:grid-cols-[1fr_220px_120px_40px] lg:items-center py-6 lg:py-8 border-b border-[#f0f0f0] gap-6 lg:gap-0 relative"
              >
                {/* Product Info */}
                <div className="flex items-center gap-4 lg:gap-7">
                  <div className="relative w-[100px] h-[100px] lg:w-[120px] lg:h-[120px] bg-[#f7f7f7] flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <p className="text-[14px] lg:text-[15px] text-[#8f8f8f] mb-1 lg:mb-2">
                      {item.category}
                    </p>

                    <h3 className="text-[18px] lg:text-[22px] font-bold text-[#222]">
                      {item.name}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center justify-between lg:contents">
                  {/* Quantity - on mobile shows label */}
                  <div className="flex items-center gap-4 lg:gap-6">
                    <span className="lg:hidden text-[14px] font-semibold text-[#3a4651]">QTY:</span>
                    <button
                      disabled={loadingAction?.id === item.lineId}
                      onClick={() =>
                        decreaseQuantity(
                          item.lineId,
                          item.quantity
                        )
                      }
                      className="text-[22px] lg:text-[26px] text-[#444] hover:text-[#c97a4a] disabled:opacity-50"
                    >
                      -
                    </button>

                    <div className="min-w-[30px] lg:min-w-[40px] flex justify-center">
                      {loadingAction?.id === item.lineId && loadingAction?.type === 'update' ? (
                        <Loader2 className="animate-spin text-[#c97a4a]" size={18} />
                      ) : (
                        <span className="text-[16px] lg:text-[18px] font-semibold text-center">
                          {item.quantity}
                        </span>
                      )}
                    </div>

                    <button
                      disabled={loadingAction?.id === item.lineId}
                      onClick={() =>
                        increaseQuantity(
                          item.lineId,
                          item.quantity
                        )
                      }
                      className="text-[22px] lg:text-[26px] text-[#444] hover:text-[#c97a4a] disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-[18px] lg:text-[22px] font-bold text-[#222]">
                    ${Number(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>

                {/* Remove - absolutely positioned on mobile for better UI */}
                <button
                  disabled={loadingAction?.id === item.lineId}
                  onClick={() =>
                    removeItem(item.lineId)
                  }
                  className="absolute top-4 right-0 lg:static w-7 h-7 flex items-center justify-center disabled:opacity-50"
                >
                  {loadingAction?.id === item.lineId && loadingAction?.type === 'delete' ? (
                    <Loader2 className="animate-spin text-[#c97a4a]" size={20} />
                  ) : (
                    <X
                      size={24}
                      className="text-[#999] hover:text-[#c97a4a]"
                    />
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* RIGHT */}
          <div className="bg-[#f5f5f5] h-fit">
            <div className="p-6 lg:p-10">
              <h2 className="text-[32px] lg:text-[54px] font-bold text-[#222] mb-8 lg:mb-10">
                Cart Total
              </h2>

              <div className="flex justify-between text-[16px] lg:text-[18px] mb-6 lg:mb-8">
                <span className="font-medium">
                  Subtotal:
                </span>

                <span className="font-bold">
                  ${Number(subtotal).toFixed(2)}
                </span>
              </div>

              <div className="border-t border-[#dddddd] mb-6 lg:mb-8" />

              <div>
                <div className="flex justify-between text-[16px] lg:text-[18px]">
                  <span className="font-medium">
                    Shipping:
                  </span>

                  <span className="font-bold">
                    Free Shipping
                  </span>
                </div>

                <p className="text-[#888] text-[15px] lg:text-[16px] leading-7 lg:leading-8 mt-4 lg:mt-5">
                  Shipping options will be
                  updated during checkout.
                </p>
              </div>

              <div className="border-t border-[#dddddd] my-6 lg:my-8" />

              <div className="flex justify-between text-[18px] lg:text-[20px]">
                <span className="font-semibold">
                  Total:
                </span>

                <span className="font-bold">
                  ${subtotal}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full h-[62px] bg-[#c97a4a] text-white text-[17px] font-bold hover:opacity-90 transition"
            >
              CHECK OUT
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}