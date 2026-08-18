import Link from "next/link";
import { ArrowRight, Check, Coffee, Utensils, SprayCan, UtensilsCrossed } from "lucide-react";

interface BuyingAdvice {
  category: string;
  slug: string;
  title: string;
  subtitle: string;
  tips: string[];
  recommendedProduct: {
    name: string;
    slug: string;
    price: number;
    highlight: string;
  };
  icon: React.ElementType;
}

const buyingAdviceData: BuyingAdvice[] = [
  {
    category: "Kaffeevollautomaten",
    slug: "kaffeevollautomaten",
    title: "Der perfekte Kaffeevollautomat",
    subtitle: "So finden Sie Ihren idealen Begleiter",
    icon: Coffee,
    tips: [
      "Bohnenbehälter mit mindestens 200ml",
      "Integrierter Milchschaum für Cappuccino",
      "Automatisches Spülprogramm",
      "Leistungsstarker Mahlwerk",
    ],
    recommendedProduct: {
      name: "De'Longhi Magnifica Evo",
      slug: "delonghi-magnifica-evo",
      price: 699,
      highlight: "Testsieger 2024",
    },
  },
  {
    category: "Küchenmaschinen",
    slug: "kuechenmaschinen",
    title: "Küchenmaschine Ratgeber",
    subtitle: "Vom Teigkneten bis zum Mixen",
    icon: Utensils,
    tips: [
      "Mindestens 1000W Motor",
      "Große Schüssel (mindestens 5L)",
      "Metallgetriebe für Langlebigkeit",
      "Umfangreiches Zubehör",
    ],
    recommendedProduct: {
      name: "KitchenAid Artisan Standmixer",
      slug: "kitchenaid-artisan",
      price: 449,
      highlight: "Premium seit 100+ Jahren",
    },
  },
  {
    category: "Staubsauger",
    slug: "staubsauger",
    title: "Staubsauger-Kaufberatung",
    subtitle: "Kabelgebunden, kabellos oder Roboter",
    icon: SprayCan,
    tips: [
      "Akku-Laufzeit min. 40 Minuten",
      "HEPA-Filter für Allergiker",
      "Bürstenwechselsystem",
      "Geringes Gewicht",
    ],
    recommendedProduct: {
      name: "Dyson V15 Detect",
      slug: "dyson-v15-detect",
      price: 649,
      highlight: "Laser-Technologie",
    },
  },
  {
    category: "Geschirrspüler",
    slug: "geschirrspueler",
    title: "Geschirrspüler-Ratgeber",
    subtitle: "Energieeffizient und leise",
    icon: UtensilsCrossed,
    tips: [
      "Energieeffizienzklasse A oder besser",
      "3D-Steckkorb für flexible Beladung",
      "Zeitaufruf-Programm",
      "Wasserschutz-System",
    ],
    recommendedProduct: {
      name: "Bosch Serie 6 SMV6ZCX49E",
      slug: "bosch-serie-6-geschirrspueler",
      price: 899,
      highlight: "Home Connect",
    },
  },
];

export default function BuyingAdviceSection() {
  return (
    <section className="section-py bg-white">
      <div className="container-hauselio">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="caption text-[var(--color-accent)] mb-3">Kaufberatung</p>
          <h2 className="heading-2">Experten-Tipps für den richtigen Kauf</h2>
          <p className="body-large mt-2">
            Unsere Kaufberater helfen Ihnen, das perfekte Gerät zu finden
          </p>
        </div>

        {/* Advice Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {buyingAdviceData.map((advice) => {
            const Icon = advice.icon;
            return (
              <div
                key={advice.slug}
                className="bg-[var(--color-bg-secondary)] rounded-2xl p-5 border border-[var(--color-border-light)] hover:border-[var(--color-primary)]/20 hover:shadow-md transition-all duration-300 group"
              >
                {/* Header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-primary-50)] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">
                      {advice.title}
                    </h3>
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                      {advice.subtitle}
                    </p>
                  </div>
                </div>

                {/* Tips */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {advice.tips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full bg-[var(--color-success-light)] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 text-[var(--color-success)]" />
                      </div>
                      <p className="text-[11px] text-[var(--color-text-secondary)] leading-tight">
                        {tip}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Recommended Product */}
                <div className="bg-white rounded-xl p-4 border border-[var(--color-border-light)]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent)] mb-2">
                    Empfehlung
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-xs text-[var(--color-text-primary)]">
                        {advice.recommendedProduct.name}
                      </p>
                      <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
                        {advice.recommendedProduct.highlight}
                      </p>
                    </div>
                    <p className="font-bold text-sm text-[var(--color-primary)]">
                      {new Intl.NumberFormat("de-DE", {
                        style: "currency",
                        currency: "EUR",
                      }).format(advice.recommendedProduct.price)}
                    </p>
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href={`/kategorie/${advice.slug}`}
                  className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors group/link"
                >
                  Alle {advice.category} ansehen
                  <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
