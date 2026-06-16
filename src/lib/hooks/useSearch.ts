import { useState, useEffect, useRef } from "react";
import { searchAll } from "@/lib/data/search";

export function useSearch() {
  const [query, setQuery]         = useState("");
  const [products, setProducts]   = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading]     = useState(false);

  const debounceRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef      = useRef<AbortController | null>(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setProducts([]);
      setCategories([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    abortRef.current?.abort();

    debounceRef.current = setTimeout(async () => {
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const { products, categories } = await searchAll(query, 5, controller.signal);
        if (!controller.signal.aborted) {
          setProducts(products);
          setCategories(categories);
        }
      } catch {
        if (!controller.signal.aborted) {
          setProducts([]);
          setCategories([]);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 300); 

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const clear = () => {
    abortRef.current?.abort();
    setQuery("");
    setProducts([]);
    setCategories([]);
  };

  return { query, setQuery, products, categories, loading, clear };
}