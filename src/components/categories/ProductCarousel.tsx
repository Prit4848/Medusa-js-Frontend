"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useCallback, useEffect } from "react";
import { Product } from "@/middleware/types/commerce.types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { convertToLocale } from "@lib/util/money";

interface ProductCarouselProps {
  title?: string;
  products: Product[];
}

function formatPrice(product: Product): string {
  const amount = product.price?.amount ?? product.variants?.[0]?.price;
  const currency = product.price?.currency_code ?? product.variants?.[0]?.currency_code ?? "USD";
  if (!amount) return "";

  return convertToLocale({ amount, currency_code: currency });
}

export default function ProductCarousel({ title = "You may also like:", products }: ProductCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
  }, []);

  useEffect(() => {
    updateScrollState();
  }, [products, updateScrollState]);

  const scroll = (dir: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -520 : 520, behavior: "smooth" });
    setTimeout(updateScrollState, 300);
  };

  if (!products.length) return null;

  return (
    <section className="relative max-w-[1200px] mx-auto px-4 py-12">
      <h2
        className="text-[#111] mb-8"
        style={{ fontSize: "18px", fontWeight: 400 }}
      >
        {title}
      </h2>

      <div className="relative">
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="absolute left-0 lg:-left-5 top-[40%] -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-[#e5e5e5] shadow-sm flex items-center justify-center hover:bg-gray-50 transition"
          >
            <ChevronLeft size={16} strokeWidth={1.5} />
          </button>
        )}

        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="absolute right-0 lg:-right-5 top-[40%] -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-[#e5e5e5] shadow-sm flex items-center justify-center hover:bg-gray-50 transition"
          >
            <ChevronRight size={16} strokeWidth={1.5} />
          </button>
        )}

        <div
          ref={trackRef}
          onScroll={updateScrollState}
          className="flex gap-5 overflow-x-auto scroll-smooth pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  const price = formatPrice(product);
  const category = product.category ?? "Category";

  return (
    <Link
      href={`/products/${product.handle}`}
      className="flex-none group"
      style={{ width: "200px", textDecoration: "none" }}
    >
      {/* image box */}
      <div
        className="relative overflow-hidden mb-3"
        style={{ width: "200px", height: "220px", backgroundColor: "#f5f5f5" }}
      >
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="200px"
            className="object-contain p-5 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
            No image
          </div>
        )}
      </div>

      {/* category label */}
      <p
        className="text-[#9c9c9c] uppercase tracking-wide mb-1"
        style={{ fontSize: "10px" }}
      >
        {category}
      </p>

      {/* product name */}
      <h3
        className="text-[#222] font-medium leading-snug mb-1 group-hover:underline"
        style={{ fontSize: "13px" }}
      >
        {product.title}
      </h3>

      {/* price */}
      {price && (
        <p className="text-[#111]" style={{ fontSize: "13px" }}>
          {price}
        </p>
      )}
    </Link>
  );
}
