import { AdapterFactory } from "@/middleware/factory/adapter.factory";
import ShopPage from "@/components/shop/ShopPage";
import { notFound } from "next/navigation";
import Link from "next/link";

const PLACEHOLDER = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=70';

// Helper to get product price for filtering/sorting
function getProductPrice(product: any): number {
  if (product.price?.amount != null) return product.price.amount;
  const variantPrices = product.variants?.map((v: any) => v.price) ?? [];
  if (!variantPrices.length) return 0;
  return Math.min(...variantPrices);
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { handle } = await params;
  const sParams = await searchParams;
  const adapter = AdapterFactory.getAdapter();

  const page = parseInt(sParams.page as string) || 1;
  const limit = 12;
  const sortBy = (sParams.sort as string) || "Most Popular";
  const minPrice = sParams.min_price ? parseInt(sParams.min_price as string) : 0;
  const maxPrice = sParams.max_price ? parseInt(sParams.max_price as string) : 1500;
  const isPriceFiltered = sParams.min_price || sParams.max_price;
  const isSortingByPrice = sortBy === "Price: Low to High" || sortBy === "Price: High to Low";
  const isManualProcessing = isPriceFiltered || isSortingByPrice;

  const [categories, collectionsResult] = await Promise.all([
    adapter.listCategories(),
    adapter.listCollections(),
  ]);

  const collections = collectionsResult ?? [];
  const currentCategory = (categories as any[]).find(
    (c) => c.handle === handle
  );

  if (!currentCategory) notFound();

  const query: any = {
    limit: isManualProcessing ? 100 : limit,
    offset: isManualProcessing ? 0 : (page - 1) * limit,
    category_id: [currentCategory.id],
  };

  // Map sort (only if not doing in-memory sort)
  if (!isManualProcessing) {
    if (sortBy === "Newest") {
      query.order = "-created_at";
    }
  }

  // Filter by Brand IDs
  if (sParams.brand) {
    const selectedBrands = Array.isArray(sParams.brand) ? sParams.brand : [sParams.brand];
    const collectionIds = collections
      .filter(c => selectedBrands.includes(c.title))
      .map(c => c.id);
    if (collectionIds.length > 0) {
      query.collection_id = collectionIds;
    }
  }

  if (sParams.availability === "On Stock") query.availability = "in_stock";

  try {
    const { products: fetchedProducts, count: totalCount } = await adapter.listProducts(query);
    
    let products = fetchedProducts.map(p => ({
      ...p,
      thumbnail: p.thumbnail || PLACEHOLDER
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
      // Apply pagination
      const offset = (page - 1) * limit;
      displayProducts = displayProducts.slice(offset, offset + limit);
    }

    return (
      <>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-4 text-[14px] sm:text-[15px] text-gray-400 flex items-center gap-2">
          <Link href="/shop" className="hover:text-[#c87a4c]">
            Category
          </Link>
          <span>&gt;</span>
          <span>{currentCategory.name}</span>
        </div>

        <div className="border-b border-gray-200 max-w-[1600px] mx-auto" />

        <ShopPage
          products={displayProducts}
          categories={categories as any}
          collections={collections as any}
          totalProducts={displayCount}
          currentPage={page}
          limit={limit}
        />
      </>
    );
  } catch (error: any) {
    if (error.name === "AbortError" || error.code === 23 || error.name === "TimeoutError") {
      throw error;
    }
    console.error("Category Error:", error);
    return <div>Error loading category. Please try again later.</div>;
  }
}
