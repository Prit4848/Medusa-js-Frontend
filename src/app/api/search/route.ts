import { NextRequest, NextResponse } from "next/server"
import { sdk } from "@lib/config"
import { getRegion } from "@lib/data/regions"

export const dynamic = "force-dynamic"

let cachedRegionId: string | undefined

// Memory cache for search results
const searchCache = new Map<string, { data: any; expiry: number }>()
const CACHE_TTL = 30_000 // 30 seconds

async function getRegionId() {
  if (cachedRegionId) return cachedRegionId
  const region = await getRegion(
    process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"
  )
  cachedRegionId = region?.id
  return cachedRegionId
}

export async function GET(req: NextRequest) {
  const q     = req.nextUrl.searchParams.get("q") ?? ""
  const limit = Math.min(
    Number(req.nextUrl.searchParams.get("limit") ?? 5),
    50
  )

  if (!q.trim()) {
    return NextResponse.json({ products: [], categories: [] })
  }

  const cacheKey = `${q}:${limit}`
  const cached = searchCache.get(cacheKey)
  if (cached && cached.expiry > Date.now()) {
    return NextResponse.json(cached.data)
  }

  try {
    const regionIdPromise = getRegionId()
    const catPromise      = sdk.store.category.list(
      { q, limit: 3, fields: "id,name,handle" } as any,
      { signal: req.signal } as any
    )

    // Chain product list to region resolution for max parallelism
    const productPromise = regionIdPromise.then((region_id) =>
      sdk.store.product.list(
        {
          q,
          limit,
          region_id,
          fields: "id,title,handle,thumbnail,variants.calculated_price,variants.inventory_quantity,variants.manage_inventory,categories.name,categories.handle",
        } as any,
        { signal: req.signal } as any
      )
    )

    const [catResult, productResult] = await Promise.all([
      catPromise,
      productPromise,
    ])

    const rawProducts = productResult.products ?? []

    const products = rawProducts.map((p: any) => ({
      id: p.id,
      title: p.title,
      handle: p.handle,
      thumbnail: p.thumbnail ?? null,
      category: p.categories?.[0]?.name ?? null,
      category_handle: p.categories?.[0]?.handle ?? null,
      variants: (p.variants ?? []).map((v: any) => ({
        id: v.id,
        price: v.calculated_price?.calculated_amount ?? 0,
        currency_code: v.calculated_price?.currency_code ?? "EUR",
        calculated_price: v.calculated_price, // for search page detail
        inventory_quantity: v.inventory_quantity,
        manage_inventory: v.manage_inventory,
      })),
    }))

    const responseData = { 
      products, 
      categories: catResult.product_categories ?? [] 
    }

    // Update server-side cache
    searchCache.set(cacheKey, { 
      data: responseData, 
      expiry: Date.now() + CACHE_TTL 
    })

    return NextResponse.json(
      responseData,
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        },
      }
    )
  } catch (e: any) {
    if (e.name === "AbortError" || e.code === 23 || e.name === "TimeoutError") {
      return new NextResponse(null, { status: 499 })
    }
    console.error("Search error:", e)
    return NextResponse.json(
      { products: [], categories: [] },
      { status: 500 }
    )
  }
  }