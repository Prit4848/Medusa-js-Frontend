export default function medusaError(error: any): never {
  if (error.response) {
    // Axios-style or SDK error with response object
    const u = error.config?.url ? new URL(error.config.url, error.config.baseURL) : "Unknown URL"
    console.error("Resource:", u.toString())
    console.error("Response data:", error.response.data)
    console.error("Status code:", error.response.status)

    const message = error.response.data?.message || error.response.data || error.message || "An unknown error occurred"
    throw new Error(String(message).charAt(0).toUpperCase() + String(message).slice(1) + ".")
  } else if (error.status) {
    // Medusa V2 SDK fetch error style
    console.error("Medusa SDK Error:", {
      status: error.status,
      statusText: error.statusText,
      message: error.message,
    })

    const message = error.message || "An unknown error occurred"
    throw new Error(String(message).charAt(0).toUpperCase() + String(message).slice(1) + ".")
  } else if (error.request) {
    throw new Error("No response received: " + error.request)
  } else {
    throw new Error("Error setting up the request: " + error.message)
  }
}

