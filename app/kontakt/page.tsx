import Image from "next/image";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import KontaktForm from "@/components/kontakt/KontaktForm";
import FaqSection from "@/components/kontakt/FaqSection";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { SITE_URL } from "@/lib/constants";
import { buildFaqJsonLd } from "@/lib/faq";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Kontaktieren Sie HAUSAURA — per E-Mail, Telefon oder persönlicher Nachricht. Wir sind für Sie da.",
  alternates: { canonical: "/kontakt" },
  openGraph: {
    title: "Kontakt — HAUSAURA",
    description: "Kontaktieren Sie HAUSAURA — per E-Mail, Telefon oder persönlicher Nachricht.",
    url: `${SITE_URL}/kontakt`,
    siteName: "HAUSAURA",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kontakt — HAUSAURA",
    description: "Kontaktieren Sie HAUSAURA — per E-Mail, Telefon oder persönlicher Nachricht.",
  },
};

const fallbackSettings = {
  contactEmail: "info@HAUSAURA.de",
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
    name: "Kontakt — HAUSAURA",
    url: `${SITE_URL}/kontakt`,
    mainEntity: {
      "@type": "Organization",
      name: "HAUSAURA GmbH",
      telephone: settings.contactPhone,
      email: settings.contactEmail,
      address: settings.contactAddress,
    },
  };

  const faqJsonLd = buildFaqJsonLd();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <main id="main-content">
      <div className="container-hausaura py-6 sm:py-8">
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
