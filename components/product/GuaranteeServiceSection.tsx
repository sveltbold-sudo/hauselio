import { Shield, Wrench, Headphones, Truck, Clock, HeartHandshake, BadgeCheck } from "lucide-react";

const guarantees = [
  {
    icon: Shield,
    title: "Garantie bis zu 5 Jahre",
    description: "Erweiterte Garantie auf alle Geräte – für Ihre Sicherheit und Zufriedenheit",
    color: "text-[var(--color-primary)]",
    bgColor: "bg-[var(--color-primary-50)]",
  },
  {
    icon: Wrench,
    title: "Kostenloser Service",
    description: "Reparatur und Wartung durch qualifizierte Techniker – ohne versteckte Kosten",
    color: "text-[var(--color-success)]",
    bgColor: "bg-[var(--color-success-light)]",
  },
  {
    icon: Headphones,
    title: "Persönliche Beratung",
    description: "Unser Experten-Team berät Sie telefonisch, per E-Mail oder vor Ort",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  {
    icon: Truck,
    title: "Lieferung & Installation",
    description: "Wir liefern kostenlos und installieren Ihr Gerät fachgerecht",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    icon: Clock,
    title: "30 Tage Rückgaberecht",
    description: "Nicht zufrieden? Kostenloser Rückversand innerhalb von 30 Tagen",
    color: "text-rose-600",
    bgColor: "bg-rose-50",
  },
  {
    icon: BadgeCheck,
    title: "Geprüfte Qualität",
    description: "Alle Produkte sind TÜV-geprüft und entsprechen EU-Standards",
    color: "text-teal-600",
    bgColor: "bg-teal-50",
  },
];

const stats = [
  { number: "15.000+", label: "Zufriedene Kunden" },
  { number: "98%", label: "Weiterempfehlungsrate" },
  { number: "4.8/5", label: "Kundenbewertung" },
  { number: "24h", label: "Reaktionszeit Support" },
];

export default function GuaranteeServiceSection() {
  return (
    <section className="section-py bg-gradient-to-b from-[var(--color-bg)] to-white">
      <div className="container-hauselio">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="caption text-[var(--color-primary)] mb-3">Service & Garantie</p>
          <h2 className="heading-2">Ihr Vertrauen ist unser Antrieb</h2>
          <p className="body-large mt-2 max-w-2xl mx-auto">
            Bei HAUSELIO stehen wir hinter der Qualität unserer Produkte. 
            Profitieren Sie von unserem erstklassigen Service und unserer Garantie.
          </p>
        </div>

        {/* Guarantees Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {guarantees.map((guarantee, i) => {
            const Icon = guarantee.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-[var(--color-border-light)] hover:shadow-xl hover:border-[var(--color-primary)]/20 transition-all duration-500 group animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`w-12 h-12 rounded-xl ${guarantee.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500`}>
                  <Icon className={`w-6 h-6 ${guarantee.color}`} />
                </div>
                <h3 className="font-bold text-[var(--color-text-primary)] mb-2">
                  {guarantee.title}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {guarantee.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Stats Bar */}
        <div className="bg-[var(--color-primary)] rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl md:text-4xl font-black text-white mb-2">
                  {stat.number}
                </p>
                <p className="text-sm text-white/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Note */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-3 border border-[var(--color-border-light)] shadow-sm">
            <HeartHandshake className="w-5 h-5 text-[var(--color-primary)]" />
            <span className="text-sm font-semibold text-[var(--color-text-secondary)]">
              Über 15.000 zufriedene Kunden vertrauen auf HAUSELIO
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
