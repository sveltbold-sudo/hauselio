import type { Metadata } from "next";
import { Truck, Package, Landmark } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Versandinformationen",
  description: "Informationen zum Versand, Lieferzeiten und Kosten bei HAUSAURA",
  robots: { index: false, follow: false },
  alternates: { canonical: "/versand" },
  openGraph: {
    title: "Versandinformationen — HAUSAURA",
    description: "Informationen zum Versand, Lieferzeiten und Kosten bei HAUSAURA.",
    siteName: "HAUSAURA",
    locale: "de_DE",
    type: "website",
  },
};

const shippingMethods = [
  {
    name: "Standardversand",
    price: "4,99 €",
    freeAbove: "50 €",
    duration: "2–5 Werktage",
    icon: Truck,
    available: true,
  },
  {
    name: "Expressversand",
    price: "9,99 €",
    freeAbove: null,
    duration: "1–2 Werktage",
    icon: Package,
    available: false,
  },
];

export default function VersandPage() {
  return (
    <main id="main-content" className="container-hauselio py-16 max-w-3xl">
      <Breadcrumb items={[{ label: "Versand" }]} />
      <h1 className="heading-1 mb-8">
        Versandinformationen
      </h1>

      {/* Versandarten */}
      <section className="mb-8 sm:mb-12">
        <h2 className="heading-3 mb-6">
          Versandarten & Kosten
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {shippingMethods.map((method) => (
            <div
              key={method.name}
              className="bg-white rounded-xl border border-[var(--color-border-light)] p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[var(--color-primary-50)] rounded-lg flex items-center justify-center">
                  <method.icon className="w-5 h-5 text-[var(--color-primary)]" />
                </div>
                <h3 className="font-semibold text-[var(--color-text-primary)]">{method.name}</h3>
              </div>
              <div className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                <p>
                  <span className="font-medium">Kosten:</span>{" "}
                  {method.available ? method.price : (
                    <span className="text-[var(--color-text-muted)]">bald verfügbar</span>
                  )}
                </p>
                {method.freeAbove && (
                  <p className="text-[var(--color-success)] font-medium">
                    Kostenlos ab {method.freeAbove} Bestellwert
                  </p>
                )}
                <p>
                  <span className="font-medium">Lieferzeit:</span>{" "}
                  {method.available ? method.duration : (
                    <span className="text-[var(--color-text-muted)]">in Planung</span>
                  )}
                </p>
                {!method.available && (
                  <p className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] rounded-full text-xs font-medium">
                    Bald verfügbar
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lieferung */}
      <section className="mb-8 sm:mb-12">
        <h2 className="heading-3 mb-6">
          Lieferung
        </h2>
        <div className="space-y-4">
          <p className="text-[var(--color-text-secondary)] leading-relaxed">
            Wir versenden Ihre Bestellung innerhalb Deutschlands an die von Ihnen
            angegebene Lieferadresse. Alle Sendungen sind mit einer
            Sendungsverfolgungsnummer ausgestattet, die Sie nach Versand der
            Bestellung per E-Mail erhalten.
          </p>
          <p className="text-[var(--color-text-secondary)] leading-relaxed">
            Die Lieferung erfolgt in der Regel innerhalb von <strong>2–5
            Werktagen</strong> nach Eingang der Zahlung. Ein Expressversand
            wird bald verfügbar sein.
          </p>
          <p className="text-[var(--color-text-secondary)] leading-relaxed">
            Bitte stellen Sie sicher, dass bei Lieferung eine Person anwesend
            ist, die die Ware entgegennehmen kann. Bei großen Geräten wird die
            Lieferung bis zur Bordsteinkante (Kerbdienst) durchgeführt.
          </p>
        </div>
      </section>

      {/* Zahlung */}
      <section className="mb-8 sm:mb-12">
        <h2 className="heading-3 mb-6">
          Zahlungsarten
        </h2>
        <div className="bg-[var(--color-bg)] rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[var(--color-primary-50)] rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <Landmark className="w-5 h-5 text-[var(--color-primary)]" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--color-text-primary)] mb-2">
                Überweisung (SEPA)
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                Nach Ihrer Bestellung erhalten Sie eine Bestätigungs-E-Mail mit
                unseren Bankverbindungen. Bitte überweisen Sie den Gesamtbetrag
                innerhalb von <strong>5 Werktagen</strong> auf unser Konto. Nach
                Eingang der Zahlung wird Ihre Bestellung umgehend versendet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sendungsverfolgung */}
      <section className="mb-8 sm:mb-12">
        <h2 className="heading-3 mb-6">
          Sendungsverfolgung
        </h2>
        <p className="text-[var(--color-text-secondary)] leading-relaxed">
          Nach Versand Ihrer Bestellung erhalten Sie eine E-Mail mit einem Link
          zur Sendungsverfolgung. Über diesen Link können Sie den aktuellen
          Status Ihrer Lieferung jederzeit verfolgen.
        </p>
      </section>

      {/* Kontakt */}
      <section>
        <h2 className="heading-3 mb-6">
          Fragen zum Versand?
        </h2>
        <p className="text-[var(--color-text-secondary)] leading-relaxed">
          Bei Fragen zu Versand, Lieferung oder Zahlung stehen wir Ihnen gerne
          zur Verfügung:
        </p>
        <div className="mt-4 bg-[var(--color-bg)] rounded-xl p-6">
          <p className="text-sm text-[var(--color-text-secondary)]">
            <span className="font-medium">E-Mail:</span> hilfe@hausaura.de
          </p>
          <p className="text-sm text-[var(--color-text-secondary)]">
            <span className="font-medium">Telefon:</span> +49 (0)30 555 789 01
          </p>
          <p className="text-sm text-[var(--color-text-secondary)]">
            <span className="font-medium">Mo–Fr:</span> 9:00–18:00 Uhr
          </p>
        </div>
      </section>

      <p className="text-xs text-[var(--color-text-muted)] mt-8 pt-4 border-t border-[var(--color-border)]">
        Stand: August 2026
      </p>
    </main>
  );
}
