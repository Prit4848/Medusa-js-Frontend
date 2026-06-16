import { getLocaleHeader } from "@lib/util/get-locale-header"
import Medusa, { FetchArgs, FetchInput } from "@medusajs/js-sdk"

let MEDUSA_BACKEND_URL = "http://localhost:9000"

if (process.env.MEDUSA_BACKEND_URL) {
  MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL
}

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})

const originalFetch = sdk.client.fetch.bind(sdk.client)

sdk.client.fetch = async <T>(
  input: FetchInput,
  init?: FetchArgs
): Promise<T> => {
  const headers = (init?.headers as Record<string, string>) ?? {}
  let localeHeader: Record<string, string> = {}

  try {
    const lh = await getLocaleHeader()
    if (lh["x-medusa-locale"]) {
      localeHeader["x-medusa-locale"] = lh["x-medusa-locale"]
    }
  } catch {}

  init = {
    ...init,
    headers: {
      ...localeHeader,
      ...headers,
    },
    // ↓ This is the fix — stops Next.js from trying to cache Medusa responses
    next: {
      ...((init as any)?.next ?? {}),
      cache: "no-store",
    },
  }

  try {
    const response = await originalFetch(input, init)
    return response as T
  } catch (error: any) {
    if (error.name === "AbortError" || error.code === 23 || error.name === "TimeoutError") {
      throw error
    }

    let errorData = error.response?.data

    if (error.response && typeof error.response.text === "function") {
      try {
        const text = await error.response.clone().text()
        try {
          errorData = JSON.parse(text)
        } catch {
          errorData = text
        }
      } catch {}
    }

    throw error
  }
}