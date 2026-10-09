"use client";
import type React from "react";
import { useSite } from "@/components/SiteProvider";

const t = {
  de: { title: "UNSERE ARBEIT.", sweetsTitle: "GALERIE." },
  en: { title: "OUR WORK.", sweetsTitle: "GALLERY." }
};

export default function Gallery() {
  const { activeSite, siteData, language } = useSite();
  const text = t[language];

  // Served from /public — no third-party image hosts.
  const images =
    activeSite === "sweets"
      ? ["/sweets-2.jpg", "/gallery-5.jpg", "/sweets-3.jpg", "/gallery-1.jpg"]
      : ["/grill-1.jpg", "/grill-3.jpg", "/gallery-2.jpg", "/gallery-1.jpg"];

  return (
    <div className={`min-h-[calc(100vh-73px)] ${siteData.colors.bg} relative p-4 md:p-16 overflow-hidden`}>
      {/* Heavy Dot Grid Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#000_2px,transparent_0)] bg-[length:20px_20px] md:bg-[length:30px_30px] opacity-20 z-0 pointer-events-none"></div>

      <div className="relative z-20 max-w-6xl mx-auto pt-4 md:pt-8 text-center md:text-left">
        <h1 className="text-5xl md:text-9xl font-black uppercase tracking-tighter mb-10 md:mb-16 text-white drop-shadow-[4px_4px_0_rgba(0,0,0,1)] md:drop-shadow-[8px_8px_0_rgba(0,0,0,1)]">
          {activeSite === 'sweets' ? text.sweetsTitle : text.title}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          {images.map((img, idx) => (
            <div 
              key={img}
              style={{ "--i": idx } as React.CSSProperties}
              className={`rise-in bg-white border-[3px] border-black p-3 shadow-[6px_6px_0_0_rgba(0,0,0,1)] md:shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:-translate-y-2 md:hover:-translate-y-4 hover:shadow-[10px_10px_0_0_rgba(0,0,0,1)] md:hover:shadow-[16px_16px_0_0_rgba(0,0,0,1)] transition-all duration-300 group cursor-pointer ${idx % 2 === 0 ? 'transform rotate-2 hover:rotate-0' : 'transform -rotate-2 hover:-rotate-0'}`}
            >
              <div className="w-full aspect-[4/5] border-[3px] border-black overflow-hidden relative">
                <img src={img} alt={`${activeSite === "sweets" ? "Sweets" : "Grill"} ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="mt-3 flex justify-between items-center px-1">
                <span className="font-mono font-bold text-sm md:text-base text-black/50">IMG_{String(idx + 1).padStart(2, '0')}</span>
                <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-black ${siteData.colors.accent}`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}