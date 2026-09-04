import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";
import MobileHorizontalScroll from "@/components/ui/MobileHorizontalScroll";

interface PressReview {
  publication: string;
  logoText: string;
  rating: string;
  headline: string;
  excerpt: string;
  category: string;
  product: string;
  accentColor: string;
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
    accentColor: "var(--color-info)",
  },
  {
    publication: "CHIP",
    logoText: "CHIP",
    rating: "SEHR GUT",
    headline: "Bester Kabelloser Staubsauger",
    excerpt: "Der Dyson V15 Detect setzt neue Maßstäbe mit Laser-Technologie und herausragender Saugleistung.",
    category: "Staubsauger",
    product: "Dyson V15 Detect",
    accentColor: "var(--color-accent)",
  },
  {
    publication: "Computer BILD",
    logoText: "COMPUTER\nBILD",
    rating: "GUT (1,9)",
    headline: "Smart Home Integration",
    excerpt: "Bosch Geschirrspüler überzeugen mit nahtlosem Home Connect und energieeffizienter Technologie.",
    category: "Geschirrspüler",
    product: "Bosch Serie 6",
    accentColor: "var(--color-success)",
  },
  {
    publication: "Focus Money",
    logoText: "FOCUS\nMONEY",
    rating: "KAUFEN",
    headline: "Preis-Leistungs-Sieger",
    excerpt: "KitchenAid Artisan bietet premium Qualität zu fairem Preis – ideal für ambitionierte Hobbyköche.",
    category: "Küchenmaschinen",
    product: "KitchenAid Artisan",
    accentColor: "var(--color-primary)",
  },
];

interface PressReviewsSectionProps {
  pressReviews?: PressReview[];
}

function PublicationLogo({ logoText, accentColor }: { logoText: string; accentColor: string }) {
  const lines = logoText.split("\n");
  return (
    <div
      className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 relative overflow-hidden"
      style={{ backgroundColor: `color-mix(in srgb, ${accentColor} 8%, white)` }}
    >
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 2px, ${accentColor} 1px, ${accentColor} 1px 3px)`,
        }}
      />
      <span
        className="text-[9px] font-black uppercase tracking-wider leading-[1.15] text-center whitespace-pre-line relative z-10"
        style={{ color: accentColor }}
      >
        {logoText}
      </span>
    </div>
  );
}

function ReviewCard({ review, index }: { review: PressReview; index: number }) {
  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden border border-[var(--color-border-light)] hover:border-transparent hover:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] transition-all duration-500 animate-fade-in-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Top accent line */}
      <div className="h-[3px] w-full" style={{ background: `linear-gradient(90deg, ${review.accentColor}, color-mix(in srgb, ${review.accentColor} 40%, transparent))` }} />

      <div className="p-5 sm:p-6">
        {/* Header: Logo + Rating */}
        <div className="flex items-start justify-between mb-4">
          <PublicationLogo logoText={review.logoText} accentColor={review.accentColor} />
          <div
            className="px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide"
            style={{
              backgroundColor: `color-mix(in srgb, ${review.accentColor} 10%, white)`,
              color: review.accentColor,
            }}
          >
            {review.rating}
          </div>
        </div>

        {/* Headline */}
        <h3 className="text-base font-bold text-[var(--color-text-primary)] mb-2 leading-snug">
          {review.headline}
        </h3>

        {/* Excerpt with quote mark */}
        <div className="relative mb-4">
          <Quote
            className="absolute -top-1 -left-0.5 w-4 h-4 opacity-15"
            style={{ color: review.accentColor }}
            aria-hidden="true"
          />
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed pl-4">
            {review.excerpt}
          </p>
        </div>

        {/* Footer: Product + Category */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border-light)]">
          <span className="text-sm font-semibold text-[var(--color-text-primary)]">
            {review.product}
          </span>
          <span
            className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md"
            style={{
              backgroundColor: `color-mix(in srgb, ${review.accentColor} 6%, white)`,
              color: `color-mix(in srgb, ${review.accentColor} 70%, var(--color-text-muted))`,
            }}
          >
            {review.category}
          </span>
        </div>
      </div>
    </div>
  );
}

function ReviewCardMobile({ review }: { review: PressReview }) {
  return (
    <div className="snap-start shrink-0 w-[280px]">
      <div className="bg-white rounded-2xl overflow-hidden border border-[var(--color-border-light)] h-full">
        {/* Accent top */}
        <div className="h-[3px] w-full" style={{ background: `linear-gradient(90deg, ${review.accentColor}, color-mix(in srgb, ${review.accentColor} 40%, transparent))` }} />

        <div className="p-5">
          {/* Logo + Rating row */}
          <div className="flex items-center justify-between mb-3">
            <PublicationLogo logoText={review.logoText} accentColor={review.accentColor} />
            <span
              className="px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide"
              style={{
                backgroundColor: `color-mix(in srgb, ${review.accentColor} 10%, white)`,
                color: review.accentColor,
              }}
            >
              {review.rating}
            </span>
          </div>

          {/* Headline */}
          <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-2 leading-snug">
            {review.headline}
          </h3>

          {/* Excerpt */}
          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-3 line-clamp-3">
            &ldquo;{review.excerpt}&rdquo;
          </p>

          {/* Product */}
          <div className="pt-3 border-t border-[var(--color-border-light)]">
            <span className="text-xs font-semibold text-[var(--color-text-primary)]">
              {review.product}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PressReviewsSection({
  pressReviews = defaultPressReviews,
}: PressReviewsSectionProps) {
  return (
    <section className="relative overflow-hidden" aria-label="Pressestimmen">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg-secondary)] via-white to-[var(--color-bg-secondary)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(var(--color-primary-rgb,59,130,246),0.03),transparent_70%)]" />

      <div className="relative section-py">
        <div className="container-hausaura">
          {/* Header */}
          <div className="text-center mb-10 md:mb-14">
            <p className="caption text-[var(--color-accent)] mb-3">Pressestimmen</p>
            <h2 className="heading-2 mb-3">
              Was die Experten <span className="text-[var(--color-accent)]">&</span> Kunden sagen
            </h2>
            <p className="body-large max-w-xl mx-auto">
              Von unabhängigen Instituten getestet, von Kunden geliebt
            </p>
          </div>

          {/* Mobile: horizontal scroll */}
          <div className="sm:hidden -mx-5 px-5">
            <MobileHorizontalScroll autoScrollInterval={7000}>
              {pressReviews.map((review, i) => (
                <ReviewCardMobile key={review.publication} review={review} />
              ))}
            </MobileHorizontalScroll>
          </div>

          {/* Desktop: 2x2 grid */}
          <div className="hidden sm:grid grid-cols-2 gap-5 lg:gap-6">
            {pressReviews.map((review, i) => (
              <ReviewCard key={review.publication} review={review} index={i} />
            ))}
          </div>

          {/* Disclaimer + CTA */}
          <div className="mt-8 md:mt-12 flex flex-col items-center gap-4">
            <p className="text-[10px] text-[var(--color-text-muted)] text-center max-w-md">
              Redaktionelle Zusammenstellung — Quellen siehe einzelne Bewertungen
            </p>
            <Link
              href="/shop?sort=rating"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors group"
            >
              Alle Bewertungen ansehen
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
