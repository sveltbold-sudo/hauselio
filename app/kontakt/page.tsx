import { prisma } from "@/lib/prisma";
import KontaktForm from "@/components/kontakt/KontaktForm";

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
    <div className="container-hauselio py-8">
      {/* Header */}
      <div className="mb-12">
        <p className="caption text-[var(--color-primary)] mb-3">Kontakt</p>
        <h1 className="heading-1">So erreichen Sie uns</h1>
        <p className="body-large mt-2">
          Wir sind für Sie da — per E-Mail, Telefon oder persönlicher Nachricht.
        </p>
      </div>

      <KontaktForm settings={settings} />
    </div>
  );
}
