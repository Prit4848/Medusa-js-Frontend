'use client';

import { useState, useEffect } from 'react';
import { Range } from 'react-range';
import { ProductCategory, ProductCollection } from '@/middleware/types/commerce.types';
import { ShopFilters } from './ShopPage';
import { convertToLocale } from "@lib/util/money";
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';

interface ShopSidebarProps {
  filters: ShopFilters;
  onFiltersChange: (filters: ShopFilters) => void;
  categories: ProductCategory[];
  collections: ProductCollection[];
  priceMaxLimit: number;
  currencyCode: string;
}

const AVAILABILITY = ['On Stock', 'Out of Stock'];

export default function ShopSidebar({
  filters: initialFilters,
  onFiltersChange,
  categories,
  collections,
  priceMaxLimit,
  currencyCode,
}: ShopSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<ShopFilters>(initialFilters);

  useEffect(() => {
    setLocalFilters(initialFilters);
  }, [initialFilters]);

  const toggle = (arr: string[], item: string): string[] =>
    arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];

  const handleCategory = (name: string) =>
    setLocalFilters({ ...localFilters, categories: toggle(localFilters.categories, name) });

  const handleBrand = (title: string) =>
    setLocalFilters({ ...localFilters, brands: toggle(localFilters.brands, title) });

  const handleAvailability = (avail: string) =>
    setLocalFilters({
      ...localFilters,
      availability: localFilters.availability[0] === avail ? [] : [avail]
    });

  const handleApply = () => {
    onFiltersChange(localFilters);
    if (isMobileOpen) setIsMobileOpen(false);
  };

  const handleClearAll = () => {
    const cleared: ShopFilters = {
      categories: [],
      brands: [],
      priceMin: 0,
      priceMax: priceMaxLimit,
      availability: [],
      minRating: 0,  // ← new
    };
    setLocalFilters(cleared);
    onFiltersChange(cleared);
  };

  // Show "Clear all" if any filter is active including minRating
  const hasActiveFilters =
    localFilters.categories.length > 0 ||
    localFilters.brands.length > 0 ||
    localFilters.availability.length > 0 ||
    localFilters.priceMin > 0 ||
    localFilters.priceMax < priceMaxLimit ||
    localFilters.minRating > 0  // ← new

  const formattedMin = convertToLocale({ amount: localFilters.priceMin, currency_code: currencyCode });
  const formattedMax = convertToLocale({ amount: localFilters.priceMax, currency_code: currencyCode });

  return (
    <aside className="w-full lg:w-[310px] lg:min-w-[310px] px-6 lg:px-[32px] py-4 lg:py-[42px] bg-[#fafafa] border-b lg:border-b-0 lg:border-r border-[#ececec] flex-shrink-0">

      {/* Mobile Toggle */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden flex items-center justify-between w-full py-4 text-[#222] font-bold text-[18px]"
      >
        <div className="flex items-center gap-2">
          <Filter size={20} />
          <span>Filters</span>
        </div>
        {isMobileOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      <div className={`lg:sticky lg:top-[120px] ${isMobileOpen ? 'block' : 'hidden lg:block'}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="hidden lg:block text-[20px] font-bold text-[#222]">Filters</h2>
          <button
            onClick={handleApply}
            className="w-full lg:w-auto bg-[#c97a4a] text-white px-4 py-2 text-[13px] font-bold tracking-widest hover:opacity-90 transition rounded-sm"
          >
            APPLY FILTER
          </button>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-[26px]">
              <h3 className="text-[13px] font-bold tracking-[0.14em] uppercase text-[#222]">
                Categories
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={handleClearAll}
                  className="text-[11px] text-[#c97a4a] hover:underline font-medium"
                >
                  Clear all
                </button>
              )}
            </div>
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-3 mb-[18px] cursor-pointer">
                <input
                  type="checkbox"
                  checked={localFilters.categories.includes(cat.name)}
                  onChange={() => handleCategory(cat.name)}
                  className="w-5 h-5 cursor-pointer accent-[#c97a4a]"
                />
                <span className="text-[16px] text-[#444]">{cat.name}</span>
              </label>
            ))}
          </div>
        )}

        {/* Price */}
        <div className="mb-12">
          <h3 className="text-[13px] font-bold tracking-[0.14em] uppercase text-[#222] mb-[26px]">Price</h3>
          <p className="text-[16px] text-[#666] mb-[18px]">
            Price Range: {formattedMin} - {formattedMax}
          </p>
          <Range
            step={1}
            min={0}
            max={priceMaxLimit}
            values={[localFilters.priceMin, localFilters.priceMax]}
            onChange={([min, max]) =>
              setLocalFilters({ ...localFilters, priceMin: min, priceMax: max })
            }
            renderTrack={({ props, children }) => {
              const { key, ...rest } = props as any;
              return (
                <div key={key} {...rest} style={{ ...rest.style, height: '4px', width: '100%', background: '#ececec', borderRadius: '999px' }}>
                  {children}
                </div>
              );
            }}
            renderThumb={({ props }) => {
              const { key, ...rest } = props;
              return (
                <div key={key} {...rest} style={{ ...rest.style, height: '14px', width: '14px', borderRadius: '50%', background: '#c97a4a', cursor: 'pointer' }} />
              );
            }}
          />
          <div className="flex justify-between mt-4 text-[#888] text-[14px]">
            <span>{formattedMin}</span>
            <span>{formattedMax}</span>
          </div>
        </div>

        {/* Brands */}
        {collections.length > 0 && (
          <div className="mb-12">
            <h3 className="text-[13px] font-bold tracking-[0.14em] uppercase text-[#222] mb-[26px]">
              Brands
            </h3>
            {collections.map((col) => (
              <label key={col.id} className="flex items-center gap-3 mb-[18px] cursor-pointer">
                <input
                  type="checkbox"
                  checked={localFilters.brands.includes(col.title)}
                  onChange={() => handleBrand(col.title)}
                  className="w-5 h-5 cursor-pointer accent-[#c97a4a]"
                />
                <span className="text-[16px] text-[#444]">{col.title}</span>
              </label>
            ))}
          </div>
        )}

        {/* Availability */}
        <div className="mb-12">
          <h3 className="text-[13px] font-bold tracking-[0.14em] uppercase text-[#222] mb-[26px]">
            Availability
          </h3>
          {AVAILABILITY.map((avail) => (
            <label key={avail} className="flex items-center gap-3 mb-[18px] cursor-pointer">
              <input
                type="radio"
                checked={localFilters.availability.includes(avail)}
                onChange={() => handleAvailability(avail)}
                className="w-5 h-5 cursor-pointer accent-[#c97a4a]"
              />
              <span className="text-[16px] text-[#444]">{avail}</span>
            </label>
          ))}
        </div>

        {/* Rating ← new section */}
        <div className="mb-12">
          <h3 className="text-[13px] font-bold tracking-[0.14em] uppercase text-[#222] mb-[26px]">
            Rating
          </h3>

          {[4, 3, 2, 1].map((star) => (
            <label key={star} className="flex items-center gap-3 mb-[18px] cursor-pointer">
              <input
                type="radio"
                checked={localFilters.minRating === star}
                onChange={() =>
                  setLocalFilters({
                    ...localFilters,
                    minRating: localFilters.minRating === star ? 0 : star,
                  })
                }
                className="w-5 h-5 cursor-pointer accent-[#c97a4a]"
              />
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span
                      key={s}
                      className={`text-lg leading-none ${s <= star ? "text-[#d8a46c]" : "text-gray-300"}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-[14px] text-[#666]">& up</span>
              </div>
            </label>
          ))}

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              checked={localFilters.minRating === 0}
              onChange={() => setLocalFilters({ ...localFilters, minRating: 0 })}
              className="w-5 h-5 cursor-pointer accent-[#c97a4a]"
            />
            <span className="text-[16px] text-[#444]">All ratings</span>
          </label>
        </div>

      </div>
    </aside>
  );
}