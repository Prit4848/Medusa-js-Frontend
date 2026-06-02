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

interface ShopProductCardProps {
  product: Product;
  price: number;
}

export default function ShopProductCard({
  product,
  price,
}: ShopProductCardProps) {
  const [showQuickView, setShowQuickView] = useState(false);

  const thumbnail = product.thumbnail || PLACEHOLDER;
  const formattedPrice = `$${price.toFixed(2)}`;
  const handleAddToCart = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const variantId = product?.variants?.[0]?.id;

      if (!variantId) {
        console.error("No variant found");
        return;
      }

      await addToCart({
        variantId,
        quantity: 1,
        countryCode: "in",
      });

      toast.success(
  "Product successfully added to cart"
);
    } catch (error) {
      console.error("Add to cart failed:", error);
    }
  };
  return (
    <>
      <div className="shop-card" style={styles.card}>
        <Link
          href={`/products/${product.id}`}
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

              <button className="action-btn" onClick={handleAddToCart}>
                <FiShoppingCart />
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