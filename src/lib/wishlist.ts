'use client';

import { useState, useEffect } from 'react';

export interface WishlistItem {
  id: string;
  handle: string;
  title: string;
  category: string;
  thumbnail: string;
  price: number;
  variantId: string;
  inStock: boolean;
}

const WISHLIST_KEY = 'wishlist_items';

export function useWishlist() {
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {}
  }, []);

  const save = (next: WishlistItem[]) => {
    setItems(next);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
  };

  const addItem = (item: WishlistItem) => {
    setItems((prev) => {
      if (prev.find((i) => i.id === item.id)) return prev;
      const next = [...prev, item];
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
      return next;
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.id !== id);
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
      return next;
    });
  };

  const isWishlisted = (id: string) => items.some((i) => i.id === id);

  return { items, addItem, removeItem, isWishlisted, save };
}