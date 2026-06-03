'use client';

import { Range } from 'react-range';
import { ProductCategory, ProductCollection } from '@/middleware/types/commerce.types';
import { ShopFilters } from './ShopPage';

interface ShopSidebarProps {
  filters: ShopFilters;
  onFiltersChange: (filters: ShopFilters) => void;
  categories: ProductCategory[];
  collections: ProductCollection[];
  priceMaxLimit: number;
}

const AVAILABILITY = ['On Stock', 'Out of Stock'];

export default function ShopSidebar({
  filters,
  onFiltersChange,
  categories,
  collections,
  priceMaxLimit,
}: ShopSidebarProps) {
  const toggle = (arr: string[], item: string): string[] =>
    arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];

  const handleCategory = (name: string) =>
    onFiltersChange({ ...filters, categories: toggle(filters.categories, name) });

  const handleBrand = (title: string) =>
    onFiltersChange({ ...filters, brands: toggle(filters.brands, title) });

  const handleAvailability = (avail: string) =>
    onFiltersChange({ ...filters, availability: toggle(filters.availability, avail) });

  return (
    <aside className="w-[310px] min-w-[310px] px-[32px] py-[42px] bg-[#fafafa] border-r border-[#ececec] flex-shrink-0">

      {/* Categories */}
      {categories.length > 0 && (
        <div className="mb-12">
          <h3 className="text-[13px] font-bold tracking-[0.14em] uppercase text-[#222] mb-[26px]">
            Categories
          </h3>
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-3 mb-[18px] cursor-pointer">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat.name)}
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
        <h3 className="text-[13px] font-bold tracking-[0.14em] uppercase text-[#222] mb-[26px]">
          Price
        </h3>
        <p className="text-[16px] text-[#666] mb-[18px]">
          Price Range: ${filters.priceMin} - ${filters.priceMax}
        </p>
        <Range
          step={1}
          min={0}
          max={priceMaxLimit}
          values={[filters.priceMin, filters.priceMax]}
          onChange={([min, max]) =>
            onFiltersChange({ ...filters, priceMin: min, priceMax: max })
          }
          renderTrack={({ props, children }) => {
            const { key, ...rest } = props as any;
            return (
              <div
                key={key}
                {...rest}
                style={{
                  ...rest.style,
                  height: '4px',
                  width: '100%',
                  background: '#ececec',
                  borderRadius: '999px',
                }}
              >
                {children}
              </div>
            );
          }}
          renderThumb={({ props }) => {
            const { key, ...rest } = props;
            return (
              <div
                key={key}
                {...rest}
                style={{
                  ...rest.style,
                  height: '14px',
                  width: '14px',
                  borderRadius: '50%',
                  background: '#c97a4a',
                  cursor: 'pointer',
                }}
              />
            );
          }}
        />
        <div className="flex justify-between mt-4 text-[14px] text-[#888]">
          <span>{filters.priceMin} $</span>
          <span>{filters.priceMax} $</span>
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
                checked={filters.brands.includes(col.title)}
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
              type="checkbox"
              checked={filters.availability.includes(avail)}
              onChange={() => handleAvailability(avail)}
              className="w-5 h-5 cursor-pointer accent-[#c97a4a]"
            />
            <span className="text-[16px] text-[#444]">{avail}</span>
          </label>
        ))}
      </div>

    </aside>
  );
}