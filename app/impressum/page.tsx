"use client";

import { useSite } from "@/components/SiteProvider";

// -----------------------------------------------------------------------
// IMPRESSUM — required for every commercial website reachable from
// Germany under §5 Digitale-Dienste-Gesetz (DDG, formerly §5 TMG).
//
// ⚠️  EVERY [BRACKETED] VALUE BELOW IS A PLACEHOLDER. This page will not
// be legally sufficient until you replace them with your real details.
// If "Hungry Chicken" is a registered business (GmbH, e.K., OHG, etc.)
// rather than a sole proprietorship, you also need the register court,
// register number, and (if applicable) the names of managing directors —
// ask a lawyer or your Steuerberater if you're not sure which applies.
// -----------------------------------------------------------------------

export default function ImpressumPage() {
  const { language } = useSite();
  const isDE = language === "de";

  return (
    <div className="min-h-[calc(100vh-73px)] bg-white text-black p-6 md:p-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-8 border-b-[4px] border-black pb-4">
          Impressum
        </h1>

        <section className="mb-8">
          <h2 className="font-black uppercase text-lg mb-2">{isDE ? "Angaben gemäß § 5 DDG" : "Information pursuant to § 5 DDG (German law)"}</h2>
          <p className="font-mono text-sm leading-relaxed">
            [Vollständiger Name des Inhabers / der Firma]
            <br />
            [Straße und Hausnummer]
            <br />
            [PLZ und Ort]
            <br />
            {isDE ? "Deutschland" : "Germany"}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-black uppercase text-lg mb-2">{isDE ? "Kontakt" : "Contact"}</h2>
          <p className="font-mono text-sm leading-relaxed">
            {isDE ? "Telefon" : "Phone"}: [Telefonnummer]
            <br />
            E-Mail: [E-Mail-Adresse]
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-black uppercase text-lg mb-2">
            {isDE ? "Umsatzsteuer-Identifikationsnummer" : "VAT ID"}
          </h2>
          <p className="font-mono text-sm leading-relaxed">
            {isDE
              ? "Sofern vorhanden: Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz: [USt-IdNr., falls vorhanden]"
              : "If applicable: VAT identification number per § 27a of the German VAT Act: [VAT ID, if applicable]"}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-black uppercase text-lg mb-2">
            {isDE ? "Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV" : "Responsible for content pursuant to § 18(2) MStV"}
          </h2>
          <p className="font-mono text-sm leading-relaxed">[Name der verantwortlichen Person, Anschrift wie oben]</p>
        </section>

        <section className="mb-8">
          <h2 className="font-black uppercase text-lg mb-2">{isDE ? "Streitschlichtung" : "Dispute Resolution"}</h2>
          <p className="font-mono text-sm leading-relaxed">
            {isDE ? (
              <>
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
                <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="underline">
                  https://ec.europa.eu/consumers/odr/
                </a>
                . Unsere E-Mail-Adresse finden Sie oben. Wir sind nicht verpflichtet und nicht bereit, an
                Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
              </>
            ) : (
              <>
                The European Commission provides a platform for online dispute resolution (ODR):{" "}
                <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="underline">
                  https://ec.europa.eu/consumers/odr/
                </a>
                . You can find our email address above. We are not obliged or willing to participate in dispute
                resolution proceedings before a consumer arbitration board.
              </>
            )}
          </p>
        </section>

        <p className="font-mono text-xs text-gray-500 mt-12 border-t-2 border-black pt-4">
          {isDE
            ? "Hinweis für den Betreiber: Diese Seite muss vor dem Livegang vollständig mit echten Angaben ausgefüllt werden."
            : "Note to the site operator: this page must be fully completed with real information before going live."}
        </p>
      </div>
    </div>
  );
}