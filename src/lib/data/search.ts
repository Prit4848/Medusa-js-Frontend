const CACHE_TTL_MS = 15_000;
const cache = new Map<string, { data: any; expiry: number }>();

export async function searchAll(
  query: string,
  limit = 5,
  signal?: AbortSignal
): Promise<{ products: any[]; categories: any[] }> {
  const key = `${query}:${limit}`;
  const hit = cache.get(key);
  if (hit && hit.expiry > Date.now()) return hit.data;

  try {
    const res = await fetch(
      `/api/search?q=${encodeURIComponent(query)}&limit=${limit}`,
      { signal }
    );

    if (!res.ok) return { products: [], categories: [] };

    const data = await res.json();
    cache.set(key, { data, expiry: Date.now() + CACHE_TTL_MS });
    return data;
  } catch (e: any) {
    if (e.name === "AbortError" || e.code === 23 || e.name === "TimeoutError") {
      return { products: [], categories: [] };
    }
    console.error("searchAll error:", e);
    return { products: [], categories: [] };
  }
}
