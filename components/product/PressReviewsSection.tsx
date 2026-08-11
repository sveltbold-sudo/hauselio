import Link from "next/link";
import { Star, Award, ExternalLink, Quote } from "lucide-react";

const pressReviews = [
  {
    publication: "Stiftung Warentest",
    logo: "🏆",
    rating: "GUT (1.8)",
    headline: "Testsieger Kaffeevollautomaten 2024",
    excerpt: "Der De'Longhi Magnifica Evo überzeugt in der Gesamtbewertung mit erstklassiger Kaffeequalität und einfachster Bedienung.",
    category: "Kaffeevollautomaten",
    product: "De'Longhi Magnifica Evo",
    color: "border-l-blue-500",
  },
  {
    publication: "CHIP",
    logo: "⭐",
    rating: "SEHR GUT",
    headline: "Bester Kabelloser Staubsauger",
    excerpt: "Der Dyson V15 Detect setzt neue Maßstäbe mit seiner Laser-Technologie und herausragender Saugleistung.",
    category: "Staubsauger",
    product: "Dyson V15 Detect",
    color: "border-l-amber-500",
  },
  {
    publication: "Computer Bild",
    logo: "💻",
    rating: "GUT (1.9)",
    headline: "Smart Home integration",
    excerpt: "Bosch Geschirrspüler überzeugen mit nahtlosem Home Connect Integration und energieeffizienter Technologie.",
    category: "Geschirrspüler",
    product: "Bosch Serie 6",
    color: "border-l-green-500",
  },
  {
    publication: "Focus Money",
    logo: "📊",
    rating: "KAUFEN",
    headline: "Preis-Leistungs-Sieger",
    excerpt: "KitchenAid Artisan bietet premium Qualität zu fairem Preis – ideal für ambitionierte Hobbykochs.",
    category: "Küchenmaschinen",
    product: "KitchenAid Artisan",
    color: "border-l-purple-500",
  },
];

const customerHighlights = [
  {
    name: "Thomas K.",
    location: "Berlin",
    rating: 5,
    text: "Ausgezeichneter Service! Das Gerät wurde pünktlich geliefert und professionell installiert.",
    product: "Miele Kühlschrank",
  },
  {
    name: "Sandra M.",
    location: "München",
    rating: 5,
    text: "Die Kaufberatung war hervorragend. Bin sehr zufrieden mit meinem neuen Kaffeevollautomaten.",
    product: "Jura E8",
  },
  {
    name: "Michael R.",
    location: "Hamburg",
    rating: 5,
    text: "Schneller Versand und Top Qualität. Gerne wieder!",
    product: "Samsung Waschmaschine",
  },
];

export default function PressReviewsSection() {
  return (
    <section className="section-py bg-[var(--color-bg)]">
      <div className="container-hauselio">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="caption text-[var(--color-primary)] mb-3">Presse & Bewertungen</p>
          <h2 className="heading-2">Was die Experten sagen</h2>
          <p className="body-large mt-2">
            Von unabhängigen Instituten getestet und empfohlen
          </p>
        </div>

        {/* Press Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {pressReviews.map((review, i) => (
            <div
              key={i}
              className={`bg-white rounded-2xl p-6 border border-[var(--color-border-light)] border-l-4 ${review.color} hover:shadow-lg transition-all duration-500 animate-fade-in-up`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{review.logo}</span>
                  <div>
                    <p className="font-bold text-[var(--color-text-primary)]">
                      {review.publication}
                    </p>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--color-success-light)] text-[var(--color-success)] text-xs font-bold rounded-full">
                      <Award className="w-3 h-3" />
                      {review.rating}
                    </span>
                  </div>
                </div>
              </div>

              <h3 className="font-bold text-[var(--color-text-primary)] mb-2">
                {review.headline}
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">
                {review.excerpt}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border-light)]">
                <span className="text-xs font-medium text-[var(--color-text-muted)]">
                  {review.product}
                </span>
                <span className="text-xs font-bold text-[var(--color-primary)] uppercase">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {customerHighlights.map((review, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-[var(--color-border-light)] relative animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <Quote className="w-8 h-8 text-[var(--color-primary)]/20 absolute top-4 right-4" />
              
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    className={`w-4 h-4 ${
                      j < review.rating
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-200"
                    }`}
                  />
                ))}
              </div>

              <p className="text-sm text-[var(--color-text-secondary)] mb-4 leading-relaxed">
                &ldquo;{review.text}&rdquo;
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border-light)]">
                <div>
                  <p className="font-semibold text-sm text-[var(--color-text-primary)]">
                    {review.name}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {review.location}
                  </p>
                </div>
                <span className="text-xs font-medium text-[var(--color-text-muted)]">
                  {review.product}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/shop?sort=rating"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors"
          >
            Alle Bewertungen ansehen
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
