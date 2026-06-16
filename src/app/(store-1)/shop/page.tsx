import { Suspense } from "react"
import { unstable_cache } from "next/cache"
import { Metadata } from "next"

import { AdapterFactory } from "@/middleware/factory/adapter.factory"
import { Product } from "@/middleware/types/commerce.types"

import ShopPage from "@/components/shop/ShopPage"
import { ShopSkeleton } from "@/components/skeletons/HomeSkeletons"
import {
  getProductPrice,
  SortOption,
  DEFAULT_SORT,
  PRODUCTS_PER_PAGE,
  MAX_PRICE_LIMIT,
} from "@/lib/util/commerce"

export const metadata: Metadata = {
  title: "Shop | Premium Furniture & Decor",
  description:
    "Explore our curated collection of high-quality furniture, lighting, and home decoration. Find the perfect pieces for your space.",
  openGraph: {
    title: "Shop | Premium Furniture & Decor",
    description: "Browse our premium collection of home essentials.",
    type: "website",
  },
}

const adapter = AdapterFactory.getAdapter()

const getFiltersCached = unstable_cache(
  async () => adapter.getFilters(),
  ["shop-filters"],
  { revalidate: 3600, tags: ["filters"] }
)

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=70"

const BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

interface ShopSearchParams {
  page?: string
  sort?: string
  min_price?: string
  max_price?: string
  min_rating?: string
  category?: string | string[]
  brand?: string | string[]
  availability?: string
}

// ── Single clean try/catch, no duplicate blocks ──────────────────────────────
async function fetchAverages(
  productIds: string[]
): Promise<Record<string, { average: number; count: number; popularity_score: number }>> {
  if (!productIds.length) return {}
  try {
    const res = await fetch(`${BACKEND_URL}/store/feedback/averages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
      },
      body: JSON.stringify({ product_ids: productIds }),
      cache: "no-store", 
    })
    if (!res.ok) return {}
    const data = await res.json()
    return data.averages || {}
  } catch (error) {
    console.error("Fetch Averages Error:", error)
    return {}
  }
}

async function ShopContent({ searchParams }: { searchParams: ShopSearchParams }) {
  const page = parseInt(searchParams.page || "1") || 1
  const sortBy = (searchParams.sort as SortOption) || DEFAULT_SORT
  const minPrice = parseInt(searchParams.min_price || "0")
  const maxPrice = parseInt(searchParams.max_price || MAX_PRICE_LIMIT.toString())
  const minRating = parseInt(searchParams.min_rating || "0")

  const isPriceFiltered = !!(searchParams.min_price || searchParams.max_price)
  const isSortingByPrice =
    sortBy === "Price: Low to High" || sortBy === "Price: High to Low"
  const isPopularityRequested = sortBy === "Most Popular"
  const isRatingFiltered = minRating > 0
  const isManualProcessing =
    isPriceFiltered || isSortingByPrice || isRatingFiltered || isPopularityRequested

  const filtersData = await getFiltersCached()
  const { categories, collections } = filtersData

  const query: any = {
    limit: isManualProcessing ? 100 : PRODUCTS_PER_PAGE,
    offset: isManualProcessing ? 0 : (page - 1) * PRODUCTS_PER_PAGE,
  }

  if (!isManualProcessing && sortBy === "Newest") {
    query.order = "-created_at"
  }

  if (searchParams.category) {
    const selectedCats = Array.isArray(searchParams.category)
      ? searchParams.category
      : [searchParams.category]
    const categoryIds = categories
      .filter((c) => selectedCats.includes(c.name))
      .map((c) => c.id)
    if (categoryIds.length) query.category_id = categoryIds
  }

  if (searchParams.brand) {
    const selectedBrands = Array.isArray(searchParams.brand)
      ? searchParams.brand
      : [searchParams.brand]
    const collectionIds = collections
      .filter((c) => selectedBrands.includes(c.title))
      .map((c) => c.id)
    if (collectionIds.length) query.collection_id = collectionIds
  }

  if (searchParams.availability === "On Stock") {
    query.availability = "in_stock"
  }

  try {
    const { products: fetchedProducts, count: totalCount } =
      await adapter.listProducts(query)

    let products = fetchedProducts.map((p) => ({
      ...p,
      thumbnail: p.thumbnail || PLACEHOLDER,
    }))

    let displayProducts = products
    let displayCount = totalCount

    if (isManualProcessing) {
      // Price filter
      if (isPriceFiltered) {
        displayProducts = displayProducts.filter((p) => {
          const price = getProductPrice(p)
          return price >= minPrice && price <= maxPrice
        })
      }

      // Fetch averages once for both rating filter and popularity sort
      if (isRatingFiltered || isPopularityRequested) {
        const averages = await fetchAverages(displayProducts.map((p) => p.id))
        if (isRatingFiltered) {
          displayProducts = displayProducts.filter(
            (p) => (averages[p.id]?.average ?? 0) >= minRating
          )
        }

        if (isPopularityRequested) {
          displayProducts.sort((a, b) => {
            const scoreA = averages[a.id]?.popularity_score ?? 0
            const scoreB = averages[b.id]?.popularity_score ?? 0
            if (scoreB !== scoreA) return scoreB - scoreA
            // Tiebreak: newer first
            return (
              new Date(b.created_at || 0).getTime() -
              new Date(a.created_at || 0).getTime()
            )
          })
        }
      }

      if (sortBy === "Price: Low to High") {
        displayProducts.sort((a, b) => getProductPrice(a) - getProductPrice(b))
      } else if (sortBy === "Price: High to Low") {
        displayProducts.sort((a, b) => getProductPrice(b) - getProductPrice(a))
      } else if (sortBy === "Newest" && isManualProcessing) {
        displayProducts.sort(
          (a, b) =>
            new Date(b.created_at || 0).getTime() -
            new Date(a.created_at || 0).getTime()
        )
      }

      displayCount = displayProducts.length
      const offset = (page - 1) * PRODUCTS_PER_PAGE
      displayProducts = displayProducts.slice(offset, offset + PRODUCTS_PER_PAGE)
    }

    return (
      <ShopPage
        products={displayProducts}
        categories={categories}
        collections={collections}
        totalProducts={displayCount}
        currentPage={page}
        limit={PRODUCTS_PER_PAGE}
      />
    )
  } catch (error: any) {
    console.error("Shop Content Error:", error)
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Oops! Something went wrong
        </h2>
        <p className="text-gray-600 mb-6">
          We couldn't load the products. Please try refreshing the page.
        </p>
      </div>
    )
  }
}

export default async function Shop({
  searchParams,
}: {
  params: Promise<any>
  searchParams: Promise<ShopSearchParams>
}) {
  const sParams = await searchParams
  return (
    <div className="bg-[#fafafa]">
      <Suspense fallback={<ShopSkeleton />}>
        <ShopContent searchParams={sParams} />
      </Suspense>
    </div>
  )
}