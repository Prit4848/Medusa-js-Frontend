'use client';

import { useMemo, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Product, ProductCategory, ProductCollection } from '@/middleware/types/commerce.types';
import ShopSidebar from './ShopSidebar';
import ShopProductGrid from './ShopProductGrid';
import { getProductPrice, SortOption, MAX_PRICE_LIMIT, PRODUCTS_PER_PAGE } from '@/lib/util/commerce';

export interface ShopFilters {
  categories: string[];
  brands: string[];
  priceMin: number;
  priceMax: number;
  availability: string[];
  minRating: number;  
}

interface ShopPageProps {
  products: Product[];
  categories: ProductCategory[];
  collections: ProductCollection[];
  totalProducts: number;
  currentPage: number;
  limit: number;
}

export default function ShopPage({
  products,
  categories,
  collections,
  totalProducts,
  currentPage,
  limit = PRODUCTS_PER_PAGE
}: ShopPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Sync filters from URL
  const filters: ShopFilters = useMemo(() => ({
    categories: searchParams.getAll('category'),
    brands: searchParams.getAll('brand'),
    priceMin: parseInt(searchParams.get('min_price') || '0'),
    priceMax: parseInt(searchParams.get('max_price') || MAX_PRICE_LIMIT.toString()),
    availability: searchParams.getAll('availability'),
    minRating: parseInt(searchParams.get('min_rating') || '0'),
  }), [searchParams]);

  const sortBy = (searchParams.get('sort') as SortOption) || 'Most Popular';

  const updateFilters = (newFilters: ShopFilters) => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete('category');
    params.delete('brand');
    params.delete('availability');
    params.delete('min_price');
    params.delete('max_price');
    params.delete('min_rating');
    params.set('page', '1');

    newFilters.categories.forEach(cat => params.append('category', cat));
    newFilters.brands.forEach(brand => params.append('brand', brand));
    newFilters.availability.forEach(avail => params.append('availability', avail));
    params.set('min_price', newFilters.priceMin.toString());
    params.set('max_price', newFilters.priceMax.toString());
    
    if (newFilters.minRating > 0) {
      params.set('min_rating', newFilters.minRating.toString());
    } else {
      params.delete('min_rating');
    }

    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });
  };

  const handleSortChange = (newSort: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', newSort);
    params.set('page', '1');
    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });
  };

  const currencyCode = useMemo(() => {
    return products[0]?.price?.currency_code ?? products[0]?.variants?.[0]?.currency_code ?? "USD";
  }, [products]);

  return (
    <div className="flex flex-col lg:flex-row bg-[#fafafa] min-h-screen max-w-[1600px] mx-auto">
      <aside className="w-full lg:w-auto">
        <ShopSidebar
          filters={filters}
          onFiltersChange={updateFilters}
          categories={categories}
          collections={collections}
          priceMaxLimit={MAX_PRICE_LIMIT}
          currencyCode={currencyCode}
        />
      </aside>
      <main className="flex-1">
        <ShopProductGrid
          products={products}
          totalProducts={totalProducts}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          getPrice={getProductPrice}
          currentPage={currentPage}
          limit={limit}
          onPageChange={handlePageChange}
          isLoading={isPending}
        />
      </main>
    </div>
  );
}