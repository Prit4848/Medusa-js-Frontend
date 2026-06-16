"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSearch } from "@/lib/hooks/useSearch";
import ShopProductCard from "@/components/shop/ShopProductCard";
import { convertToLocale } from "@lib/util/money";
import { searchAll } from "@/lib/data/search";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=70";

export default function SearchPage() {
  const router = useRouter();
  const {
    query,
    setQuery,
    products: suggestions,
    categories,
    loading,
    clear,
  } = useSearch();

  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (query.length >= 2) setShowDropdown(true);
    else setShowDropdown(false);
  }, [query, suggestions]);

  const handleSearch = async (q = query) => {
    if (!q.trim()) return;
    setShowDropdown(false);
    setSubmitted(true);
    setSearching(true);
    
    // Update URL if we're performing a search manually
    if (q === query) {
      router.replace(`/search?q=${encodeURIComponent(q)}`, { scroll: false });
    }

    const { products: raw } = await searchAll(q.trim(), 24);
    const mapped = raw.map((p: any) => ({
      product: p,
      price: p.variants?.[0]?.price ?? 0,
    }));

    setResults(mapped);
    setSearching(false);
  };

  // Handle URL changes (for "See all" from other pages)
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const q = searchParams.get("q");
    if (q) {
      setQuery(q);
      handleSearch(q);
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
    if (e.key === "Escape") setShowDropdown(false);
  };

  const handleSuggestionClick = (
    item: any,
    type: "product" | "category"
  ) => {
    setShowDropdown(false);
    if (type === "category") {
      router.push(`/categories/${item.handle}`);
    } else {
      router.push(`/products/${item.handle}`);
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-12 lg:py-20">

      {/* ── Big Search Bar ── */}
      <div ref={wrapperRef} className="relative max-w-[720px] mx-auto mb-14">
        <div className="flex items-center border-b-2 border-[#222] pb-3 gap-4">
          <Search
            size={22}
            strokeWidth={1.8}
            className="text-[#8f8f8f] shrink-0"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSubmitted(false);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => query.length >= 2 && setShowDropdown(true)}
            placeholder="Search for products, categories..."
            className="flex-1 text-[22px] lg:text-[28px] font-light text-[#222] placeholder-gray-300 outline-none bg-transparent"
          />
          {query && (
            <button
              onClick={() => {
                clear();
                setSubmitted(false);
                setResults([]);
                inputRef.current?.focus();
              }}
              className="text-gray-400 hover:text-[#c97a4a] transition-colors"
            >
              <X size={20} strokeWidth={1.8} />
            </button>
          )}
          {loading && (
            <div className="w-4 h-4 border-2 border-gray-300 border-t-[#c97a4a] rounded-full animate-spin shrink-0" />
          )}
          <button
            onClick={() => handleSearch()}
            className="hidden sm:block text-[12px] font-semibold uppercase tracking-widest text-[#c97a4a] hover:opacity-70 transition-opacity shrink-0"
          >
            Search
          </button>
        </div>

        {/* ── Autocomplete Dropdown ── */}
        {showDropdown &&
          (suggestions.length > 0 || categories.length > 0) && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 shadow-xl z-50 max-h-[380px] overflow-y-auto">

              {/* Categories */}
              {categories.length > 0 && (
                <div>
                  <p className="px-5 pt-4 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Categories
                  </p>
                  {categories.map((cat: any) => (
                    <button
                      key={cat.id}
                      onClick={() => handleSuggestionClick(cat, "category")}
                      className="w-full flex items-center gap-3 px-5 py-3 hover:bg-[#f7f6f4] text-left transition-colors"
                    >
                      <span className="text-[11px] text-[#c97a4a]">▤</span>
                      <span className="text-[14px] text-[#222]">
                        {cat.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Products */}
              {suggestions.length > 0 && (
                <div>
                  <p className="px-5 pt-4 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Products
                  </p>
                  {suggestions.map((p: any) => {
                    const variant = p.variants?.[0];
                    const price = variant?.price ?? 0;
                    const currency = variant?.currency_code ?? "EUR";
                    const formattedPrice = convertToLocale({
                      amount: price,
                      currency_code: currency,
                    });

                    return (
                      <button
                        key={p.id}
                        onClick={() => handleSuggestionClick(p, "product")}
                        className="w-full flex items-center gap-4 px-5 py-3 hover:bg-[#f7f6f4] text-left transition-colors group"
                      >
                        <div className="w-11 h-11 bg-[#f7f6f4] shrink-0 relative overflow-hidden">
                          <Image
                            src={p.thumbnail || PLACEHOLDER}
                            alt={p.title}
                            fill
                            className="object-contain"
                            sizes="44px"
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
                        <Search
                          size={13}
                          strokeWidth={1.8}
                          className="text-gray-300 shrink-0"
                        />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* See all */}
              <button
                onClick={() => handleSearch()}
                className="w-full px-5 py-3.5 text-[12px] font-semibold text-[#c97a4a] uppercase tracking-widest border-t border-gray-100 hover:bg-[#f7f6f4] text-center transition-colors"
              >
                See all results for &ldquo;{query}&rdquo; →
              </button>
            </div>
          )}
      </div>

      {/* ── Initial empty state ── */}
      {!submitted && !query && (
        <p className="text-center text-[14px] text-gray-300 uppercase tracking-widest">
          Start typing to search products
        </p>
      )}

      {/* ── Loading results ── */}
      {searching && (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-[#c97a4a] rounded-full animate-spin" />
        </div>
      )}

      {/* ── Results Grid ── */}
      {submitted && !searching && results.length > 0 && (
        <div>
          <p className="text-[14px] text-gray-400 uppercase tracking-widest mb-10">
            {results.length} results found for &ldquo;{query}&rdquo;
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 lg:gap-x-6 lg:gap-y-16">
            {results.map((item) => (
              <ShopProductCard
                key={item.product.id}
                product={item.product}
                price={item.price}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── No results ── */}
      {submitted && !searching && results.length === 0 && (
        <div className="text-center py-20">
          <p className="text-[18px] font-semibold text-[#222] mb-2">
            No products found
          </p>
          <p className="text-[13px] text-gray-400 mb-8">
            Nothing matched &ldquo;{query}&rdquo; — try a different term.
          </p>
          <Link
            href="/shop"
            className="border border-[#c97a4a] text-[#c97a4a] px-8 py-3 text-[12px] font-semibold uppercase tracking-widest hover:bg-[#c97a4a] hover:text-white transition"
          >
            Browse All Products
          </Link>
        </div>
      )}
    </div>
  );
}
