import { ICommerceAdapter } from "./adapter.interface";
import { Product, Cart, Order, Customer, ProductCategory, ProductCollection, CommerceFilters } from "../types/commerce.types";

export class ShopifyAdapter implements ICommerceAdapter {
  private domain: string;
  private accessToken: string;
  private apiVersion: string;

  constructor() {
    this.domain = process.env.SHOPIFY_STORE_DOMAIN || "";
    this.accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || "";
    this.apiVersion = "2024-01";
  }

  private async fetchShopify<T>(query: string, variables = {}): Promise<T> {
    const response = await fetch(`https://${this.domain}/api/${this.apiVersion}/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": this.accessToken,
      },
      body: JSON.stringify({ query, variables }),
      cache: "force-cache",
    });

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors.map((e: any) => e.message).join(", "));
    }

    return result.data;
  }

  async listProducts(query?: any): Promise<{ products: Product[]; count: number }> {
    const limit = query?.limit || 12;
    
    let shopifyQuery = "";
    let variables: any = { first: limit };

    // If category_id (Shopify collection) is provided, fetch via collection
    if (query?.category_id || query?.collection_id) {
      const collectionId = query.category_id || query.collection_id;
      shopifyQuery = `
        query getCollectionProducts($id: ID!, $first: Int!) {
          collection(id: $id) {
            products(first: $first) {
              edges {
                node {
                  id
                  title
                  handle
                  description
                  createdAt
                  updatedAt
                  images(first: 5) {
                    edges {
                      node {
                        url
                      }
                    }
                  }
                  variants(first: 10) {
                    edges {
                      node {
                        id
                        title
                        sku
                        createdAt
                        updatedAt
                        price {
                          amount
                          currencyCode
                        }
                        quantityAvailable
                        currentlyNotInStock
                      }
                    }
                  }
                  options {
                    id
                    name
                    values
                  }
                }
              }
            }
          }
        }
      `;
      variables.id = collectionId;
    } else {
      shopifyQuery = `
        query getProducts($first: Int!) {
          products(first: $first) {
            edges {
              node {
                id
                title
                handle
                description
                createdAt
                updatedAt
                images(first: 5) {
                  edges {
                    node {
                      url
                    }
                  }
                }
                variants(first: 10) {
                  edges {
                    node {
                      id
                      title
                      sku
                      createdAt
                      updatedAt
                      price {
                        amount
                        currencyCode
                      }
                      quantityAvailable
                      currentlyNotInStock
                    }
                  }
                }
                options {
                  id
                  name
                  values
                }
              }
            }
          }
        }
      `;
    }

    const data = await this.fetchShopify<any>(shopifyQuery, variables);
    const productsSource = data.collection ? data.collection.products : data.products;
    const products = productsSource.edges.map((edge: any) => this.mapProduct(edge.node));

    return {
      products,
      count: products.length,
    };
  }

  async listCategories(): Promise<ProductCategory[]> {
    const query = `
      query getCollections {
        collections(first: 50) {
          edges {
            node {
              id
              title
              handle
              description
            }
          }
        }
      }
    `;
    const data = await this.fetchShopify<any>(query);
    return data.collections.edges.map((edge: any) => ({
      id: edge.node.id,
      name: edge.node.title,
      handle: edge.node.handle,
      description: edge.node.description || undefined,
    }));
  }

  async listCollections(): Promise<ProductCollection[]> {
    // In Shopify, categories and collections are often mapped to the same thing
    return this.listCategories().then(cats => cats.map(c => ({
      id: c.id,
      title: c.name,
      handle: c.handle
    })));
  }

  async getFilters(): Promise<CommerceFilters> {
    const categories = await this.listCategories();
    
    return {
      categories,
      collections: categories.map(c => ({
        id: c.id,
        title: c.name,
        handle: c.handle
      })),
      priceRange: {
        min: 0,
        max: 1000,
        currency_code: "USD",
      },
      availability: ["in_stock", "out_of_stock"],
    };
  }

  async getProduct(id: string, query?: any): Promise<Product | null> {
    const shopifyQuery = `
      query getProduct($id: ID!) {
        product(id: $id) {
          id
          title
          handle
          description
          createdAt
          updatedAt
          images(first: 5) {
            edges {
              node {
                url
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                sku
                createdAt
                updatedAt
                price {
                  amount
                  currencyCode
                }
                quantityAvailable
                currentlyNotInStock
              }
            }
          }
          options {
            id
            name
            values
          }
        }
      }
    `;

    try {
      const data = await this.fetchShopify<any>(shopifyQuery, { id });
      return data.product ? this.mapProduct(data.product) : null;
    } catch (error) {
      return null;
    }
  }

  async createCart(data?: any): Promise<Cart> {
    const mutation = `
      mutation cartCreate {
        cartCreate {
          cart {
            id
            checkoutUrl
            totalQuantity
            createdAt
            updatedAt
            cost {
              totalAmount {
                amount
                currencyCode
              }
              subtotalAmount {
                amount
                currencyCode
              }
            }
          }
        }
      }
    `;
    const result = await this.fetchShopify<any>(mutation);
    return this.mapCart(result.cartCreate.cart);
  }

  async getCart(id: string): Promise<Cart | null> {
    const query = `
      query getCart($id: ID!) {
        cart(id: $id) {
          id
          createdAt
          updatedAt
          lines(first: 50) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      id
                      title
                      handle
                    }
                  }
                }
                cost {
                  totalAmount {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
          }
        }
      }
    `;
    try {
      const data = await this.fetchShopify<any>(query, { id });
      return data.cart ? this.mapCart(data.cart) : null;
    } catch (error) {
      return null;
    }
  }

  async addItemToCart(cartId: string, variantId: string, quantity: number): Promise<Cart> {
    const mutation = `
      mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            id
            cost {
              totalAmount {
                amount
                currencyCode
              }
            }
          }
        }
      }
    `;
    const result = await this.fetchShopify<any>(mutation, {
      cartId,
      lines: [{ merchandiseId: variantId, quantity }],
    });
    return this.mapCart(result.cartLinesAdd.cart);
  }

  async updateItemInCart(cartId: string, itemId: string, quantity: number): Promise<Cart> {
    const mutation = `
      mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart {
            id
            cost {
              totalAmount {
                amount
                currencyCode
              }
            }
          }
        }
      }
    `;
    const result = await this.fetchShopify<any>(mutation, {
      cartId,
      lines: [{ id: itemId, quantity }],
    });
    return this.mapCart(result.cartLinesUpdate.cart);
  }

  async removeItemFromCart(cartId: string, itemId: string): Promise<Cart> {
    const mutation = `
      mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart {
            id
            cost {
              totalAmount {
                amount
                currencyCode
              }
            }
          }
        }
      }
    `;
    const result = await this.fetchShopify<any>(mutation, {
      cartId,
      lineIds: [itemId],
    });
    return this.mapCart(result.cartLinesRemove.cart);
  }

  async listOrders(customerId: string): Promise<Order[]> {
    // Requires Customer Access Token, skeleton for now
    return [];
  }

  async getOrder(id: string): Promise<Order | null> {
    return null;
  }

  async getCustomer(id: string): Promise<Customer | null> {
    return null;
  }

  private mapProduct(p: any): Product {
    return {
      id: p.id,
      title: p.title,
      handle: p.handle,
      description: p.description,
      thumbnail: p.images?.edges[0]?.node?.url,
      images: p.images?.edges.map((e: any) => e.node.url),
      variants: p.variants?.edges.map((e: any) => ({
        id: e.node.id,
        title: e.node.title,
        sku: e.node.sku,
        price: parseFloat(e.node.price.amount),
        currency_code: e.node.price.currencyCode,
        inventory_quantity: e.node.quantityAvailable || 0,
        manage_inventory: !e.node.currentlyNotInStock,
        created_at: e.node.createdAt,
        updated_at: e.node.updatedAt,
      })),
      options: p.options?.map((o: any) => ({
        id: o.id,
        title: o.name,
        values: o.values,
      })),
      created_at: p.createdAt,
      updated_at: p.updatedAt,
    };
  }

  private mapCart(c: any): Cart {
    return {
      id: c.id,
      items: c.lines?.edges.map((e: any) => ({
        id: e.node.id,
        product_id: e.node.merchandise.product.id,
        variant_id: e.node.merchandise.id,
        title: e.node.merchandise.product.title,
        description: e.node.merchandise.title,
        quantity: e.node.quantity,
        unit_price: parseFloat(e.node.cost.totalAmount.amount) / e.node.quantity,
        total: parseFloat(e.node.cost.totalAmount.amount),
        created_at: e.node.createdAt,
        updated_at: e.node.updatedAt,
      })) || [],
      currency_code: c.cost?.totalAmount?.currencyCode || "USD",
      subtotal: parseFloat(c.cost?.subtotalAmount?.amount || "0"),
      total: parseFloat(c.cost?.totalAmount?.amount || "0"),
      created_at: c.createdAt,
      updated_at: c.updatedAt,
    };
  }
}
