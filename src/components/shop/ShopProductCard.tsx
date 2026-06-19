'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiHeart, FiSearch, FiShoppingCart } from 'react-icons/fi';
import { Product } from '@/middleware/types/commerce.types';
import QuickViewModal from './QuickViewModal';
import { addToCart } from "@/lib/data/cart";
import { useWishlist } from '@/lib/hooks/wishlist';
import toast from "react-hot-toast";
import { convertToLocale } from "@lib/util/money";

const PLACEHOLDER =
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=70';
const DEFAULT_COUNTRY_CODE = process.env.NEXT_PUBLIC_DEFAULT_REGION || "us";

interface ShopProductCardProps {
  product: Product;
  price: number;
  priority?: boolean;
}

export default function ShopProductCard({ product, price, priority }: ShopProductCardProps) {
  const [showQuickView, setShowQuickView] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const router = useRouter();

  const {
    isWishlisted,
    addItem,
    removeItem,
    getWishlistItemId,
    isLoggedIn,
  } = useWishlist();

  const wishlisted = isWishlisted(product.id);
  const thumbnail = product.thumbnail || PLACEHOLDER;
  const currencyCode = product.price?.currency_code ?? product.variants?.[0]?.currency_code ?? "USD";
  const formattedPrice = convertToLocale({ amount: price, currency_code: currencyCode });

  const handleWishlist = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      toast('Please log in to save items to your wishlist', { icon: '🔒' });
      router.push('/login?redirectTo=/wishlist');
      return;
    }

    setWishlistLoading(true);

    try {
      if (wishlisted) {
        const itemId = getWishlistItemId(product.id);
        if (itemId) {
          await removeItem(itemId);
          toast.success('Removed from wishlist');
        }
      } else {
        const success = await addItem({
          product_id: product.id,
          variant_id: product.variants?.[0]?.id ?? '',
          handle: product.handle ?? '',
          title: product.title,
          category: product.category ?? '',
          thumbnail: product.thumbnail ?? '',
          price,
          in_stock: (product.variants?.[0]?.inventory_quantity ?? 0) > 0,
        });

        if (success) {
          toast.success('Added to wishlist');
        } else {
          toast.error('Failed to add to wishlist');
        }
      }
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);

    try {
      const variant = product?.variants?.[0];
      const variantId = variant?.id;

      if (!variantId) {
        toast.error("No variant found for this product");
        return;
      }
      if (variant.manage_inventory && (variant.inventory_quantity ?? 0) < 1) {
        toast.error("This product is out of stock");
        return;
      }
      if (!variant.price || variant.price <= 0) {
        toast.error("This product is not priced for the selected region");
        return;
      }

      const result = await addToCart({
        variantId,
        quantity: 1,
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
    <>
      <div className="relative group cursor-pointer bg-transparent">
        <Link href={`/products/${product.handle}`} className="block no-underline text-inherit">

          {/* image wrapper */}
          <div className="relative w-full aspect-square bg-[#f7f6f4] overflow-hidden">
            <Image
              src={thumbnail}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={priority}
              className="object-contain transition-transform duration-[350ms] ease-in-out group-hover:scale-[1.03]"
            />

            {/* action buttons */}
            <div className="
              absolute top-1/2 -translate-y-1/2
              flex flex-col gap-2
              opacity-100 right-3
              lg:opacity-0 lg:right-[-8px]
              transition-all duration-300 ease-in-out
              lg:group-hover:opacity-100 lg:group-hover:right-3
            ">
              {/* Heart */}
              <button
                className="
                  w-8 h-8 rounded-full border-none bg-white
                  flex items-center justify-center
                  text-[13px]
                  shadow-[0_2px_6px_rgba(0,0,0,0.12)]
                  transition-all duration-200
                  hover:bg-[#c97a4a] hover:text-white
                  cursor-pointer
                  disabled:opacity-50
                "
                style={{ color: wishlisted ? '#c97a4a' : '#222' }}
                onClick={handleWishlist}
                disabled={wishlistLoading}
              >
                {wishlistLoading ? (
                  <div className="w-3 h-3 border-2 border-[#c97a4a] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FiHeart style={{ fill: wishlisted ? '#c97a4a' : 'none' }} />
                )}
              </button>

              {/* Quick view */}
              <button
                className="
                  w-8 h-8 rounded-full border-none bg-white
                  flex items-center justify-center
                  text-[13px] text-[#222]
                  shadow-[0_2px_6px_rgba(0,0,0,0.12)]
                  transition-all duration-200
                  hover:bg-[#c97a4a] hover:text-white
                  cursor-pointer
                "
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowQuickView(true);
                }}
              >
                <FiSearch />
              </button>

              {/* Add to cart */}
              <button
                className="
                  w-8 h-8 rounded-full border-none bg-white
                  flex items-center justify-center
                  text-[13px] text-[#222]
                  shadow-[0_2px_6px_rgba(0,0,0,0.12)]
                  transition-all duration-200
                  hover:bg-[#c97a4a] hover:text-white
                  cursor-pointer
                  disabled:opacity-50
                "
                onClick={handleAddToCart}
                disabled={isAdding}
              >
                {isAdding ? (
                  <div className="w-4 h-4 border-2 border-[#c97a4a] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FiShoppingCart />
                )}
              </button>
            </div>
          </div>

          {/* info */}
          <div className="pt-[14px]">
            <p className="text-[14px] text-[#8f8f8f] font-normal mb-2">
              {product.category ?? 'Uncategorized'}
            </p>
            <p className="text-[16px] font-bold text-[#222] leading-[1.3] mb-2">
              {product.title}
            </p>
            <p className="text-[16px] text-[#333] font-normal">
              {formattedPrice}
            </p>
          </div>
        </Link>
      </div>

      <QuickViewModal
        open={showQuickView}
        product={product}
        price={price}
        onClose={() => setShowQuickView(false)}
      />
    </>
  );
}