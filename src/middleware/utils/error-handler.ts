import { NextResponse } from "next/server";

export const handleError = (error: any) => {
  // Medusa SDK wraps errors — extract the real message
  const message =
    error?.response?.data?.message ||   // Medusa SDK v2 error shape
    error?.response?.data?.error ||
    error?.body?.message ||              // alternate shape
    error?.message ||
    "An unexpected error occurred"

  const status =
    error?.response?.status ||
    error?.status ||
    500

  return NextResponse.json(
    { error: message, status },
    { status }
  )
}

export class CommerceError extends Error {
  status: number

  constructor(message: string, status: number = 400) {
    super(message)
    this.status = status
    this.name = "CommerceError"
  }
}
