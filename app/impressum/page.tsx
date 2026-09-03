import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { prisma } from "@/lib/prisma";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Impressum",
  description: "Angaben gemäß § 5 TMG der HAUSAURA GmbH.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/impressum" },
  openGraph: {
    title: "Impressum — HAUSAURA",
    description: "Angaben gemäß § 5 TMG der HAUSAURA GmbH.",
    siteName: "HAUSAURA",
    locale: "de_DE",
    type: "website",
  },
};

const fallback = {
  companyName: "HAUSAURA GmbH",
  companyAddress: "Kastanienallee 42, 10435 Berlin",
  contactPhone: "+49 (0)30 555 789 01",
  contactEmail: "info@hausaura.de",
  vatId: "DE 312 847 609",
  managingDirector: "Max Mustermann",
};

async function getSettings() {
  try {
    const s = await prisma.siteSettings.findFirst();
    if (!s) return fallback;
    return {
      companyName: s.companyName || fallback.companyName,
      companyAddress: s.companyAddress || fallback.companyAddress,
      contactPhone: s.contactPhone || fallback.contactPhone,
      contactEmail: s.contactEmail || fallback.contactEmail,
      vatId: s.vatId || fallback.vatId,
      managingDirector: s.managingDirector || fallback.managingDirector,
    };
  } catch {
    return fallback;
  }
}

export default async function ImpressumPage() {
  const s = await getSettings();
  const addressLines = s.companyAddress.split(",").map((l) => l.trim());

  return (
    <main id="main-content" className="container-hausaura py-8 sm:py-12 max-w-3xl">
      <Breadcrumb items={[{ label: "Impressum" }]} />
      <h1 className="heading-1 mb-8">Impressum</h1>

      <div className="prose-hausaura space-y-8">
        <section>
          <h2 className="heading-3 mb-3">Angaben gemäß § 5 TMG</h2>
          <div className="bg-[var(--color-bg)] rounded-xl p-6 space-y-2">
            <p className="text-[var(--color-text-secondary)]">{s.companyName}</p>
            {addressLines.map((line) => (
              <p key={line} className="text-[var(--color-text-secondary)]">{line}</p>
            ))}
            <p className="text-[var(--color-text-secondary)]">Deutschland</p>
          </div>
        </section>

        <section>
          <h2 className="heading-3 mb-3">Geschäftsführer</h2>
          <div className="bg-[var(--color-bg)] rounded-xl p-6">
            <p className="text-[var(--color-text-secondary)]">{s.managingDirector}</p>
          </div>
        </section>

        <section>
          <h2 className="heading-3 mb-3">Kontakt</h2>
          <div className="bg-[var(--color-bg)] rounded-xl p-6 space-y-2">
            <p className="text-[var(--color-text-secondary)]">Telefon: {s.contactPhone}</p>
            <p className="text-[var(--color-text-secondary)]">E-Mail: {s.contactEmail}</p>
            <p className="text-[var(--color-text-secondary)]">Website: www.hausaura.de</p>
          </div>
        </section>

        <section>
          <h2 className="heading-3 mb-3">Umsatzsteuer-ID</h2>
          <p className="text-[var(--color-text-secondary)]">
            Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:
          </p>
          <p className="text-[var(--color-text-primary)] font-mono mt-1">{s.vatId}</p>
        </section>

        <section>
          <h2 className="heading-3 mb-3">Streitschlichtung</h2>
          <p className="text-[var(--color-text-secondary)]">
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent)] hover:underline ml-1 break-all"
            >
              https://ec.europa.eu/consumers/odr/
            </a>
          </p>
          <p className="text-[var(--color-text-secondary)] mt-3">
            Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </section>

        <section>
          <h2 className="heading-3 mb-3">Haftung für Inhalte</h2>
          <p className="text-[var(--color-text-secondary)]">
            Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den
            allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht
            unter der Verpflichtung, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach
            Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
          </p>
        </section>

        <section>
          <h2 className="heading-3 mb-3">Haftung für Links</h2>
          <p className="text-[var(--color-text-secondary)]">
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben.
            Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
            verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
          </p>
        </section>

        <section>
          <h2 className="heading-3 mb-3">Urheberrecht</h2>
          <p className="text-[var(--color-text-secondary)]">
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen
            Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
            Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
          </p>
        </section>

        <p className="text-xs text-[var(--color-text-muted)] mt-8 pt-4 border-t border-[var(--color-border)]">
          Stand: September 2026
        </p>
      </div>
    </main>
  );
}
