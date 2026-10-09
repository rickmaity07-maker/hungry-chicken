"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useSite } from "./SiteProvider";

type CartItem = {
  id: string;
  name: string;
  price: number;
  brand: "sweets" | "grill";
  quantity: number;
  image: string;
  instructions: string;
};

type WishlistItem = {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  image: string;
  brand: string;
};

type CommerceContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  updateInstructions: (id: string, text: string) => void;
  isCartOpen: boolean;
  setIsCartOpen: (val: boolean) => void;
  isProfileOpen: boolean;
  setIsProfileOpen: (val: boolean) => void;
  wishlist: WishlistItem[];
  toggleWishlist: (item: WishlistItem) => void;
  isWishlisted: (menuItemId: string) => boolean;
};

const CommerceContext = createContext<CommerceContextType | undefined>(undefined);

export function useCommerce() {
  const context = useContext(CommerceContext);
  if (!context) {
    return {
      cart: [],
      addToCart: () => {},
      updateQuantity: () => {},
      removeItem: () => {},
      updateInstructions: () => {},
      isCartOpen: false,
      setIsCartOpen: () => {},
      isProfileOpen: false,
      setIsProfileOpen: () => {},
      wishlist: [],
      toggleWishlist: () => {},
      isWishlisted: () => false,
    };
  }
  return context;
}

type ProfileTab = "account" | "orders" | "wishlist";
type AuthView = "login" | "register" | "otp" | "awaiting-link";

export function CommerceEngine({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const { siteData } = useSite();

  // ---------------- Cart (shared across Grill + Sweets) ----------------
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "checkout" | "confirmed">("cart");

  useEffect(() => {
    setIsMounted(true);
    const savedCart = localStorage.getItem("hc_cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    if (isMounted) localStorage.setItem("hc_cart", JSON.stringify(cart));
  }, [cart, isMounted]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQ = item.quantity + delta;
          return newQ > 0 ? { ...item, quantity: newQ } : item;
        }
        return item;
      })
    );
  };

  const removeItem = (id: string) => setCart((prev) => prev.filter((item) => item.id !== id));
  const updateInstructions = (id: string, text: string) =>
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, instructions: text } : item)));

  // Menu prices are gross (VAT included), as German price law requires for
  // consumers — so the total is simply the sum, with nothing added on top.
  const finalTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // ---------------- Wishlist ----------------
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  const refreshWishlist = useCallback(async () => {
    if (status !== "authenticated") {
      setWishlist([]);
      return;
    }
    try {
      const res = await fetch("/api/wishlist");
      if (res.ok) setWishlist(await res.json());
    } catch {}
  }, [status]);

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  const isWishlisted = (menuItemId: string) => wishlist.some((w) => w.menuItemId === menuItemId);

  const toggleWishlist = async (item: WishlistItem) => {
    if (status !== "authenticated") {
      setIsProfileOpen(true);
      return;
    }
    if (isWishlisted(item.menuItemId)) {
      setWishlist((prev) => prev.filter((w) => w.menuItemId !== item.menuItemId));
      await fetch("/api/wishlist", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ menuItemId: item.menuItemId }) });
    } else {
      setWishlist((prev) => [...prev, item]);
      await fetch("/api/wishlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) });
    }
  };

  // ---------------- Profile modal / auth / orders ----------------
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileTab, setProfileTab] = useState<ProfileTab>("account");
  const [authView, setAuthView] = useState<AuthView>("login");
  const [authError, setAuthError] = useState("");
  const [authBusy, setAuthBusy] = useState(false);

  // NextAuth redirects back with ?error=... when a provider sign-in fails
  // (e.g. Google/Facebook client ID or secret missing or misconfigured).
  // Surface that instead of failing silently. Read straight off the
  // browser URL (client-only) so this doesn't force a Suspense boundary
  // around the whole app the way next/navigation's useSearchParams would.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get("error");
    if (!oauthError) return;

    const messages: Record<string, string> = {
      OAuthSignin: "That login provider isn't set up yet on this server (missing client ID/secret). Try email/password below.",
      OAuthCallback: "That login provider isn't set up yet on this server. Try email/password below.",
      OAuthCreateAccount: "Couldn't create an account from that provider. Try email/password below.",
      OAuthAccountNotLinked: "That email is already registered with a password. Log in with your email and password instead.",
      Callback: "Something went wrong finishing that login. Please try again.",
      CredentialsSignin: "Incorrect email or password.",
      Default: "Something went wrong logging in. Please try again.",
    };

    setAuthView("login");
    setAuthError(messages[oauthError] || messages.Default);
    setIsProfileOpen(true);

    // Strip ?error=...&callbackUrl=... from the URL so a refresh doesn't re-show it.
    window.history.replaceState({}, "", window.location.pathname);
  }, []);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regAgreed, setRegAgreed] = useState(false);

  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");

  const [orders, setOrders] = useState<any[]>([]);
  const [deleteConfirming, setDeleteConfirming] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const refreshOrders = useCallback(async () => {
    if (status !== "authenticated") {
      setOrders([]);
      return;
    }
    try {
      const res = await fetch("/api/orders");
      if (res.ok) setOrders(await res.json());
    } catch {}
  }, [status]);

  useEffect(() => {
    if (profileTab === "orders") refreshOrders();
  }, [profileTab, refreshOrders]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthBusy(true);
    const res = await signIn("credentials", { email: loginEmail, password: loginPassword, redirect: false });
    setAuthBusy(false);
    if (res?.error) setAuthError(res.error === "CredentialsSignin" ? "Incorrect email or password." : res.error);
    else {
      setIsProfileOpen(false);
      if (checkoutStep === "cart" && isCartOpen) setCheckoutStep("checkout");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    if (!regAgreed) {
      setAuthError("Please confirm you've read the Privacy Policy to continue.");
      return;
    }
    setAuthBusy(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: regName, email: regEmail, phone: regPhone, password: regPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not sign up.");
      setAuthView("otp");
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthBusy(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthBusy(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: regEmail, emailCode: emailOtp, phoneCode: phoneOtp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not verify codes.");
      setAuthView("awaiting-link");
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthBusy(false);
    }
  };

  const handleResendOtp = async () => {
    setAuthError("");
    await fetch("/api/auth/resend-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: regEmail }),
    });
  };

  const handlePlaceOrder = async (payload: { fulfillment: "pickup" | "delivery"; address: string; customerName: string; customerPhone: string; instructions: string }) => {
    setAuthError("");
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cart.map((c) => ({ id: c.id, quantity: c.quantity, instructions: c.instructions })),
        ...payload,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setAuthError(data.error || "Could not place order.");
      return false;
    }
    setCart([]);
    setCheckoutStep("confirmed");
    return true;
  };

  const isVerified = status === "authenticated" && !!(session?.user as any)?.emailVerified;

  const handleDeleteAccount = async () => {
    setDeleteBusy(true);
    setDeleteError("");
    try {
      const res = await fetch("/api/account/delete", { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not delete account.");
      await signOut({ redirect: false });
      setIsProfileOpen(false);
      setDeleteConfirming(false);
    } catch (err: any) {
      setDeleteError(err.message);
    } finally {
      setDeleteBusy(false);
    }
  };

  return (
    <CommerceContext.Provider value={{ cart, addToCart, updateQuantity, removeItem, updateInstructions, isCartOpen, setIsCartOpen, isProfileOpen, setIsProfileOpen, wishlist, toggleWishlist, isWishlisted }}>
      {children}

      {/* FLOATING ACTION BUTTONS */}
      <div className="fixed bottom-4 md:bottom-8 right-4 md:right-8 z-50 flex flex-col items-end gap-3">
        {status === "authenticated" && (
          <span className="bg-black text-white text-[10px] md:text-xs font-black uppercase px-2 py-1 border-2 border-black shadow-[3px_3px_0_0_rgba(0,0,0,1)]">
            ✓ {session?.user?.name?.split(" ")[0] || "Logged In"}
          </span>
        )}
        <button
          onClick={() => setIsProfileOpen(true)}
          title={status === "authenticated" ? `Logged in as ${session?.user?.email}` : "Log in / Sign up"}
          className="relative w-12 h-12 md:w-16 md:h-16 bg-white border-[3px] border-black rounded-full shadow-[4px_4px_0_0_rgba(0,0,0,1)] flex items-center justify-center text-xl md:text-2xl hover:-translate-y-1 hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-all"
        >
          {status === "authenticated" ? "👤" : "🔐"}
          {status === "authenticated" && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-black rounded-full"></span>
          )}
        </button>
        <button
          onClick={() => {
            setCheckoutStep("cart");
            setIsCartOpen(true);
          }}
          className={`relative w-12 h-12 md:w-16 md:h-16 ${siteData.colors.bg} text-white border-[3px] border-black rounded-full shadow-[4px_4px_0_0_rgba(0,0,0,1)] flex items-center justify-center text-xl md:text-2xl hover:-translate-y-1 hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-all`}
        >
          🛒
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
        </button>
      </div>

      {/* CART / CHECKOUT DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              setIsCartOpen(false);
              setCheckoutStep("cart");
            }}
          ></div>
          <div className="relative w-full max-w-md bg-white text-black h-full border-l-[4px] border-black flex flex-col shadow-[-10px_0_0_0_rgba(0,0,0,0.2)] animate-in slide-in-from-right duration-300">
            <div className={`p-6 border-b-[4px] border-black flex justify-between items-center ${siteData.colors.bg}`}>
              <h2 className="text-3xl font-black uppercase text-white drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
                {checkoutStep === "confirmed" ? "Order Placed" : checkoutStep === "checkout" ? "Checkout" : "Your Order"}
              </h2>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setCheckoutStep("cart");
                }}
                aria-label="Schließen" className="text-white text-3xl font-bold drop-shadow-[2px_2px_0_rgba(0,0,0,1)] hover:rotate-90 transition-transform"
              >
                ×
              </button>
            </div>

            {checkoutStep === "cart" && (
              <>
                <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-[radial-gradient(#d4d4d4_2px,transparent_0)] bg-[length:20px_20px]">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                      <span className="text-6xl mb-4">🍗</span>
                      <p className="font-bold text-xl uppercase font-mono">Your cart is starving.</p>
                      <p className="font-mono text-xs mt-2 text-gray-500 uppercase">Grill & Sweets share one cart — mix and match freely.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div key={item.id} className="bg-white border-[3px] border-black p-3 shadow-[4px_4px_0_0_rgba(0,0,0,1)] flex flex-col gap-3">
                          <div className="flex gap-3 items-center">
                            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover border-[2px] border-black" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-black uppercase leading-tight text-sm md:text-base">{item.name}</h4>
                                <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 border-2 border-black ${item.brand === "grill" ? "bg-[#FF5A1F] text-white" : "bg-[#FFC000] text-black"}`}>
                                  {item.brand}
                                </span>
                              </div>
                              <span className="font-black text-sm">€{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                            <button onClick={() => removeItem(item.id)} className="text-2xl leading-none hover:text-red-600 transition-colors px-2 pb-1">
                              ×
                            </button>
                          </div>

                          <div className="flex gap-2 h-10">
                            <div className="flex items-center border-[2px] border-black h-full bg-gray-100">
                              <button onClick={() => updateQuantity(item.id, -1)} className="px-3 h-full font-black hover:bg-black hover:text-white transition-colors">
                                -
                              </button>
                              <span className="px-2 font-black text-sm">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, 1)} className="px-3 h-full font-black hover:bg-black hover:text-white transition-colors">
                                +
                              </button>
                            </div>
                            <input
                              type="text"
                              placeholder="Notes? (e.g. No mayo)"
                              value={item.instructions}
                              onChange={(e) => updateInstructions(item.id, e.target.value)}
                              className="flex-1 border-[2px] border-black px-2 text-xs font-bold uppercase focus:outline-none focus:ring-2 ring-black placeholder:text-gray-400"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-6 border-t-[4px] border-black bg-white">
                  <div className="flex justify-between items-center font-black uppercase text-2xl">
                    <span>Total:</span>
                    <span className="tabular-nums">€{finalTotal.toFixed(2)}</span>
                  </div>
                  <p className="mb-4 text-right font-mono text-xs text-gray-500">inkl. MwSt.</p>
                  <button
                    disabled={cart.length === 0 || status === "loading"}
                    onClick={() => {
                      if (status === "loading") return; // session still resolving — wait, don't bounce to login
                      if (status !== "authenticated") {
                        setProfileTab("account");
                        setAuthView("login");
                        setIsProfileOpen(true);
                        return;
                      }
                      setCheckoutStep("checkout");
                    }}
                    className={`w-full py-4 border-[3px] border-black font-black uppercase text-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed ${siteData.colors.accent} ${siteData.colors.accentText}`}
                  >
                    {status === "loading" ? "Checking Login..." : status === "authenticated" ? "Checkout (Cash)" : "Log In to Checkout"}
                  </button>
                </div>
              </>
            )}

            {checkoutStep === "checkout" && (
              <CheckoutForm
                total={finalTotal}
                defaultName={session?.user?.name || ""}
                defaultPhone={(session?.user as any)?.phone || ""}
                onBack={() => setCheckoutStep("cart")}
                onSubmit={handlePlaceOrder}
                error={authError}
                accent={siteData.colors.accent}
                accentText={siteData.colors.accentText}
              />
            )}

            {checkoutStep === "confirmed" && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-4">
                <span className="text-6xl">✅</span>
                <h3 className="font-black uppercase text-2xl">Order sent to the kitchen!</h3>
                <p className="font-mono text-sm text-gray-600 uppercase">Pay with cash when it's ready. You'll see live status under My Orders.</p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setCheckoutStep("cart");
                  }}
                  className="mt-4 border-[3px] border-black px-6 py-3 font-black uppercase bg-black text-white hover:bg-gray-800 transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* USER PROFILE MODAL */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsProfileOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white text-black border-[4px] border-black shadow-[12px_12px_0_0_rgba(0,0,0,1)] animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-4 border-b-[4px] border-black bg-gray-100">
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                <button onClick={() => setProfileTab("account")} className={`px-3 py-1 font-bold uppercase border-[2px] border-black text-xs ${profileTab === "account" ? "bg-black text-white" : "bg-white"}`}>
                  Account
                </button>
                <button onClick={() => setProfileTab("orders")} className={`px-3 py-1 font-bold uppercase border-[2px] border-black text-xs ${profileTab === "orders" ? "bg-black text-white" : "bg-white"}`}>
                  Orders
                </button>
                <button onClick={() => setProfileTab("wishlist")} className={`px-3 py-1 font-bold uppercase border-[2px] border-black text-xs ${profileTab === "wishlist" ? "bg-black text-white" : "bg-white"}`}>
                  Wishlist
                </button>
              </div>
              <button onClick={() => setIsProfileOpen(false)} className="text-2xl font-black ml-2 leading-none pb-1">
                ×
              </button>
            </div>

            <div className="p-8 overflow-y-auto">
              {profileTab === "account" && status === "authenticated" && (
                <div className="space-y-4 text-center">
                  <span className="text-5xl">👤</span>
                  <h2 className="text-2xl font-black uppercase">{session?.user?.name || "Your Account"}</h2>
                  <p className="font-mono text-sm text-gray-600">{session?.user?.email}</p>
                  {(session?.user as any)?.phone && <p className="font-mono text-sm text-gray-600">{(session?.user as any)?.phone}</p>}
                  {isVerified ? (
                    <p className="inline-block font-black text-xs uppercase bg-green-400 border-2 border-black px-2 py-1">✓ Verified</p>
                  ) : (
                    <p className="inline-block font-black text-xs uppercase bg-yellow-300 border-2 border-black px-2 py-1">Awaiting verification</p>
                  )}
                  {(session?.user as any)?.role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setIsProfileOpen(false)}
                      className="block w-full bg-yellow-300 border-[3px] border-black py-3 font-black uppercase hover:bg-yellow-200 transition-colors"
                    >
                      👑 Kitchen Portal
                    </Link>
                  )}
                  <button onClick={() => signOut()} className="w-full mt-4 bg-black text-white border-[3px] border-black py-3 font-black uppercase hover:bg-gray-800 transition-colors">
                    Log Out
                  </button>

                  <div className="mt-6 pt-4 border-t-2 border-dashed border-gray-300 space-y-2 text-left">
                    <p className="font-mono text-[10px] text-gray-500 uppercase text-center">Your Data (GDPR)</p>
                    <a
                      href="/api/account/export"
                      className="block w-full text-center border-[3px] border-black py-2 font-black uppercase text-xs hover:bg-black hover:text-white transition-colors"
                    >
                      ⬇ Download My Data
                    </a>

                    {!deleteConfirming ? (
                      <button
                        onClick={() => setDeleteConfirming(true)}
                        className="w-full text-center border-[3px] border-red-600 text-red-600 py-2 font-black uppercase text-xs hover:bg-red-600 hover:text-white transition-colors"
                      >
                        Delete My Account
                      </button>
                    ) : (
                      <div className="border-[3px] border-red-600 p-3 space-y-2">
                        <p className="font-mono text-xs text-red-700">
                          This permanently deletes your account, wishlist, and saved addresses. Past orders are kept
                          for tax records but your name/phone/address are removed from them. This can't be undone.
                        </p>
                        {deleteError && <p className="font-mono text-xs text-red-700 font-bold">{deleteError}</p>}
                        <div className="flex gap-2">
                          <button
                            onClick={() => setDeleteConfirming(false)}
                            className="flex-1 border-2 border-black py-2 font-black uppercase text-xs hover:bg-gray-100 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleDeleteAccount}
                            disabled={deleteBusy}
                            className="flex-1 bg-red-600 text-white border-2 border-red-600 py-2 font-black uppercase text-xs hover:bg-red-700 transition-colors disabled:opacity-50"
                          >
                            {deleteBusy ? "Deleting..." : "Yes, Delete"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {profileTab === "account" && status !== "authenticated" && (
                <AuthPanel
                  view={authView}
                  setView={setAuthView}
                  error={authError}
                  busy={authBusy}
                  loginEmail={loginEmail}
                  setLoginEmail={setLoginEmail}
                  loginPassword={loginPassword}
                  setLoginPassword={setLoginPassword}
                  onLogin={handleLogin}
                  regName={regName}
                  setRegName={setRegName}
                  regEmail={regEmail}
                  setRegEmail={setRegEmail}
                  regPhone={regPhone}
                  setRegPhone={setRegPhone}
                  regPassword={regPassword}
                  setRegPassword={setRegPassword}
                  regAgreed={regAgreed}
                  setRegAgreed={setRegAgreed}
                  onRegister={handleRegister}
                  emailOtp={emailOtp}
                  setEmailOtp={setEmailOtp}
                  phoneOtp={phoneOtp}
                  setPhoneOtp={setPhoneOtp}
                  onVerifyOtp={handleVerifyOtp}
                  onResendOtp={handleResendOtp}
                />
              )}

              {profileTab === "orders" && (
                <div>
                  {status !== "authenticated" ? (
                    <div className="text-center py-10">
                      <span className="text-4xl">🧾</span>
                      <h3 className="font-black uppercase mt-4 text-xl">Log In First</h3>
                      <p className="font-mono text-sm mt-2 text-gray-500">See your order history once you're logged in.</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-10">
                      <span className="text-4xl">🧾</span>
                      <h3 className="font-black uppercase mt-4 text-xl">No Past Orders</h3>
                      <p className="font-mono text-sm mt-2 text-gray-500">Your first order will show up here.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((o) => (
                        <div key={o.id} className="border-[3px] border-black p-3 shadow-[3px_3px_0_0_rgba(0,0,0,1)]">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-black text-sm">#{o.id.slice(-6)}</span>
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 border-2 border-black ${o.status === "completed" ? "bg-green-400" : o.status === "cancelled" ? "bg-red-400" : "bg-yellow-300"}`}>
                              {o.status}
                            </span>
                          </div>
                          <p className="font-mono text-xs text-gray-600">{new Date(o.createdAt).toLocaleString()}</p>
                          <ul className="font-mono text-xs mt-2 space-y-0.5">
                            {o.items.map((it: any) => (
                              <li key={it.id}>
                                {it.quantity}x {it.name}
                              </li>
                            ))}
                          </ul>
                          <p className="font-black text-sm mt-2">€{o.totalAmount.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {profileTab === "wishlist" && (
                <div>
                  {status !== "authenticated" ? (
                    <div className="text-center py-10">
                      <span className="text-4xl">❤️</span>
                      <h3 className="font-black uppercase mt-4 text-xl">Log In First</h3>
                      <p className="font-mono text-sm mt-2 text-gray-500">Save your favorite dishes once you're logged in.</p>
                    </div>
                  ) : wishlist.length === 0 ? (
                    <div className="text-center py-10">
                      <span className="text-4xl">❤️</span>
                      <h3 className="font-black uppercase mt-4 text-xl">Wishlist Empty</h3>
                      <p className="font-mono text-sm mt-2 text-gray-500">Tap the heart on any dish to save it here.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {wishlist.map((w) => (
                        <div key={w.id} className="flex items-center gap-3 border-[3px] border-black p-2 shadow-[3px_3px_0_0_rgba(0,0,0,1)]">
                          <img src={w.image} className="w-12 h-12 object-cover border-2 border-black" />
                          <div className="flex-1">
                            <p className="font-black text-sm uppercase">{w.name}</p>
                            <p className="font-mono text-xs">€{w.price.toFixed(2)}</p>
                          </div>
                          <button
                            onClick={() =>
                              addToCart({
                                id: w.menuItemId,
                                name: w.name,
                                price: w.price,
                                brand: w.brand as "sweets" | "grill",
                                quantity: 1,
                                image: w.image,
                                instructions: "",
                              })
                            }
                            className="text-xs font-black uppercase border-2 border-black px-2 py-1 hover:bg-black hover:text-white transition-colors"
                          >
                            Add
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </CommerceContext.Provider>
  );
}

// ---------------------------------------------------------------------
// Login / Register / OTP panel
// ---------------------------------------------------------------------
function AuthPanel(props: any) {
  const { view, setView, error, busy, loginEmail, setLoginEmail, loginPassword, setLoginPassword, onLogin, regName, setRegName, regEmail, setRegEmail, regPhone, setRegPhone, regPassword, setRegPassword, regAgreed, setRegAgreed, onRegister, emailOtp, setEmailOtp, phoneOtp, setPhoneOtp, onVerifyOtp, onResendOtp } = props;

  if (view === "login") {
    return (
      <div className="space-y-4">
        <h2 className="text-3xl font-black uppercase mb-2 text-center">Login</h2>
        <button onClick={() => signIn("google")} className="w-full bg-white border-[3px] border-black py-3 font-bold uppercase shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2">
          <span>G</span> Continue with Google
        </button>
        <button onClick={() => signIn("facebook")} className="w-full bg-blue-600 text-white border-[3px] border-black py-3 font-bold uppercase shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2">
          <span>f</span> Continue with Facebook
        </button>
        <p className="font-mono text-[10px] text-gray-500 text-center">
          By continuing with Google or Facebook you agree to our{" "}
          <Link href="/datenschutz" target="_blank" className="underline">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="text-center font-mono text-sm font-bold my-4">OR</div>
        <form onSubmit={onLogin} className="space-y-3">
          <input type="email" required placeholder="EMAIL ADDRESS" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="w-full border-[3px] border-black p-3 font-bold uppercase focus:outline-none focus:ring-4 ring-[#FFC000]" />
          <input type="password" required placeholder="PASSWORD" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="w-full border-[3px] border-black p-3 font-bold uppercase focus:outline-none focus:ring-4 ring-[#FFC000]" />
          {error && <p className="text-red-600 font-bold text-xs uppercase">{error}</p>}
          <button type="submit" disabled={busy} className="w-full bg-black text-white border-[3px] border-black py-3 font-black uppercase shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:bg-gray-800 transition-colors disabled:opacity-50">
            {busy ? "Logging in..." : "Log In"}
          </button>
        </form>
        <button onClick={() => setView("register")} className="w-full text-center font-mono text-xs uppercase underline mt-2">
          New here? Create an account
        </button>
      </div>
    );
  }

  if (view === "register") {
    return (
      <div className="space-y-4">
        <h2 className="text-3xl font-black uppercase mb-2 text-center">Sign Up</h2>
        <form onSubmit={onRegister} className="space-y-3">
          <input type="text" required placeholder="FULL NAME" value={regName} onChange={(e) => setRegName(e.target.value)} className="w-full border-[3px] border-black p-3 font-bold uppercase focus:outline-none focus:ring-4 ring-[#FFC000]" />
          <input type="email" required placeholder="EMAIL ADDRESS" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} className="w-full border-[3px] border-black p-3 font-bold uppercase focus:outline-none focus:ring-4 ring-[#FFC000]" />
          <input type="tel" required placeholder="MOBILE NUMBER" value={regPhone} onChange={(e) => setRegPhone(e.target.value)} className="w-full border-[3px] border-black p-3 font-bold uppercase focus:outline-none focus:ring-4 ring-[#FFC000]" />
          <input type="password" required placeholder="PASSWORD (MIN 6 CHARS)" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} className="w-full border-[3px] border-black p-3 font-bold uppercase focus:outline-none focus:ring-4 ring-[#FFC000]" />
          <label className="flex items-start gap-2 font-mono text-xs cursor-pointer">
            <input type="checkbox" checked={regAgreed} onChange={(e) => setRegAgreed(e.target.checked)} className="mt-0.5 w-4 h-4 shrink-0 accent-black" />
            <span>
              I've read and agree to the{" "}
              <Link href="/datenschutz" target="_blank" className="underline font-bold">
                Privacy Policy
              </Link>
              .
            </span>
          </label>
          {error && <p className="text-red-600 font-bold text-xs uppercase">{error}</p>}
          <button type="submit" disabled={busy || !regAgreed} className="w-full bg-black text-white border-[3px] border-black py-3 font-black uppercase shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:bg-gray-800 transition-colors disabled:opacity-50">
            {busy ? "Sending codes..." : "Send Verification Codes"}
          </button>
        </form>
        <button onClick={() => setView("login")} className="w-full text-center font-mono text-xs uppercase underline mt-2">
          Already have an account? Log in
        </button>
      </div>
    );
  }

  if (view === "otp") {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-black uppercase mb-2 text-center">Verify You</h2>
        <p className="font-mono text-xs text-center text-gray-600 uppercase">We sent a 6-digit code to your email and your phone.</p>
        <form onSubmit={onVerifyOtp} className="space-y-3">
          <input type="text" required maxLength={6} placeholder="EMAIL CODE" value={emailOtp} onChange={(e) => setEmailOtp(e.target.value)} className="w-full border-[3px] border-black p-3 font-bold uppercase text-center tracking-[0.3em] focus:outline-none focus:ring-4 ring-[#FFC000]" />
          <input type="text" required maxLength={6} placeholder="PHONE CODE" value={phoneOtp} onChange={(e) => setPhoneOtp(e.target.value)} className="w-full border-[3px] border-black p-3 font-bold uppercase text-center tracking-[0.3em] focus:outline-none focus:ring-4 ring-[#FFC000]" />
          {error && <p className="text-red-600 font-bold text-xs uppercase">{error}</p>}
          <button type="submit" disabled={busy} className="w-full bg-black text-white border-[3px] border-black py-3 font-black uppercase shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:bg-gray-800 transition-colors disabled:opacity-50">
            {busy ? "Verifying..." : "Verify Codes"}
          </button>
        </form>
        <button onClick={onResendOtp} className="w-full text-center font-mono text-xs uppercase underline mt-2">
          Resend codes
        </button>
      </div>
    );
  }

  // awaiting-link
  return (
    <div className="text-center space-y-4 py-6">
      <span className="text-5xl">📬</span>
      <h2 className="text-2xl font-black uppercase">Almost there</h2>
      <p className="font-mono text-sm text-gray-600 uppercase">
        Codes confirmed. We just emailed you a final confirmation link — click it, then come back here and log in.
      </p>
      <button onClick={() => setView("login")} className="w-full bg-black text-white border-[3px] border-black py-3 font-black uppercase shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:bg-gray-800 transition-colors">
        Back to Login
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------
// Checkout form (address / pickup / instructions) — cash only
// ---------------------------------------------------------------------
function CheckoutForm({ total, defaultName, defaultPhone, onBack, onSubmit, error, accent, accentText }: any) {
  const [fulfillment, setFulfillment] = useState<"pickup" | "delivery">("pickup");
  const [name, setName] = useState(defaultName);
  const [phone, setPhone] = useState(defaultPhone);
  const [address, setAddress] = useState("");
  const [instructions, setInstructions] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    await onSubmit({ fulfillment, address, customerName: name, customerPhone: phone, instructions });
    setBusy(false);
  };

  return (
    <form onSubmit={submit} className="flex-1 flex flex-col overflow-y-auto">
      <div className="flex-1 p-6 space-y-4">
        <div className="flex gap-2">
          <button type="button" onClick={() => setFulfillment("pickup")} className={`flex-1 border-[3px] border-black py-3 font-black uppercase text-sm ${fulfillment === "pickup" ? `${accent} ${accentText}` : "bg-white"}`}>
            Pickup
          </button>
          <button type="button" onClick={() => setFulfillment("delivery")} className={`flex-1 border-[3px] border-black py-3 font-black uppercase text-sm ${fulfillment === "delivery" ? `${accent} ${accentText}` : "bg-white"}`}>
            Delivery
          </button>
        </div>

        <input type="text" required placeholder="YOUR NAME" value={name} onChange={(e) => setName(e.target.value)} className="w-full border-[3px] border-black p-3 font-bold uppercase focus:outline-none focus:ring-4 ring-black/20" />
        <input type="tel" required placeholder="PHONE NUMBER" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border-[3px] border-black p-3 font-bold uppercase focus:outline-none focus:ring-4 ring-black/20" />

        {fulfillment === "delivery" && (
          <textarea required rows={3} placeholder="DELIVERY ADDRESS" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border-[3px] border-black p-3 font-bold uppercase focus:outline-none focus:ring-4 ring-black/20 resize-none" />
        )}

        <textarea rows={2} placeholder="ANYTHING ELSE FOR THE KITCHEN? (OPTIONAL)" value={instructions} onChange={(e) => setInstructions(e.target.value)} className="w-full border-[3px] border-black p-3 font-bold uppercase focus:outline-none focus:ring-4 ring-black/20 resize-none" />

        {error && <p className="text-red-600 font-bold text-xs uppercase">{error}</p>}
      </div>

      <div className="p-6 border-t-[4px] border-black bg-white">
        <div className="flex justify-between items-center mb-4 font-black uppercase text-2xl">
          <span>Total (Cash):</span>
          <span>€{total.toFixed(2)}</span>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={onBack} className="flex-1 border-[3px] border-black py-4 font-black uppercase bg-white hover:bg-gray-100 transition-colors">
            Back
          </button>
          <button type="submit" disabled={busy} className={`flex-[2] py-4 border-[3px] border-black font-black uppercase text-lg shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all disabled:opacity-50 ${accent} ${accentText}`}>
            {busy ? "Placing..." : "Place Order"}
          </button>
        </div>
      </div>
    </form>
  );
}