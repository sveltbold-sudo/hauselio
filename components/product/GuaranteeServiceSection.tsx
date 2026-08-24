import { Shield, Wrench, Headphones, Truck, Clock, BadgeCheck } from "lucide-react";

const guarantees = [
  {
    icon: Shield,
    title: "Bis zu 5 Jahre Garantie",
    description: "Erweiterte Garantie auf alle Geräte",
    color: "text-[var(--color-primary)]",
  },
  {
    icon: Wrench,
    title: "Kostenloser Service",
    description: "Reparatur und Wartung inklusive",
    color: "text-[var(--color-success)]",
  },
  {
    icon: Headphones,
    title: "Persönliche Beratung",
    description: "Telefon, E-Mail oder vor Ort",
    color: "text-[var(--color-accent)]",
  },
  {
    icon: Truck,
    title: "Lieferung & Anschluss",
    description: "Kostenlos und fachgerecht",
    color: "text-[var(--color-info)]",
  },
  {
    icon: Clock,
    title: "30 Tage Rückgabe",
    description: "Kostenloser Rückversand",
    color: "text-[var(--color-info)]",
  },
  {
    icon: BadgeCheck,
    title: "Geprüfte Qualität",
    description: "TÜV-geprüft, EU-Standards",
    color: "text-[var(--color-accent)]",
  },
];

const stats = [
  { number: "15.000+", label: "Zufriedene Kunden" },
  { number: "98%", label: "Weiterempfehlung" },
  { number: "4,8/5", label: "Kundenbewertung" },
  { number: "24h", label: "Support-Reaktion" },
];

export default function GuaranteeServiceSection() {
  return (
    <section className="section-py bg-white" aria-label="Service und Garantie">
      <div className="container-hauselio">
        {/* Header */}
        <div className="text-center mb-6 md:mb-10">
          <p className="caption text-[var(--color-primary)] mb-3">Service & Garantie</p>
          <h2 className="heading-2">Ihr Vertrauen ist unser Antrieb</h2>
          <p className="body-large mt-2 max-w-2xl mx-auto">
            Profitieren Sie von erstklassigem Service und Garantie
          </p>
        </div>

        {/* Guarantees — compact horizontal layout like AO/Darty */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6 md:mb-10">
          {guarantees.map((guarantee, i) => {
            const Icon = guarantee.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-xl p-4 border border-[var(--color-border-light)] hover:border-[var(--color-primary)]/15 hover:shadow-md transition-colors transition-shadow duration-300 group animate-fade-in-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[var(--color-bg-secondary)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                    <Icon className={`w-5 h-5 ${guarantee.color}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[var(--color-text-primary)] mb-0.5">
                      {guarantee.title}
                    </h3>
                    <p className="text-xs text-[var(--color-text-muted)] leading-snug">
                      {guarantee.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats Bar — bolder, like Coolblue trust metrics */}
        <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-2xl p-6 md:p-8 shadow-lg shadow-[var(--color-primary)]/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl md:text-3xl font-extrabold text-white mb-0.5">
                  {stat.number}
                </p>
                <p className="text-xs text-white/80 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
