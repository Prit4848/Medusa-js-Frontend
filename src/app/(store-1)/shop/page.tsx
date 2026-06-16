import { Suspense } from 'react';
import { AdapterFactory } from '@/middleware/factory/adapter.factory';
import { Product } from '@/middleware/types/commerce.types';
import ShopPage from '@/components/shop/ShopPage';
import { ShopSkeleton } from '@/components/skeletons/HomeSkeletons';

export const metadata = {
  title: 'Shop | Flatlogic',
  description: 'Browse our collection of furniture, lighting, decoration and more.',
};

const PLACEHOLDER = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=70';

// Helper to get product price for filtering/sorting
function getProductPrice(product: Product): number {
  if (product.price?.amount != null) return product.price.amount;
  const variantPrices = product.variants?.map((v) => v.price) ?? [];
  if (!variantPrices.length) return 0;
  return Math.min(...variantPrices);
}

async function ShopContent({ searchParams }: { searchParams: any }) {
  const adapter = AdapterFactory.getAdapter();

  const page = parseInt(searchParams.page as string) || 1;
  const limit = 12;
  const sortBy = (searchParams.sort as string) || "Most Popular";
  const minPrice = searchParams.min_price ? parseInt(searchParams.min_price) : 0;
  const maxPrice = searchParams.max_price ? parseInt(searchParams.max_price) : 1500;
  const isPriceFiltered = searchParams.min_price || searchParams.max_price;
  const isSortingByPrice = sortBy === "Price: Low to High" || sortBy === "Price: High to Low";
  const isManualProcessing = isPriceFiltered || isSortingByPrice;

  // Initial query for categories and collections
  const filtersData = await adapter.getFilters();
  const categories = filtersData.categories;
  const collections = filtersData.collections;

  const query: any = {
    limit: isManualProcessing ? 100 : limit,
    offset: isManualProcessing ? 0 : (page - 1) * limit,
  };

  // Map sort options to Medusa fields (only if not doing in-memory sort)
  if (!isManualProcessing) {
    if (sortBy === "Newest") {
      query.order = "-created_at";
    }
  }

  // Filter by Category IDs
  if (searchParams.category) {
    const selectedCats = Array.isArray(searchParams.category) ? searchParams.category : [searchParams.category];
    const categoryIds = categories
      .filter(c => selectedCats.includes(c.name))
      .map(c => c.id);
    if (categoryIds.length > 0) {
      query.category_id = categoryIds;
    }
  }

  // Filter by Collection IDs (Brands)
  if (searchParams.brand) {
    const selectedBrands = Array.isArray(searchParams.brand) ? searchParams.brand : [searchParams.brand];
    const collectionIds = collections
      .filter(c => selectedBrands.includes(c.title))
      .map(c => c.id);
    if (collectionIds.length > 0) {
      query.collection_id = collectionIds;
    }
  }

  // Filter by Availability
  if (searchParams.availability === "On Stock") {
    query.availability = "in_stock";
  }

  try {
    const { products: fetchedProducts, count: totalCount } = await adapter.listProducts(query);
   
    let products: Product[] = fetchedProducts.map((p) => ({
      ...p,
      thumbnail: p.thumbnail || PLACEHOLDER,
    }));

    let displayProducts = products;
    let displayCount = totalCount;

    // Apply in-memory price filtering and sorting if needed
    if (isManualProcessing) {
      if (isPriceFiltered) {
        displayProducts = products.filter(p => {
          const price = getProductPrice(p);
          return price >= minPrice && price <= maxPrice;
        });
      }

      // Apply in-memory sort
      if (sortBy === "Price: Low to High") {
        displayProducts.sort((a, b) => getProductPrice(a) - getProductPrice(b));
      } else if (sortBy === "Price: High to Low") {
        displayProducts.sort((a, b) => getProductPrice(b) - getProductPrice(a));
      } else if (sortBy === "Newest") {
        displayProducts.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
      }

      displayCount = displayProducts.length;
      // Apply pagination to the filtered set
      const offset = (page - 1) * limit;
      displayProducts = displayProducts.slice(offset, offset + limit);
    }

    return (
      <ShopPage
        products={displayProducts}
        categories={categories}
        collections={collections}
        totalProducts={displayCount}
        currentPage={page}
        limit={limit}
      />
    );
  } catch (error: any) {
    if (error.name === "AbortError" || error.code === 23 || error.name === "TimeoutError") {
      throw error;
    }
    console.error("Shop Error:", error);
    return <div>Error loading shop. Please try again later.</div>;
  }
}

export default async function Shop({
  params,
  searchParams,
}: {
  params: Promise<any>;
  searchParams: Promise<any>;
}) {
  const sParams = await searchParams;
  return (
    <Suspense fallback={<ShopSkeleton />}>
      <ShopContent searchParams={sParams} />
    </Suspense>
  );
}
