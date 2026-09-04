import { Truck, Shield, Headphones, Award, Heart, Zap } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Über uns",
  description: "Erfahren Sie mehr über HAUSAURA — Ihr Partner für hochwertige Haushaltsgeräte aus Deutschland.",
  alternates: { canonical: "/ueber-uns" },
  openGraph: {
    title: "Über uns — Ihr Partner für Haushaltsgeräte",
    description: "Erfahren Sie mehr über HAUSAURA — Ihr Partner für hochwertige Haushaltsgeräte aus Deutschland.",
    url: `${SITE_URL}/ueber-uns`,
    siteName: "HAUSAURA",
    locale: "de_DE",
    type: "website",
    images: [{ url: `${SITE_URL}/logos/logoprincipale.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Über uns",
    description: "Erfahren Sie mehr über HAUSAURA — Ihr Partner für hochwertige Haushaltsgeräte.",
    images: [`${SITE_URL}/logos/logoprincipale.png`],
  },
};

const values = [
  {
    icon: Award,
    title: "Qualität",
    description: "Wir bieten ausschließlich Produkte renommierter Markenhersteller, die strenge Qualitätsstandards erfüllen.",
  },
  {
    icon: Truck,
    title: "Schneller Versand",
    description: "Kostenloser Versand innerhalb Deutschlands ab 50€ Bestellwert. Ihre Bestellung wird innerhalb von 1-3 Werktagen geliefert.",
  },
  {
    icon: Shield,
    title: "Sicher einkaufen",
    description: "SSL-verschlüsselte Zahlungsabwicklung und DSGVO-konformer Datenschutz. Ihr Vertrauen liegt uns am Herzen.",
  },
  {
    icon: Headphones,
    title: "Persönlicher Service",
    description: "Unser deutsches Kundenteam berät Sie gerne — per E-Mail, Telefon oder über unser Kontaktformular.",
  },
  {
    icon: Heart,
    title: "Kundenzufriedenheit",
    description: "14 Tage Widerrufsrecht und transparente Geschäftsbedingungen. Sie kaufen risikofrei bei uns ein.",
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "Wir entwickeln ständig unser Angebot weiter, um Ihnen die neuesten Haushaltsinnovationen zugänglich zu machen.",
  },
];

export default function UeberUnsPage() {
  return (
    <main id="main-content" className="container-hausaura py-6 sm:py-8">
      <Breadcrumb items={[{ label: "Über uns" }]} />
      {/* Header */}
      <div className="mb-10 sm:mb-16 text-center max-w-3xl mx-auto">
        <p className="caption text-[var(--color-primary)] mb-3">Über HAUSAURA</p>
        <h1 className="heading-1 mb-8">
          Über HAUSAURA
        </h1>
        <p className="body-large">
          HAUSAURA wurde mit einer klaren Vision gegründet: hochwertige Haushaltsgeräte
          zugänglich, transparent und servicestark zu machen.
        </p>
      </div>

      {/* Story */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center mb-16 sm:mb-24">
        <div>
          <h2 className="heading-2 mb-6">Unsere Geschichte</h2>
          <div className="space-y-4 text-[var(--color-text-secondary)] leading-relaxed">
            <p>
              HAUSAURA ist ein deutscher Online-Shop für hochwertige Haushaltsgeräte.
              Von der Kaffeemaschine bis zum Staubsauger — wir bieten eine kuraterte Auswahl
              an Produkten namhafter Hersteller, die Ihr Zuhause komfortabler machen.
            </p>
            <p>
              Unser Team aus Experten für Haushaltstechnik steht Ihnen mit Rat und Tat zur Seite.
              Wir legen Wert auf persönlichen Service, transparente Kommunikation und eine
              erstklassige Kundenerfahrung — von der Bestellung bis zur Lieferung.
            </p>
            <p>
              Als Start-up mit Sitz in Berlin verbinden wir die Tradition deutschen
              Ingenieurswesens mit modernem E-Commerce. So stellen wir sicher, dass Sie
              immer die besten Produkte zum besten Preis erhalten.
            </p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-[var(--color-primary-50)] to-[var(--color-primary)]/10 rounded-3xl p-8 sm:p-12 flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl sm:text-7xl font-extrabold text-[var(--color-primary)] mb-4">H</div>
            <p className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
              Seit 2024 in Berlin
            </p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="mb-16 sm:mb-24">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="heading-2 mb-4">Unsere Werte</h2>
          <p className="body-large max-w-2xl mx-auto">
            Diese Prinzipien leiten unser Handeln — jeden Tag aufs Neue.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value) => (
            <div
              key={value.title}
              className="bg-white rounded-2xl border border-[var(--color-border-light)] p-7 hover:border-[var(--color-primary)]/30 hover:shadow-[var(--shadow-card-hover)] transition-colors transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-[var(--color-primary-50)] rounded-xl flex items-center justify-center mb-5">
                <value.icon className="w-6 h-6 text-[var(--color-primary)]" aria-hidden="true" />
              </div>
              <h3 className="heading-3 mb-2">
                {value.title}
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-[var(--color-secondary)] rounded-3xl p-8 sm:p-12 text-center text-white">
        <h2 className="heading-2 mb-4 text-white">Überzeugen Sie sich selbst</h2>
        <p className="text-white/70 mb-8 max-w-xl mx-auto">
          Entdecken Sie unser Sortiment an hochwertigen Haushaltsgeräten und erleben Sie
          den HAUSAURA Unterschied.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center px-8 py-3.5 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:bg-[var(--color-primary-hover)] transition-colors"
        >
          Zur Boutique
        </Link>
      </div>
    </main>
  );
}
