'use client';

import Image from 'next/image';
import Link from 'next/link';
import { X, Loader2 } from 'lucide-react';
import { useWishlist } from '@/lib/wishlist';
import { addToCart } from '@/lib/data/cart';
import toast from 'react-hot-toast';
import { useState } from 'react';

const DEFAULT_COUNTRY_CODE = process.env.NEXT_PUBLIC_DEFAULT_REGION || 'us';

export default function WishlistPage() {
  const { items, removeItem } = useWishlist();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleAddToCart = async (item: typeof items[0]) => {
    setLoadingId(item.id);
    try {
      const result = await addToCart({
        variantId: item.variantId,
        quantity: 1,
        countryCode: DEFAULT_COUNTRY_CODE,
      });
      if (!result.success) {
        toast.error(result.error || 'Unable to add item to cart');
        return;
      }
      toast.success('Added to cart');
    } catch (err) {
      toast.error('Unable to add item to cart');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <section className="bg-white min-h-screen py-20">
      <div className="max-w-[1320px] mx-auto px-6">
        <h1 className="text-[54px] font-bold text-[#222] mb-12">Wishlist</h1>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <p className="text-[#888] text-lg mb-6">Your wishlist is empty.</p>
            <Link
              href="/shop"
              className="px-8 py-3 bg-[#c97a4a] text-white font-semibold hover:opacity-90 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="border border-[#e5e5e5]">
            {/* Header */}
            <div className="grid grid-cols-[2fr_1fr_1fr_180px_48px] bg-[#fafafa] border-b border-[#e5e5e5] px-6 py-4 text-[13px] font-semibold text-[#3a4651] uppercase tracking-wide">
              <div>Product</div>
              <div>Price</div>
              <div>Stock Status</div>
              <div></div>
              <div></div>
            </div>

            {/* Rows */}
            {items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[2fr_1fr_1fr_180px_48px] items-center px-6 py-5 border-b border-[#f0f0f0] last:border-b-0"
              >
                {/* Product */}
                <Link href={`/products/${item.handle}`} className="flex items-center gap-5 group">
                  <div className="relative w-[80px] h-[80px] bg-[#f7f7f7] shrink-0">
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-[13px] text-[#8f8f8f] mb-1">{item.category}</p>
                    <p className="text-[16px] font-semibold text-[#222] group-hover:text-[#c97a4a] transition">
                      {item.title}
                    </p>
                  </div>
                </Link>

                {/* Price */}
                <div className="text-[16px] font-semibold text-[#222]">
                  ${item.price.toFixed(2)}
                </div>

                {/* Stock */}
                <div>
                  {item.inStock ? (
                    <span className="text-[13px] font-semibold text-green-600 bg-green-50 px-3 py-1">
                      In Stock
                    </span>
                  ) : (
                    <span className="text-[13px] font-semibold text-red-500 bg-red-50 px-3 py-1">
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Add to Cart */}
                <button
                  disabled={!item.inStock || loadingId === item.id}
                  onClick={() => handleAddToCart(item)}
                  className="flex items-center justify-center h-[42px] px-5 bg-[#c97a4a] text-white text-[13px] font-bold hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loadingId === item.id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    'ADD TO CART'
                  )}
                </button>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="flex items-center justify-center w-8 h-8 mx-auto hover:text-[#c97a4a] text-[#bbb] transition"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}