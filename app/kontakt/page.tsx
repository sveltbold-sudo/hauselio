import Image from "next/image";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import KontaktForm from "@/components/kontakt/KontaktForm";
import FaqSection from "@/components/kontakt/FaqSection";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Kontaktieren Sie HAUSELIO — per E-Mail, Telefon oder persönlicher Nachricht. Wir sind für Sie da.",
  alternates: { canonical: "/kontakt" },
  openGraph: {
    title: "Kontakt — HAUSELIO",
    description: "Kontaktieren Sie HAUSELIO — per E-Mail, Telefon oder persönlicher Nachricht.",
    url: `${SITE_URL}/kontakt`,
    siteName: "HAUSELIO",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kontakt — HAUSELIO",
    description: "Kontaktieren Sie HAUSELIO — per E-Mail, Telefon oder persönlicher Nachricht.",
  },
};

const fallbackSettings = {
  contactEmail: "info@hauselio.de",
  contactPhone: "+49 (0)30 555 789 01",
  contactAddress: "Kastanienallee 42, 10435 Berlin",
};

async function getSettings() {
  try {
    const settings = await prisma.siteSettings.findFirst();
    if (!settings) return fallbackSettings;
    return {
      contactEmail: settings.contactEmail || fallbackSettings.contactEmail,
      contactPhone: settings.contactPhone || fallbackSettings.contactPhone,
      contactAddress: settings.contactAddress || fallbackSettings.contactAddress,
    };
  } catch {
    return fallbackSettings;
  }
}

export default async function KontaktPage() {
  const settings = await getSettings();

  const contactJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Kontakt — HAUSELIO",
    url: `${SITE_URL}/kontakt`,
    mainEntity: {
      "@type": "Organization",
      name: "HAUSELIO GmbH",
      telephone: settings.contactPhone,
      email: settings.contactEmail,
      address: settings.contactAddress,
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Wie kann ich ein Produkt bestellen?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Wählen Sie Ihre Lieblingsprodukte im Shop aus, fügen Sie sie zum Warenkorb hinzu und folgen Sie dem Bestellprozess. Die Zahlung erfolgt per Überweisung (SEPA). Sie erhalten nach der Bestellung eine E-Mail mit den Bankverbindungen.",
        },
      },
      {
        "@type": "Question",
        name: "Wie lange dauert die Lieferung?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Die Lieferzeit beträgt in der Regel 2-5 Werktage nach Eingang der Zahlung. Bei großen Haushaltsgeräten wie Waschmaschinen oder Geschirrspülern können wir auch einen Wunschtermin vereinbaren.",
        },
      },
      {
        "@type": "Question",
        name: "Kann ich ein Gerät zurückgeben?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ja, Sie haben ein 30-tägiges Rückgaberecht. Die Rücksendung ist kostenlos. Kontaktieren Sie uns einfach per E-Mail oder Telefon und wir organisieren den Rückversand für Sie.",
        },
      },
      {
        "@type": "Question",
        name: "Welche Garantie bieten Sie?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Wir bieten eine erweiterte Garantie von bis zu 5 Jahren auf alle Geräte. Zusätzlich haben Sie die gesetzliche Gewährleistung. Bei Defekten übernehmen wir die Reparatur oder den Ersatz kostenfrei.",
        },
      },
      {
        "@type": "Question",
        name: "Kann ich eine Beratung vor dem Kauf erhalten?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Selbstverständlich! Unsere Experten beraten Sie gerne telefonisch, per E-Mail oder über unser Kontaktformular. Wir helfen Ihnen, das perfekte Gerät für Ihre Bedürfnisse zu finden.",
        },
      },
      {
        "@type": "Question",
        name: "Bieten Sie einen Anschlussservice an?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ja, bei vielen Geräten bieten wir einen kostenlosen Anschlussservice an. Bei der Bestellung können Sie angeben, ob Sie eine fachgerechte Installation wünschen.",
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <main id="main-content">
      <div className="container-hauselio py-6 sm:py-8">
        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: "Kontakt" }]} />

        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <h1 className="heading-1">So erreichen Sie uns</h1>
              <p className="body-large mt-2">
                Wir sind für Sie da — per E-Mail, Telefon oder persönlicher Nachricht.
              </p>
            </div>
            <div className="hidden lg:block">
              <Image
                src="/images/illustrations/contact-support.svg"
                alt="Kontakt Support"
                width={200}
                height={150}
                className="w-full max-w-[200px] h-auto"
              />
            </div>
          </div>
        </div>

        <KontaktForm settings={settings} />
      </div>
      <FaqSection />
    </main>
    </>
  );
}
