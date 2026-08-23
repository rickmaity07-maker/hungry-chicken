"use client";

import { useSite } from "@/components/SiteProvider";
import Link from "next/link";

// -----------------------------------------------------------------------
// DATENSCHUTZERKLÄRUNG — describes every real data flow this codebase
// has: account/OTP data, order data, Google/Facebook OAuth, and every
// third-party processor actually wired in (Neon, Vercel, Resend, Twilio,
// Google, Facebook). The [BRACKETED] parts are business specifics only
// you can fill in — your legal name/address (same as the Impressum),
// which supervisory authority applies to you, and your own contact
// details for privacy requests.
//
// ⚠️ Not legal advice. Have this reviewed by a lawyer or Datenschutz-
// beauftragter before going live — this is a solid technical starting
// point, not a substitute for legal sign-off.
// -----------------------------------------------------------------------

export default function DatenschutzPage() {
  const { language } = useSite();
  const isDE = language === "de";

  return (
    <div className="min-h-[calc(100vh-73px)] bg-white text-black p-6 md:p-16">
      <div className="max-w-3xl mx-auto font-mono text-sm leading-relaxed">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-8 border-b-[4px] border-black pb-4 font-sans">
          {isDE ? "Datenschutzerklärung" : "Privacy Policy"}
        </h1>

        {isDE ? (
          <>
            <Section title="1. Verantwortlicher">
              <p>
                Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:
                <br />
                [Name/Firma wie im <Link href="/impressum" className="underline">Impressum</Link>]
                <br />
                [Anschrift wie im Impressum]
                <br />
                E-Mail: [Datenschutz-Kontakt-E-Mail]
              </p>
            </Section>

            <Section title="2. Übersicht der Verarbeitungen">
              <p>Wir verarbeiten personenbezogene Daten in folgenden Zusammenhängen:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Erstellung und Verwaltung eines Kundenkontos</li>
                <li>Verifizierung der E-Mail-Adresse und Mobilfunknummer per Einmalcode (OTP) und Bestätigungslink</li>
                <li>Anmeldung über Google oder Facebook (Social Login)</li>
                <li>Entgegennahme und Abwicklung von Bestellungen (Abholung oder Lieferung, Barzahlung)</li>
                <li>Speicherung von Merklisten (Wunschliste) und Bestellhistorie</li>
                <li>Benachrichtigung des Betreibers über eingehende Bestellungen</li>
              </ul>
            </Section>

            <Section title="3. Registrierung, Kontoerstellung und Verifizierung">
              <p>
                Bei der Registrierung erheben wir: Name, E-Mail-Adresse, Mobilfunknummer und ein Passwort (gespeichert
                nur als Hash, niemals im Klartext). Zur Bestätigung Ihrer Kontaktdaten senden wir einen 6-stelligen
                Einmalcode an Ihre E-Mail-Adresse und einen weiteren an Ihre Mobilfunknummer. Nach erfolgreicher
                Eingabe beider Codes senden wir zusätzlich einen Bestätigungslink per E-Mail, dessen Aufruf das Konto
                endgültig aktiviert. Die Einmalcodes werden nach erfolgreicher Verifizierung oder spätestens nach 10
                Minuten gelöscht bzw. ungültig.
                <br />
                <br />
                Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Erfüllung eines Vertrags bzw. vorvertragliche Maßnahmen –
                Bereitstellung des Kundenkontos) sowie Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der
                Verhinderung von Missbrauch durch die Verifizierung).
              </p>
            </Section>

            <Section title="4. Anmeldung über Google oder Facebook">
              <p>
                Wenn Sie sich über Google oder Facebook anmelden, übermitteln diese Anbieter Name, E-Mail-Adresse und
                ggf. Profilbild an uns. Diese Verarbeitung erfolgt auf Ihre aktive Auswahl hin (Art. 6 Abs. 1 lit. a
                DSGVO – Einwilligung durch Klick auf die jeweilige Schaltfläche) sowie zur Kontoerstellung/-anmeldung
                (Art. 6 Abs. 1 lit. b DSGVO). Es gelten zusätzlich die Datenschutzhinweise der jeweiligen Anbieter:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>
                  Google Ireland Limited:{" "}
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">
                    policies.google.com/privacy
                  </a>
                </li>
                <li>
                  Meta Platforms Ireland Limited (Facebook):{" "}
                  <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer" className="underline">
                    facebook.com/privacy/policy
                  </a>
                </li>
              </ul>
            </Section>

            <Section title="5. Bestellungen">
              <p>
                Zur Abwicklung einer Bestellung verarbeiten wir: Name, Telefonnummer, die von Ihnen gewählten
                Speisen, bei Lieferung Ihre Lieferadresse, sowie ggf. Ihre Anmerkungen für die Küche. Eine
                Online-Zahlung findet nicht statt; die Bezahlung erfolgt in bar bei Abholung bzw. Lieferung.
                <br />
                <br />
                Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung). Bestelldaten mit steuerlicher
                Relevanz unterliegen zudem gesetzlichen Aufbewahrungspflichten (siehe Abschnitt 8).
              </p>
            </Section>

            <Section title="6. Wunschliste und Bestellhistorie">
              <p>
                Nach Anmeldung können Sie Gerichte auf einer Wunschliste speichern und Ihre vergangenen Bestellungen
                einsehen. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO sowie Art. 6 Abs. 1 lit. f DSGVO (berechtigtes
                Interesse an einer komfortablen Nutzung unseres Angebots).
              </p>
            </Section>

            <Section title="7. Cookies">
              <p>
                Wir setzen ein technisch notwendiges Session-Cookie (verwaltet durch Auth.js/NextAuth) ein, um Ihre
                Anmeldung während eines Besuchs aufrechtzuerhalten. Ohne dieses Cookie ist ein Login und eine
                Bestellung nicht möglich. Da es sich um ein für den Betrieb der Website unbedingt erforderliches
                Cookie handelt, ist gemäß § 25 Abs. 2 Nr. 2 TTDSG keine gesonderte Einwilligung erforderlich.
                Wir setzen aktuell keine Analyse-, Marketing- oder Tracking-Cookies ein.
              </p>
            </Section>

            <Section title="8. Empfänger und Auftragsverarbeiter">
              <p>Zur Bereitstellung unseres Angebots setzen wir folgende Dienstleister ein, die als Auftragsverarbeiter (Art. 28 DSGVO) für uns tätig sind bzw. bei Social Login als eigenständig Verantwortliche agieren:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li><strong>Vercel Inc.</strong> (USA) – Hosting der Website und Speicherung von hochgeladenen Speisekarten-Fotos (Vercel Blob).</li>
                <li><strong>Neon Inc.</strong> – Datenbank-Hosting (Kundenkonten, Bestellungen). [Serverstandort/Region beim jeweiligen Anbieter prüfen und hier eintragen.]</li>
                <li><strong>Resend</strong> (USA) – Versand von Bestätigungs- und Benachrichtigungs-E-Mails.</li>
                <li><strong>Twilio Inc.</strong> (USA) – Versand von SMS-Einmalcodes.</li>
                <li><strong>Google LLC / Google Ireland Limited</strong> – Social Login (nur bei aktiver Nutzung).</li>
                <li><strong>Meta Platforms, Inc. / Meta Platforms Ireland Limited</strong> – Social Login (nur bei aktiver Nutzung).</li>
              </ul>
              <p className="mt-2">
                Soweit Anbieter mit Sitz außerhalb der EU/des EWR (insb. USA) personenbezogene Daten verarbeiten,
                stützen wir dies auf geeignete Garantien gemäß Art. 46 DSGVO, insbesondere die Standardvertragsklauseln
                der EU-Kommission, sofern kein Angemessenheitsbeschluss besteht. [Vor Livegang prüfen: Auftrags-
                verarbeitungsverträge (AVV) mit allen genannten Anbietern abschließen.]
              </p>
            </Section>

            <Section title="9. Speicherdauer">
              <ul className="list-disc pl-6 space-y-1">
                <li>Kontodaten: bis zur Löschung Ihres Kontos durch Sie oder auf Ihre Anfrage hin.</li>
                <li>Einmalcodes (OTP): maximal 10 Minuten, danach automatisch ungültig.</li>
                <li>
                  Bestell-/Rechnungsdaten: 10 Jahre gemäß § 147 Abgabenordnung (AO) i. V. m. § 257 Handelsgesetzbuch
                  (HGB), auch nach Löschung des Kontos – in diesem Fall werden Ihre Kontaktdaten in den betroffenen
                  Bestellungen anonymisiert, die für die Buchhaltung erforderlichen Angaben (Artikel, Beträge, Datum)
                  bleiben bestehen.
                </li>
              </ul>
            </Section>

            <Section title="10. Ihre Rechte">
              <p>Ihnen stehen folgende Rechte zu:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Auskunft über die zu Ihrer Person gespeicherten Daten (Art. 15 DSGVO)</li>
                <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
                <li>Löschung Ihrer Daten (Art. 17 DSGVO), vorbehaltlich gesetzlicher Aufbewahrungspflichten</li>
                <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
                <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
                <li>Widerspruch gegen auf berechtigtem Interesse beruhende Verarbeitung (Art. 21 DSGVO)</li>
                <li>Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO)</li>
                <li>Beschwerde bei einer Datenschutz-Aufsichtsbehörde (Art. 77 DSGVO)</li>
              </ul>
              <p className="mt-2">
                Sie können Ihr Konto samt personenbezogener Daten selbstständig über die Kontoseite löschen sowie
                eine Kopie Ihrer gespeicherten Daten herunterladen. Für weitere Anliegen kontaktieren Sie uns unter
                der in Abschnitt 1 genannten E-Mail-Adresse.
              </p>
            </Section>

            <Section title="11. Zuständige Aufsichtsbehörde">
              <p>
                [Zuständige Landesdatenschutzbehörde eintragen, z. B. für Bayern: Bayerisches Landesamt für
                Datenschutzaufsicht (BayLDA), Promenade 27, 91522 Ansbach – abhängig vom tatsächlichen Sitz des
                Verantwortlichen.]
              </p>
            </Section>

            <Section title="12. Datensicherheit">
              <p>
                Die Übertragung erfolgt verschlüsselt (TLS/HTTPS). Passwörter werden ausschließlich als Hash
                (bcrypt) gespeichert, niemals im Klartext. Einmalcodes sind zeitlich begrenzt gültig und werden nach
                Verwendung gelöscht.
              </p>
            </Section>

            <Section title="13. Änderungen dieser Datenschutzerklärung">
              <p>
                Wir passen diese Datenschutzerklärung an, sobald sich unsere Datenverarbeitung ändert. Es gilt die
                jeweils aktuelle, auf dieser Seite veröffentlichte Fassung.
              </p>
            </Section>
          </>
        ) : (
          <>
            <Section title="1. Data Controller">
              <p>
                The controller responsible for data processing under the GDPR is:
                <br />
                [Name/business as in the <Link href="/impressum" className="underline">Impressum</Link>]
                <br />
                [Address as in the Impressum]
                <br />
                Email: [privacy contact email]
              </p>
            </Section>

            <Section title="2. Overview of Processing">
              <p>We process personal data in the following contexts:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Creating and managing a customer account</li>
                <li>Verifying your email address and phone number via one-time code (OTP) and confirmation link</li>
                <li>Login via Google or Facebook (social login)</li>
                <li>Receiving and fulfilling orders (pickup or delivery, cash payment)</li>
                <li>Storing wishlists and order history</li>
                <li>Notifying the site operator of incoming orders</li>
              </ul>
            </Section>

            <Section title="3. Registration, Account Creation and Verification">
              <p>
                During registration we collect: name, email address, phone number, and a password (stored only as a
                hash, never in plain text). To confirm your contact details, we send a 6-digit one-time code to your
                email and another to your phone. Once both are entered correctly, we additionally send a confirmation
                link by email; visiting it finally activates the account. The one-time codes are deleted or expire
                automatically after verification or after 10 minutes at the latest.
                <br />
                <br />
                Legal basis: Art. 6(1)(b) GDPR (performance of a contract / pre-contractual measures — providing the
                customer account) and Art. 6(1)(f) GDPR (legitimate interest in preventing abuse through
                verification).
              </p>
            </Section>

            <Section title="4. Login via Google or Facebook">
              <p>
                If you log in via Google or Facebook, those providers transmit your name, email address, and
                possibly a profile picture to us. This processing is based on your active choice (Art. 6(1)(a) GDPR —
                consent by clicking the respective button) and on account creation/login (Art. 6(1)(b) GDPR). The
                respective providers' own privacy notices also apply:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>
                  Google Ireland Limited:{" "}
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">
                    policies.google.com/privacy
                  </a>
                </li>
                <li>
                  Meta Platforms Ireland Limited (Facebook):{" "}
                  <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer" className="underline">
                    facebook.com/privacy/policy
                  </a>
                </li>
              </ul>
            </Section>

            <Section title="5. Orders">
              <p>
                To process an order we handle: your name, phone number, chosen dishes, your delivery address (for
                delivery orders), and any notes for the kitchen. No online payment takes place; payment is made in
                cash on pickup or delivery.
                <br />
                <br />
                Legal basis: Art. 6(1)(b) GDPR (contract performance). Order data with tax relevance is additionally
                subject to statutory retention obligations (see Section 8).
              </p>
            </Section>

            <Section title="6. Wishlist and Order History">
              <p>
                Once logged in, you can save dishes to a wishlist and view your past orders. Legal basis: Art. 6(1)(b)
                GDPR and Art. 6(1)(f) GDPR (legitimate interest in a convenient user experience).
              </p>
            </Section>

            <Section title="7. Cookies">
              <p>
                We use a technically necessary session cookie (managed by Auth.js/NextAuth) to keep you logged in
                during a visit. Without this cookie, login and ordering are not possible. As this cookie is strictly
                necessary for operating the site, no separate consent is required under § 25(2) No. 2 TTDSG (the
                German law implementing the ePrivacy Directive). We currently use no analytics, marketing, or
                tracking cookies.
              </p>
            </Section>

            <Section title="8. Recipients and Processors">
              <p>We use the following service providers to run our service, acting as processors under Art. 28 GDPR (or as independent controllers for social login):</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li><strong>Vercel Inc.</strong> (USA) – website hosting and storage of uploaded menu photos (Vercel Blob).</li>
                <li><strong>Neon Inc.</strong> – database hosting (customer accounts, orders). [Confirm and note the server region with the provider.]</li>
                <li><strong>Resend</strong> (USA) – sending confirmation and notification emails.</li>
                <li><strong>Twilio Inc.</strong> (USA) – sending SMS one-time codes.</li>
                <li><strong>Google LLC / Google Ireland Limited</strong> – social login (only when actively used).</li>
                <li><strong>Meta Platforms, Inc. / Meta Platforms Ireland Limited</strong> – social login (only when actively used).</li>
              </ul>
              <p className="mt-2">
                Where providers based outside the EU/EEA (particularly the USA) process personal data, we rely on
                appropriate safeguards under Art. 46 GDPR, in particular the EU Commission's Standard Contractual
                Clauses, where no adequacy decision applies. [Before going live: execute Data Processing Agreements
                (DPAs) with all listed providers.]
              </p>
            </Section>

            <Section title="9. Retention Periods">
              <ul className="list-disc pl-6 space-y-1">
                <li>Account data: until you or your request causes the account to be deleted.</li>
                <li>One-time codes (OTP): maximum 10 minutes, automatically invalid afterward.</li>
                <li>
                  Order/invoice data: 10 years under § 147 of the German Fiscal Code (AO) in conjunction with § 257
                  of the German Commercial Code (HGB), even after account deletion — in that case your contact
                  details on the affected orders are anonymized, while the accounting-relevant details (items,
                  amounts, date) are retained.
                </li>
              </ul>
            </Section>

            <Section title="10. Your Rights">
              <p>You have the following rights:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Access to the data we hold about you (Art. 15 GDPR)</li>
                <li>Rectification of inaccurate data (Art. 16 GDPR)</li>
                <li>Erasure of your data (Art. 17 GDPR), subject to statutory retention obligations</li>
                <li>Restriction of processing (Art. 18 GDPR)</li>
                <li>Data portability (Art. 20 GDPR)</li>
                <li>Objection to processing based on legitimate interest (Art. 21 GDPR)</li>
                <li>Withdrawal of consent with effect for the future (Art. 7(3) GDPR)</li>
                <li>Lodging a complaint with a supervisory authority (Art. 77 GDPR)</li>
              </ul>
              <p className="mt-2">
                You can delete your account and personal data yourself from your account page, and download a copy of
                your stored data. For anything else, contact us at the email address listed in Section 1.
              </p>
            </Section>

            <Section title="11. Competent Supervisory Authority">
              <p>
                [Enter the relevant state data protection authority — e.g. for Bavaria: Bayerisches Landesamt für
                Datenschutzaufsicht (BayLDA), Promenade 27, 91522 Ansbach — depending on the controller's actual
                place of business.]
              </p>
            </Section>

            <Section title="12. Data Security">
              <p>
                Data is transmitted encrypted (TLS/HTTPS). Passwords are stored exclusively as a hash (bcrypt), never
                in plain text. One-time codes are valid for a limited time and deleted after use.
              </p>
            </Section>

            <Section title="13. Changes to this Privacy Policy">
              <p>
                We update this privacy policy whenever our data processing changes. The version currently published
                on this page applies.
              </p>
            </Section>
          </>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="font-black uppercase text-lg mb-2 font-sans">{title}</h2>
      {children}
    </section>
  );
}