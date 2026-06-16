import { sdk } from "@lib/config";
import { HttpTypes } from "@medusajs/types";
import { getCacheOptions } from "@lib/data/cookies";
import ProductCarousel from "./ProductCarousel";
import { Product } from "@/middleware/types/commerce.types";

async function getFeaturedProducts(limit = 12): Promise<Product[]> {
  const next = { ...(await getCacheOptions("products")) };

  try {
    const { regions } = await sdk.client.fetch<HttpTypes.StoreRegionListResponse>(
      `/store/regions`,
      { query: { limit: 1 }, next, cache: "force-cache" }
    );
    const region_id = regions[0]?.id;

    const { products } = await sdk.client.fetch<HttpTypes.StoreProductListResponse>(
      `/store/products`,
      {
        query: {
          fields: "id,title,handle,thumbnail,variants.id,variants.title,variants.sku,variants.calculated_price,variants.inventory_quantity,variants.manage_inventory,categories.name,categories.handle,collection.title",
          region_id,
          limit,
        },
        next,
        cache: "force-cache",
      }
    );

    return products.map((p) => ({
      id: p.id,
      title: p.title,
      handle: p.handle,
      description: p.description ?? undefined,
      thumbnail: p.thumbnail ?? undefined,
      images: p.images?.map((i: any) => i.url),
      category: (p as any).categories?.[0]?.name ?? undefined,
      collection: (p as any).collection?.title ?? undefined,
      variants: p.variants?.map((v: any) => ({
        id: v.id,
        title: v.title,
        sku: v.sku ?? undefined,
        price: v.calculated_price?.calculated_amount ?? 0,
        currency_code: v.calculated_price?.currency_code ?? "USD",
        inventory_quantity: v.inventory_quantity ?? 0,
        manage_inventory: !!v.manage_inventory,
        options: {},
        created_at: v.created_at ?? undefined,
        updated_at: v.updated_at ?? undefined,
      })) ?? [],
      created_at: p.created_at ?? undefined,
      updated_at: p.updated_at ?? undefined,
    }));
  } catch {
    return [];
  }
}

export default async function ProductCarouselWrapper() {
  const products = await getFeaturedProducts(12);
  if (!products.length) return null;
  return <ProductCarousel title="You may also like:" products={products} />;
}
