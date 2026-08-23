"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSite } from "./SiteProvider";

// This site only sets one cookie: the NextAuth session cookie, which is
// strictly necessary for login/checkout to function. Under § 25(2) No. 2
// TTDSG that doesn't require opt-in consent — so this is a one-time
// transparency notice, not a consent gate. It never blocks the site.
export default function CookieNotice() {
  const { language } = useSite();
  const isDE = language === "de";
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("hc_cookie_notice_seen")) setDismissed(false);
  }, []);

  const dismiss = () => {
    localStorage.setItem("hc_cookie_notice_seen", "1");
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[70] bg-black text-white border-t-[4px] border-white p-4 md:p-5 flex flex-col md:flex-row items-center gap-4 justify-between">
      <p className="font-mono text-xs md:text-sm text-center md:text-left">
        {isDE ? (
          <>
            Diese Website verwendet nur ein technisch notwendiges Cookie für Login und Warenkorb — keine Analyse-
            oder Marketing-Cookies. Mehr dazu in unserer{" "}
            <Link href="/datenschutz" className="underline font-bold">
              Datenschutzerklärung
            </Link>
            .
          </>
        ) : (
          <>
            This site only uses one strictly necessary cookie for login and checkout — no analytics or marketing
            cookies. More in our{" "}
            <Link href="/datenschutz" className="underline font-bold">
              Privacy Policy
            </Link>
            .
          </>
        )}
      </p>
      <button
        onClick={dismiss}
        className="shrink-0 bg-white text-black border-[3px] border-white px-5 py-2 font-black uppercase text-xs hover:bg-gray-200 transition-colors"
      >
        {isDE ? "Verstanden" : "Got it"}
      </button>
    </div>
  );
}