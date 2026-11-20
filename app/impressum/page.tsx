import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { SITE_URL } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Angaben gemäß § 5 DDG der HAUSAURA GmbH.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/impressum" },
  openGraph: {
    title: "Impressum",
    description: "Angaben gemäß § 5 DDG der HAUSAURA GmbH.",
    siteName: "HAUSAURA",
    locale: "de_DE",
    type: "website",
    images: [{ url: `${SITE_URL}/logos/logoprincipale.png`, width: 1200, height: 630 }],
  },
};

const fallback = {
  companyName: "HAUSAURA GmbH",
  companyAddress: "",
  contactPhone: "+49 1525 9140453",
  contactEmail: "info@hausaura.de",
  vatId: "",
  managingDirector: "",
  registerCourt: "",
  registerNumber: "",
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
      registerCourt: s.registerCourt || fallback.registerCourt,
      registerNumber: s.registerNumber || fallback.registerNumber,
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
      <BreadcrumbJsonLd items={[{ name: "HAUSAURA", url: "/" }, { name: "Impressum", url: "/impressum" }]} />
      <Breadcrumb items={[{ label: "Impressum" }]} />
      <h1 className="heading-1 mb-8">Impressum</h1>

      <div className="prose-hausaura space-y-8">
        <section>
          <h2 className="heading-3 mb-3">Angaben gemäß § 5 DDG</h2>
          <div className="bg-[var(--color-bg)] rounded-xl p-6 space-y-2">
            <p className="text-[var(--color-text-secondary)]">{s.companyName}</p>
            {addressLines.filter(Boolean).map((line, i) => (
              <p key={`${line}-${i}`} className="text-[var(--color-text-secondary)]">{line}</p>
            ))}
            {s.companyAddress && <p className="text-[var(--color-text-secondary)]">Deutschland</p>}
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

        {s.managingDirector && (
          <section>
            <h2 className="heading-3 mb-3">Vertreten durch</h2>
            <p className="text-[var(--color-text-secondary)]">{s.managingDirector}</p>
          </section>
        )}

        {(s.registerCourt || s.registerNumber) && (
          <section>
            <h2 className="heading-3 mb-3">Registereintrag</h2>
            <p className="text-[var(--color-text-secondary)]">
              Eintragung im Handelsregister.<br />
              {s.registerCourt && <>Registergericht: {s.registerCourt}<br /></>}
              {s.registerNumber && <>Registernummer: {s.registerNumber}</>}
            </p>
          </section>
        )}

        {s.managingDirector && (
          <section>
            <h2 className="heading-3 mb-3">Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
            <p className="text-[var(--color-text-secondary)]">
              {s.managingDirector}{s.companyAddress ? `, ${s.companyAddress}` : ""}, Deutschland
            </p>
          </section>
        )}

        {s.vatId && (
          <section>
            <h2 className="heading-3 mb-3">Umsatzsteuer-ID</h2>
            <p className="text-[var(--color-text-secondary)]">
              Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:
            </p>
            <p className="text-[var(--color-text-primary)] font-mono mt-1">{s.vatId}</p>
          </section>
        )}

        <section>
          <h2 className="heading-3 mb-3">Verbraucherstreitbeilegung</h2>
          <p className="text-[var(--color-text-secondary)]">
            Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </section>

        <section>
          <h2 className="heading-3 mb-3">Haftung für Inhalte</h2>
          <p className="text-[var(--color-text-secondary)]">
            Als Diensteanbieter sind wir gemäß § 7 Abs.1 DDG für eigene Inhalte auf diesen Seiten nach den
            allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht
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
          Stand: November 2026
        </p>
      </div>
    </main>
  );
}
