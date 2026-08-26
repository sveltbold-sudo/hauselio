import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Clock, CheckCircle, Phone, Mail, FileText } from "lucide-react";
import { SITE_URL } from "@/lib/constants";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Garantie | HAUSELIO",
  description: "Informieren Sie sich über unsere Garantie- und Gewährleistungsbedingungen. Bis zu 5 Jahre Garantie auf ausgewählte Produkte.",
  alternates: { canonical: `${SITE_URL}/garantie` },
};

const guaranteeTiers = [
  {
    title: "Standard-Garantie",
    duration: "2 Jahre",
    description: "Gesetzliche Gewährleistung auf alle Produkte. Kostenloser Ersatz oder Reparatur bei Material- und Herstellungsfehlern.",
    icon: Shield,
    color: "text-[var(--color-primary)]",
    bgColor: "bg-[var(--color-primary)]/10",
  },
  {
    title: "Erweiterte Garantie",
    duration: "Bis zu 3 Jahre",
    description: "Optional buchbar bei ausgewählten Produkten. Erweitert die Standard-Garantie um ein weiteres Jahr.",
    icon: Clock,
    color: "text-[var(--color-accent)]",
    bgColor: "bg-[var(--color-accent)]/10",
  },
  {
    title: "Premium-Garantie",
    duration: "Bis zu 5 Jahre",
    description: "Für Premium-Geräte von Miele, Gaggenau und V-ZUG. Umfassender Schutz für Ihre Investition.",
    icon: CheckCircle,
    color: "text-[var(--color-success)]",
    bgColor: "bg-[var(--color-success)]/10",
  },
];

const guaranteeSteps = [
  {
    step: 1,
    title: "Mangel melden",
    description: "Kontaktieren Sie uns per E-Mail oder Telefon und schildern Sie das Problem.",
  },
  {
    step: 2,
    title: "Gerät prüfen",
    description: "Unser Service-Team prüft Ihren Fall und erstattet gegebenenfalls einen Gutachter.",
  },
  {
    step: 3,
    title: "Lösung",
    description: "Reparatur, Ersatzlieferung oder Rückerstattung — je nach Fall und Garantieumfang.",
  },
];

export default function GarantiePage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Startseite", url: "/" },
          { name: "Garantie", url: "/garantie" },
        ]}
      />

      <main id="main-content" className="container-hauselio py-8 sm:py-12 max-w-4xl">
        <Breadcrumb items={[{ label: "Startseite", href: "/" }, { label: "Garantie" }]} />

        <h1 className="heading-1 mb-4">Garantie & Gewährleistung</h1>
        <p className="text-[var(--color-text-secondary)] text-base sm:text-lg mb-8 sm:mb-12 max-w-2xl">
          Bei HAUSELIO stehen wir hinter der Qualität unserer Produkte. Profitieren Sie von unserer umfassenden Garantie.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-16">
          {guaranteeTiers.map((tier) => (
            <div
              key={tier.title}
              className="bg-white rounded-2xl border border-[var(--color-border-light)] p-6 hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 rounded-xl ${tier.bgColor} flex items-center justify-center mb-4`}>
                <tier.icon className={`w-6 h-6 ${tier.color}`} />
              </div>
              <div className="text-sm font-bold text-[var(--color-primary)] mb-1">{tier.duration}</div>
              <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">{tier.title}</h2>
              <p className="text-sm text-[var(--color-text-secondary)]">{tier.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-[var(--color-bg-secondary)] rounded-2xl p-6 sm:p-8 mb-10 sm:mb-16">
          <h2 className="heading-3 mb-8 text-center">So melden Sie einen Garantiefall</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {guaranteeSteps.map((step) => (
              <div key={step.step} className="text-center">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                  {step.step}
                </div>
                <h3 className="font-bold text-[var(--color-text-primary)] mb-2">{step.title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="prose-hauselio space-y-6 sm:space-y-8 mb-10 sm:mb-16">
          <section>
            <h2 className="heading-3 mb-3">Gesetzliche Gewährleistung</h2>
            <p className="text-[var(--color-text-secondary)]">
              Alle Produkte unterliegen der gesetzlichen Gewährleistung von 24 Monaten ab Lieferung. Innerhalb dieser
              Zeit haben Sie das Recht auf Reparatur, Ersatzlieferung oder Minderung des Kaufpreises bei
              Mängeln, die nicht durch unsachgemäße Verwendung entstanden sind.
            </p>
          </section>

          <section>
            <h2 className="heading-3 mb-3">Details zur erweiterten Garantie</h2>
            <p className="text-[var(--color-text-secondary)]">
              Für ausgewählte Produkte bieten wir eine optionale erweiterte Garantie an. Diese kann direkt beim Kauf
              für 1-3 weitere Jahre gebucht werden. Die erweiterte Garantie deckt die gleichen Mängel ab wie die
              gesetzliche Gewährleistung und verlängert deren Laufzeit.
            </p>
          </section>

          <section>
            <h2 className="heading-3 mb-3">Ausschlüsse</h2>
            <p className="text-[var(--color-text-secondary)]">
              Die Garantie umfasst keine Schäden durch unsachgemäße Verwendung, sportliche Aktivitäten,
              Wasserschäden durch Überschwemmungen, Brandschäden oder andere äußere Einwirkungen. Ebenso ausgeschlossen
              sind Schäden durch nicht autorisierte Reparaturversuche.
            </p>
          </section>
        </div>

        <div className="bg-white rounded-2xl border border-[var(--color-border-light)] p-6 sm:p-8">
          <h2 className="heading-3 mb-4">Kontaktieren Sie uns</h2>
          <p className="text-[var(--color-text-secondary)] mb-6">
            Haben Sie Fragen zur Garantie? Unser Service-Team hilft Ihnen gerne weiter.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a
              href="tel:+493055578901"
              className="flex items-center gap-3 p-4 rounded-xl bg-[var(--color-bg-secondary)] hover:bg-[var(--color-primary)]/5 transition-colors"
            >
              <Phone className="w-5 h-5 text-[var(--color-primary)]" />
              <div>
                <div className="text-sm font-bold text-[var(--color-text-primary)]">Telefon</div>
                <div className="text-xs text-[var(--color-text-muted)]">+49 (0)30 555 789 01</div>
              </div>
            </a>
            <a
              href="mailto:service@hauselio.de"
              className="flex items-center gap-3 p-4 rounded-xl bg-[var(--color-bg-secondary)] hover:bg-[var(--color-primary)]/5 transition-colors"
            >
              <Mail className="w-5 h-5 text-[var(--color-primary)]" />
              <div>
                <div className="text-sm font-bold text-[var(--color-text-primary)]">E-Mail</div>
                <div className="text-xs text-[var(--color-text-muted)]">service@hauselio.de</div>
              </div>
            </a>
            <Link
              href="/kontakt"
              className="flex items-center gap-3 p-4 rounded-xl bg-[var(--color-bg-secondary)] hover:bg-[var(--color-primary)]/5 transition-colors"
            >
              <FileText className="w-5 h-5 text-[var(--color-primary)]" />
              <div>
                <div className="text-sm font-bold text-[var(--color-text-primary)]">Kontaktformular</div>
                <div className="text-xs text-[var(--color-text-muted)]">Nachricht senden</div>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
