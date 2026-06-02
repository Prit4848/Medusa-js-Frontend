export interface ProductCategory {
  id: string;
  name: string;
  handle: string;
  description?: string;
}

export interface ProductCollection {
  id: string;
  title: string;
  handle: string;
}

export interface CommerceFilters {
  categories: ProductCategory[];
  collections: ProductCollection[];
  priceRange: {
    min: number;
    max: number;
    currency_code: string;
  };
  availability: string[];
}

export interface Product {
  id: string;
  title: string;
  handle: string;
  description?: string;
  thumbnail?: string;
  images?: string[];
  variants: ProductVariant[];
  options?: ProductOption[];
  price?: {
    amount: number;
    currency_code: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  sku?: string;
  price: number;
  currency_code: string;
  inventory_quantity: number;
  manage_inventory: boolean;
  options?: Record<string, string>;
  created_at?: string;
  updated_at?: string;
}

export interface ProductOption {
  id: string;
  title: string;
  values: string[];
}

export interface Cart {
  id: string;
  items: CartItem[];
  region_id?: string;
  currency_code: string;
  subtotal: number;
  total: number;
  shipping_total?: number;
  tax_total?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  variant_id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  quantity: number;
  unit_price: number;
  total: number;
  created_at?: string;
  updated_at?: string;
}

export interface Order {
  id: string;
  status: string;
  items: CartItem[];
  total: number;
  currency_code: string;
  customer_id?: string;
  email: string;
  created_at?: string;
  updated_at?: string;
}

export interface Customer {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
}
