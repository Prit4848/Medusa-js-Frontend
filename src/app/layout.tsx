import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css";
import { Montserrat } from "next/font/google";
import Toaster from '@/components/layout/Toaster';
import { AuthProvider } from "@/lib/auth/AuthContext"
import { getCustomer } from "@/lib/auth/getCustomer"

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

// Global log suppressor for specific expected errors
if (typeof window === "undefined") {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    const msg = args[0]?.toString() || "";
    if (
      msg.includes("TimeoutError") || 
      msg.includes("aborted due to timeout") ||
      (args[0]?.code === 23)
    ) {
      return;
    }
    originalError(...args);
  };
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const customer = await getCustomer()

  return (
    <html lang="en">
      <body className={montserrat.className}>
        <AuthProvider initialCustomer={customer}>
          <main>{children}</main>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
