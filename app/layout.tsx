import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteProvider } from "@/components/SiteProvider";
import { CommerceEngine } from "@/components/CommerceEngine";
import { AuthProvider } from "@/components/AuthProvider"; // <-- Added AuthProvider import
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hungry Chicken | Aggressive Eating",
  description: "Official Restaurant Presentation and Online Ordering",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // Added scroll-smooth for anchor links and smooth scrolling
    <html lang="en" className="scroll-smooth">
      <body 
        className={`${inter.className} font-sans antialiased bg-white text-black min-h-screen flex flex-col overflow-x-hidden`}
      >
        {/* Wrap everything in AuthProvider so the session is available globally */}
        <AuthProvider>
          <SiteProvider>
            <CommerceEngine>
              <Navbar />
              {/* flex-1 ensures the main content pushes the footer (if you add one) to the bottom */}
              <main className="flex-1 flex flex-col w-full">
                {children}
              </main>
            </CommerceEngine>
          </SiteProvider>
        </AuthProvider>
      </body>
    </html>
  );
}