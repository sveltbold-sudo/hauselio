import type { Metadata } from "next";
import { Mail, Phone } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Barrierefreiheitserklärung",
  description: "Informationen zur Barrierefreiheit der HAUSAURA Website gemäß Barrierefreiheitsstärkungsgesetz (BFSG).",
  alternates: { canonical: `${SITE_URL}/barrierefreiheit` },
  openGraph: {
    title: "Barrierefreiheitserklärung — HAUSAURA",
    description: "Informationen zur Barrierefreiheit der HAUSAURA Website gemäß BFSG.",
    siteName: "HAUSAURA",
    locale: "de_DE",
    type: "website",
  },
};

export default function BarrierefreiheitPage() {
  return (
    <main id="main-content" className="container-hausaura py-8 sm:py-12 max-w-3xl">
      <BreadcrumbJsonLd items={[{ name: "HAUSAURA", url: "/" }, { name: "Barrierefreiheit", url: "/barrierefreiheit" }]} />
      <Breadcrumb items={[{ label: "Startseite", href: "/" }, { label: "Barrierefreiheit" }]} />
      <h1 className="heading-1 mb-8">Barrierefreiheitserklärung</h1>

      <div className="prose-hausaura space-y-8">
        <section>
          <h2 className="heading-3 mb-3">1. Erklärung zur Barrierefreiheit</h2>
          <p className="text-[var(--color-text-secondary)]">
            HAUSAURA GmbH verpflichtet sich, die Barrierefreiheit der Website hausaura.de gemäß dem
            Barrierefreiheitsstärkungsgesetz (BFSG) und der Europäischen Barrierefreiheitsverordnung (EU) 2019/882
            sicherzustellen. Diese Erklärung gilt für die Website hausaura.de.
          </p>
        </section>

        <section>
          <h2 className="heading-3 mb-3">2. Aktueller Stand der Barrierefreiheit</h2>
          <p className="text-[var(--color-text-secondary)]">
            Die Website hausaura.de wird derzeit auf ihren Grad der Barrierefreiheit hin überprüft und
            ist teilweise barrierefrei. Die folgenden Bereiche sind barrierefrei:
          </p>
          <ul className="list-disc list-inside text-[var(--color-text-secondary)] space-y-1 mt-2">
            <li>Semantische HTML-Struktur mit korrekten Überschriftenhierarchien</li>
            <li>Keyboard-Navigation für alle interaktiven Elemente</li>
            <li>Ausreichende Farbkontraste (WCAG 2.1 AA)</li>
            <li>Alternativtexte für informative Bilder</li>
            <li>ARIA-Labels und Rollen für Screenreader-Kompatibilität</li>
            <li>Responsives Design für alle Bildschirmgrößen</li>
            <li>Skip-Link zur direkten Inhaltsnavigation</li>
          </ul>
        </section>

        <section>
          <h2 className="heading-3 mb-3">3. Erstellt am</h2>
          <p className="text-[var(--color-text-secondary)]">
            Diese Erklärung wurde am 31. August 2026 erstellt und zuletzt am 31. August 2026 überprüft.
          </p>
        </section>

        <section>
          <h2 className="heading-3 mb-3">4. Bekannte Einschränkungen</h2>
          <p className="text-[var(--color-text-secondary)]">
            Trotz unserer Bemühungen um vollständige Barrierefreiheit können einige Einschränkungen bestehen:
          </p>
          <ul className="list-disc list-inside text-[var(--color-text-secondary)] space-y-1 mt-2">
            <li>Einige ältere Produktbilder verfügen möglicherweise über unvollständige Alternativtexte</li>
            <li>Externe Inhalte (z.B. Zahlungsanbieter) unterliegen nicht unserer Barrierefreiheitskontrolle</li>
            <li>Die administrative Oberfläche (Login) ist nicht für Endnutzer bestimmt und wird nicht als barrierefrei bewertet</li>
          </ul>
        </section>

        <section>
          <h2 className="heading-3 mb-3">5. Feedback und Kontaktdaten</h2>
          <p className="text-[var(--color-text-secondary)]">
            Sie können auf Probleme bei der Barrierefreiheit dieser Website hinweisen oder
            Verbesserungsvorschläge unterfolgenden Kontaktdaten mitteilen:
          </p>
          <div className="bg-[var(--color-bg)] rounded-xl p-6 mt-4 space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-[var(--color-primary)]" />
              <div>
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">E-Mail</p>
                <p className="text-sm text-[var(--color-text-secondary)]">barrierefreiheit@hausaura.de</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-[var(--color-primary)]" />
              <div>
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">Telefon</p>
                <p className="text-sm text-[var(--color-text-secondary)]">+49 (0)30 555 789 01</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="heading-3 mb-3">6. Durchsetzung und Schlichtungsverfahren</h2>
          <p className="text-[var(--color-text-secondary)]">
            Wenn Sie mit der barrierefreien Gestaltung dieser Website nicht zufrieden sind, können Sie sich an die
            zuständige Schlichtungsstelle wenden:
          </p>
          <div className="bg-[var(--color-bg)] rounded-xl p-6 mt-4">
            <p className="text-sm text-[var(--color-text-secondary)]">
              Allgemeine Schlichtungsstelle des Bundes<br />
              Representativesstraße 10<br />
              77654 Offenburg<br />
              <a href="https://www.ergaenzende-schlichtung.de" className="text-[var(--color-primary)] hover:underline break-all" target="_blank" rel="noopener noreferrer">
                www.ergaenzende-schlichtung.de
              </a>
            </p>
          </div>
        </section>

        <section>
          <h2 className="heading-3 mb-3">7. Verfahren bei Schlichtungsverfahren</h2>
          <p className="text-[var(--color-text-secondary)]">
            Innerhalb von zwei Monaten nach Einreichung einer Beschwerde bei der Schlichtungsstelle prüft diese,
            ob das Schlichtungsverfahren für Sie geeignet und notwendig ist. Die Schlichtungsstelle kontaktiert
            Sie innerhalb eines Monats nach Eingang der Beschwerde. Das Schlichtungsverfahren ist für Sie kostenlos.
          </p>
        </section>

        <section>
          <h2 className="heading-3 mb-3">8. Technische Beschreibung der Barrierefreiheit</h2>
          <p className="text-[var(--color-text-secondary)]">
            Die Website ist nach den WCAG 2.1 Richtlinien auf Konformitätsstufe AA ausgelegt. Dies umfasst:
          </p>
          <ul className="list-disc list-inside text-[var(--color-text-secondary)] space-y-1 mt-2">
            <li>WCAG 2.1 Level AA als Zielkonformität</li>
            <li>EN 301 549 als technischer Standard</li>
            <li>semantische HTML5-Struktur</li>
            <li>ARIA 1.2 Attribute für assistive Technologien</li>
            <li>Responsive Layout mit Breakpoints für mobile Geräte</li>
            <li>Reduzierte Bewegung (prefers-reduced-motion) wird unterstützt</li>
          </ul>
        </section>

        <p className="text-xs text-[var(--color-text-muted)] mt-8 pt-4 border-t border-[var(--color-border)]">
          Stand: August 2026
        </p>
      </div>
    </main>
  );
}
