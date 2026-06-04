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

async function ShopContent() {
  const adapter = AdapterFactory.getAdapter();

  try {
    // Fetch products + filters in parallel
    const [productResult, filters] = await Promise.all([
      adapter.listProducts({ limit: 15 }),
      adapter.getFilters(),
    ]);
   
    const products: Product[] = productResult.products.map((p) => ({
      ...p,
      thumbnail: p.thumbnail || PLACEHOLDER,
    }));
    const categories = filters.categories;
    const collections = filters.collections;

    return (
      <ShopPage
        products={products}
        categories={categories}
        collections={collections}
      />
    );
  } catch (error) {
  
    return <div>Error loading shop. Please try again later.</div>;
  }
}

export default function Shop() {
  return (
    <Suspense fallback={<ShopSkeleton />}>
      <ShopContent />
    </Suspense>
  );
}
