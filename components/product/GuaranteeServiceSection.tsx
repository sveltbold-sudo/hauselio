import { Shield, Wrench, Headphones, Truck, Clock, BadgeCheck } from "lucide-react";

const guarantees = [
  {
    icon: Shield,
    title: "Garantie bis zu 5 Jahre",
    description: "Erweiterte Garantie auf alle Geräte",
    color: "text-[var(--color-primary)]",
    bgColor: "bg-[var(--color-primary-50)]",
  },
  {
    icon: Wrench,
    title: "Kostenloser Service",
    description: "Reparatur und Wartung ohne versteckte Kosten",
    color: "text-[var(--color-success)]",
    bgColor: "bg-[var(--color-success-light)]",
  },
  {
    icon: Headphones,
    title: "Persönliche Beratung",
    description: "Telefonisch, per E-Mail oder vor Ort",
    color: "text-[var(--color-accent)]",
    bgColor: "bg-[var(--color-accent-light)]",
  },
  {
    icon: Truck,
    title: "Lieferung & Installation",
    description: "Kostenlos und fachgerecht",
    color: "text-[var(--color-info)]",
    bgColor: "bg-[var(--color-info-light)]",
  },
  {
    icon: Clock,
    title: "30 Tage Rückgaberecht",
    description: "Kostenloser Rückversand",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    icon: BadgeCheck,
    title: "Geprüfte Qualität",
    description: "TÜV-geprüft, EU-Standards",
    color: "text-teal-600",
    bgColor: "bg-teal-50",
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
    <section className="section-py bg-[var(--color-bg-secondary)]">
      <div className="container-hauselio">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="caption text-[var(--color-primary)] mb-3">Service & Garantie</p>
          <h2 className="heading-2">Ihr Vertrauen ist unser Antrieb</h2>
          <p className="body-large mt-2 max-w-2xl mx-auto">
            Profitieren Sie von erstklassigem Service und Garantie
          </p>
        </div>

        {/* Guarantees Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {guarantees.map((guarantee, i) => {
            const Icon = guarantee.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 border border-[var(--color-border-light)] hover:shadow-lg hover:border-[var(--color-primary)]/15 transition-all duration-300 group animate-fade-in-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className={`w-10 h-10 rounded-lg ${guarantee.bgColor} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300`}>
                  <Icon className={`w-5 h-5 ${guarantee.color}`} />
                </div>
                <h3 className="font-bold text-sm text-[var(--color-text-primary)] mb-1">
                  {guarantee.title}
                </h3>
                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                  {guarantee.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Stats Bar */}
        <div className="bg-[var(--color-primary)] rounded-2xl p-6 md:p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl md:text-3xl font-extrabold text-white mb-1">
                  {stat.number}
                </p>
                <p className="text-xs text-white/70 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
