import Image from 'next/image';
import { Product } from '@/middleware/types/commerce.types';
import Link from "next/link";
import { addToCart } from "@/lib/data/cart";
import toast from "react-hot-toast";
import { useState } from "react";
import { convertToLocale } from "@lib/util/money";
import { useRouter } from "next/navigation";


const DEFAULT_COUNTRY_CODE = process.env.NEXT_PUBLIC_DEFAULT_REGION || "us";

interface Props {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  price: number;
}

export default function QuickViewModal({
  product,
  open,
  onClose,
  price,
}: Props) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isBuying, setIsBuying] = useState(false);

  if (!open || !product) return null;

  const currencyCode = product.price?.currency_code ?? product.variants?.[0]?.currency_code ?? "USD";
  const formattedPrice = convertToLocale({ amount: price * quantity, currency_code: currencyCode });

  const handleBuyNow = async () => {
    setIsBuying(true);
    try {
      const variant = product?.variants?.[0];
      const variantId = variant?.id;

      if (!variantId) {
        toast.error("No variant found for this product");
        return;
      }

      const result = await addToCart({
        variantId,
        quantity,
        countryCode: DEFAULT_COUNTRY_CODE,
      });

      if (result.success) {
        router.push("/billing");
      } else {
        toast.error(result.error || "Unable to process request");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsBuying(false);
    }
  };

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      const variant = product?.variants?.[0];
      const variantId = variant?.id;

      if (!variantId) {
        toast.error("No variant found for this product");
        return;
      }

      if (variant.manage_inventory && (variant.inventory_quantity ?? 0) < quantity) {
        toast.error("This product is out of stock");
        return;
      }

      if (!variant.price || variant.price <= 0) {
        toast.error("This product is not priced for the selected region");
        return;
      }

      const result = await addToCart({
        variantId,
        quantity,
        countryCode: DEFAULT_COUNTRY_CODE,
      });

      if (!result.success) {
        toast.error(result.error || "Unable to add item to cart");
        return;
      }

      toast.success("Product successfully added to cart");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to add item to cart");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/55 z-[1000] flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="w-[1030px] h-[640px] bg-white flex"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left */}
        <div className="w-1/2 relative bg-[#f7f6f4]">
          <Image
            src={product.thumbnail!}
            alt={product.title}
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* Right */}
        <div className="w-1/2 p-[38px]">
          <Link
            href={`/products/${product.handle}`}
            className="text-[#c86f43] text-[22px] no-underline"
          >
            More about product →
          </Link>

          <div className="text-[#888] text-[14px] mb-[18px]">
            {product.category}
          </div>

          <h2 className="text-[28px] font-bold text-[#222] m-0 mb-[25px]">
            {product.title}
          </h2>

          <div className="text-[#d9ab76] text-[24px] mb-[28px]">
            ★ ★ ★ ★ ☆
            <span className="text-[#999] text-[15px] ml-3">12 reviews</span>
          </div>

          <p className="text-[#666] leading-[1.8] text-[15px] mb-[45px]">
            Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. In ut ullamcorper leo,
            eget euismod orci.
          </p>

          <div className="flex gap-[70px] mb-[60px]">
            <div>
              <p className="font-bold text-[12px] mb-4">
                QUANTITY
              </p>

              <div className="flex items-center gap-5 text-lg">
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((prev) => Math.max(1, prev - 1))
                  }
                  className="w-8 h-8 border rounded hover:bg-gray-100"
                >
                  -
                </button>

                <span className="min-w-[30px] text-center font-semibold">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="w-8 h-8 border rounded hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <p className="font-bold text-[12px] mb-4">
                PRICE
              </p>

              <p className="font-semibold text-[22px]">
                {formattedPrice}
              </p>
            </div>
          </div>

          <div className="flex gap-[22px]">
            <button
              className="w-[210px] h-[56px] text-[14px] font-bold cursor-pointer transition-opacity duration-200 bg-white border border-[#c97a4a] text-[#c97a4a] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
              onClick={handleAddToCart}
              disabled={isAdding}
            >
              {isAdding ? (
                <div className="w-6 h-6 border-2 border-[#c97a4a] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "ADD TO CART"
              )}
            </button>

            <button
              className="w-full h-[62px] bg-[#c97a4a] text-white text-[17px] font-bold hover:opacity-90 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleBuyNow}
              disabled={isBuying}
            >
              {isBuying ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "BUY NOW"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}