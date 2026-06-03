'use client';

import Image from 'next/image';
import { Product } from '@/middleware/types/commerce.types';
import Link from "next/link";
import { addToCart } from "@/lib/data/cart";
import toast from "react-hot-toast";
import { useState } from "react";

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
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  if (!open || !product) return null;
  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      const variant = product?.variants?.[0];
      const variantId = variant?.id;

      if (!variantId) {
        console.error("No variant found");
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

      toast.success(
        "Product successfully added to cart"
      );
    } catch (error) {
      console.error("Add to cart failed:", error);
      toast.error(error instanceof Error ? error.message : "Unable to add item to cart");
    } finally {
      setIsAdding(false);
    }
  };
  return (
    <div className="overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="left">
          <Image
            src={product.thumbnail!}
            alt={product.title}
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>

        <div className="right">
          <Link
            href={`/products/${product.handle}`}
            className="topLink"
          >
            More about product →
          </Link>

          <div className="category">
            {product.category}
          </div>

          <h2>{product.title}</h2>

          <div className="stars">
            ★ ★ ★ ★ ☆
            <span>12 reviews</span>
          </div>

          <p className="desc">
            Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. In ut ullamcorper leo,
            eget euismod orci.
          </p>

          <div className="priceRow">
            <div>
              <p className="font-bold text-[12px] mb-4">
                QUANTITY
              </p>

              <div className="flex items-center gap-5 text-lg">
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((prev) =>
                      Math.max(1, prev - 1)
                    )
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
                  onClick={() =>
                    setQuantity((prev) => prev + 1)
                  }
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
                ${(price * quantity).toFixed(2)}
              </p>
            </div>

          </div>

          <div className="buttons">
            <button 
                className="outline flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed" 
                onClick={handleAddToCart}
                disabled={isAdding}
            >
              {isAdding ? (
                <div className="w-6 h-6 border-2 border-[#c97a4a] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "ADD TO CART"
              )}
            </button>

            <button className="filled">
              BUY NOW
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,.55);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal {
    width: 1030px;
    height: 640px;
    background: white;
    display: flex;
  }

  .left {
    width: 50%;
    position: relative;
    background: #f7f6f4;
  }

  .right {
    width: 50%;
    padding: 38px;
  }

.topLink {
  color: #c86f43;
  font-size: 22px;
  text-decoration: none;
}

  .category {
    color: #888;
    font-size: 14px;
    margin-bottom: 18px;
  }

  h2 {
    font-size: 28px;
    font-weight: 700;
    color: #222;
    margin: 0 0 25px;
  }

  .stars {
    color: #d9ab76;
    font-size: 24px;
    margin-bottom: 28px;
  }

  .stars span {
    color: #999;
    font-size: 15px;
    margin-left: 12px;
  }

  .desc {
    color: #666;
    line-height: 1.8;
    font-size: 15px;
    margin-bottom: 45px;
  }

  .priceRow {
    display: flex;
    gap: 70px;
    margin-bottom: 60px;
  }

  .priceRow p {
    font-size: 14px;
    font-weight: 700;
    color: #333;
    margin-bottom: 10px;
  }

  .priceRow div div {
    font-size: 16px;
    font-weight: 600;
  }

  .buttons {
    display: flex;
    gap: 22px;
  }

  .outline,
  .filled {
    width: 210px;
    height: 56px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: .2s;
  }

  .outline {
    background: white;
    border: 1px solid #c97a4a;
    color: #c97a4a;
  }

  .filled {
    background: #c97a4a;
    color: white;
    border: none;
  }

  .outline:hover,
  .filled:hover {
    opacity: .9;
  }
`}</style>
    </div>
  );
}
