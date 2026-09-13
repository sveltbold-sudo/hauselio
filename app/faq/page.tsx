import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

function sectionId(title: string): string {
  return title
    .toLowerCase()
    .replace(/ß/g, "ss")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "FAQ — Häufig gestellte Fragen zu HAUSAURA",
  description:
    "Finden Sie Antworten auf die häufigsten Fragen zu Bestellung, Versand, Zahlung, Garantie und Rückgabe bei HAUSAURA — Ihrem Online-Shop für Haushaltsgeräte.",
  robots: { index: true, follow: true },
  alternates: { canonical: `${SITE_URL}/faq` },
  openGraph: {
    title: `FAQ — Häufig gestellte Fragen | ${SITE_NAME}`,
    description:
      "Antworten zu Bestellung, Versand, Zahlung, Garantie und Rückgabe.",
    url: `${SITE_URL}/faq`,
    siteName: SITE_NAME,
    locale: "de_DE",
    type: "website",
    images: [{ url: `${SITE_URL}/logos/logoprincipale.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `FAQ — Häufig gestellte Fragen | ${SITE_NAME}`,
    description: "Antworten zu Bestellung, Versand, Zahlung, Garantie und Rückgabe.",
    images: [`${SITE_URL}/logos/logoprincipale.png`],
  },
};

const faqSections = [
  {
    title: "Bestellung & Zahlung",
    items: [
      {
        q: "Wie kann ich ein Produkt bei HAUSAURA bestellen?",
        a: "Wählen Sie Ihre Lieblingsprodukte im Shop aus, fügen Sie sie zum Warenkorb hinzu und folgen Sie dem Bestellprozess. Geben Sie Ihre Rechnungs- und Lieferadresse ein, wählen Sie die Zahlungsart Überweisung (Vorkasse) und schließen Sie die Bestellung ab. Sie erhalten eine Bestätigungs-E-Mail mit unseren Bankverbindungsdaten.",
      },
      {
        q: "Welche Zahlungsarten stehen zur Verfügung?",
        a: "Wir bieten ausschließlich die Zahlungsart Überweisung (Vorkasse) an. Nach Ihrer Bestellung erhalten Sie eine E-Mail mit unseren Bankverbindungsdaten. Die Zahlungsfrist beträgt 5 Werktage nach Abschluss des Vertrages.",
      },
      {
        q: "Kann ich meine Bestellung stornieren?",
        a: "Ja, Sie können Ihre Bestellung solange stornieren, wie sie noch nicht versandt wurde. Kontaktieren Sie uns umgehend per E-Mail oder Telefon und wir nehmen die Stornierung vor.",
      },
    ],
  },
  {
    title: "Versand & Lieferung",
    items: [
      {
        q: "Wie lange dauert die Lieferung?",
        a: "Die Lieferung erfolgt innerhalb von 2-5 Werktagen nach Eingang Ihrer Zahlung. Versandkostenfrei innerhalb Deutschlands ab einem Bestellwert von 50 Euro. Darunter fallen 4,99 Euro Versandkosten an.",
      },
      {
        q: "Versendet HAUSAURA auch nach Österreich und in die Schweiz?",
        a: "Ja, wir versanden nach Deutschland, Österreich und der Schweiz. Die Versandkosten betragen 4,99€ (DE, ab 50€ versandkostenfrei), 7,99€ (AT, ab 75€ versandkostenfrei) und 9,99€ (CH, ab 100€ versandkostenfrei).",
      },
      {
        q: "Kann ich meine Bestellung nachverfolgen?",
        a: "Ja, nach Versand Ihrer Bestellung erhalten Sie eine E-Mail mit einer Sendungsverfolgungsnummer. Über diese können Sie den aktuellen Status Ihres Pakets jederzeit online verfolgen.",
      },
      {
        q: "Was passiert, wenn ich nicht zu Hause bin?",
        a: "Der Paketdienstleister hinterlässt eine Benachrichtigung. In der Regel wird das Paket bei einem Nachbarn, bei der Poststelle oder in einem Paketshop hinterlegt. Alternativ können Sie einen Wunschtermin für die Zustellung vereinbaren.",
      },
    ],
  },
  {
    title: "Rückgabe & Garantie",
    items: [
      {
        q: "Kann ich ein Gerät zurückgeben?",
        a: "Ja, Sie haben ein 30-tägiges Rückgaberecht ab Erhalt der Ware. Die Ware muss unbenutzt und in der Originalverpackung sein. Kontaktieren Sie uns per E-Mail oder Telefon und wir klären die Rücksendung mit Ihnen ab. Die Rücksendekosten tragen Sie als Verbraucher.",
      },
      {
        q: "Welche Garantie bieten Sie?",
        a: "Alle Produkte unterliegen der gesetzlichen Gewährleistung von 24 Monaten. Für ausgewählte Premium-Produkte (Miele, Gaggenau, V-ZUG) bieten wir eine optionale Premium-Garantie bis zu 5 Jahre an. Diese kann direkt beim Kauf gebucht werden.",
      },
      {
        q: "Was tun bei einem Defekt oder Garantiefall?",
        a: "Kontaktieren Sie uns umgehend per E-Mail oder Telefon mit einer Beschreibung des Problems und ggf. Fotos. Wir melden uns innerhalb von 24 Stunden bei Ihnen und klären das weitere Vorgehen — Reparatur, Umtausch oder Erstattung.",
      },
    ],
  },
  {
    title: "Konto & Newsletter",
    items: [
      {
        q: "Brauche ich ein Konto, um zu bestellen?",
        a: "Nein, Sie können auch als Gast bestellen. Mit einem Konto können Sie Ihren Bestellstatus verfolgen, Ihre Bestellhistorie einsehen und Ihr Newsletter-Abonnement verwalten.",
      },
      {
        q: "Wie kann ich meinen Newsletter abbestellen?",
        a: "Klicken Sie in jeder Newsletter-E-Mail auf den Abbestell-Link. Alternativ können Sie sich auch über unser Kontaktformular an uns wenden. Wir verarbeiten Ihre Abbestellung umgehend.",
      },
    ],
  },
  {
    title: "Beratung & Service",
    items: [
      {
        q: "Kann ich eine Beratung vor dem Kauf erhalten?",
        a: "Selbstverständlich! Unser deutsches Kundenteam berät Sie gerne per E-Mail (info@hausaura.de), telefonisch (+49 1525 9140453) oder über unser Kontaktformular. Wir sind montags bis freitags von 9:00 bis 18:00 Uhr und samstags von 10:00 bis 14:00 Uhr erreichbar.",
      },
      {
        q: "Bieten Sie einen Anschlussservice an?",
        a: "Derzeit konzentrieren wir uns auf den Verkauf hochwertiger Haushaltsgeräte. Für technische Probleme oder Reparaturwünsche verweisen wir Sie gerne an den jeweiligen Herstellerservice. Bei Garantiefällen helfen wir Ihnen selbstverständlich weiter.",
      },
      {
        q: "Welche Marken führen Sie?",
        a: "Wir führen eine kuratierte Auswahl an Premium-Marken: Miele, Bosch, Siemens, Dyson, Jura, De'Longhi, Samsung, LG, Liebherr, Thermomix, tado°, Philips Hue, Ring, Netatmo, IKEA Smart Home und weitere. Alle Produkte werden direkt vom Hersteller oder autorisierten Händlern bezogen.",
      },
    ],
  },
];

export default function FaqPage() {
  const allQuestions = faqSections.flatMap((s) => s.items);

  const enhancedFaqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allQuestions.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(enhancedFaqJsonLd) }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "HAUSAURA", url: SITE_URL },
          { name: "FAQ", url: `${SITE_URL}/faq` },
        ]}
      />
      <main id="main-content" className="container-hausaura py-8 sm:py-12 max-w-3xl">
        <Breadcrumb items={[{ label: "FAQ" }]} />
        <h1 className="heading-1 mb-4">Häufig gestellte Fragen</h1>
        <p className="text-[var(--color-text-secondary)] mb-10">
          Finden Sie Antworten auf die häufigsten Fragen zu Bestellung, Versand, Zahlung,
          Garantie und Rückgabe bei {SITE_NAME}.
        </p>

        <nav className="mb-10 space-y-2" aria-label="FAQ-Bereiche">
          {faqSections.map((section) => (
            <a
              key={section.title}
              href={`#${sectionId(section.title)}`}
              className="block px-4 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] bg-[var(--color-bg-secondary)] rounded-lg hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-colors"
            >
              {section.title}
            </a>
          ))}
        </nav>

        {faqSections.map((section) => (
          <section
            key={section.title}
            id={sectionId(section.title)}
            className="mb-12 scroll-mt-24"
          >
            <h2 className="heading-3 mb-4">{section.title}</h2>
            <div className="space-y-3">
              {section.items.map((item, i) => (
                <details
                  key={i}
                  className="group bg-[var(--color-bg)] rounded-xl overflow-hidden border border-[var(--color-border-light)]"
                >
                  <summary className="flex items-center justify-between cursor-pointer p-5 font-semibold text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors">
                    {item.q}
                    <span className="ml-4 text-[var(--color-text-muted)] group-open:rotate-180 transition-transform flex-shrink-0">
                      ▼
                    </span>
                  </summary>
                  <div className="px-5 pb-5 text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}

        <div className="bg-[var(--color-bg-secondary)] rounded-2xl p-6 sm:p-8 text-center">
          <h2 className="heading-3 mb-3">Noch Fragen?</h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-5">
            Unser Kundenteam hilft Ihnen gerne weiter — schnell, kompetent und persönlich.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/kontakt"
              className="inline-flex items-center justify-center px-6 py-3 bg-[var(--color-accent)] text-white rounded-xl text-sm font-semibold hover:bg-[var(--color-accent-hover)] transition-colors"
            >
              Kontaktformular
            </Link>
            <a
              href="tel:+4915259140453"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-[var(--color-border)] text-[var(--color-text-primary)] rounded-xl text-sm font-semibold hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
            >
              +49 1525 9140453
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
