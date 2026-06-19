"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

type Customer = {
  id: string
  email: string
  first_name?: string
  last_name?: string
  phone?: string
}

type RegisterData = {
  email: string
  password: string
  first_name: string
  last_name: string
}

type AuthContextType = {
  customer: Customer | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({
  children,
  initialCustomer = null,
}: {
  children: React.ReactNode
  initialCustomer?: Customer | null
}) {
  const [customer, setCustomer] = useState<Customer | null>(initialCustomer)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // On mount — verify session is still valid
  // Catches stale initialCustomer when cookie has expired
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (!data.customer && customer) {
          setCustomer(null)
        }
        if (data.customer && !customer) {
          setCustomer(data.customer)
        }
      })
      .catch(() => {})
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Invalid email or password")
      }
      const meRes = await fetch("/api/auth/me")
      const { customer: c } = await meRes.json()
      setCustomer(c)
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (data: RegisterData) => {
    setLoading(true)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Registration failed")
      }
      const { customer: c } = await res.json()
      setCustomer(c)
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    setCustomer(null)
    router.push("/")
  }

  return (
    <AuthContext.Provider value={{ customer, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}