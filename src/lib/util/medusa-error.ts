export default function medusaError(error: any): never {
  if (error.name === "AbortError" || error.code === 23 || error.name === "TimeoutError") {
    // Silence abort/timeout errors by throwing a generic error that we can filter or just re-throwing
    // But since this is a "never" function, we must throw.
    throw error;
  }

  if (error.response) {
    // Axios-style or SDK error with response object
    const message = error.response.data?.message || error.response.data || error.message || "An unknown error occurred"
    throw new Error(String(message).charAt(0).toUpperCase() + String(message).slice(1) + ".")
  } else if (error.status) {
    // Medusa V2 SDK fetch error style
    const message = error.message || "An unknown error occurred"
    throw new Error(String(message).charAt(0).toUpperCase() + String(message).slice(1) + ".")
  } else if (error.request) {
    throw new Error("No response received: " + error.request)
  } else {
    throw new Error("Error setting up the request: " + error.message)
  }
}
