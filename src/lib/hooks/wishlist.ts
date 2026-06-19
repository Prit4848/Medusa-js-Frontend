'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/AuthContext'

export interface WishlistItem {
  id: string
  product_id: string
  variant_id: string
  handle: string
  title: string
  category: string | null
  thumbnail: string | null
  price: number
  in_stock: boolean
}

export function useWishlist() {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const { customer } = useAuth() // ← reads from context, no extra fetch needed
  const router = useRouter()

  const fetchWishlist = useCallback(async () => {
    if (!customer) {
      setItems([])
      setLoading(false)
      return
    }

    try {
      const res = await fetch(
        `/api/wishlist?customer_id=${customer.id}`
      )
      const data = await res.json()
      setItems(data.items || [])
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [customer])

  useEffect(() => {
    fetchWishlist()
  }, [fetchWishlist])

  const addItem = async (product: {
    product_id: string
    variant_id: string
    handle: string
    title: string
    category?: string
    thumbnail?: string
    price: number
    in_stock: boolean
  }) => {
    if (!customer) {
      router.push('/login?redirectTo=/wishlist')
      return false
    }

    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: customer.id,
          ...product,
        }),
      })

      if (res.ok) {
        await fetchWishlist()
        return true
      }
      return false
    } catch {
      return false
    }
  }

  const removeItem = async (wishlistItemId: string) => {
    if (!customer) return false

    setItems((prev) => prev.filter((i) => i.id !== wishlistItemId))

    try {
      await fetch('/api/wishlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: wishlistItemId }),
      })
      return true
    } catch {
      await fetchWishlist()
      return false
    }
  }

  const isWishlisted = (productId: string) =>
    items.some((i) => i.product_id === productId)

  const getWishlistItemId = (productId: string) =>
    items.find((i) => i.product_id === productId)?.id

  return {
    items,
    loading,
    addItem,
    removeItem,
    isWishlisted,
    getWishlistItemId,
    isLoggedIn: !!customer, 
  }
}