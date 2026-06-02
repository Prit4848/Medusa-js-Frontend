import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Montserrat } from "next/font/google";
import { Toaster } from "react-hot-toast";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <Navbar />

        <main>{children}</main>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#fff",
              color: "#222",
              border: "1px solid #eee",
            },
          }}
        />
        <Footer />
      </body>
    </html>
  )
}
