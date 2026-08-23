# Datenschutz Audit — Hungry Chicken

**Not legal advice.** This is a solid technical starting point built from
what the codebase actually does. Have it reviewed by a lawyer or
Datenschutzbeauftragter (data protection officer) before going live —
especially the Impressum and Datenschutzerklärung, which have placeholder
business details only you can fill in correctly.

## What was broken (fixed this pass)

| Issue | Status |
|---|---|
| No Impressum (legally required for any commercial site reachable from Germany, § 5 DDG) | ✅ Added `/impressum` |
| No Datenschutzerklärung at all | ✅ Added `/datenschutz`, covering every real data flow in the app |
| Neither page linked from anywhere | ✅ Added a site-wide `Footer` with both links, on every page |
| No cookie disclosure | ✅ Added a one-time, dismissible notice (not a consent gate — see below) |
| No privacy-policy consent captured at signup | ✅ Required checkbox before the "Send Verification Codes" button submits |
| OAuth data transfer (Google/Facebook) undisclosed at point of use | ✅ Added a disclosure line + link right under those buttons |
| No way for a customer to exercise Art. 17 (erasure) or Art. 20 (portability) rights | ✅ Added self-service "Download My Data" and "Delete My Account" in the account panel |
| Order records would be destroyed on account deletion, violating German tax retention law | ✅ Deletion now anonymizes the customer fields on past orders instead of deleting them; `Order.userId` is explicitly `onDelete: Restrict` so this can't silently regress |

## Why no cookie *consent banner*

Checked against § 25(2) No. 2 TTDSG (Germany's ePrivacy implementation):
consent is only required for cookies that aren't strictly necessary for
the service. This site sets exactly one cookie — the NextAuth session
cookie, without which login/checkout can't function at all. That
qualifies as strictly necessary, so a blocking opt-in banner isn't legally
required. **This changes immediately if you ever add** Google Analytics,
Meta Pixel, or any marketing/analytics cookie — at that point you'd need a
real consent-management banner that blocks those specific cookies until
opted in. The current banner is informational only and never blocks
anything.

## What only you (or a lawyer) can finish

1. **Impressum** — every `[bracketed]` value needs your real business
   name, address, and contact info. If Hungry Chicken is a registered
   business (not a sole proprietorship), you also need the register
   court/number and managing director names.
2. **Datenschutzerklärung** — same placeholders (controller identity,
   privacy contact email), plus:
   - **Data Processing Agreements (Auftragsverarbeitungsverträge)** with
     Neon, Vercel, Resend, and Twilio — Art. 28 GDPR requires these to
     exist, not just be mentioned in a privacy policy. All four offer
     standard DPAs you can execute from their dashboards/legal pages.
   - Confirm **which supervisory authority** applies to your business —
     the doc has a Bavaria placeholder (BayLDA) since you're in
     Schweinfurt, but this depends on where the business is actually
     registered.
   - Confirm **Neon's server region** for the exact wording (your
     database is currently in `eu-central-1`, i.e. the EU, which is good
     — but double-check this hasn't changed before finalizing the text).
3. **DSGVO Art. 30 record of processing activities** — technically
   required internal documentation (who processes what, why, for how
   long) separate from the public-facing privacy policy. Not customer-
   facing, but a lawyer/Steuerberater can help you put this together
   quickly since most of the content is already in the Datenschutz page.
4. **Data Protection Officer (Datenschutzbeauftragter)** — only mandatory
   if you have 20+ people constantly processing personal data, or your
   core business involves large-scale sensitive data processing. A single
   restaurant almost certainly doesn't need one, but worth a quick check
   with a lawyer if you plan to grow the team significantly.

## Files touched this pass

New: `app/impressum/page.tsx`, `app/datenschutz/page.tsx`,
`components/Footer.tsx`, `components/CookieNotice.tsx`,
`app/api/account/delete/route.ts`, `app/api/account/export/route.ts`

Modified: `app/layout.tsx` (wired in Footer/CookieNotice),
`components/CommerceEngine.tsx` (consent checkbox, OAuth disclosure,
data export/delete buttons), `prisma/schema.prisma` (explicit retention
behavior on `Order.userId`)

## One migration step needed

The schema change (explicit `onDelete: Restrict` on `Order.user`) needs:
```powershell
npx prisma generate
npx prisma db push
```
