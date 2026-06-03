'use client';

import { useState, useMemo } from 'react';
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
}

// Mirrors NewArrivals getPrice exactly
function getPrice(product: Product): number {
  if (product.price?.amount != null) return product.price.amount;
  const variantPrices = product.variants?.map((v) => v.price) ?? [];
  if (!variantPrices.length) return 0;
  return Math.min(...variantPrices);
}

export default function ShopPage({ products, categories, collections }: ShopPageProps) {
  const priceMaxLimit = useMemo(() => {
    const max = Math.max(...products.map(getPrice), 0);
    return max > 0 ? Math.ceil(max / 100) * 100 : 1500;
  }, [products]);

  const [filters, setFilters] = useState<ShopFilters>({
    categories: [],
    brands: [],
    priceMin: 0,
    priceMax: priceMaxLimit,
    availability: [],
  });
  const [sortBy, setSortBy] = useState<SortOption>('Most Popular');

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by category name
    if (filters.categories.length > 0) {
      result = result.filter((p) =>
        p.category ? filters.categories.includes(p.category) : false
      );
    }

    // Filter by collection title (brand)
    if (filters.brands.length > 0) {
      result = result.filter((p) =>
        p.collection ? filters.brands.includes(p.collection) : false
      );
    }

    // Filter by price
    result = result.filter((p) => {
      const price = getPrice(p);
      return (
        price >= filters.priceMin &&
        price <= filters.priceMax
      );
    });

    // Filter by availability using inventory_quantity from variants
    if (filters.availability.length > 0) {
      const wantInStock = filters.availability.includes('On Stock');
      const wantOutOfStock = filters.availability.includes('Out of Stock');
      if (wantInStock && !wantOutOfStock) {
        result = result.filter((p) =>
          p.variants?.some((v) => v.inventory_quantity > 0)
        );
      } else if (wantOutOfStock && !wantInStock) {
        result = result.filter((p) =>
          p.variants?.every((v) => v.inventory_quantity === 0)
        );
      }
    }

    // Sort
    switch (sortBy) {
      case 'Price: Low to High':
        result.sort((a, b) => getPrice(a) - getPrice(b));
        break;
      case 'Price: High to Low':
        result.sort((a, b) => getPrice(b) - getPrice(a));
        break;
      case 'Newest':
        result.sort(
          (a, b) =>
            new Date(b.created_at ?? 0).getTime() -
            new Date(a.created_at ?? 0).getTime()
        );
        break;
      default:
        break;
    }

    return result;
  }, [products, filters, sortBy]);

  const currencyCode = useMemo(() => {
    return products[0]?.price?.currency_code ?? products[0]?.variants?.[0]?.currency_code ?? "USD";
  }, [products]);

  return (
    <div className="flex flex-col lg:flex-row bg-[#fafafa] min-h-screen max-w-[1600px] mx-auto">
      <div className="w-full lg:w-auto">
        <ShopSidebar
          filters={filters}
          onFiltersChange={setFilters}
          categories={categories}
          collections={collections}
          priceMaxLimit={priceMaxLimit}
          currencyCode={currencyCode}
        />
      </div>
      <ShopProductGrid
        products={filteredProducts}
        totalProducts={products.length}
        sortBy={sortBy}
        onSortChange={setSortBy}
        getPrice={getPrice}
      />
    </div>
  );
  }