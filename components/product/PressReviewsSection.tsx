import Link from "next/link";
import { Star, Award, ExternalLink } from "lucide-react";

const pressReviews = [
  {
    publication: "Stiftung Warentest",
    logoText: "STIFTUNG WARENTEST",
    rating: "GUT (1,8)",
    headline: "Testsieger Kaffeevollautomaten 2024",
    excerpt: "Der De'Longhi Magnifica Evo überzeugt in der Gesamtbewertung mit erstklassiger Kaffeequalität und einfachster Bedienung.",
    category: "Kaffeevollautomaten",
    product: "De'Longhi Magnifica Evo",
    borderColor: "border-l-[var(--color-info)]",
  },
  {
    publication: "CHIP",
    logoText: "CHIP",
    rating: "SEHR GUT",
    headline: "Bester Kabelloser Staubsauger",
    excerpt: "Der Dyson V15 Detect setzt neue Maßstäbe mit seiner Laser-Technologie und herausragender Saugleistung.",
    category: "Staubsauger",
    product: "Dyson V15 Detect",
    borderColor: "border-l-[var(--color-accent)]",
  },
  {
    publication: "Computer BILD",
    logoText: "COMPUTER BILD",
    rating: "GUT (1,9)",
    headline: "Smart Home Integration",
    excerpt: "Bosch Geschirrspüler überzeugen mit nahtlosem Home Connect Integration und energieeffizienter Technologie.",
    category: "Geschirrspüler",
    product: "Bosch Serie 6",
    borderColor: "border-l-[var(--color-success)]",
  },
  {
    publication: "Focus Money",
    logoText: "FOCUS MONEY",
    rating: "KAUFEN",
    headline: "Preis-Leistungs-Sieger",
    excerpt: "KitchenAid Artisan bietet premium Qualität zu fairem Preis – ideal für ambitionierte Hobbyköche.",
    category: "Küchenmaschinen",
    product: "KitchenAid Artisan",
    borderColor: "border-l-purple-500",
  },
];

const customerHighlights = [
  {
    name: "Thomas K.",
    location: "Berlin",
    rating: 5,
    text: "Ausgezeichneter Service! Das Gerät wurde pünktlich geliefert und professionell installiert.",
    product: "Miele Kühlschrank",
    verified: true,
  },
  {
    name: "Sandra M.",
    location: "München",
    rating: 5,
    text: "Die Kaufberatung war hervorragend. Bin sehr zufrieden mit meinem neuen Kaffeevollautomaten.",
    product: "Jura E8",
    verified: true,
  },
  {
    name: "Michael R.",
    location: "Hamburg",
    rating: 5,
    text: "Schneller Versand und Top Qualität. Gerne wieder!",
    product: "Samsung Waschmaschine",
    verified: true,
  },
];

export default function PressReviewsSection() {
  return (
    <section className="section-py bg-[var(--color-bg-secondary)]">
      <div className="container-hauselio">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="caption text-[var(--color-accent)] mb-3">Presse & Bewertungen</p>
          <h2 className="heading-2">Was die Experten sagen</h2>
          <p className="body-large mt-2">
            Von unabhängigen Instituten getestet und empfohlen
          </p>
        </div>

        {/* Press Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
          {pressReviews.map((review, i) => (
            <div
              key={i}
              className={`bg-white rounded-2xl p-5 border border-[var(--color-border-light)] border-l-4 ${review.borderColor} hover:shadow-lg transition-all duration-300 animate-fade-in-up`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {/* Logo placeholder as text */}
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-wider leading-tight text-center">
                      {review.logoText}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[var(--color-text-primary)]">
                      {review.publication}
                    </p>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--color-success-light)] text-[var(--color-success)] text-[10px] font-bold rounded-full">
                      <Award className="w-2.5 h-2.5" />
                      {review.rating}
                    </span>
                  </div>
                </div>
              </div>

              <h3 className="font-bold text-sm text-[var(--color-text-primary)] mb-2">
                {review.headline}
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-4">
                {review.excerpt}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border-light)]">
                <span className="text-[11px] font-medium text-[var(--color-text-muted)]">
                  {review.product}
                </span>
                <span className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-wider">
                  {review.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Customer Highlights */}
        <div className="text-center mb-8">
          <h3 className="heading-3">Das sagen unsere Kunden</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {customerHighlights.map((review, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 border border-[var(--color-border-light)] animate-fade-in-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    className={`w-3.5 h-3.5 ${
                      j < review.rating
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-200 fill-gray-200"
                    }`}
                  />
                ))}
              </div>

              <p className="text-sm text-[var(--color-text-secondary)] mb-4 leading-relaxed">
                &ldquo;{review.text}&rdquo;
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border-light)]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-primary-50)] flex items-center justify-center">
                    <span className="text-xs font-bold text-[var(--color-primary)]">
                      {review.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-[var(--color-text-primary)]">
                      {review.name}
                    </p>
                    <p className="text-[10px] text-[var(--color-text-muted)]">
                      {review.location}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-medium text-[var(--color-text-muted)] block">
                    {review.product}
                  </span>
                  {review.verified && (
                    <span className="text-[9px] font-bold text-[var(--color-success)]">
                      ✓ Verifizierter Kauf
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link
            href="/shop?sort=rating"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
          >
            Alle Bewertungen ansehen
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
