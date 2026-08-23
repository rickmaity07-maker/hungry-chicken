"use client";

import Link from "next/link";
import { useSite } from "./SiteProvider";

export default function Footer() {
  const { language } = useSite();
  const isDE = language === "de";

  return (
    <footer className="w-full bg-white text-black border-t-[3px] border-black px-4 md:px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs md:text-sm font-bold uppercase">
      <p className="font-mono text-gray-500 normal-case">
        © {new Date().getFullYear()} Hungry Chicken
      </p>
      <div className="flex gap-4 md:gap-6">
        <Link href="/impressum" className="hover:underline decoration-2 underline-offset-4">
          Impressum
        </Link>
        <Link href="/datenschutz" className="hover:underline decoration-2 underline-offset-4">
          {isDE ? "Datenschutz" : "Privacy Policy"}
        </Link>
      </div>
    </footer>
  );
}