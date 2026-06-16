import { Product } from "@/middleware/types/commerce.types"

/**
 * Gets the lowest price from a product's variants or its base price.
 */
export function getProductPrice(product: Product): number {
  if (product.price?.amount != null) {
    return product.price.amount
  }

  const variantPrices =
    product.variants?.map((v) => v.price) ?? []

  if (!variantPrices.length) {
    return 0
  }

  return Math.min(...variantPrices)
}

/**
 * Common Sort Options for the Shop
 */
export type SortOption =
  | "Most Popular"
  | "Price: Low to High"
  | "Price: High to Low"
  | "Newest"

export const DEFAULT_SORT: SortOption = "Most Popular"
export const PRODUCTS_PER_PAGE = 12
export const MAX_PRICE_LIMIT = 1500
