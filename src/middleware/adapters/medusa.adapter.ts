import { sdk } from "@lib/config";
import { ICommerceAdapter } from "./adapter.interface";
import { Product, Cart, Order, Customer } from "../types/commerce.types";
import { HttpTypes } from "@medusajs/types";

export class MedusaAdapter implements ICommerceAdapter {
  async listProducts(query?: any): Promise<{ products: Product[]; count: number }> {
    const region_id = await this.getRegionId(query?.region_id);
    
    // Normalize filters for Medusa
    const medusaQuery: any = {
      fields: "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags,",
      ...query,
      region_id,
    };

    if (query?.category_id) {
      medusaQuery.category_id = query.category_id;
    }
    if (query?.collection_id) {
      medusaQuery.collection_id = query.collection_id;
    }
    if (query?.min_price) {
      medusaQuery.min_price = query.min_price;
    }
    if (query?.max_price) {
      medusaQuery.max_price = query.max_price;
    }

    if (query?.availability === "in_stock") {
      // Simple approximation for Medusa v2
      medusaQuery["variants.inventory_quantity"] = { $gt: 0 };
    }

    const { products, count } = await sdk.client.fetch<HttpTypes.StoreProductListResponse>(
      `/store/products`,
      {
        query: medusaQuery,
      }
    );

    return {
      products: products.map((p) => this.mapProduct(p)),
      count,
    };
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
            fields: "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags,",
            region_id,
          },
        }
      );
      return this.mapProduct(product);
    } catch (error) {
      return null;
    }
  }

  private async getRegionId(explicitRegionId?: string): Promise<string | undefined> {
    if (explicitRegionId) {
      return explicitRegionId;
    }

    try {
      const { regions } = await sdk.client.fetch<HttpTypes.StoreRegionListResponse>(`/store/regions`, {
        query: { limit: 1 },
      });
      return regions[0]?.id;
    } catch (error) {
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
    } catch (error) {
      return null;
    }
  }

  async addItemToCart(cartId: string, variantId: string, quantity: number): Promise<Cart> {
    const { cart } = await sdk.store.cart.createLineItem(cartId, {
      variant_id: variantId,
      quantity,
    });
    return this.mapCart(cart);
  }

  async updateItemInCart(cartId: string, itemId: string, quantity: number): Promise<Cart> {
    const { cart } = await sdk.store.cart.updateLineItem(cartId, itemId, {
      quantity,
    });
    return this.mapCart(cart);
  }

  async removeItemFromCart(cartId: string, itemId: string): Promise<Cart> {
    const { cart } = await sdk.store.cart.deleteLineItem(cartId, itemId);
    return this.mapCart(cart);
  }

  async listOrders(customerId: string): Promise<Order[]> {
    const { orders } = await sdk.client.fetch<HttpTypes.StoreOrderListResponse>(`/store/orders`, {
      query: {
        customer_id: customerId,
      },
    });
    return orders.map(this.mapOrder);
  }

  async getOrder(id: string): Promise<Order | null> {
    try {
      const { order } = await sdk.client.fetch<HttpTypes.StoreOrderResponse>(`/store/orders/${id}`);
      return this.mapOrder(order);
    } catch (error) {
      return null;
    }
  }

  async getCustomer(id: string): Promise<Customer | null> {
    try {
      const { customer } = await sdk.client.fetch<HttpTypes.StoreCustomerResponse>(`/store/customers/me`);
      return this.mapCustomer(customer);
    } catch (error) {
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
        created_at: v.created_at,
        updated_at: v.updated_at,
      })) || [],
      options: p.options?.map((o: any) => ({
        id: o.id,
        title: o.title,
        values: o.values?.map((v: any) => v.value) || [],
      })),
      created_at: p.created_at,
      updated_at: p.updated_at,
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
      created_at: c.created_at,
      updated_at: c.updated_at,
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
      email: o.email,
      created_at: o.created_at,
      updated_at: o.updated_at,
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
