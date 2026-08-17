import { Truck, Euro, Shield, CreditCard, Gift, Clock } from "lucide-react";

const valueProps = [
  {
    icon: Truck,
    title: "Kostenloser Versand",
    description: "Auf alle Bestellungen ab 50€",
    metric: "Sparen Sie bis zu 12,99€",
    color: "text-[var(--color-primary)]",
    bgColor: "bg-[var(--color-primary-50)]",
    highlight: true,
  },
  {
    icon: Euro,
    title: "Bis zu 40% sparen",
    description: "Auf ausgewählte Markengeräte",
    metric: "Durchschnittlich 180€ Ersparnis",
    color: "text-[var(--color-success)]",
    bgColor: "bg-[var(--color-success-light)]",
    highlight: true,
  },
  {
    icon: Shield,
    title: "Garantie-Plus",
    description: "Kostenlose Garantieverlängerung",
    metric: "Bis zu 5 Jahre Garantie",
    color: "text-[var(--color-primary)]",
    bgColor: "bg-[var(--color-primary-50)]",
    highlight: false,
  },
  {
    icon: CreditCard,
    title: "Sichere Zahlung",
    description: "SEPA-Überweisung auf Rechnung",
    metric: "Keine Vorkasse nötig",
    color: "text-[var(--color-text-secondary)]",
    bgColor: "bg-gray-100",
    highlight: false,
  },
  {
    icon: Gift,
    title: "Gratis-Geschenk",
    description: "Zubehör-Wert bis 99€ gratis",
    metric: "Bei ausgewählten Geräten",
    color: "text-[var(--color-success)]",
    bgColor: "bg-[var(--color-success-light)]",
    highlight: false,
  },
  {
    icon: Clock,
    title: "Schnelle Lieferung",
    description: "In 1-3 Werktagen bei Ihnen",
    metric: "Express-Lieferung verfügbar",
    color: "text-[var(--color-primary)]",
    bgColor: "bg-[var(--color-primary-50)]",
    highlight: false,
  },
];

export default function ValuePropsSection() {
  return (
    <section className="py-12 bg-white border-y border-[var(--color-border-light)]">
      <div className="container-hauselio">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {valueProps.map((prop, i) => {
            const Icon = prop.icon;
            return (
              <div
                key={i}
                className={`text-center p-4 rounded-2xl transition-all duration-500 ${
                  prop.highlight
                    ? "bg-[var(--color-primary-50)] border border-[var(--color-primary)]/20"
                    : "hover:bg-gray-50"
                } animate-fade-in-up`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className={`w-12 h-12 rounded-xl ${prop.bgColor} flex items-center justify-center mx-auto mb-3`}>
                  <Icon className={`w-6 h-6 ${prop.color}`} />
                </div>
                <h3 className="font-bold text-sm text-[var(--color-text-primary)] mb-1">
                  {prop.title}
                </h3>
                <p className="text-xs text-[var(--color-text-muted)] mb-2">
                  {prop.description}
                </p>
                <p className={`text-xs font-bold ${prop.highlight ? prop.color : "text-[var(--color-text-secondary)]"}`}>
                  {prop.metric}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
