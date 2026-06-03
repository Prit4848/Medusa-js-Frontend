import { AdapterFactory } from "@/middleware/factory/adapter.factory";
import ShopPage from "@/components/shop/ShopPage";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const adapter = AdapterFactory.getAdapter();

  const [categories, collectionsResult, allProductsResult] = await Promise.all([
    adapter.listCategories(),
    adapter.listCollections(),
    adapter.listProducts({ limit: 100 }),
  ]);

  const collections = collectionsResult ?? [];
  const allProducts = allProductsResult?.products ?? [];

  const currentCategory = (categories as any[]).find(
    (c) => c.handle === handle
  );

  if (!currentCategory) notFound();

  const filteredProducts = allProducts.filter(
    (p: any) => p.category_handle === handle
  );

  return (
    <>
      <div className="max-w-[1600px] mx-auto px-6 py-4 text-[15px] text-gray-400 flex items-center gap-2">
        <Link href="/shop" className="hover:text-[#c87a4c]">
          Category
        </Link>
        <span>&gt;</span>
        <span>{currentCategory.name}</span>
      </div>

      <div className="border-b border-gray-200 max-w-[1600px] mx-auto" />

      <ShopPage
        products={filteredProducts}
        categories={categories as any}
        collections={collections as any}
      />
    </>
  );
}
