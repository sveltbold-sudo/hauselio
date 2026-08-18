import { Truck, Euro, Shield, CreditCard, Clock, Headphones } from "lucide-react";

const valueProps = [
  {
    icon: Truck,
    title: "Kostenloser Versand",
    description: "Auf alle Bestellungen ab 50€",
    color: "text-[var(--color-primary)]",
    bgColor: "bg-[var(--color-primary-50)]",
  },
  {
    icon: Euro,
    title: "Bis zu 40% sparen",
    description: "Auf ausgewählte Markengeräte",
    color: "text-[var(--color-accent)]",
    bgColor: "bg-[var(--color-accent-light)]",
  },
  {
    icon: Shield,
    title: "Garantie bis 5 Jahre",
    description: "Kostenlose Garantieverlängerung",
    color: "text-[var(--color-success)]",
    bgColor: "bg-[var(--color-success-light)]",
  },
  {
    icon: CreditCard,
    title: "Sichere Zahlung",
    description: "SEPA-Überweisung auf Rechnung",
    color: "text-[var(--color-text-secondary)]",
    bgColor: "bg-gray-100",
  },
  {
    icon: Clock,
    title: "Schnelle Lieferung",
    description: "In 1-3 Werktagen bei Ihnen",
    color: "text-[var(--color-info)]",
    bgColor: "bg-[var(--color-info-light)]",
  },
  {
    icon: Headphones,
    title: "Deutsche Beratung",
    description: "Persönlich, telefonisch, per E-Mail",
    color: "text-[var(--color-primary)]",
    bgColor: "bg-[var(--color-primary-50)]",
  },
];

export default function ValuePropsSection() {
  return (
    <section aria-label="Unsere Vorteile" className="py-5 bg-white border-b border-[var(--color-border-light)]">
      <div className="container-hauselio">
        <h2 className="sr-only">Ihre Vorteile bei HAUSELIO</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {valueProps.map((prop, i) => {
            const Icon = prop.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--color-bg-secondary)] transition-colors duration-200 animate-fade-in-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className={`w-10 h-10 rounded-lg ${prop.bgColor} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-5 h-5 ${prop.color}`} />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-[var(--color-text-primary)] leading-tight">
                    {prop.title}
                  </h3>
                  <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5 leading-tight">
                    {prop.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
