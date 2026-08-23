"use client";

import { useEffect, useState } from "react";
import { useSite } from "@/components/SiteProvider";
import { useCommerce } from "@/components/CommerceEngine";

type MenuItem = {
  id: string;
  section: string;
  category: string;
  name: string;
  description: string;
  price: number;
  image: string;
};

export default function MenuPage() {
  const { activeSite, siteData } = useSite();
  const { addToCart, toggleWishlist, isWishlisted } = useCommerce();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const isGrill = activeSite === "grill";
  const pageTitle = isGrill ? "THE GRILL MENU" : "THE SWEETS MENU";
  const fallbackImage = isGrill ? "/grill-1.jpg" : "/sweets-2.jpg";

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/menu?section=${activeSite}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [activeSite]);

  // Group by category for a nicer layout
  const categories = Array.from(new Set(items.map((i) => i.category)));

  return (
    <div className={`min-h-[calc(100vh-73px)] ${siteData.colors.bg} relative p-4 md:p-16 overflow-hidden`}>
      <div className={`absolute inset-0 bg-[radial-gradient(${isGrill ? "#FF5A1F" : "#000"}_2px,transparent_0)] bg-[length:20px_20px] md:bg-[length:30px_30px] opacity-20 z-0 pointer-events-none`}></div>

      <div className="relative z-20 max-w-6xl mx-auto pt-4 md:pt-8 text-center md:text-left">
        <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-10 md:mb-16 text-white drop-shadow-[4px_4px_0_rgba(0,0,0,1)] md:drop-shadow-[8px_8px_0_rgba(0,0,0,1)]">
          {pageTitle}
        </h1>

        {loading && <p className="text-white font-black uppercase text-xl">Loading menu...</p>}

        {!loading && items.length === 0 && (
          <p className="text-white font-black uppercase text-xl bg-black/20 border-[3px] border-white p-6 inline-block">
            No items yet — the owner hasn't added this section's menu in the Kitchen Portal.
          </p>
        )}

        {categories.map((category) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl md:text-3xl font-black uppercase text-white mb-6 border-b-4 border-white/40 pb-2 inline-block">
              {category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10 pb-4">
              {items
                .filter((i) => i.category === category)
                .map((item, idx) => (
                  <div
                    key={item.id}
                    className={`relative bg-white border-[4px] border-black p-4 shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:-translate-y-2 md:hover:-translate-y-4 hover:shadow-[12px_12px_0_0_rgba(0,0,0,1)] transition-all duration-300 flex flex-col ${
                      idx % 2 === 0 ? "transform rotate-1" : "transform -rotate-1"
                    }`}
                  >
                    <button
                      onClick={() =>
                        toggleWishlist({
                          id: item.id,
                          menuItemId: item.id,
                          name: item.name,
                          price: item.price,
                          image: item.image || fallbackImage,
                          brand: activeSite,
                        })
                      }
                      className="absolute top-2 left-2 z-10 w-9 h-9 bg-white border-2 border-black rounded-full flex items-center justify-center text-lg"
                      aria-label="Toggle wishlist"
                    >
                      {isWishlisted(item.id) ? "❤️" : "🤍"}
                    </button>

                    <div className="w-full aspect-square border-[3px] border-black overflow-hidden relative mb-4">
                      <img src={item.image || fallbackImage} alt={item.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                      <div className="absolute top-2 right-2 bg-black text-white px-3 py-1 font-black text-lg border-2 border-white">
                        €{item.price.toFixed(2)}
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col text-left">
                      <h3 className="font-black uppercase text-xl md:text-2xl mb-2 leading-tight">{item.name}</h3>
                      <p className="font-mono text-sm text-gray-600 mb-6 flex-1">{item.description}</p>

                      <button
                        onClick={() =>
                          addToCart({
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            brand: activeSite as "sweets" | "grill",
                            quantity: 1,
                            image: item.image || fallbackImage,
                            instructions: "",
                          })
                        }
                        className={`w-full py-3 border-[3px] border-black font-black uppercase text-lg hover:bg-black hover:text-white transition-colors ${siteData.colors.accent} ${siteData.colors.accentText}`}
                      >
                        Eat Now
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
