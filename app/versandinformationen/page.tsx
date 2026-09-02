import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Versandinformationen",
  description: "Versandkosten, Lieferzeiten und Versandbedingungen bei HAUSAURA — kostenloser Versand ab 50€ innerhalb Deutschlands.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/versandinformationen" },
  openGraph: {
    title: "Versandinformationen — HAUSAURA",
    description: "Versandkosten, Lieferzeiten und Versandbedingungen bei HAUSAURA.",
    siteName: "HAUSAURA",
    locale: "de_DE",
    type: "website",
  },
};

export default function VersandPage() {
  return (
    <main id="main-content" className="container-hausaura py-8 sm:py-12 max-w-3xl">
      <Breadcrumb items={[{ label: "Versandinformationen" }]} />
      <h1 className="heading-1 mb-4">Versandinformationen</h1>
      <p className="text-[var(--color-text-secondary)] mb-8">
        Alle Informationen zu Versandkosten, Lieferzeiten und Versandbedingungen.
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="heading-3 mb-4">Versandkosten</h2>
          <div className="bg-[var(--color-bg)] rounded-xl p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-[var(--color-border)]">
                <p className="text-sm text-[var(--color-text-muted)] mb-1">Innerhalb Deutschlands</p>
                <p className="text-2xl font-bold text-[var(--color-text-primary)]">Kostenlos</p>
                <p className="text-sm text-[var(--color-text-secondary)]">ab 50€ Bestellwert</p>
              </div>
              <div className="p-4 rounded-lg border border-[var(--color-border)]">
                <p className="text-sm text-[var(--color-text-muted)] mb-1">Innerhalb Deutschlands</p>
                <p className="text-2xl font-bold text-[var(--color-text-primary)]">5,99 €</p>
                <p className="text-sm text-[var(--color-text-secondary)]">unter 50€ Bestellwert</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="heading-3 mb-4">Lieferzeiten</h2>
          <div className="bg-[var(--color-bg)] rounded-xl p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">1</div>
              <div>
                <p className="font-semibold text-[var(--color-text-primary)]">Bearbeitungszeit</p>
                <p className="text-sm text-[var(--color-text-secondary)]">1 Werktag nach Zahlungseingang</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">2</div>
              <div>
                <p className="font-semibold text-[var(--color-text-primary)]">Versandzeit</p>
                <p className="text-sm text-[var(--color-text-secondary)]">1-2 Werktage über DHL</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">3</div>
              <div>
                <p className="font-semibold text-[var(--color-text-primary)]">Gesamte Lieferzeit</p>
                <p className="text-sm text-[var(--color-text-secondary)]">Insgesamt 2-3 Werktage nach Zahlungseingang</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="heading-3 mb-4">Versanddienstleister</h2>
          <div className="bg-[var(--color-bg)] rounded-xl p-6">
            <p className="text-[var(--color-text-secondary)]">
              Der Versand erfolgt über <strong>DHL</strong> oder einen anderen zuverlässigen Versanddienstleister.
              Alle Sendungen sind standardmäßig versichert. Für Großgeräte (Waschmaschinen, Trockner, Kühlschränke)
              erfolgt die Lieferung durch einen spezialisierten Speditionsdienstleister bis vor die Haustür.
            </p>
          </div>
        </section>

        <section>
          <h2 className="heading-3 mb-4">Versandarten</h2>
          <div className="bg-[var(--color-bg)] rounded-xl p-6 space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-lg">📦</span>
              <div>
                <p className="font-semibold text-[var(--color-text-primary)]">Standard-Versand</p>
                <p className="text-sm text-[var(--color-text-secondary)]">2-3 Werktage · Kostenloser Versand ab 50€</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg">🚚</span>
              <div>
                <p className="font-semibold text-[var(--color-text-primary)]">Spedition (Großgeräte)</p>
                <p className="text-sm text-[var(--color-text-secondary)]">3-5 Werktage · Lieferung bis Haustür</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="heading-3 mb-4">Verfolgung Ihrer Bestellung</h2>
          <div className="bg-[var(--color-bg)] rounded-xl p-6">
            <p className="text-[var(--color-text-secondary)]">
              Nach Versand Ihrer Bestellung erhalten Sie eine E-Mail mit der DHL-Sendungsverfolgungsnummer.
              Über diese können Sie den aktuellen Status Ihrer Lieferung jederzeit online verfolgen.
            </p>
          </div>
        </section>

        <section>
          <h2 className="heading-3 mb-4">Wichtig zu wissen</h2>
          <ul className="bg-[var(--color-bg)] rounded-xl p-6 space-y-2 text-[var(--color-text-secondary)]">
            <li>• Versandkostenfrei innerhalb Deutschlands ab 50€ Bestellwert</li>
            <li>• Alle Sendungen sind standardmäßig versichert</li>
            <li>• Lieferung nur innerhalb Deutschlands</li>
            <li>• Bei Zahlung per Vorkasse wird die Ware nach Zahlungseingang versandt</li>
            <li>• Für Großgeräte bitten wir Sie, einen Wunschtermin mit uns abzustimmen</li>
          </ul>
        </section>
      </div>

      <p className="text-xs text-[var(--color-text-muted)] mt-8 pt-4 border-t border-[var(--color-border)]">
        Stand: August 2026
      </p>
    </main>
  );
}
