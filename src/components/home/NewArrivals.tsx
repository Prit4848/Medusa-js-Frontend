import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/middleware/types/commerce.types';
import { AdapterFactory } from '@/middleware/factory/adapter.factory';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=70';

export default async function NewArrivals() {
  let products: Product[] = [];
  
  try {
    const adapter = AdapterFactory.getAdapter();
    const result = await adapter.listProducts({ limit: 4 });
    products = result.products;
  } catch (error) {
    console.error("Error fetching products:", error);
    products = [];
  }

  // Get lowest price from variants
  const getPrice = (product: Product): string => {
    if (product.price) {
      return product.price.amount.toFixed(2);
    }

    const variantPrices = product.variants?.map((v) => v.price) ?? [];
    if (!variantPrices.length) return 'N/A';
    const min = Math.min(...variantPrices);

    return min.toFixed(2);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">New Arrivals</h2>
          <p className="text-gray-500 text-base max-w-4xl mx-auto leading-relaxed">
            Check out our new furniture collection! Cozy sofa, fancy chair, wooden casket,
            and many more. The new collection brings an informal elegance to your home.
          </p>
        </div>

        {/* Grid */}
        {products.length === 0 ? (
          <p className="text-center text-gray-400">No products found.</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.handle}`}
                className="group block"
              >
                {/* Image */}
                <div className="relative aspect-square bg-gray-100 mb-4 overflow-hidden">
                  <Image
                    src={product.thumbnail || PLACEHOLDER}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>

                {/* Variant count */}
                <p className="text-sm text-gray-400 mb-1">
                  {product.variants?.length ?? 0} variant{product.variants?.length !== 1 ? 's' : ''}
                </p>

                {/* Title */}
                <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-[#c17f4a] transition-colors">
                  {product.title}
                </h3>

                {/* Price */}
                <p className="text-base text-gray-900">${getPrice(product)}</p>
              </Link>
            ))}
          </div>
        )}

        {/* View More */}
        <div className="flex justify-center mt-16">
          <Link
            href="/shop"
            className="border border-[#c17f4a] text-[#c17f4a] text-xs font-bold tracking-widest uppercase px-12 py-4 hover:bg-[#c17f4a] hover:text-white transition-all duration-300"
          >
            VIEW MORE
          </Link>
        </div>

      </div>
    </section>
  );
}