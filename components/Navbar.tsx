"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useSite } from './SiteProvider';
import { useCommerce } from './CommerceEngine';

export default function Navbar() {
  const { siteData, content, toggleSite, toggleLanguage, activeSite, language } = useSite();
  const { setIsProfileOpen } = useCommerce();
  const { data: session, status } = useSession();
  const pathname = usePathname() ?? '/';
  const navLinks = [
    { href: '/', label: content.nav.home },
    { href: '/menu', label: content.nav.menu },
    { href: '/gallery', label: content.nav.gallery },
    { href: '/contact', label: content.nav.contact },
  ];

  return (
    <nav aria-label="Hauptnavigation" className="w-full bg-white text-black border-b-[3px] border-black px-4 md:px-6 py-4 flex flex-col xl:flex-row justify-between items-center sticky top-0 z-50">

      <div className="w-full xl:w-auto flex justify-center xl:absolute xl:left-1/2 xl:-translate-x-1/2 text-2xl md:text-3xl font-black uppercase tracking-tighter mb-4 xl:mb-0">
        {siteData.name} <span className={activeSite === 'grill' ? 'text-[#FF5A1F] ml-2' : 'text-[#FF2A75] ml-2'}>{activeSite.toUpperCase()}</span>
      </div>

      <div className="flex flex-wrap justify-center gap-2 md:gap-3 text-xs md:text-sm font-black uppercase tracking-tight mb-5 xl:mb-0 w-full xl:w-auto">
        {navLinks.map(({ href, label }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`px-2 py-1 border-[2px] transition-colors ${
                active
                  ? `border-black ${siteData.colors.accent} ${siteData.colors.accentText} shadow-[3px_3px_0_0_rgba(0,0,0,1)]`
                  : "border-transparent hover:border-black"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>

      <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4 w-full xl:w-auto">
        <button
          onClick={toggleLanguage}
          className="text-[10px] md:text-xs font-black uppercase border-[3px] border-black px-3 py-2 bg-black text-white hover:bg-white hover:text-black transition-colors"
        >
          {language === 'de' ? 'EN' : 'DE'}
        </button>

        <button
          onClick={toggleSite}
          className="text-[10px] md:text-xs font-black uppercase border-[3px] border-black px-3 md:px-4 py-2 hover:bg-black hover:text-white transition-colors"
        >
          {content.nav.toggleBrand}
        </button>

        <button
          onClick={() => setIsProfileOpen(true)}
          className={`relative border-[3px] border-black px-4 md:px-6 py-2 font-black uppercase text-[10px] md:text-sm shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none active:scale-95 transition-all ${siteData.colors.accent} ${siteData.colors.accentText}`}
        >
          {status === "authenticated" && (
            <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-green-500 border-2 border-black rounded-full"></span>
          )}
          {status === "authenticated"
            ? session?.user?.name?.split(" ")[0] || (language === 'de' ? 'Konto' : 'Account')
            : language === 'de' ? 'Anmelden' : 'Log In'}
        </button>
      </div>
    </nav>
  );
}