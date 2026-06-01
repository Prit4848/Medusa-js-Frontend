import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Montserrat } from "next/font/google";
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

        <Footer />
      </body>
    </html>
  )
}
