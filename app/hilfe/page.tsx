import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Link from "next/link";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Hilfe & FAQ",
    description: "Häufige Fragen und Antworten rund um Bestellung, Versand, Zahlung, Garantie und Rückgabe bei HAUSAURA.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/hilfe" },
  openGraph: {
    title: "Hilfe & FAQ - HAUSAURA",
  description: "Häufige Fragen und Antworten rund um Bestellung, Versand, Zahlung, Garantie und Rückgabe bei HAUSAURA.",
    siteName: "HAUSAURA",
    locale: "de_DE",
    type: "website",
  },
};

const faqs = [
  {
    question: "Wie kann ich ein Produkt bestellen?",
    answer: "Wählen Sie Ihr gewünschtes Produkt aus und klicken Sie auf In den Warenkorb. Im Warenkorb können Sie die Menge anpassen und direkt zur Kasse weitergehen. Geben Sie Ihre Rechnungs- und Lieferadresse ein, wählen Sie die Zahlungsart Überweisung (Vorkasse) und schließen Sie die Bestellung ab. Sie erhalten eine Bestätigungs-E-Mail mit unseren Bankverbindungsdaten.",
  },
  {
    question: "Wie lange dauert die Lieferung?",
    answer: "Die Lieferung erfolgt innerhalb von 1-3 Werktagen nach Eingang Ihrer Zahlung. Versandkostenfrei innerhalb Deutschlands ab einem Bestellwert von 50 Euro. Darunter fallen 5,99 Euro Versandkosten an.",
  },
  {
    question: "Kann ich ein Gerät zurückgeben?",
    answer: "Ja, Sie haben ein 14-tägiges Widerrufsrecht ab Erhalt der Ware. Die Ware muss unbenutzt und in der Originalverpackung sein. Kontaktieren Sie uns per E-Mail oder Telefon und wir klären die Rücksendung mit Ihnen ab. Die Rücksendekosten tragen Sie als Verbraucher.",
  },
  {
    question: "Welche Garantie bieten Sie?",
    answer: "Alle Produkte unterliegen der gesetzlichen Gewährleistung von 24 Monaten. Für ausgewählte Premium-Produkte (Miele, Gaggenau, V-ZUG) bieten wir eine optionale Premium-Garantie bis zu 5 Jahre an. Diese kann direkt beim Kauf gebucht werden.",
  },
  {
    question: "Kann ich eine Beratung vor dem Kauf erhalten?",
    answer: "Selbstverständlich! Unser deutsches Kundenteam berät Sie gerne per E-Mail (info@hausaura.de), telefonisch (+49 (0)30 555 789 01) oder über unser Kontaktformular. Wir sind montags bis freitags von 9:00 bis 18:00 Uhr und samstags von 10:00 bis 14:00 Uhr erreichbar.",
  },
  {
    question: "Bieten Sie einen Anschlussservice an?",
    answer: "Derzeit konzentrieren wir uns auf den Verkauf hochwertiger Haushaltsgeräte. Für technische Probleme oder Reparaturwünsche verweisen wir Sie gerne an den jeweiligen Herstellerservice. Bei Garantiefällen helfen wir Ihnen selbstverständlich weiter.",
  },
  {
    question: "Welche Zahlungsarten stehen zur Verfügung?",
    answer: "Wir bieten ausschließlich die Zahlungsart Überweisung (Vorkasse) an. Nach Ihrer Bestellung erhalten Sie eine E-Mail mit unseren Bankverbindungsdaten. Die Zahlungsfrist beträgt 5 Werktage nach Abschluss des Vertrages.",
  },
  {
    question: "Wie kann ich meinen Newsletter abbestellen?",
    answer: "Klicken Sie in jeder Newsletter-E-Mail auf den Abbestell-Link. Alternativ können Sie sich auch über unser Kontaktformular an uns wenden. Wir verarbeiten Ihre Abbestellung umgehend.",
  },
];

export default function HilfePage() {
  return (
    <main id="main-content" className="container-hausaura py-8 sm:py-12 max-w-3xl">
      <Breadcrumb items={[{ label: "Hilfe & FAQ" }]} />
      <h1 className="heading-1 mb-4">Hilfe & FAQ</h1>
      <p className="text-[var(--color-text-secondary)] mb-8">
        Häufige Fragen und Antworten rund um Bestellung, Versand, Zahlung, Garantie und Rückgabe.
      </p>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <details
            key={i}
            className="group bg-[var(--color-bg)] rounded-xl overflow-hidden"
          >
            <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors">
              {faq.question}
              <span className="ml-4 text-[var(--color-text-muted)] group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <div className="px-6 pb-6 text-[var(--color-text-secondary)]">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>

      <div className="mt-12 bg-[var(--color-bg)] rounded-xl p-6">
        <h2 className="heading-3 mb-4">Noch Fragen?</h2>
        <p className="text-[var(--color-text-secondary)] mb-4">
          Unser Kundenteam hilft Ihnen gerne weiter.
        </p>
        <div className="space-y-2 text-[var(--color-text-secondary)]">
          <p>Telefon: +49 (0)30 555 789 01</p>
          <p>E-Mail: info@hausaura.de</p>
          <p>Adresse: Kastanienallee 42, 10435 Berlin</p>
          <p>Mo-Fr: 9:00-18:00, Sa: 10:00-14:00</p>
        </div>
        <Link
          href="/kontakt"
          className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
        >
          Kontaktformular
        </Link>
      </div>
    </main>
  );
}
