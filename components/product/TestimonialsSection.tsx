import Image from "next/image";
import { prisma } from "@/lib/prisma";
import StarRating from "@/components/ui/StarRating";
import { Quote } from "lucide-react";

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
    content: "Hervorragende Beratung und blitzschnelle Lieferung. Der Jura E8 Kaffeevollautomat funktioniert einwandfrei. Kann HAUSELIO nur empfehlen!",
    product: "Jura E8 Platinum",
    avatar: null,
  },
  {
    id: "2",
    name: "Anna K.",
    location: "München",
    rating: 5,
    content: "Der Miele Waschmaschine-Lieferung war problemlos. Das Gerät läuft super und der Preis war am günstigsten. Vielen Dank!",
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
    rating: 5,
    content: "Die KitchenAid Artisan kommt genau wie beschrieben. Der Versand war schnell und das Gerät ist wunderschön. Gerne wieder!",
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

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const avatarColors = [
  "bg-[var(--color-primary)]",
  "bg-[var(--color-accent)]",
  "bg-[var(--color-success)]",
  "bg-[var(--color-info)]",
  "bg-purple-500",
  "bg-pink-500",
];

export default async function TestimonialsSection() {
  const testimonials = await getTestimonials();

  return (
    <section className="section-py">
      <div className="container-hauselio">
        <div className="text-center mb-10">
          <p className="caption text-[var(--color-accent)] mb-3">Kundenstimmen</p>
          <h2 className="heading-2 mb-3">Was unsere Kunden sagen</h2>
          <p className="body-large max-w-2xl mx-auto">
            Echte Bewertungen von zufriedenen HAUSELIO Kunden
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl p-6 border border-[var(--color-border-light)] hover:shadow-lg hover:border-[var(--color-primary)]/10 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Quote icon */}
              <Quote className="w-8 h-8 text-[var(--color-primary)]/10 mb-4" />

              {/* Rating */}
              <div className="mb-3">
                <StarRating rating={testimonial.rating} size="sm" />
              </div>

              {/* Content */}
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Product tag */}
              {testimonial.product && (
                <div className="mb-4">
                  <span className="inline-block px-2.5 py-1 bg-[var(--color-bg-secondary)] rounded-md text-[10px] font-semibold text-[var(--color-text-muted)]">
                    {testimonial.product}
                  </span>
                </div>
              )}

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-[var(--color-border-light)]">
                {/* Avatar */}
                {testimonial.avatar ? (
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={40}
                    height={40}
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
                    <p className="text-[10px] text-[var(--color-text-muted)]">
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
