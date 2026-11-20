import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getInitials } from "@/lib/html";
import MobileHorizontalScroll from "@/components/ui/MobileHorizontalScroll";

interface Testimonial {
  id: string;
  name: string;
  location: string | null;
  rating: number;
  content: string;
  product: string | null;
  avatar: string | null;
}

async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isApproved: true },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      take: 6,
    });

    if (testimonials.length === 0) return [];

    return testimonials.map((t) => ({
      id: t.id,
      name: t.name,
      location: t.location,
      rating: t.rating,
      content: t.content,
      product: t.product,
      avatar: t.avatar,
    }));
  } catch {
    return [];
  }
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} von 5 Sternen`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${i < rating ? "text-[var(--color-star-filled)]" : "text-[var(--color-star-empty)]"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

const avatarColors = [
  "from-[var(--color-primary)] to-[var(--color-primary-dark)]",
  "from-[var(--color-accent)] to-[var(--color-accent-dark,#c43d0a)]",
  "from-[var(--color-success)] to-emerald-700",
  "from-[var(--color-info)] to-blue-700",
  "from-rose-500 to-pink-700",
  "from-amber-500 to-orange-700",
];

export default async function TestimonialsSection() {
  const testimonials = await getTestimonials();

  if (testimonials.length === 0) return null;

  return (
    <section className="section-py" aria-label="Kundenstimmen">
      <div className="container-hausaura">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <p className="caption text-[var(--color-accent)] mb-3">Vertrauen</p>
          <h2 className="heading-2 mb-3">
            Was unsere <span className="text-[var(--color-accent)]">Kunden</span> sagen
          </h2>
          <p className="body-large max-w-2xl mx-auto mb-3">
            Echte Rückmeldungen von Kundinnen und Kunden
          </p>
        </div>

        {/* Mobile: centered scroll */}
        <div className="sm:hidden -mx-5 overflow-hidden">
          <MobileHorizontalScroll autoScrollInterval={8000} label="Kundenstimmen — horizontal scrollen">
            {testimonials.map((t) => (
              <div key={t.id} className="shrink-0 w-[280px]">
                <TestimonialCard testimonial={t} />
              </div>
            ))}
          </MobileHorizontalScroll>
        </div>

        {/* Desktop: grid */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.id} testimonial={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial, index }: { testimonial: Testimonial; index?: number }) {
  return (
    <div
      className="group bg-white rounded-2xl p-5 sm:p-6 border border-[var(--color-border-light)] hover:border-[var(--color-primary)]/15 hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] transition-all duration-300 relative"
      style={index !== undefined ? { animationDelay: `${index * 80}ms` } : undefined}
    >
      {/* Stars */}
      <div className="mb-3">
        <Stars rating={testimonial.rating} />
      </div>

      {/* Quote */}
      <blockquote className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4 line-clamp-4">
        &ldquo;{testimonial.content}&rdquo;
      </blockquote>

      {/* Product tag */}
      {testimonial.product && (
        <Link
          href={`/shop?q=${encodeURIComponent(testimonial.product)}`}
          className="inline-flex items-center px-2.5 py-1 mb-4 bg-[var(--color-bg-secondary)] rounded-md text-[11px] font-medium text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-colors"
        >
          {testimonial.product}
        </Link>
      )}

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-[var(--color-border-light)]">
        {testimonial.avatar ? (
          <Image
            src={testimonial.avatar}
            alt={testimonial.name}
            width={36}
            height={36}
            sizes="36px"
            className="w-9 h-9 rounded-full object-cover"
          />
        ) : (
          <div
            className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarColors[index !== undefined ? index % avatarColors.length : 0]} flex items-center justify-center text-white text-xs font-bold shadow-sm`}
          >
            {getInitials(testimonial.name)}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
            {testimonial.name}
          </p>
          {testimonial.location && (
            <p className="text-xs text-[var(--color-text-muted)] truncate">
              {testimonial.location}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
