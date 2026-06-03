'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiHeart, FiSearch, FiShoppingCart } from 'react-icons/fi';
import { Product } from '@/middleware/types/commerce.types';
import QuickViewModal from './QuickViewModal';
import { addToCart } from "@/lib/data/cart";
import toast from "react-hot-toast";

const PLACEHOLDER =
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=70';
const DEFAULT_COUNTRY_CODE = process.env.NEXT_PUBLIC_DEFAULT_REGION || "us";

interface ShopProductCardProps {
  product: Product;
  price: number;
}

export default function ShopProductCard({
  product,
  price,
}: ShopProductCardProps) {
  const [showQuickView, setShowQuickView] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const thumbnail = product.thumbnail || PLACEHOLDER;
  const formattedPrice = `$${price.toFixed(2)}`;
  const handleAddToCart = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);

    try {
      const variant = product?.variants?.[0];
      const variantId = variant?.id;

      if (!variantId) {
        console.error("No variant found");
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
    <>
      <div className="shop-card" style={styles.card}>
        <Link
          href={`/products/${product.handle}`}
          style={styles.link}
        >
          <div style={styles.imageWrapper}>
            <Image
              src={thumbnail}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              style={{
                objectFit: 'contain',
              }}
            />

            <div className="actions">
              <button className="action-btn">
                <FiHeart />
              </button>

              <button
                className="action-btn"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowQuickView(true);
                }}
              >
                <FiSearch />
              </button>

              <button className="action-btn" onClick={handleAddToCart} disabled={isAdding}>
                {isAdding ? (
                  <div className="w-4 h-4 border-2 border-[#c97a4a] border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FiShoppingCart />
                )}
              </button>
            </div>
          </div>

          <div style={styles.info}>
            <p style={styles.category}>
              {product.category ?? 'Uncategorized'}
            </p>

            <p style={styles.name}>
              {product.title}
            </p>

            <p style={styles.price}>
              {formattedPrice}
            </p>
          </div>
        </Link>

        <style jsx>{`
  .shop-card {
    position: relative;
  }

  .actions {
    position: absolute;
    top: 50%;
    right: -8px;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    gap: 8px;
    opacity: 0;
    transition: all 0.3s ease;
  }

  .shop-card:hover .actions {
    opacity: 1;
    right: 12px;
  }

  .action-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;
    background: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    color: #222;
    box-shadow: 0 2px 6px rgba(0,0,0,.12);
    transition: all .2s ease;
  }

  .action-btn:hover {
    background: #c97a4a;
    color: white;
  }

  .shop-card :global(img) {
    transition: transform .35s ease;
  }

  .shop-card:hover :global(img) {
    transform: scale(1.03);
  }
`}</style>
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

const styles: Record<string, React.CSSProperties> = {
  link: {
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
  },

  card: {
    background: 'transparent',
    cursor: 'pointer',
  },

  imageWrapper: {
    position: 'relative',
    width: '100%',
    aspectRatio: '1 / 1',
    background: '#f7f6f4',
    overflow: 'hidden',
  },

  info: {
    paddingTop: 14,
  },

  category: {
    fontSize: 14,
    color: '#8f8f8f',
    marginBottom: 8,
    fontWeight: 400,
  },

  name: {
    fontSize: 16,
    fontWeight: 700,
    color: '#222',
    marginBottom: 8,
    lineHeight: 1.3,
  },

  price: {
    fontSize: 16,
    color: '#333',
    fontWeight: 400,
  },
};
