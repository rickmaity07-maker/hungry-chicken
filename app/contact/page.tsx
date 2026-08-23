"use client";
import { useSite } from "@/components/SiteProvider";

function SweetsContact() {
  return (
    <div className="min-h-screen bg-zinc-50 pt-32 px-8">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
        <div className="space-y-16 py-12">
          <div>
            <h1 className="text-5xl font-light tracking-[0.2em] text-zinc-900 mb-6">SAY HELLO.</h1>
            <p className="text-zinc-500 font-light leading-relaxed max-w-md">We'd love to host you. Drop by for fresh juices or reach out for event catering.</p>
          </div>
          <div className="space-y-4 text-zinc-800 font-light text-lg">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-medium mb-2">Location</p>
            <p>Münchner Straße 45</p>
            <p>80331 Munich, Germany</p>
            
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-medium mb-2 pt-8">Hours</p>
            <p>Mon - Sun | 10:00 - 20:00</p>
          </div>
        </div>
        <div className="aspect-[4/5] bg-zinc-200 shadow-2xl shadow-black/5 overflow-hidden">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2662.7!2d11.5!3d48.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z!5e0!3m2!1sen!2sde!4v1620000000000!5m2!1sen!2sde" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" className="grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700"></iframe>
        </div>
      </div>
    </div>
  );
}

function GrillContact() {
  return (
    <div className="min-h-screen bg-neutral-950 pt-32 px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-7xl font-black text-white uppercase tracking-tighter mb-16 text-center">FIND <span className="text-red-600">US.</span></h1>
        
        <div className="grid md:grid-cols-3 gap-0 border border-neutral-800">
          <div className="bg-neutral-900 p-12 col-span-1 flex flex-col justify-center border-b md:border-b-0 md:border-r border-neutral-800">
            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter text-red-500">LOCATION</h2>
            <p className="text-neutral-400 font-bold mb-12 text-lg">Münchner Straße 45<br/>80331 Munich</p>
            
            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter text-red-500">HOURS</h2>
            <p className="text-white font-black text-3xl">11:00 - LATE</p>
          </div>
          
          <div className="col-span-2 h-[600px] bg-neutral-900 relative">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2662.7!2d11.5!3d48.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z!5e0!3m2!1sen!2sde!4v1620000000000!5m2!1sen!2sde" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" className="opacity-60 hover:opacity-100 transition-opacity duration-500"></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Contact() {
  const { activeSite } = useSite();
  if (activeSite === 'sweets') return <SweetsContact />;
  return <GrillContact />;
}