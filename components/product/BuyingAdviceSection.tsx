import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

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
  icon: string;
}

const buyingAdviceData: BuyingAdvice[] = [
  {
    category: "Kaffeevollautomaten",
    slug: "kaffeevollautomaten",
    title: "Der perfekte Kaffeevollautomat",
    subtitle: "So finden Sie Ihren idealen Begleiter für den täglichen Genuss",
    icon: "☕",
    tips: [
      "Bohnenbehälter mit mindestens 200ml Fassungsvermögen",
      "Integrierter Milchschaum für Cappuccino & Latte Macchiato",
      "Einfache Reinigung durch automatisches Spülprogramm",
      "Leistungsstarker Mahlwerk für gleichmäßige Kaffeemühle",
    ],
    recommendedProduct: {
      name: "De'Longhi Magnifica Evo",
      slug: "delonghi-magnifica-evo",
      price: 699,
      highlight: "Bester Preis-Leistungs-Testsieger 2024",
    },
  },
  {
    category: "Küchenmaschinen",
    slug: "kuechenmaschinen",
    title: "Küchenmaschine Ratgeber",
    subtitle: "Vom Teigkneten bis zum Mixen – die richtige Küchenmaschine",
    icon: "🥣",
    tips: [
      "Mindestens 1000W Motor für schwere Teige",
      "Große Schüssel (mindestens 5L) für große Mengen",
      "Metallgetriebe für Langlebigkeit und Leistung",
      "Umfangreiches Zubehör für verschiedene Aufgaben",
    ],
    recommendedProduct: {
      name: "KitchenAid Artisan Standmixer",
      slug: "kitchenaid-artisan",
      price: 449,
      highlight: "Premium-Qualität seit über 100 Jahren",
    },
  },
  {
    category: "Staubsauger",
    slug: "staubsauger",
    title: "Staubsauger-Kaufberatung",
    subtitle: "Kabelgebunden, kabellos oder roboter – was passt zu Ihnen?",
    icon: "🧹",
    tips: [
      "Akku-Laufzeit von mindestens 40 Minuten für mittelgroße Wohnungen",
      "HEPA-Filter für Allergiker besonders wichtig",
      "Bürstenwechselsystem für verschiedene Böden",
      "Geringes Gewicht für komfortables Saugen",
    ],
    recommendedProduct: {
      name: "Dyson V15 Detect",
      slug: "dyson-v15-detect",
      price: 649,
      highlight: "Laser-Technologie für unsichtbaren Staub",
    },
  },
  {
    category: "Geschirrspüler",
    slug: "geschirrspueler",
    title: "Geschirrspüler-Ratgeber",
    subtitle: "Energieeffizient und leise – die richtige Spülmaschine",
    icon: "🍽️",
    tips: [
      "Energieeffizienzklasse A oder besser spart Wasser und Strom",
      "3D-Steckkorb für flexible Beladung",
      "Zeitaufruf-Programm für schnelles Spülen",
      "Wasserschutz-System gegen Undichtigkeiten",
    ],
    recommendedProduct: {
      name: "Bosch Serie 6 SMV6ZCX49E",
      slug: "bosch-serie-6-geschirrspueler",
      price: 899,
      highlight: "Energielabel A mit Home Connect",
    },
  },
];

export default function BuyingAdviceSection() {
  return (
    <section className="section-py bg-white">
      <div className="container-hauselio">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="caption text-[var(--color-primary)] mb-3">Kaufberatung</p>
          <h2 className="heading-2">Experten-Tipps für den richtigen Kauf</h2>
          <p className="body-large mt-2">
            Unsere Kaufberater helfen Ihnen, das perfekte Gerät für Ihre Bedürfnisse zu finden
          </p>
        </div>

        {/* Advice Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {buyingAdviceData.map((advice) => (
            <div
              key={advice.slug}
              className="bg-[var(--color-bg)] rounded-2xl p-6 border border-[var(--color-border-light)] hover:border-[var(--color-primary)]/30 transition-all duration-500 group"
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-5">
                <span className="text-4xl">{advice.icon}</span>
                <div>
                  <h3 className="font-bold text-[var(--color-text-primary)] text-lg group-hover:text-[var(--color-primary)] transition-colors">
                    {advice.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-muted)] mt-1">
                    {advice.subtitle}
                  </p>
                </div>
              </div>

              {/* Tips */}
              <div className="space-y-3 mb-6">
                {advice.tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[var(--color-success-light)] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-[var(--color-success)]" />
                    </div>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      {tip}
                    </p>
                  </div>
                ))}
              </div>

              {/* Recommended Product */}
              <div className="bg-white rounded-xl p-4 border border-[var(--color-border-light)]">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] mb-2">
                  Empfehlung
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-[var(--color-text-primary)]">
                      {advice.recommendedProduct.name}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                      {advice.recommendedProduct.highlight}
                    </p>
                  </div>
                  <p className="font-bold text-[var(--color-primary)]">
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
                className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors group/link"
              >
                Alle {advice.category} ansehen
                <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
