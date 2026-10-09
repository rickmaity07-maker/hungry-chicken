"use client";
import { useSite } from "@/components/SiteProvider";
import { useCommerce } from "@/components/CommerceEngine";
import { business } from "@/lib/siteConfig";
import Link from "next/link";

const t = {
  de: {
    title: { grill: "FINDE UNS.", sweets: "SAG HALLO." },
    location: "Adresse",
    hours: "Öffnungszeiten",
    order: "Bestellen",
    orderText: "Online bestellen, bar bezahlen — zur Abholung oder Lieferung.",
    orderCta: "Zur Speisekarte",
    account: "Bestellstatus",
    accountText: "Eingeloggt? Den Status deiner Bestellung siehst du live in deinem Konto.",
    accountCta: "Mein Konto",
    maps: "In Google Maps öffnen",
    mapsNote: "Öffnet Google Maps in einem neuen Tab.",
  },
  en: {
    title: { grill: "FIND US.", sweets: "SAY HELLO." },
    location: "Location",
    hours: "Opening Hours",
    order: "Order",
    orderText: "Order online, pay cash — for pickup or delivery.",
    orderCta: "See the Menu",
    account: "Order Status",
    accountText: "Logged in? Track your order status live in your account.",
    accountCta: "My Account",
    maps: "Open in Google Maps",
    mapsNote: "Opens Google Maps in a new tab.",
  },
};

export default function Contact() {
  const { activeSite, siteData, language } = useSite();
  const { setIsProfileOpen } = useCommerce();
  const text = t[language];
  const card = "bg-white text-black border-[4px] border-black p-6 md:p-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)]";
  const label = "font-mono font-bold uppercase text-xs md:text-sm text-black/50 mb-2";
  const button = `inline-block mt-6 px-6 py-3 border-[3px] border-black font-black uppercase shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all ${siteData.colors.accent} ${siteData.colors.accentText}`;

  return (
    <div className={`min-h-[calc(100vh-73px)] ${siteData.colors.bg} relative p-4 md:p-16 overflow-hidden`}>
      <div className="absolute inset-0 bg-[radial-gradient(#000_2px,transparent_0)] bg-[length:20px_20px] md:bg-[length:30px_30px] opacity-20 z-0 pointer-events-none"></div>

      <div className="relative z-20 max-w-6xl mx-auto pt-4 md:pt-8">
        <h1 className="text-5xl md:text-9xl font-black uppercase tracking-tighter mb-10 md:mb-16 text-white text-center md:text-left drop-shadow-[4px_4px_0_rgba(0,0,0,1)] md:drop-shadow-[8px_8px_0_rgba(0,0,0,1)]">
          {text.title[activeSite]}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          <div className={`${card} md:-rotate-1`}>
            <p className={label}>{text.location}</p>
            <p className="font-black uppercase text-2xl md:text-4xl leading-tight">
              {business.street}
              <br />
              {business.city}
            </p>
            <a href={business.mapsUrl} target="_blank" rel="noopener noreferrer" className={button}>
              📍 {text.maps}
            </a>
            <p className="font-mono text-xs text-black/50 mt-3">{text.mapsNote}</p>
          </div>

          <div className={`${card} md:rotate-1`}>
            <p className={label}>{text.hours}</p>
            <p className="font-black uppercase text-2xl md:text-4xl leading-tight">
              {business.hours[activeSite][language]}
            </p>
            <div className="mt-6 pt-6 border-t-[3px] border-black">
              <p className={label}>{activeSite === "grill" ? "🔥 Grill" : "🍓 Sweets"}</p>
              <p className="font-mono text-sm">
                {language === "de"
                  ? "Grill und Sweets teilen sich einen Warenkorb — alles in einer Bestellung."
                  : "Grill and Sweets share one cart — everything in a single order."}
              </p>
            </div>
          </div>

          <div className={`${card} md:rotate-1`}>
            <p className={label}>{text.order}</p>
            <p className="font-bold text-lg md:text-xl">{text.orderText}</p>
            <Link href="/menu" className={button}>
              {text.orderCta} →
            </Link>
          </div>

          <div className={`${card} md:-rotate-1`}>
            <p className={label}>{text.account}</p>
            <p className="font-bold text-lg md:text-xl">{text.accountText}</p>
            <button onClick={() => setIsProfileOpen(true)} className={button}>
              {text.accountCta}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
