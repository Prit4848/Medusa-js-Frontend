import { Product, Cart, Order, Customer, ProductCategory, ProductCollection, CommerceFilters } from "../types/commerce.types";

export interface ICommerceAdapter {
  // Products
  listProducts(query?: any): Promise<{ products: Product[]; count: number }>;
  getProduct(id: string, query?: any): Promise<Product | null>;
  
  // Filters/Metadata
  listCategories(): Promise<ProductCategory[]>;
  listCollections(): Promise<ProductCollection[]>;
  getFilters(): Promise<CommerceFilters>;

  // Cart
  createCart(data?: any): Promise<Cart>;
  getCart(id: string): Promise<Cart | null>;
  addItemToCart(cartId: string, variantId: string, quantity: number): Promise<Cart>;
  updateItemInCart(cartId: string, itemId: string, quantity: number): Promise<Cart>;
  removeItemFromCart(cartId: string, itemId: string): Promise<Cart>;

  // Orders
  listOrders(customerId: string): Promise<Order[]>;
  getOrder(id: string): Promise<Order | null>;

  // Auth/Customer
  getCustomer(id: string): Promise<Customer | null>;
  // ... more methods as needed
}
