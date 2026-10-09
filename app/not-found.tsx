"use client";
import Link from "next/link";
import { useSite } from "@/components/SiteProvider";

export default function NotFound() {
  const { siteData, language } = useSite();
  const isDE = language === "de";

  return (
    <div className={`min-h-[calc(100vh-73px)] ${siteData.colors.bg} relative p-4 md:p-16 overflow-hidden flex items-center justify-center`}>
      <div className="absolute inset-0 bg-[radial-gradient(#000_2px,transparent_0)] bg-[length:20px_20px] md:bg-[length:30px_30px] opacity-20 z-0 pointer-events-none"></div>

      <div className="relative z-20 text-center">
        <h1 className="text-[28vw] md:text-[220px] font-black leading-none tracking-tighter text-white drop-shadow-[8px_8px_0_rgba(0,0,0,1)]">
          404
        </h1>
        <p className="inline-block bg-white text-black font-black uppercase text-lg md:text-2xl px-4 py-2 border-[3px] border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] -rotate-2 mt-4">
          {isDE ? "Diese Seite wurde schon aufgegessen." : "This page has already been eaten."}
        </p>
        <div className="mt-10">
          <Link
            href="/menu"
            className={`inline-block px-8 py-4 border-[3px] border-black font-black uppercase text-lg shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all ${siteData.colors.accent} ${siteData.colors.accentText}`}
          >
            {isDE ? "Zur Speisekarte" : "To the Menu"} →
          </Link>
        </div>
      </div>
    </div>
  );
}
