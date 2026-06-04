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
  currentPage: number;
  limit: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
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
  currentPage,
  limit,
  onPageChange,
  isLoading,
}: ShopProductGridProps) {
  const totalPages = Math.ceil(totalProducts / limit);

  return (
    <div className="flex-1 px-6 lg:px-[42px] py-8 lg:py-[50px] bg-[#fafafa]">

      {/* top bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10 lg:mb-[60px]">
        <p className="text-[16px] lg:text-[18px] text-[#555] font-normal">
          {isLoading ? (
            <span className="h-6 w-48 bg-gray-200 animate-pulse rounded inline-block"></span>
          ) : (
            <>
              Showing{' '}
              <span className="text-[#c86f43] font-semibold">{products.length}</span>
              {' '}of{' '}
              <span className="text-[#c86f43] font-semibold">{totalProducts}</span>
              {' '}Products
            </>
          )}
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
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 lg:gap-x-[35px] gap-y-10 lg:gap-y-[40px]">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200 mb-4 rounded"></div>
              <div className="h-4 w-20 bg-gray-200 mb-2 rounded"></div>
              <div className="h-5 w-40 bg-gray-200 mb-2 rounded"></div>
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-[#999] mt-[60px]">
          No products match your filters.
        </p>
      ) : (
        <>
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

          {/* Classic Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-16 lg:mt-[80px]">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center border border-[#e5e5e5] bg-white text-[#555] hover:bg-[#c86f43] hover:text-white transition disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-[#555]"
              >
                &lt;
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`w-10 h-10 flex items-center justify-center border transition ${
                    currentPage === page
                      ? 'bg-[#c86f43] border-[#c86f43] text-white'
                      : 'bg-white border-[#e5e5e5] text-[#555] hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex items-center justify-center border border-[#e5e5e5] bg-white text-[#555] hover:bg-[#c86f43] hover:text-white transition disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-[#555]"
              >
                &gt;
              </button>
            </div>
          )}
        </>
      )}

    </div>
  );
}