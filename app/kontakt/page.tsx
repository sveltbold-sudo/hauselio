import Link from "next/link";
import { prisma } from "@/lib/prisma";
import KontaktForm from "@/components/kontakt/KontaktForm";
import FaqSection from "@/components/kontakt/FaqSection";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const revalidate = 86400;

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

  return (
    <>
      <div className="container-hauselio py-8">
        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: "Kontakt" }]} />

        {/* Header */}
        <div className="mb-12">
          <h1 className="heading-1">So erreichen Sie uns</h1>
          <p className="body-large mt-2">
            Wir sind für Sie da — per E-Mail, Telefon oder persönlicher Nachricht.
          </p>
        </div>

        <KontaktForm settings={settings} />
      </div>
      <FaqSection />
    </>
  );
}
