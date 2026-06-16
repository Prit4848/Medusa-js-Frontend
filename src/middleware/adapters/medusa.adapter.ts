import { sdk } from "@lib/config";
import { getRegion } from "@lib/data/regions";
import { ICommerceAdapter } from "./adapter.interface";
import { Product, Cart, Order, Customer, ProductCategory, ProductCollection, CommerceFilters } from "../types/commerce.types";
import { HttpTypes } from "@medusajs/types";

export class MedusaAdapter implements ICommerceAdapter {
  async listProducts(query?: any): Promise<{ products: Product[]; count: number }> {
    try {
      const region_id = await this.getRegionId(query?.region_id);

      const {
        min_price,
        max_price,
        availability,
        category_id,
        collection_id,
        ...restQuery
      } = query || {};

      const medusaQuery: any = {
        ...restQuery,
        fields: "id,title,handle,thumbnail,variants.id,variants.title,variants.sku,variants.calculated_price,variants.inventory_quantity,variants.manage_inventory,categories.name,categories.handle,collection.title",
        region_id,
      };

      if (category_id) {
        medusaQuery.category_id = Array.isArray(category_id) ? category_id : [category_id];
      }
      if (collection_id) {
        medusaQuery.collection_id = Array.isArray(collection_id) ? collection_id : [collection_id];
      }
      
      if (availability === "in_stock") {
        medusaQuery["variants.inventory_quantity"] = { $gt: 0 };
      }

      const { products, count } = await sdk.store.product.list(
        medusaQuery,
        { next: { tags: ["products"] } }
      );

      return {
        products: products.map((p) => this.mapProduct(p as any)),
        count,
      };
    } catch (error: any) {
      if (error.name === "AbortError" || error.code === 23 || error.name === "TimeoutError") {
        throw error;
      }
      console.error("MedusaAdapter listProducts Error:", error);
      throw error;
    }
  }

  async listCategories(): Promise<ProductCategory[]> {
    const { product_categories } = await sdk.client.fetch<HttpTypes.StoreProductCategoryListResponse>(
      `/store/product-categories`
    );
    return product_categories.map((c) => ({
      id: c.id,
      name: c.name,
      handle: c.handle,
      description: c.description || undefined,
    }));
  }

  async listCollections(): Promise<ProductCollection[]> {
    const { collections } = await sdk.client.fetch<HttpTypes.StoreCollectionListResponse>(
      `/store/collections`
    );
    return collections.map((c) => ({
      id: c.id,
      title: c.title,
      handle: c.handle,
    }));
  }

  async getFilters(): Promise<CommerceFilters> {
    const [categories, collections] = await Promise.all([
      this.listCategories(),
      this.listCollections(),
    ]);

    return {
      categories,
      collections,
      priceRange: {
        min: 0,
        max: 500,
        currency_code: "USD",
      },
      availability: ["in_stock", "out_of_stock"],
    };
  }

  async getProduct(id: string, query?: any): Promise<Product | null> {
    try {
      const region_id = await this.getRegionId(query?.region_id);
      const { product } = await sdk.client.fetch<HttpTypes.StoreProductResponse>(
        `/store/products/${id}`,
        {
          query: {
            fields: "id,title,handle,description,thumbnail,images.url,variants.id,variants.title,variants.sku,variants.calculated_price,variants.inventory_quantity,variants.manage_inventory,variants.options,options.id,options.title,options.values,categories.id,categories.name,categories.handle,collection.id,collection.title",
            region_id,
          },
        }
      );
      return this.mapProduct(product);
    } catch (error) {
      return null;
    }
  }

  async getProductByHandle(handle: string, query?: any): Promise<Product | null> {
    try {
      const region_id = await this.getRegionId(query?.region_id);
      const { products } = await sdk.client.fetch<HttpTypes.StoreProductListResponse>(
        `/store/products`,
        {
          query: {
            handle,
            fields: "id,title,handle,description,thumbnail,images.url,variants.id,variants.title,variants.sku,variants.calculated_price,variants.inventory_quantity,variants.manage_inventory,variants.options,options.id,options.title,options.values,categories.id,categories.name,categories.handle,collection.id,collection.title",
            region_id,
            limit: 1,
          },
        }
      );
      return products[0] ? this.mapProduct(products[0]) : null;
    } catch (error) {
      return null;
    }
  }

  private async getRegionId(explicitRegionId?: string): Promise<string | undefined> {
    if (explicitRegionId) return explicitRegionId;
    try {
      const countryCode = process.env.NEXT_PUBLIC_DEFAULT_REGION || "us";
      const region = await getRegion(countryCode);
      return region?.id;
    } catch {
      return undefined;
    }
  }

  async createCart(data?: any): Promise<Cart> {
    const { cart } = await sdk.store.cart.create(data || {});
    return this.mapCart(cart);
  }

  async getCart(id: string): Promise<Cart | null> {
    try {
      const { cart } = await sdk.client.fetch<HttpTypes.StoreCartResponse>(`/store/carts/${id}`, {
        query: {
          fields: "*items, *region, *items.product, *items.variant, *items.thumbnail, +items.total",
        },
      });
      return this.mapCart(cart);
    } catch {
      return null;
    }
  }

  async addItemToCart(cartId: string, variantId: string, quantity: number): Promise<Cart> {
    const { cart } = await sdk.store.cart.createLineItem(cartId, { variant_id: variantId, quantity });
    return this.mapCart(cart);
  }

  async updateItemInCart(cartId: string, itemId: string, quantity: number): Promise<Cart> {
    const { cart } = await sdk.store.cart.updateLineItem(cartId, itemId, { quantity });
    return this.mapCart(cart);
  }

  async removeItemFromCart(cart_id: string, item_id: string): Promise<Cart> {
    const { parent: cart } = await sdk.store.cart.deleteLineItem(cart_id, item_id);
    return this.mapCart(cart as any);
  }

  async checkout(cartId: string): Promise<Order> {
    const response = await sdk.store.cart.complete(cartId);
    if (response.type === "order") {
      return this.mapOrder(response.order);
    }
    throw new Error(response.error?.message || "Failed to complete checkout. Cart might be incomplete.");
  }

  async listOrders(customerId: string): Promise<Order[]> {
    const { orders } = await sdk.client.fetch<HttpTypes.StoreOrderListResponse>(`/store/orders`, {
      query: { customer_id: customerId },
    });
    return orders.map(this.mapOrder);
  }

  async getOrder(id: string): Promise<Order | null> {
    try {
      const { order } = await sdk.client.fetch<HttpTypes.StoreOrderResponse>(`/store/orders/${id}`);
      return this.mapOrder(order);
    } catch {
      return null;
    }
  }

  async getCustomer(id: string): Promise<Customer | null> {
    try {
      const { customer } = await sdk.client.fetch<HttpTypes.StoreCustomerResponse>(`/store/customers/me`);
      return this.mapCustomer(customer);
    } catch {
      return null;
    }
  }

  private mapProduct(p: HttpTypes.StoreProduct): Product {
  return {
    id: p.id,
    title: p.title,
    handle: p.handle,
    description: p.description || undefined,
    thumbnail: p.thumbnail || undefined,
    images: p.images?.map((i: any) => i.url),
    category: (p as any).categories?.[0]?.name ?? undefined,
    category_id: (p as any).categories?.[0]?.id ?? undefined,       // ← add
    category_handle: (p as any).categories?.[0]?.handle ?? undefined, // ← add
    collection: (p as any).collection?.title ?? undefined,
    variants: p.variants?.map((v: any) => ({
      id: v.id,
      title: v.title,
      sku: v.sku || undefined,
      price: v.calculated_price?.calculated_amount || 0,
      currency_code: v.calculated_price?.currency_code || "USD",
      inventory_quantity: v.inventory_quantity || 0,
      manage_inventory: !!v.manage_inventory,
      options: v.options?.reduce((acc: any, opt: any) => {
        acc[opt.option_id] = opt.value;
        return acc;
      }, {}),
      created_at: v.created_at || undefined,
      updated_at: v.updated_at || undefined,
    })) || [],
    options: p.options?.map((o: any) => ({
      id: o.id,
      title: o.title,
      values: o.values?.map((v: any) => v.value) || [],
    })),
    created_at: p.created_at || undefined,
    updated_at: p.updated_at || undefined,
  };
}

  private mapCart(c: HttpTypes.StoreCart): Cart {
    return {
      id: c.id,
      items: c.items?.map((i: any) => ({
        id: i.id,
        product_id: i.product_id,
        variant_id: i.variant_id,
        title: i.title,
        description: i.variant?.title,
        thumbnail: i.thumbnail || undefined,
        quantity: i.quantity,
        unit_price: i.unit_price,
        total: i.total,
        created_at: i.created_at,
        updated_at: i.updated_at,
      })) || [],
      region_id: c.region_id || undefined,
      currency_code: c.currency_code,
      subtotal: (c as any).subtotal || 0,
      total: c.total,
      shipping_total: (c as any).shipping_total || 0,
      tax_total: (c as any).tax_total || 0,
      created_at: c.created_at ? String(c.created_at) : undefined,
      updated_at: c.updated_at ? String(c.updated_at) : undefined,
    };
  }

  private mapOrder(o: HttpTypes.StoreOrder): Order {
    return {
      id: o.id,
      status: o.status,
      items: o.items?.map((i: any) => ({
        id: i.id,
        product_id: i.product_id,
        variant_id: i.variant_id,
        title: i.title,
        quantity: i.quantity,
        unit_price: i.unit_price,
        total: i.total,
        created_at: i.created_at,
        updated_at: i.updated_at,
      })) || [],
      total: o.total,
      currency_code: o.currency_code,
      customer_id: o.customer_id || undefined,
      email: o.email || "",
      created_at: o.created_at ? String(o.created_at) : undefined,
      updated_at: o.updated_at ? String(o.updated_at) : undefined,
    };
  }

  private mapCustomer(c: HttpTypes.StoreCustomer): Customer {
    return {
      id: c.id,
      email: c.email,
      first_name: c.first_name || undefined,
      last_name: c.last_name || undefined,
      phone: c.phone || undefined,
    };
  }
}
