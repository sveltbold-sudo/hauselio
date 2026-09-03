import { Truck, Euro, Shield, CreditCard, Clock, Headphones } from "lucide-react";

const valueProps = [
  {
    icon: Truck,
    title: "Kostenloser Versand",
    description: "Ab 50€ Bestellwert",
    color: "text-[var(--color-primary)]",
  },
  {
    icon: Euro,
    title: "Bis zu 40% sparen",
    description: "Bis -500€ auf Geräte",
    color: "text-[var(--color-accent)]",
  },
  {
    icon: Shield,
    title: "Garantie bis 5 J.",
    description: "Kostenlos verlängern",
    color: "text-[var(--color-success)]",
  },
  {
    icon: CreditCard,
    title: "Sichere Zahlung",
    description: "Überweisung (Vorkasse)",
    color: "text-[var(--color-text-secondary)]",
  },
  {
    icon: Clock,
    title: "Schnelle Lieferung",
    description: "1-3 Werktage",
    color: "text-[var(--color-info)]",
  },
  {
    icon: Headphones,
    title: "Deutsche Beratung",
    description: "Telefonisch & E-Mail",
    color: "text-[var(--color-primary)]",
  },
];

export default function ValuePropsSection() {
  return (
    <section aria-label="Unsere Vorteile" className="section-py bg-[var(--color-bg-secondary)] border-b border-[var(--color-border-light)]">
      <div className="container-hausaura">
        <h2 className="sr-only">Ihre Vorteile bei HAUSAURA</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-3" role="list">
          {valueProps.map((prop, i) => {
            const Icon = prop.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-2.5 py-3 animate-fade-in-up"
                style={{ animationDelay: `${i * 50}ms` }}
                role="listitem"
              >
                <Icon className={`w-5 h-5 ${prop.color} shrink-0`} aria-hidden="true" />
                <div className="min-w-0">
                  <p className="font-bold text-xs text-[var(--color-text-primary)] leading-tight line-clamp-2">
                    {prop.title}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] leading-tight line-clamp-2">
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
