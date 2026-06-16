"use client";

import { useSearch } from "@/lib/hooks/useSearch";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiSearch, FiX } from "react-icons/fi";
import { convertToLocale } from "@lib/util/money";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=70";

export default function SearchBar() {
  const { query, setQuery, products, categories, loading, clear } = useSearch();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const hasResults = products.length > 0 || categories.length > 0;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      setOpen(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
    if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleSelect = () => {
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-[340px]">

      {/* Input */}
      <div className="flex items-center border border-gray-200 bg-[#f7f6f4] px-3 py-2 gap-2">
        <FiSearch className="text-gray-400 shrink-0 text-[15px]" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => query.length >= 2 && setOpen(true)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none text-[13px] text-[#222] placeholder-gray-400"
        />
        {query && (
          <button
            onClick={() => { clear(); inputRef.current?.focus(); }}
            className="text-gray-400 hover:text-[#c97a4a] transition-colors"
          >
            <FiX className="text-[14px]" />
          </button>
        )}
        {loading && (
          <div className="w-3.5 h-3.5 border-2 border-gray-300 border-t-[#c97a4a] rounded-full animate-spin shrink-0" />
        )}
      </div>

      {/* Dropdown */}
      {open && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 shadow-lg z-50 max-h-[420px] overflow-y-auto">

          {/* Categories */}
          {categories.length > 0 && (
            <div>
              <p className="px-4 pt-3 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Categories
              </p>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.handle}`}
                  onClick={handleSelect}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#f7f6f4] text-[13px] text-[#222] transition-colors"
                >
                  <span className="w-5 h-5 bg-[#f0ebe4] flex items-center justify-center text-[10px] text-[#c97a4a] rounded-sm shrink-0">
                    ▤
                  </span>
                  {cat.name}
                </Link>
              ))}
            </div>
          )}

          {/* Products */}
          {products.length > 0 && (
            <div>
              <p className="px-4 pt-3 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Products
              </p>
              {products.map((p) => {
                const rawPrice =
                  p.variants?.[0]?.calculated_price?.calculated_amount ??
                  p.variants?.[0]?.prices?.[0]?.amount ??
                  0;
                const currency =
                  p.variants?.[0]?.calculated_price?.currency_code ??
                  p.variants?.[0]?.prices?.[0]?.currency_code ??
                  "USD";
                const formattedPrice = convertToLocale({
                  amount: rawPrice,
                  currency_code: currency,
                });

                return (
                  <Link
                    key={p.id}
                    href={`/products/${p.handle}`}
                    onClick={handleSelect}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#f7f6f4] transition-colors group"
                  >
                    <div className="w-10 h-10 bg-[#f7f6f4] shrink-0 relative overflow-hidden">
                      <Image
                        src={p.thumbnail || PLACEHOLDER}
                        alt={p.title}
                        fill
                        className="object-contain"
                        sizes="40px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-[#222] truncate group-hover:text-[#c97a4a] transition-colors">
                        {p.title}
                      </p>
                      <p className="text-[12px] text-[#8f8f8f]">
                        {formattedPrice}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* No results */}
          {!loading && !hasResults && (
            <p className="px-4 py-5 text-[13px] text-gray-400 text-center">
              No results for &ldquo;{query}&rdquo;
            </p>
          )}

          {/* See all */}
          {hasResults && (
            <Link
              href={`/search?q=${encodeURIComponent(query)}`}
              onClick={handleSelect}
              className="block px-4 py-3 text-[12px] font-semibold text-[#c97a4a] uppercase tracking-wide border-t border-gray-100 hover:bg-[#f7f6f4] text-center transition-colors"
            >
              See all results for &ldquo;{query}&rdquo; →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}