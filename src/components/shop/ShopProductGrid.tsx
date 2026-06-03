'use client';

import { Product } from '@/middleware/types/commerce.types';
import { SortOption } from './ShopPage';
import ShopProductCard from './ShopProductCard';

interface ShopProductGridProps {
  products: Product[];
  totalProducts: number;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  getPrice: (product: Product) => number;
}

const SORT_OPTIONS: SortOption[] = [
  'Most Popular',
  'Price: Low to High',
  'Price: High to Low',
  'Newest',
];

export default function ShopProductGrid({
  products,
  totalProducts,
  sortBy,
  onSortChange,
  getPrice,
}: ShopProductGridProps) {
  return (
    <div className="flex-1 px-6 lg:px-[42px] py-8 lg:py-[50px] bg-[#fafafa]">

      {/* top bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10 lg:mb-[60px]">
        <p className="text-[16px] lg:text-[18px] text-[#555] font-normal">
          Showing{' '}
          <span className="text-[#c86f43] font-semibold">{products.length}</span>
          {' '}of{' '}
          <span className="text-[#c86f43] font-semibold">{totalProducts}</span>
          {' '}Products
        </p>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <span className="text-[16px] lg:text-[18px] text-[#555] whitespace-nowrap">Sort by:</span>
          <div className="relative inline-flex items-center flex-1 sm:flex-initial">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="
                w-full sm:w-[200px] h-[50px] lg:h-[58px]
                border border-[#e5e5e5] bg-white
                pl-[22px] pr-[45px]
                text-[15px] lg:text-[16px] text-[#555]
                outline-none appearance-none cursor-pointer
              "
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <span className="absolute right-[18px] pointer-events-none text-[#777] text-[12px]">
              ▾
            </span>
          </div>
        </div>
      </div>

      {/* grid or empty */}
      {products.length === 0 ? (
        <p className="text-center text-[#999] mt-[60px]">
          No products match your filters.
        </p>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 lg:gap-x-[35px] gap-y-10 lg:gap-y-[40px]"
        >
          {products.map((product) => (
            <div key={product.id} className="w-full">
              <ShopProductCard
                product={product}
                price={getPrice(product)}
              />
            </div>
          ))}
        </div>
      )}

    </div>
  );
}