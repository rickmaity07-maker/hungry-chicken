export type SiteId = 'grill' | 'sweets';
export type LanguageId = 'de' | 'en';

export const siteConfig = {
  grill: {
    id: 'grill',
    name: 'Hungry Chicken',
    subName: 'Hungry Chicken Grill',
    colors: {
      bg: 'bg-[#125B39]',
      text: 'text-white',
      accent: 'bg-[#FF5A1F]',
      accentText: 'text-white',
      card: 'bg-white',
      border: 'border-black'
    },
    menu: [
      {
        category: "Chicken Classics",
        items: [
          { name: '02 Fried Chicken', desc: 'Hähnchenfleisch, Mehl, Vanille, Ingwer, Weißer Pfeffer...', price: '12.00€' },
          { name: '03 Crispy', desc: 'Hähnchenbrust fleisch, Mehl, Ei, Weißer Pfeffer, Ingwer...', price: '10.00€' },
          { name: '04 Schnitzel', desc: 'Hähnchenbrust fleisch, Mehl, Ei, Weißer Pfeffer...', price: '10.00€' },
          { name: '07 Chicken Wings', desc: 'Hähnchenfleisch, Mehl, Vanille, Ingwer...', price: '8.00€' }
        ]
      },
      {
        category: "Grill & Wraps",
        items: [
          { name: '01 Schawarma', desc: 'Hähnchenfleisch, Ingwer, Weißer Pfeffer, Zitronensaft...', price: '9.00€' },
          { name: '06 Shish Taouk', desc: 'Hähnchenbrust fleisch, Weißer Pfeffer, Ingwer...', price: '9.00€' },
          { name: '09 Mexican', desc: 'Hähnchenfleisch, Weißer Pfeffer, Mais, Soja, Pilz, Scharf...', price: '11.00€' },
          { name: '10 Fajita', desc: 'Hähnchenfleisch, Ei, Weißer Pfeffer, Käse, Paprika...', price: '11.00€' }
        ]
      },
      {
        category: "Seafood & Sides",
        items: [
          { name: '05 Hammour Fisch', desc: 'Hammour Fisch, Mehl, Ei, Weißer Pfeffer, Ingwer...', price: '15.00€' },
          { name: '11 Falafel', desc: 'Kichererbsen, Petersilie, Koriander, Salz', price: '7.00€' },
          { name: '12 Pommes', desc: 'Classic French Fries', price: '5.00€' }
        ]
      }
    ],
    de: {
      nav: { home: 'Startseite', menu: 'Speisekarte', gallery: 'Galerie', contact: 'Kontakt', toggleBrand: 'Zu Sweets' },
      hero: 'GRÖSSE ZÄHLT',
      tagline: 'NHAM (V.): \\NĂHM\\ 1. DAS GERÄUSCH AGGRESSIVEN ESSENS. 2. AKRONYM: NICHT. MEHR. HUNGRIG.',
      action: 'JETZT ESSEN',
      marquee: ['🔥 RESPEKTIERE DEN CRUNCH.', '🔥 WIR MACHEN KEINE DIÄTEN.', '🔥 ENTSCHULDIGE DICH MORGEN BEI DEINEM TRAINER.', '🔥 LASS DEINE MANIEREN AN DER TÜR.'],
      quote: '"WENN DU KEINE SERVIETTE TRÄGST, MACHST DU ES FALSCH."',
      quoteAuthor: '— Die goldene Regel von Hungry Chicken',
      menuTitle: 'SPEISEKARTE'
    },
    en: {
      nav: { home: 'Home', menu: 'Menu', gallery: 'Gallery', contact: 'Contact', toggleBrand: 'To Sweets' },
      hero: 'SIZE MATTERS',
      tagline: 'NHAM (V.): \\NĂHM\\ 1. THE SOUND OF AGGRESSIVE EATING. 2. ACRONYM: NOT. HUNGRY. ANYMORE.',
      action: 'EAT NOW',
      marquee: ['🔥 RESPECT THE CRUNCH.', '🔥 WE DON\'T DO DIETS.', '🔥 APOLOGIZE TO YOUR TRAINER TOMORROW.', '🔥 LEAVE YOUR MANNERS AT THE DOOR.'],
      quote: '"IF YOU\'RE NOT WEARING A NAPKIN, YOU\'RE DOING IT WRONG."',
      quoteAuthor: '— The Golden Rule of Hungry Chicken',
      menuTitle: 'THE MENU'
    }
  },
  sweets: {
    id: 'sweets',
    name: 'JUICE',
    subName: 'Hungry Chicken Sweets',
    colors: {
      bg: 'bg-[#FF2A75]',
      text: 'text-white',
      accent: 'bg-[#FFC000]',
      accentText: 'text-black',
      card: 'bg-white',
      border: 'border-black'
    },
    menu: [
      {
        category: "Imbiratur",
        items: [
          { name: 'Extra Groß', desc: 'Signature giant fruit and juice glass', price: '15.00€' },
          { name: 'Mittel', desc: 'Medium signature fruit glass', price: '12.00€' },
          { name: 'To Go', desc: 'Takeaway signature fruit cup', price: '10.00€' }
        ]
      },
      {
        category: "Frische Säfte",
        items: [
          { name: 'Erdbeere', desc: 'Fresh Strawberry', price: '7.00€' },
          { name: 'Orange', desc: 'Freshly squeezed Orange', price: '6.50€' },
          { name: 'Mango', desc: 'Fresh Mango puree', price: '7.00€' },
          { name: 'Zitrone & Minze', desc: 'Lemon & Mint', price: '8.00€' },
          { name: 'Ananas', desc: 'Fresh Pineapple', price: '7.00€' }
        ]
      }
    ],
    de: {
      nav: { home: 'Startseite', menu: 'Speisekarte', gallery: 'Galerie', contact: 'Kontakt', toggleBrand: 'Zum Grill' },
      hero: 'GESCHMACK ZÄHLT',
      tagline: 'SÜSS (ADJ.): \\SWĒT\\ 1. ANGENEHM IM GESCHMACK. 2. DAS GEGENGIFT FÜR EINEN LANGWEILIGEN TAG.',
      action: 'DURSTLÖSCHER',
      marquee: ['🍓 KALTGEPRESST. HOHE VIBRATIONEN.', '🍊 PERFEKT GEPRESST.', '🥭 DEINE TÄGLICHE DOSIS DOPAMIN.', '🍋 TRINK DEIN GEMÜSE. ISS DEINE FARBEN.'],
      quote: '"KEINE KÜNSTLICHEN ZUSÄTZE. WIR PRESSEN. DU TRINKST. KEINE KOMPROMISSE."',
      quoteAuthor: '— Der Gründer',
      menuTitle: 'SPEISEKARTE'
    },
    en: {
      nav: { home: 'Home', menu: 'Menu', gallery: 'Gallery', contact: 'Contact', toggleBrand: 'To Grill' },
      hero: 'TASTE MATTERS',
      tagline: 'SWEET (ADJ.): \\SWĒT\\ 1. PLEASING TO THE TASTE. 2. THE ANTIDOTE TO A BORING DAY.',
      action: 'THIRST TRAP',
      marquee: ['🍓 COLD PRESSED. HIGH VIBRATIONS.', '🍊 SQUEEZED TO PERFECTION.', '🥭 YOUR DAILY DOSE OF DOPAMINE.', '🍋 DRINK YOUR GREENS. EAT YOUR COLORS.'],
      quote: '"NO ARTIFICIAL ANYTHING. WE SQUEEZE. YOU DRINK. NO COMPROMISES."',
      quoteAuthor: '— The Founder',
      menuTitle: 'THE MENU'
    }
  }
};