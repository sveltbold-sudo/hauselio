import Link from "next/link";
import { Award, ExternalLink } from "lucide-react";
import MobileHorizontalScroll from "@/components/ui/MobileHorizontalScroll";

interface PressReview {
  publication: string;
  logoText: string;
  rating: string;
  headline: string;
  excerpt: string;
  category: string;
  product: string;
  borderColor: string;
}

const defaultPressReviews: PressReview[] = [
  {
    publication: "Stiftung Warentest",
    logoText: "STIFTUNG\nWARENTEST",
    rating: "GUT (1,8)",
    headline: "Testsieger Kaffeevollautomaten 2025",
    excerpt: "Der De'Longhi Magnifica Evo überzeugt mit erstklassiger Kaffeequalität und einfachster Bedienung.",
    category: "Kaffeevollautomaten",
    product: "De'Longhi Magnifica Evo",
    borderColor: "border-l-[var(--color-info)]",
  },
  {
    publication: "CHIP",
    logoText: "CHIP",
    rating: "SEHR GUT",
    headline: "Bester Kabelloser Staubsauger",
    excerpt: "Der Dyson V15 Detect setzt neue Maßstäbe mit Laser-Technologie und herausragender Saugleistung.",
    category: "Staubsauger",
    product: "Dyson V15 Detect",
    borderColor: "border-l-[var(--color-accent)]",
  },
  {
    publication: "Computer BILD",
    logoText: "COMPUTER\nBILD",
    rating: "GUT (1,9)",
    headline: "Smart Home Integration",
    excerpt: "Bosch Geschirrspüler überzeugen mit nahtlosem Home Connect und energieeffizienter Technologie.",
    category: "Geschirrspüler",
    product: "Bosch Serie 6",
    borderColor: "border-l-[var(--color-success)]",
  },
  {
    publication: "Focus Money",
    logoText: "FOCUS\nMONEY",
    rating: "KAUFEN",
    headline: "Preis-Leistungs-Sieger",
    excerpt: "KitchenAid Artisan bietet premium Qualität zu fairem Preis – ideal für ambitionierte Hobbyköche.",
    category: "Küchenmaschinen",
    product: "KitchenAid Artisan",
    borderColor: "border-l-[var(--color-primary-light)]",
  },
];

interface PressReviewsSectionProps {
  pressReviews?: PressReview[];
}

export default function PressReviewsSection({
  pressReviews = defaultPressReviews,
}: PressReviewsSectionProps) {
  return (
    <section className="section-py bg-[var(--color-bg-secondary)]" aria-label="Pressestimmen">
      <div className="container-hausaura">
        {/* Header */}
        <div className="text-center mb-6 md:mb-10">
          <p className="caption text-[var(--color-accent)] mb-3">Vertrauen</p>
          <h2 className="heading-2">Was die Experten & Kunden sagen</h2>
          <p className="body-large mt-2">
            Von unabhängigen Instituten getestet, von Kunden geliebt
          </p>
        </div>
        <p className="text-center text-[10px] text-[var(--color-text-muted)] mb-6">Redaktionelle Zusammenstellung — Quellen siehe einzelne Bewertungen</p>

        {/* Mobile: magazine clipping scroll */}
        <div className="sm:hidden -mx-5 px-5 bg-gradient-to-br from-[var(--color-bg-secondary)] to-[var(--color-bg)] py-6 -mt-6 overflow-hidden">
          <MobileHorizontalScroll autoScrollInterval={7000}>
            {pressReviews.map((review) => (
              <div key={review.publication} className="snap-start shrink-0 w-[280px]">
                <div className="bg-white rounded-xl p-5 shadow-sm border border-[var(--color-border-light)] relative overflow-hidden hover:shadow-md transition-shadow duration-300">
                  <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiLz4KPC9zdmc+')]" />
                  <div className="flex items-center justify-between mb-3 relative z-10">
                    <div className="w-10 h-10 rounded-lg bg-[var(--color-bg-secondary)] flex items-center justify-center">
                      <span className="text-xs font-extrabold text-[var(--color-text-muted)] text-center leading-tight whitespace-pre-line">{review.logoText}</span>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 bg-[var(--color-success)]/10 text-[var(--color-success)] text-xs font-bold rounded-full">
                      {review.rating}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3 line-clamp-3 relative z-10">
                    &ldquo;{review.excerpt}&rdquo;
                  </p>
                  <div className="flex items-center gap-2 relative z-10">
                    <span className="text-xs font-semibold text-[var(--color-text-primary)]">{review.product}</span>
                  </div>
                </div>
              </div>
            ))}
          </MobileHorizontalScroll>
        </div>
        {/* Desktop: grid */}
        <div className="hidden sm:grid grid-cols-2 gap-4 mb-8 md:mb-14">
          {pressReviews.map((review, i) => (
            <div
              key={review.publication}
              className={`bg-white rounded-xl p-5 border border-[var(--color-border-light)] border-l-4 ${review.borderColor} hover:shadow-md transition-shadow duration-300 animate-fade-in-up`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-11 h-11 bg-[var(--color-bg-secondary)] rounded-lg flex items-center justify-center border border-[var(--color-border-light)] shrink-0">
                   <span className="text-xs font-extrabold text-[var(--color-text-muted)] uppercase tracking-wider leading-[1.1] text-center whitespace-pre-line">
                    {review.logoText}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-[var(--color-text-primary)]">
                    {review.publication}
                  </p>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--color-success-light)] text-[var(--color-success)] text-xs font-bold rounded-full">
                    <Award className="w-2.5 h-2.5" />
                    {review.rating}
                  </span>
                </div>
              </div>
              <h3 className="font-bold text-sm text-[var(--color-text-primary)] mb-1.5">
                {review.headline}
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-3">
                {review.excerpt}
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border-light)]">
                <span className="text-xs font-medium text-[var(--color-text-muted)]">
                  {review.product}
                </span>
                <span className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider">
                  {review.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 md:mb-14 text-center">
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
