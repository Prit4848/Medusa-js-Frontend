import { NextRequest, NextResponse } from "next/server"

const BACKEND = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
const PUB_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!

// GET — fetch wishlist
export async function GET(request: NextRequest) {
  const token = request.cookies.get("_medusa_jwt")?.value
  const customerId = request.nextUrl.searchParams.get("customer_id")

  if (!token || !customerId) {
    return NextResponse.json({ items: [] })
  }

  const res = await fetch(
    `${BACKEND}/store/wishlist?customer_id=${customerId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-publishable-api-key": PUB_KEY,
      },
      cache: "no-store",
    }
  )

  const data = await res.json()
  return NextResponse.json(data)
}

// POST — add to wishlist
export async function POST(request: NextRequest) {
  const token = request.cookies.get("_medusa_jwt")?.value
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()

  const res = await fetch(`${BACKEND}/store/wishlist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "x-publishable-api-key": PUB_KEY,
    },
    body: JSON.stringify(body),
  })

  const data = await res.json()
  return NextResponse.json(data, { status: res.ok ? 201 : 400 })
}

// DELETE — remove from wishlist
export async function DELETE(request: NextRequest) {
  const token = request.cookies.get("_medusa_jwt")?.value
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await request.json()

  const res = await fetch(`${BACKEND}/store/wishlist/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "x-publishable-api-key": PUB_KEY,
    },
  })

  return NextResponse.json({ success: res.ok })
}