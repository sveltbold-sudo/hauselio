import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import StarRating from "@/components/ui/StarRating";
import { Quote } from "lucide-react";
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

const fallbackTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "Stefan M.",
    location: "Berlin",
    rating: 5,
    content: "Hervorragende Beratung und blitzschnelle Lieferung. Der Jura E8 Kaffeevollautomat funktioniert einwandfrei. Kann HAUSAURA nur empfehlen!",
    product: "Jura E8 Platinum",
    avatar: null,
  },
  {
    id: "2",
    name: "Anna K.",
    location: "München",
    rating: 4,
    content: "Die Miele Waschmaschine wurde problemlos geliefert. Das Gerät läuft super. Einziger Kritikpunkt: Lieferung dauerte 3 statt 2 Tage.",
    product: "Miele W1 Waschmaschine",
    avatar: null,
  },
  {
    id: "3",
    name: "Thomas B.",
    location: "Hamburg",
    rating: 5,
    content: "Sehr kompetenter Kundendienst. Hatte eine Frage zur Installation und wurde sofort freundlich beraten. Top Service!",
    product: null,
    avatar: null,
  },
  {
    id: "4",
    name: "Julia H.",
    location: "Köln",
    rating: 4,
    content: "Die KitchenAid Artisan kommt genau wie beschrieben. Preis war ok, Versand schnell. Gerne wieder!",
    product: "KitchenAid Artisan",
    avatar: null,
  },
];

async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isApproved: true },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      take: 6,
    });

    if (testimonials.length === 0) return fallbackTestimonials;

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
    return fallbackTestimonials;
  }
}

import { getInitials } from "@/lib/html";

const avatarColors = [
  "bg-[var(--color-primary)]",
  "bg-[var(--color-accent)]",
  "bg-[var(--color-success)]",
  "bg-[var(--color-info)]",
  "bg-[var(--color-info)]",
  "bg-[var(--color-accent)]",
];

export default async function TestimonialsSection() {
  const testimonials = await getTestimonials();

  return (
    <section className="section-py" aria-label="Kundenstimmen">
      <div className="container-HAUSAURA">
        {/* Header */}
        <div className="text-center mb-6 md:mb-10">
          <p className="caption text-[var(--color-accent)] mb-3">Kundenstimmen</p>
          <h2 className="heading-2 mb-3">Stimmen aus unserem Kundenkreis</h2>
          <p className="body-large max-w-2xl mx-auto">
            Echte Bewertungen von zufriedenen HAUSAURA Kunden
          </p>
        </div>

        {/* Mobile: editorial quote scroll */}
        <div className="sm:hidden -mx-5 px-5 bg-gradient-to-br from-[var(--color-primary-50)] via-white to-[var(--color-accent)]/5 py-6 -mt-6">
          <MobileHorizontalScroll className="px-0" autoScrollInterval={7000}>
            {testimonials.map((t) => (
              <div key={t.id} className="snap-start shrink-0 w-[300px]">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-[var(--color-border-light)] relative overflow-hidden hover:shadow-md transition-shadow duration-300">
                  {/* Quote mark */}
                  <div className="absolute top-3 right-4 text-6xl font-serif text-[var(--color-primary)]/10 leading-none select-none">&quot;</div>
                  {/* Stars */}
                  <div className="flex items-center gap-0.5 mb-3" aria-label={`${t.rating} von 5 Sternen`}>
                    {Array.from({ length: 5 }).map((_, si) => (
                      <svg key={si} className={`w-4 h-4 ${si < t.rating ? "text-[var(--color-star-filled)]" : "text-[var(--color-star-empty)]"}`} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4 line-clamp-4 relative z-10">
                    &ldquo;{t.content}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-3 border-t border-[var(--color-border-light)]">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white text-xs font-bold">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[var(--color-text-primary)]">{t.name}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{t.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </MobileHorizontalScroll>
        </div>
        {/* Desktop: grid */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, i) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl p-6 border border-[var(--color-border-light)] hover:shadow-lg hover:border-[var(--color-primary)]/10 transition-colors transition-shadow duration-300 animate-fade-in-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <Quote className="w-8 h-8 text-[var(--color-primary)]/10 mb-4" />
              <div className="mb-3">
                <StarRating rating={testimonial.rating} size="sm" />
              </div>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">
                &ldquo;{testimonial.content}&rdquo;
              </p>
              {testimonial.product && (
                <div className="mb-4">
                  <Link href={`/shop?q=${encodeURIComponent(testimonial.product)}`} className="inline-block px-2.5 py-1 bg-[var(--color-bg-secondary)] rounded-md text-xs font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors">
                    {testimonial.product}
                  </Link>
                </div>
              )}
              <div className="flex items-center gap-3 pt-4 border-t border-[var(--color-border-light)]">
                {testimonial.avatar ? (
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={40}
                    height={40}
                    sizes="40px"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${avatarColors[i % avatarColors.length]}`}
                  >
                    {getInitials(testimonial.name)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                    {testimonial.name}
                  </p>
                  {testimonial.location && (
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {testimonial.location}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
