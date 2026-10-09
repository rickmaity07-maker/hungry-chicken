import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import { Space_Mono } from "next/font/google";
import { Baloo_2 } from "next/font/google";
import "./globals.css";
import { SiteProvider } from "@/components/SiteProvider";
import { CommerceEngine } from "@/components/CommerceEngine";
import { AuthProvider } from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieNotice from "@/components/CookieNotice";

// Archivo: a heavy, slightly industrial grotesk that suits the neubrutalist
// look far better than Inter. Space Mono gives the labels/prices real texture.
const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-space-mono" });
// Self-hosted at build time by next/font — no request to Google from the visitor.
const baloo = Baloo_2({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-baloo" });

export const metadata: Metadata = {
  title: { default: "Hungry Chicken | Grill & Sweets", template: "%s | Hungry Chicken" },
  description: "Hungry Chicken in München — Fried Chicken, Grill, frische Säfte und Desserts. Online bestellen zur Abholung oder Lieferung.",
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "Hungry Chicken",
    title: "Hungry Chicken | Grill & Sweets",
    description: "Fried Chicken, Grill, frische Säfte und Desserts in München. Online bestellen, bar bezahlen.",
    images: [{ url: "/grill-1.jpg", width: 800, height: 800, alt: "Hungry Chicken" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#125B39",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className={`scroll-smooth ${archivo.variable} ${spaceMono.variable} ${baloo.variable}`}>
      <body 
        className={`font-sans antialiased bg-white text-black min-h-screen flex flex-col overflow-x-hidden`}
      >
        <a href="#main" className="skip-link">
          Zum Inhalt springen
        </a>
        <AuthProvider>
          <SiteProvider>
            <CommerceEngine>
              <Navbar />
              <main id="main" className="flex-1 flex flex-col w-full">
                {children}
              </main>
              <Footer />
              <CookieNotice />
              <div className="grain" aria-hidden="true" />
            </CommerceEngine>
          </SiteProvider>
        </AuthProvider>
      </body>
    </html>
  );
}