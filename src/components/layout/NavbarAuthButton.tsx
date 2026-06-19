"use client"

import { useState, useRef, useEffect } from "react"
import { User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

type Customer = {
  id: string
  email: string
  first_name?: string
  last_name?: string
} | null

export default function NavbarAuthButton({ customer }: { customer: Customer }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = async () => {
    setLoading(true)
    await fetch("/api/auth/logout", { method: "POST" })
    setOpen(false)
    router.refresh() // re-runs server components including Navbar + getCustomer
    router.push("/")
  }

  // Not logged in — just show icon link to login
  if (!customer) {
    return (
      <Link
        href="/login"
        className="hidden sm:block hover:text-[#c47c48] transition-colors duration-300"
      >
        <User size={22} strokeWidth={1.8} />
      </Link>
    )
  }

  // Logged in — show dropdown
  return (
    <div ref={ref} className="relative hidden sm:block">
      <button
        onClick={() => setOpen((p) => !p)}
        className="hover:text-[#c47c48] transition-colors duration-300 flex items-center gap-1"
      >
        <User size={22} strokeWidth={1.8} />
      </button>

      {open && (
        <div className="absolute right-0 top-[42px] w-[200px] bg-[#f5f5f5] shadow-md z-50">
          <div className="px-5 py-4 border-b border-gray-200">
            <p className="text-[13px] font-semibold text-gray-900 truncate">
              {customer.first_name} {customer.last_name}
            </p>
            <p className="text-[12px] text-gray-400 truncate">{customer.email}</p>
          </div>

          <div className="py-2">
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="block px-5 py-3 text-[14px] text-gray-700 hover:text-[#c47c48] transition-colors"
            >
              My Account
            </Link>
            <Link
              href="/account/orders"
              onClick={() => setOpen(false)}
              className="block px-5 py-3 text-[14px] text-gray-700 hover:text-[#c47c48] transition-colors"
            >
              My Orders
            </Link>
            <button
              onClick={handleLogout}
              disabled={loading}
              className="w-full text-left px-5 py-3 text-[14px] text-gray-700 hover:text-[#c47c48] transition-colors disabled:opacity-50"
            >
              {loading ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}