# Hungry Chicken — Changes Summary

Everything below was built on top of your existing template. **No visual
design was changed** — same neubrutalist look, same Grill/Sweets toggle,
same fonts/colors. This is all new plumbing underneath it.

## 1. One store, two sections (not two stores)
Nothing to "merge" architecturally — `SiteProvider` already just switches a
color theme + copy, while `CommerceEngine` (cart), `AuthProvider` (login),
and the `/admin` portal were already shared globally in `app/layout.tsx`.
That's the definition of one storefront with two visual sections. I kept it
exactly that way, since that's what you asked for, and cleaned up leftover
per-brand nav items that don't apply to a single unified checkout.

## 2. Single shared cart across Grill ↔ Sweets
Already true in the original code (`cart` lives in `CommerceEngine`, above
both sections) — confirmed and kept. Switching sections never touches the
cart. I added a little brand tag (🟠 GRILL / 🟡 SWEETS) on each cart line
so it's obvious at checkout time what's coming from where.

## 3. Removed table reservations & catering
Deleted `/app/reservations` and `/app/events` entirely, and the "Book Now"
button + those two nav links, from **both** sections. Nav is now:
Home · Menu · Gallery · Contact.

## 4. No payment portal — cash only, with a Kitchen Portal "beep"
- Checkout just collects **Pickup or Delivery**, name, phone, (address if
  delivery), and notes — then places the order. No card fields anywhere.
- `/admin` now polls for new orders every 8 seconds and plays a two-tone
  beep (generated in-browser, no audio file needed) the moment a new
  order appears — leave that tab open in the kitchen.

## 5. Login required to checkout (proprietary email, Google, or Facebook)
- **Email/password**: full signup flow below.
- **Google / Facebook**: wired to NextAuth — just add your OAuth
  credentials to `.env` (`GOOGLE_CLIENT_ID`, `FACEBOOK_CLIENT_ID`, etc.)
  and those buttons work immediately. OAuth logins skip OTP (you already
  own that inbox by definition).
- The cart's checkout button opens the login/signup panel automatically
  if nobody's logged in, and the order API rejects placing an order for
  anyone who isn't logged in **and** fully verified.

## 6. Signup flow: OTP (email + phone) → confirmation email link
Exactly the sequence you described:
1. Customer enters name, email, phone, password → **`/api/auth/register`**
   creates the account and sends a 6-digit code to their email and a
   6-digit code to their phone.
2. Customer enters both codes → **`/api/auth/verify-otp`** checks them,
   then emails a **"confirm your account" link**.
3. Customer clicks that link → **`/api/auth/verify-email`** flips the
   account to fully active. Only now can they log in and check out.

**Important — you need to add real credentials for this to actually send
email/SMS.** Until you do, nothing breaks: codes are printed to your
terminal (`npm run dev` console) so you can test the whole flow yourself
right now. See `lib/notify.ts` — it's a two-function file, easy to wire to
whatever you use later:
- Email: sign up at [resend.com](https://resend.com), drop the API key
  into `RESEND_API_KEY` in `.env`.
- SMS: sign up at [twilio.com](https://twilio.com), drop
  `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` / `TWILIO_FROM_NUMBER` into
  `.env`. (Same provider you're already using on Rebo Salon.)

## 7. Cart, wishlist, order history — all real now
- **Wishlist**: tap the heart on any menu item (needs login). Stored per
  account, with an "Add to cart" shortcut in the profile panel.
- **Order history**: the "Orders" tab in the profile panel now pulls real
  past orders (status, items, total) via `/api/orders`.
- **Addresses**: `/api/addresses` is there if you want to let customers
  save multiple delivery addresses later (not wired into the UI yet —
  the checkout form takes a plain address field for now, on purpose, to
  keep it simple for launch).

## 8. Extensive Kitchen Portal (`/admin`)
Only the account with `role = "admin"` in the database can see this page.
Three tabs:
- **Dashboard** — pending orders, orders in prep, today's order count,
  today's revenue, total customers.
- **Orders** — live-polling order queue with the beep alert, delivery
  address / phone / kitchen notes per order, and a status pipeline
  (pending → preparing → ready → completed, or cancel).
- **Menu** — full CRUD for both sections' menus (add/edit/delete items,
  show/hide without deleting, set price/description/image/category).
  This replaces the old hardcoded mock menu — the `/menu` page now reads
  live from this same table, so anything you add in the Kitchen Portal
  shows up on the site instantly.

### Making yourself the admin
Easiest path — set three values in `.env` and run the seed script once:
```
ADMIN_EMAIL="you@example.com"
ADMIN_PASSWORD="choose-a-strong-password"
ADMIN_PHONE="+49..."
```
```
npm install
npm run seed
```
That creates your admin account (already verified, no OTP needed) **and**
seeds the starter menu (your existing Grill/Sweets items) if the menu
table is empty. Safe to re-run — it won't duplicate the menu.

Alternatively, sign up normally through the site, verify it, then run
this once against your database:
```sql
UPDATE "User" SET role = 'admin' WHERE email = 'you@example.com';
```

## 9. Database changes
`prisma/schema.prisma` gained: OTP fields + `pendingActivation` on `User`,
a `MenuItem` table (the real menu), a `WishlistItem` table, an `Address`
table, and `Order`/`OrderItem` got `fulfillment`, `address`,
`customerName`, `customerPhone`, `notes`. After pulling this down:
```
npx prisma migrate dev --name commerce_v2
```
(or `npx prisma db push` if you're not using migrations yet).

## 10. Architecture alignment (per your locked-in backend-stack doc)
Checked against every locked-in decision:

| Decision | Status |
|---|---|
| Unified Next.js app (App Router, route handlers as API) on Vercel | Already this way |
| TypeScript | Already this way |
| Postgres (Neon) | Already this way |
| ORM: Prisma | Already this way (Drizzle was the other option in the doc — Prisma's in) |
| Admin auth: Auth.js/NextAuth | Already gates `/admin` |
| No live payment | Already this way — cash only |
| Owner edits menu/prices, no code access | Already this way — Menu tab in `/admin` |
| Owner notified by email per order | Already wired via Resend — see below |
| No real-time required | Confirmed; the live-poll + beep on `/admin` is extra, not required, doesn't conflict |
| Customer login **required** (your override vs. the doc's "guest checkout") | Already this way — this was built into the original request |
| Image storage: **Vercel Blob** | **New** — added this pass, see below |

**New this pass — Vercel Blob for menu photos.** The admin Menu form now
has a real file upload (drag a photo in, it uploads to Vercel Blob and
fills the image field), with pasting a URL still available as a manual
fallback. Wire it up:
1. Vercel Dashboard → your project → Storage → Create Database → **Blob**.
2. Copy the token it gives you into `BLOB_READ_WRITE_TOKEN` in `.env`
   (on Vercel itself this gets injected automatically once the store is
   attached to the project).
3. `npm install` picks up the new `@vercel/blob` dependency.

Until that token is set, uploads show a friendly error telling you to
add it or paste a URL instead — nothing breaks.

**Owner email notification** was already implemented (`ADMIN_NOTIFY_EMAIL`
+ Resend) but was silently skippable. Since your doc marks this a hard
requirement (it's the *only* order-visibility channel besides the admin
panel itself), the server now logs a clear warning in the console if
`ADMIN_NOTIFY_EMAIL` isn't set, so it won't get missed at launch.

**Open items from your doc, resolved or still open:**
- *"Should the customer get a confirmation/status update after
  ordering?"* — resolved by your login requirement: logged-in customers
  see live order status in the Orders tab, plus an in-app confirmation
  screen right after placing the order.
- *"Is 'no online payment' permanent, or Phase 1?"* — still open, needs
  the owner's call. I kept the `Order` model minimal (no payment-status
  fields) so it's a clean additive migration later if payment gets added
  — no rework needed now either way.
- *Drizzle vs. Prisma* — Prisma's already in use across the codebase, so
  that's effectively decided unless you want to revisit it.

## What still needs your input before going live
1. **Email + SMS credentials** (`RESEND_API_KEY`, `TWILIO_*`) — without
   these, OTPs/links only print to your server console.
2. **Google / Facebook OAuth app credentials** — without these, those two
   buttons will show a NextAuth config error when clicked.
3. **`BLOB_READ_WRITE_TOKEN`** — without it, menu photo uploads show a
   friendly error (pasting an image URL still works as a fallback).
4. **`ADMIN_NOTIFY_EMAIL`** — required for the owner order-notification
   email; without it you'll see a console warning per order.
5. **Run the DB migration** below so the new tables/columns exist.
6. **Run `npm run seed`** once to create your admin login and starter menu.

## 11. Finishing pass
- **Build fixed for TypeScript 7** — `tsconfig.json` no longer uses the
  removed `baseUrl` / bad `@prisma/client` path alias. Type-checking is
  clean, so the `ignoreBuildErrors` bypass in `next.config.mjs` is gone
  (as is the `eslint` key Next 16 no longer supports).
- **Contact page** rebuilt in the same neubrutalist style as the rest of
  the site, in German + English, without the stale "event catering" line.
  Address/hours live in one place: `business` in `lib/siteConfig.ts`.
  The Google Maps iframe was replaced with an "Open in Google Maps" link,
  so no data goes to Google unless the visitor clicks.
- **No third-party requests on page load** — Home and Gallery now use the
  photos in `/public` instead of hotlinked Unsplash images, and the Baloo 2
  font is self-hosted via `next/font` instead of loaded from Google Fonts
  (a known GDPR issue in Germany, see LG München I, 3 O 17493/20).
- **Menu page** is translated (DE/EN), shows a proper error if the menu
  can't load, and its dot-grid background actually renders now.
- **Section + language are remembered** across reloads (localStorage),
  and `<html lang>` follows the chosen language. Disclosed in the
  Datenschutzerklärung, section 7.
- **Branded 404 page**; removed a stray duplicate of the Kitchen Portal
  that was being served at `/api/admin`.
