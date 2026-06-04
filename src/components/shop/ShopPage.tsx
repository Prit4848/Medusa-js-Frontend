'use client';

import { useMemo, useEffect, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Product, ProductCategory, ProductCollection } from '@/middleware/types/commerce.types';
import ShopSidebar from './ShopSidebar';
import ShopProductGrid from './ShopProductGrid';

export type SortOption =
  | 'Most Popular'
  | 'Price: Low to High'
  | 'Price: High to Low'
  | 'Newest';

export interface ShopFilters {
  categories: string[];
  brands: string[];
  priceMin: number;
  priceMax: number;
  availability: string[];
}

interface ShopPageProps {
  products: Product[];
  categories: ProductCategory[];
  collections: ProductCollection[];
  totalProducts: number;
  currentPage: number;
  limit: number;
}

// Mirrors NewArrivals getPrice exactly
function getPrice(product: Product): number {
  if (product.price?.amount != null) return product.price.amount;
  const variantPrices = product.variants?.map((v) => v.price) ?? [];
  if (!variantPrices.length) return 0;
  return Math.min(...variantPrices);
}

export default function ShopPage({ 
  products, 
  categories, 
  collections,
  totalProducts,
  currentPage,
  limit
}: ShopPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const priceMaxLimit = 1500; // Fixed or could be dynamic

  // Sync filters from URL
  const filters: ShopFilters = useMemo(() => {
    return {
      categories: searchParams.getAll('category'),
      brands: searchParams.getAll('brand'),
      priceMin: parseInt(searchParams.get('min_price') || '0'),
      priceMax: parseInt(searchParams.get('max_price') || priceMaxLimit.toString()),
      availability: searchParams.getAll('availability'),
    };
  }, [searchParams]);

  const sortBy = (searchParams.get('sort') as SortOption) || 'Most Popular';

  const updateFilters = (newFilters: ShopFilters) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Clear existing to avoid duplicates
    params.delete('category');
    params.delete('brand');
    params.delete('availability');
    params.delete('min_price');
    params.delete('max_price');
    params.delete('page'); // Reset to page 1 on filter change

    newFilters.categories.forEach(cat => params.append('category', cat));
    newFilters.brands.forEach(brand => params.append('brand', brand));
    newFilters.availability.forEach(avail => params.append('availability', avail));
    params.set('min_price', newFilters.priceMin.toString());
    params.set('max_price', newFilters.priceMax.toString());

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
      <div className="w-full lg:w-auto">
        <ShopSidebar
          filters={filters}
          onFiltersChange={updateFilters}
          categories={categories}
          collections={collections}
          priceMaxLimit={priceMaxLimit}
          currencyCode={currencyCode}
        />
      </div>
      <ShopProductGrid
        products={products}
        totalProducts={totalProducts}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        getPrice={getPrice}
        currentPage={currentPage}
        limit={limit}
        onPageChange={handlePageChange}
        isLoading={isPending}
      />
    </div>
  );
}