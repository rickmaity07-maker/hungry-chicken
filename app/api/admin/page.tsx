"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Tab = "dashboard" | "orders" | "menu";

// Simple two-tone "beep-beep" using the Web Audio API — no audio file needed.
function playBeep() {
  try {
    const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
    const ctx = new Ctx();
    [880, 660].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.22);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.22 + 0.18);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.22);
      osc.stop(ctx.currentTime + i * 0.22 + 0.2);
    });
  } catch {
    // Audio not available (e.g. tab not focused yet) — safe to ignore.
  }
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("orders");

  useEffect(() => {
    if (status === "unauthenticated" || (session && (session.user as any).role !== "admin")) {
      router.push("/");
    }
  }, [status, session, router]);

  if (status === "loading") return <div className="p-10 font-black uppercase text-2xl animate-pulse">Loading Core...</div>;
  if (!session || (session.user as any).role !== "admin") return null;

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto min-h-screen bg-white text-black">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b-[6px] border-black pb-4 gap-4">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight">👑 Kitchen Portal</h1>
        <Link href="/" className="bg-white border-[4px] border-black px-6 py-3 font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors shadow-[6px_6px_0_0_rgba(0,0,0,1)]">
          Back to Store
        </Link>
      </div>

      <div className="flex gap-2 mb-8">
        {(["dashboard", "orders", "menu"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-3 font-black uppercase text-sm border-[3px] border-black transition-colors ${tab === t ? "bg-black text-white" : "bg-white hover:bg-gray-100"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "dashboard" && <Dashboard />}
      {tab === "orders" && <OrdersPanel />}
      {tab === "menu" && <MenuPanel />}
    </div>
  );
}

// ---------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------
function Dashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  if (!stats) return <p className="font-black uppercase">Loading stats...</p>;

  const cards = [
    { label: "Pending Orders", value: stats.pendingCount, color: "bg-yellow-300" },
    { label: "Preparing", value: stats.preparingCount, color: "bg-orange-300" },
    { label: "Orders Today", value: stats.todayOrderCount, color: "bg-blue-300" },
    { label: "Revenue Today", value: `€${stats.todayRevenue.toFixed(2)}`, color: "bg-green-300" },
    { label: "Customers", value: stats.totalCustomers, color: "bg-pink-300" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((c) => (
        <div key={c.label} className={`border-[4px] border-black p-6 shadow-[6px_6px_0_0_rgba(0,0,0,1)] ${c.color}`}>
          <p className="font-black uppercase text-xs mb-2">{c.label}</p>
          <p className="font-black text-3xl">{c.value}</p>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------
// Orders — polls every 8s and beeps when a NEW pending order shows up
// ---------------------------------------------------------------------
function OrdersPanel() {
  const [orders, setOrders] = useState<any[]>([]);
  const knownIds = useRef<Set<string>>(new Set());
  const firstLoad = useRef(true);

  const fetchOrders = useCallback(async () => {
    const res = await fetch("/api/admin/orders");
    if (!res.ok) return;
    const data = await res.json();

    if (!firstLoad.current) {
      const newOnes = data.filter((o: any) => !knownIds.current.has(o.id));
      if (newOnes.length > 0) playBeep();
    }
    firstLoad.current = false;
    knownIds.current = new Set(data.map((o: any) => o.id));
    setOrders(data);
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 8000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status: newStatus }),
    });
    fetchOrders();
  };

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-400",
    preparing: "bg-orange-400",
    ready: "bg-blue-400",
    completed: "bg-green-400",
    cancelled: "bg-red-400",
  };

  const nextStatus: Record<string, string | null> = {
    pending: "preparing",
    preparing: "ready",
    ready: "completed",
    completed: null,
    cancelled: null,
  };

  return orders.length === 0 ? (
    <div className="text-center py-20 border-[4px] border-black bg-gray-100 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
      <p className="text-3xl font-black uppercase">No Orders Yet.</p>
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {orders.map((order: any) => (
        <div key={order.id} className={`p-6 border-[4px] border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] flex flex-col ${statusColor[order.status] || "bg-white"}`}>
          <div className="flex justify-between items-start mb-4 border-b-[4px] border-black pb-4">
            <div>
              <h2 className="text-2xl font-black uppercase">#{order.id.slice(-6)}</h2>
              <p className="font-bold uppercase text-sm mt-1">{order.customerName || order.user?.name || "Guest"}</p>
              <p className="font-mono text-sm font-bold bg-white border-2 border-black inline-block px-1 mt-1">{order.customerPhone || order.user?.phone || "No Phone"}</p>
              <p className="text-[10px] font-black uppercase mt-1">{order.fulfillment === "delivery" ? "🚗 Delivery" : "🏠 Pickup"}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black">€{order.totalAmount.toFixed(2)}</p>
              <p className="font-black uppercase tracking-widest text-xs mt-1 bg-white border-2 border-black px-2 py-1 inline-block">{order.status}</p>
            </div>
          </div>

          <div className="mb-6 flex-1">
            <ul className="space-y-2">
              {order.items.map((item: any) => (
                <li key={item.id} className="flex justify-between font-bold text-sm bg-white border-[3px] border-black p-2">
                  <span>
                    {item.quantity}x {item.name}
                  </span>
                  <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 border-2 border-black ${item.brand === "grill" ? "bg-[#FF5A1F] text-white" : "bg-[#FFC000] text-black"}`}>{item.brand}</span>
                </li>
              ))}
            </ul>

            {order.fulfillment === "delivery" && order.address && (
              <div className="mt-4 p-3 bg-white border-[3px] border-black">
                <p className="font-black uppercase text-xs text-blue-600 mb-1">Deliver To:</p>
                <p className="font-bold text-sm">{order.address}</p>
              </div>
            )}

            {order.instructions && (
              <div className="mt-4 p-3 bg-white border-[3px] border-black">
                <p className="font-black uppercase text-xs text-red-600 mb-1">Kitchen Notes:</p>
                <p className="font-bold text-sm uppercase">{order.instructions}</p>
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-auto">
            {nextStatus[order.status] && (
              <button onClick={() => updateStatus(order.id, nextStatus[order.status]!)} className="flex-1 bg-white border-[3px] border-black py-3 font-black uppercase text-xs hover:bg-black hover:text-white transition-colors">
                Mark {nextStatus[order.status]}
              </button>
            )}
            {order.status !== "completed" && order.status !== "cancelled" && (
              <button onClick={() => updateStatus(order.id, "cancelled")} className="flex-1 bg-white border-[3px] border-black py-3 font-black uppercase text-xs text-red-600 hover:bg-red-600 hover:text-white transition-colors">
                Cancel
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------
// Menu management — full CRUD over the shared Grill/Sweets menu
// ---------------------------------------------------------------------
function MenuPanel() {
  const [items, setItems] = useState<any[]>([]);
  const [section, setSection] = useState<"grill" | "sweets">("grill");
  const [editing, setEditing] = useState<any>(null);
  const emptyForm = { section: "grill", category: "", name: "", description: "", price: "", image: "", available: true };
  const [form, setForm] = useState<any>(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setUploadError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setForm((f: any) => ({ ...f, image: data.url }));
    } catch (err: any) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const fetchItems = useCallback(async () => {
    const res = await fetch("/api/admin/menu");
    if (res.ok) setItems(await res.json());
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const startEdit = (item: any) => {
    setEditing(item);
    setForm({ ...item, price: String(item.price) });
  };

  const resetForm = () => {
    setEditing(null);
    setForm({ ...emptyForm, section });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await fetch("/api/admin/menu", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editing.id, ...form }) });
    } else {
      await fetch("/api/admin/menu", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    }
    resetForm();
    fetchItems();
  };

  const remove = async (id: string) => {
    await fetch("/api/admin/menu", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    fetchItems();
  };

  const toggleAvailable = async (item: any) => {
    await fetch("/api/admin/menu", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: item.id, available: !item.available }) });
    fetchItems();
  };

  const filtered = items.filter((i) => i.section === section);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="flex gap-2 mb-6">
          {(["grill", "sweets"] as const).map((s) => (
            <button key={s} onClick={() => setSection(s)} className={`px-4 py-2 font-black uppercase text-sm border-[3px] border-black ${section === s ? "bg-black text-white" : "bg-white"}`}>
              {s}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="font-mono uppercase text-sm text-gray-500">No items in this section yet — add one on the right.</p>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <div key={item.id} className={`flex items-center gap-4 border-[3px] border-black p-3 shadow-[4px_4px_0_0_rgba(0,0,0,1)] ${item.available ? "bg-white" : "bg-gray-200 opacity-60"}`}>
                {item.image && <img src={item.image} className="w-14 h-14 object-cover border-2 border-black" />}
                <div className="flex-1">
                  <p className="font-black uppercase text-sm">{item.name}</p>
                  <p className="font-mono text-xs text-gray-500">{item.category} · €{item.price.toFixed(2)}</p>
                </div>
                <button onClick={() => toggleAvailable(item)} className="text-xs font-black uppercase border-2 border-black px-2 py-1 hover:bg-black hover:text-white transition-colors">
                  {item.available ? "Hide" : "Show"}
                </button>
                <button onClick={() => startEdit(item)} className="text-xs font-black uppercase border-2 border-black px-2 py-1 hover:bg-black hover:text-white transition-colors">
                  Edit
                </button>
                <button onClick={() => remove(item.id)} className="text-xs font-black uppercase border-2 border-black px-2 py-1 text-red-600 hover:bg-red-600 hover:text-white transition-colors">
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-[4px] border-black p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)] bg-white h-fit">
        <h3 className="font-black uppercase text-xl mb-4">{editing ? "Edit Item" : "Add Item"}</h3>
        <form onSubmit={save} className="space-y-3">
          <select value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} className="w-full border-[2px] border-black p-2 font-bold uppercase text-sm">
            <option value="grill">Grill</option>
            <option value="sweets">Sweets</option>
          </select>
          <input required placeholder="CATEGORY (e.g. Grill & Wraps)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border-[2px] border-black p-2 font-bold uppercase text-sm" />
          <input required placeholder="NAME" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border-[2px] border-black p-2 font-bold uppercase text-sm" />
          <textarea placeholder="DESCRIPTION" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border-[2px] border-black p-2 font-bold text-sm resize-none" rows={2} />
          <input required type="number" step="0.01" placeholder="PRICE" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full border-[2px] border-black p-2 font-bold uppercase text-sm" />

          <div className="space-y-2">
            <label className="block text-xs font-black uppercase">Photo</label>
            {form.image && <img src={form.image} className="w-full h-32 object-cover border-2 border-black" />}
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              className="w-full border-[2px] border-black p-2 text-xs font-bold uppercase file:mr-3 file:border-2 file:border-black file:bg-black file:text-white file:px-2 file:py-1 file:font-black file:uppercase file:text-xs"
            />
            {uploading && <p className="font-mono text-xs">Uploading...</p>}
            {uploadError && <p className="font-mono text-xs text-red-600">{uploadError}</p>}
            <input placeholder="OR PASTE IMAGE URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full border-[2px] border-black p-2 font-bold uppercase text-sm" />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-black text-white font-black uppercase py-3 text-sm hover:bg-gray-800 transition-colors">
              {editing ? "Save Changes" : "Add to Menu"}
            </button>
            {editing && (
              <button type="button" onClick={resetForm} className="border-[2px] border-black px-4 font-black uppercase text-sm">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}