"use client";

import { useSite } from "@/components/SiteProvider";
import Link from "next/link";

// ==========================================
// SWEETS BRAND HOME
// ==========================================
function SweetsHome({ data, content, language }: { data: any, content: any, language: string }) {
  const images = [
    "https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1546173159-315724a31696?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?q=80&w=800&auto=format&fit=crop"
  ];

  return (
    <main className="w-full overflow-x-hidden bg-white">
      
      {/* HERO SECTION */}
      <div className={`relative w-full h-[calc(100dvh-130px)] min-h-[500px] md:min-h-[550px] border-b-[3px] border-black ${data.colors.bg} px-4 py-4 flex flex-col items-center justify-center overflow-hidden`}>

        {/* Dotted Background Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#000_2px,transparent_0)] bg-[length:20px_20px] md:bg-[length:30px_30px] opacity-15 z-0 pointer-events-none"></div>

        {/* Quirks: Ambient color blobs for depth */}
        <div className="absolute -top-20 -left-20 w-48 h-48 md:w-72 md:h-72 rounded-full bg-[#B4FF00] opacity-30 blur-2xl md:blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-16 w-56 h-56 md:w-80 md:h-80 rounded-full bg-[#FFC000] opacity-30 blur-2xl md:blur-3xl pointer-events-none"></div>

        {/* Quirks: Floating citrus doodle */}
        <svg className="absolute top-16 left-4 md:top-24 md:left-6 w-12 h-12 md:w-20 md:h-20 z-30 animate-float hidden sm:block" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="46" fill="#FFC000" stroke="black" strokeWidth="4"/>
          <g stroke="black" strokeWidth="3" strokeLinecap="round">
            <line x1="50" y1="10" x2="50" y2="90"/>
            <line x1="10" y1="50" x2="90" y2="50"/>
            <line x1="21" y1="21" x2="79" y2="79"/>
            <line x1="79" y1="21" x2="21" y2="79"/>
          </g>
        </svg>

        {/* Quirks: Wiggling Sticker */}
        <div className="absolute top-4 right-4 md:top-8 md:right-8 bg-black text-white font-black px-4 md:px-6 py-1.5 md:py-2 border-[2px] md:border-[3px] border-black shadow-[4px_4px_0_0_rgba(255,192,0,1)] z-30 transform rotate-3 animate-wiggle text-xs md:text-lg hidden sm:block">
          100% ORGANIC
        </div>

        {/* Quirks: Stamp sticker */}
        <div className="absolute bottom-16 right-4 md:bottom-20 md:right-14 w-16 h-16 md:w-24 md:h-24 rounded-full border-[2px] md:border-[3px] border-dashed border-black bg-[#B4FF00] flex flex-col items-center justify-center text-center font-black uppercase text-[8px] md:text-[10px] leading-tight z-30 transform -rotate-12 hidden md:flex">
          {language === 'de' ? <>Täglich<br/>Frisch<br/>Gepresst</> : <>Squeezed<br/>Fresh<br/>Daily</>}
        </div>

        <h1 
          className="text-[12vw] sm:text-[10vw] md:text-[8vw] lg:text-[110px] font-black uppercase tracking-tighter leading-[0.85] text-white w-full text-center scale-y-110 mb-4 md:mb-8 z-10 drop-shadow-[6px_6px_0_rgba(0,0,0,1)] md:drop-shadow-[8px_8px_0_rgba(0,0,0,1)] px-2"
          style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 800 }}
        >
          {content.hero}
        </h1>

        {/* DESKTOP POLAROIDS (Hidden on mobile) */}
        <div className="relative w-full max-w-4xl h-[340px] hidden md:flex justify-center items-center z-20">
          <div className="absolute left-12 transform -rotate-6 border-[6px] border-white bg-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] h-64 w-48">
            <img src={images[0]} className="w-full h-full object-cover border-[3px] border-black"/>
          </div>

          <Link href="/menu" className="relative z-30 transform scale-105 hover:-translate-y-4 hover:rotate-2 transition-all duration-500 border-[6px] border-white bg-white shadow-[12px_12px_0_0_rgba(0,0,0,1)] h-80 w-60 flex flex-col group cursor-pointer block">
            <div className="flex-1 border-[3px] border-black overflow-hidden relative">
              <img src={images[1]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
              {/* Quirks: Hover Drip Reveal */}
              <svg className="absolute -bottom-1 left-0 w-full h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300" viewBox="0 0 200 24" preserveAspectRatio="none">
                <path d="M0,0 Q10,20 20,0 T40,0 T60,0 T80,0 T100,0 T120,0 T140,0 T160,0 T180,0 T200,0 V0 H0 Z" fill="#FF2A75"/>
              </svg>
            </div>
            <div className={`w-full py-2 mt-1.5 border-[3px] border-black text-center font-black uppercase text-lg hover:bg-black hover:text-white transition-colors ${data.colors.accent} ${data.colors.accentText}`}>
              {content.action}
            </div>
          </Link>

          <div className="absolute right-12 transform rotate-6 border-[6px] border-white bg-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] h-64 w-48">
            <img src={images[2]} className="w-full h-full object-cover border-[3px] border-black"/>
          </div>
        </div>

        {/* MOBILE POLAROID SLIDER (Hidden on desktop) */}
        <div className="w-full flex md:hidden overflow-x-auto snap-x snap-mandatory gap-6 px-8 pb-8 pt-2 z-20 no-scrollbar">
          {images.map((img, i) => (
            <Link href="/menu" key={i} className={`shrink-0 w-52 h-72 snap-center transform transition-all duration-300 border-[4px] border-white bg-white shadow-[6px_6px_0_0_rgba(0,0,0,1)] flex flex-col group ${i === 1 ? 'scale-105 rotate-1 z-10' : (i === 0 ? '-rotate-2' : 'rotate-2')}`}>
              <div className="flex-1 border-[2px] border-black overflow-hidden relative">
                <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
                <svg className="absolute -bottom-1 left-0 w-full h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" viewBox="0 0 200 24" preserveAspectRatio="none">
                  <path d="M0,0 Q10,20 20,0 T40,0 T60,0 T80,0 T100,0 T120,0 T140,0 T160,0 T180,0 T200,0 V0 H0 Z" fill="#FF2A75"/>
                </svg>
              </div>
              <div className={`w-full py-1.5 mt-1 border-[2px] border-black text-center font-black uppercase text-sm hover:bg-black hover:text-white transition-colors ${data.colors.accent} ${data.colors.accentText}`}>
                {content.action}
              </div>
            </Link>
          ))}
        </div>

        <div className="absolute bottom-2 text-center text-[8px] md:text-xs font-mono font-bold leading-tight uppercase max-w-[280px] md:max-w-md mx-auto z-20">
          {content.tagline}
        </div>
      </div>

      {/* TICKER TAPE MARQUEE */}
      <div className={`w-full h-[50px] md:h-[60px] border-b-[3px] border-black overflow-hidden flex items-center ${data.colors.accent} ${data.colors.accentText}`}>
        <div className="marquee-container flex whitespace-nowrap w-full">
          <div className="animate-marquee font-black uppercase text-base md:text-2xl tracking-tighter shrink-0 flex items-center">
            {content.marquee.map((text: string, i: number) => <span key={i} className="mx-4 md:mx-8">{text}</span>)}
          </div>
          <div className="animate-marquee font-black uppercase text-base md:text-2xl tracking-tighter shrink-0 flex items-center" aria-hidden="true">
            {content.marquee.map((text: string, i: number) => <span key={`dup-${i}`} className="mx-4 md:mx-8">{text}</span>)}
          </div>
        </div>
      </div>

      {/* MASSIVE QUOTE SECTION */}
      <div className="w-full min-h-[50dvh] md:min-h-[60vh] bg-[#FFFDF6] relative flex items-center justify-center py-16 md:py-20 px-4 md:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#000_2px,transparent_0)] bg-[length:20px_20px] md:bg-[length:30px_30px] opacity-10 z-0 pointer-events-none"></div>
        
        {/* Quirks: Splash doodles */}
        <svg className="absolute top-10 left-6 w-20 h-20 md:w-28 md:h-28 opacity-70 hidden md:block" viewBox="0 0 100 100" fill="none" stroke="black" strokeWidth="4">
          <path d="M20,80 Q10,40 40,20 Q50,50 70,30" strokeLinecap="round"/>
          <circle cx="75" cy="22" r="4" fill="black"/>
        </svg>
        <svg className="absolute bottom-10 right-6 w-20 h-20 md:w-28 md:h-28 opacity-70 hidden md:block" viewBox="0 0 100 100" fill="none" stroke="black" strokeWidth="4">
          <path d="M80,20 Q90,60 60,80 Q50,50 30,70" strokeLinecap="round"/>
          <circle cx="25" cy="78" r="4" fill="black"/>
        </svg>

        <div className="relative z-10 max-w-5xl text-center flex flex-col items-center">
          <span className="text-[6rem] md:text-[12rem] leading-none absolute -top-12 -left-4 md:-top-32 md:-left-16 opacity-20 text-black">"</span>
          
          <h2 
            className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-[0.9] text-black mb-6 md:mb-8 relative z-10 bg-white inline-block px-3 md:px-4 border-[2px] md:border-[3px] border-black shadow-[6px_6px_0_0_rgba(180,255,0,1)] md:shadow-[8px_8px_0_0_rgba(180,255,0,1)]"
            style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 800 }}
          >
            {content.quote}
          </h2>
          
          <div className="flex items-center gap-3 md:gap-4 mt-2 md:mt-4">
            <div className={`w-10 h-10 md:w-16 md:h-16 rounded-full border-[2px] md:border-[3px] border-black ${data.colors.bg}`}></div>
            <div className="text-left">
              <p className="font-black uppercase text-sm md:text-xl text-black">{content.quoteAuthor}</p>
            </div>
          </div>
        </div>
      </div>

    </main>
  );
}

// ==========================================
// GRILL BRAND HOME
// ==========================================
function GrillHome({ data, content, language }: { data: any, content: any, language: string }) {
  // NEW: Updated to high-quality Fried Chicken / Grill photos
  const images = [
    "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1569691899455-88464f6d3ab1?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?q=80&w=800&auto=format&fit=crop"
  ];

  return (
    <main className="w-full overflow-hidden bg-white">
      
      {/* HERO SECTION */}
      <div className={`relative w-full h-[calc(100dvh-130px)] min-h-[500px] md:min-h-[550px] border-b-[3px] border-black ${data.colors.bg} px-4 py-4 flex flex-col items-center justify-center overflow-hidden`}>
        
        {/* Dotted Background Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#000_2px,transparent_0)] bg-[length:20px_20px] md:bg-[length:30px_30px] opacity-20 z-0 pointer-events-none"></div>

        {/* Quirks: Welcome Badge */}
        <div className="absolute top-4 left-4 md:top-8 md:left-8 bg-blue-600 text-white font-bold px-4 md:px-6 py-1.5 md:py-2 border-[2px] md:border-[3px] border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] z-30 transform -rotate-3 text-xs md:text-base hidden sm:block">
          {content.nav.home}
        </div>

        <h1 className="text-[12vw] sm:text-[10vw] md:text-[8vw] lg:text-[110px] font-black uppercase tracking-tighter leading-[0.85] text-white w-full text-center scale-y-110 mb-4 md:mb-8 z-10 drop-shadow-[6px_6px_0_rgba(0,0,0,1)] md:drop-shadow-[8px_8px_0_rgba(0,0,0,1)] px-2">
          {content.hero}
        </h1>

        {/* DESKTOP POLAROIDS (Hidden on mobile) */}
        <div className="relative w-full max-w-4xl h-[340px] hidden md:flex justify-center items-center z-20">
          
          {/* Quirks: Arrow Scribbles */}
          <svg className="absolute -left-4 bottom-10 w-24 h-12 md:-left-8 md:w-32 md:h-16 z-30 drop-shadow-md" viewBox="0 0 100 50" fill="none" stroke="black" strokeWidth="4">
            <path d="M10,40 Q40,30 80,20 M70,10 L85,18 L75,30" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>

          <div className="absolute left-12 transform -rotate-6 border-[6px] border-white bg-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] h-64 w-48">
            <img src={images[0]} className="w-full h-full object-cover border-[3px] border-black"/>
          </div>

          <Link href="/menu" className="relative z-30 transform scale-105 hover:-translate-y-4 transition-all duration-500 border-[6px] border-white bg-white shadow-[12px_12px_0_0_rgba(0,0,0,1)] h-80 w-60 flex flex-col group cursor-pointer block">
            <div className="flex-1 border-[3px] border-black overflow-hidden relative">
              <img src={images[1]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
            </div>
            <div className={`w-full py-2 mt-1.5 border-[3px] border-black text-center font-black uppercase text-lg hover:bg-black hover:text-white transition-colors ${data.colors.accent} ${data.colors.accentText}`}>
              {content.action}
            </div>
          </Link>

          <div className="absolute right-12 transform rotate-6 border-[6px] border-white bg-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] h-64 w-48">
            <img src={images[2]} className="w-full h-full object-cover border-[3px] border-black"/>
          </div>

          {/* Quirks: Spring Scribbles */}
          <svg className="absolute -right-2 bottom-0 w-20 h-20 md:-right-4 md:w-24 md:h-24 z-30 drop-shadow-md" viewBox="0 0 100 100" fill="none" stroke="black" strokeWidth="5">
            <path d="M10,80 Q20,20 30,80 T50,80 T70,80 T90,80" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* MOBILE POLAROID SLIDER (Hidden on desktop) */}
        <div className="w-full flex md:hidden overflow-x-auto snap-x snap-mandatory gap-6 px-8 pb-8 pt-2 z-20 no-scrollbar relative">
          {images.map((img, i) => (
            <Link href="/menu" key={i} className={`shrink-0 w-52 h-72 snap-center transform transition-all duration-300 border-[4px] border-white bg-white shadow-[6px_6px_0_0_rgba(0,0,0,1)] flex flex-col group ${i === 1 ? 'scale-105 rotate-1 z-10' : (i === 0 ? '-rotate-2' : 'rotate-2')}`}>
              <div className="flex-1 border-[2px] border-black overflow-hidden relative">
                <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
              </div>
              <div className={`w-full py-1.5 mt-1 border-[2px] border-black text-center font-black uppercase text-sm hover:bg-black hover:text-white transition-colors ${data.colors.accent} ${data.colors.accentText}`}>
                {content.action}
              </div>
            </Link>
          ))}
        </div>

        <div className="absolute bottom-2 text-center text-[8px] md:text-xs font-mono font-bold leading-tight uppercase max-w-[280px] md:max-w-md mx-auto z-20">
          {content.tagline}
        </div>
      </div>

      {/* TICKER TAPE MARQUEE */}
      <div className={`w-full h-[50px] md:h-[60px] border-b-[3px] border-black overflow-hidden flex items-center ${data.colors.accent} ${data.colors.accentText}`}>
        <div className="marquee-container flex whitespace-nowrap w-full">
          <div className="animate-marquee font-black uppercase text-base md:text-2xl tracking-tighter shrink-0 flex items-center">
            {content.marquee.map((text: string, i: number) => <span key={i} className="mx-4 md:mx-8">{text}</span>)}
          </div>
          <div className="animate-marquee font-black uppercase text-base md:text-2xl tracking-tighter shrink-0 flex items-center" aria-hidden="true">
            {content.marquee.map((text: string, i: number) => <span key={`dup-${i}`} className="mx-4 md:mx-8">{text}</span>)}
          </div>
        </div>
      </div>

      {/* MASSIVE QUOTE SECTION - NEW: Grill themed colors */}
      <div className="w-full min-h-[50dvh] md:min-h-[60vh] bg-[#FFF5F0] relative overflow-hidden flex flex-col items-center justify-center py-16 md:py-20 px-4 md:px-6">
        {/* NEW: Dotted grid now perfectly matches the Orange Brand Accent */}
        <div className="absolute inset-0 bg-[radial-gradient(#FF5A1F_2px,transparent_0)] bg-[length:20px_20px] md:bg-[length:30px_30px] opacity-20 z-0 pointer-events-none"></div>

        <div className="z-10 flex flex-col items-center text-center max-w-4xl px-2 md:px-4">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-[0.9] text-black mb-8 md:mb-12">
            {content.quote}
          </h2>

          <div className="relative mt-2 md:mt-8 group">
            {/* Quirks: Explosions on hover */}
            <div className="absolute top-1/2 -left-12 md:-left-16 -translate-y-1/2 text-2xl md:text-4xl hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity">
              💥
            </div>

            <div className="bg-black text-white font-mono font-bold text-xs md:text-base px-4 py-2.5 md:px-8 md:py-4 border-[2px] md:border-[3px] border-black shadow-[4px_4px_0_0_rgba(255,90,31,1)] md:shadow-[6px_6px_0_0_rgba(255,90,31,1)] transform rotate-2">
              {content.quoteAuthor}
            </div>

            {/* Quirks: Explosions on hover */}
            <div className="absolute top-1/2 -right-12 md:-right-16 -translate-y-1/2 text-2xl md:text-4xl hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity">
              💥
            </div>
          </div>
        </div>
      </div>

    </main>
  );
}

export default function Home() {
  const { activeSite, siteData, content, language } = useSite();

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&display=swap');

        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }

        @keyframes wiggle {
          0%, 100% { transform: rotate(3deg); }
          50% { transform: rotate(-3deg); }
        }
        .animate-wiggle {
          animation: wiggle 2.5s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-14px) rotate(8deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        /* Hides scrollbar for the mobile photo slider */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
      
      {activeSite === 'sweets' ? <SweetsHome data={siteData} content={content} language={language} /> : <GrillHome data={siteData} content={content} language={language} />}
    </>
  );
}