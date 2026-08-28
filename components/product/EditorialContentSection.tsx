import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronRight } from "lucide-react";
import MobileHorizontalScroll from "@/components/ui/MobileHorizontalScroll";

interface EditorialItem {
  type: string;
  title: string;
  excerpt: string;
  href: string;
  readTime: string;
  category: string;
  image: string;
}

const defaultEditorialContent: EditorialItem[] = [
  {
    type: "Ratgeber",
    title: "Der ultimative Kaffee-Ratgeber",
    excerpt: "Von der Bohne bis zur Tasse – alles über die Zubereitung des perfekten Kaffees.",
    href: "/shop?category=kaffee",
    readTime: "8 Min.",
    category: "Kaffeevollautomaten",
    image: "/images/products/jura-e8-platinum/1.jpg",
  },
  {
    type: "Rezept",
    title: "Perfektes Brot backen mit der Küchenmaschine",
    excerpt: "Frisches Brot zum Frühstück – mit unseren Anleitungen gelingt es immer.",
    href: "/shop?category=kueche",
    readTime: "5 Min.",
    category: "Küchenmaschinen",
    image: "/images/products/kitchenaid-artisan-5ksm175pse/1.jpg",
  },
  {
    type: "Tipps",
    title: "Sparsam kochen: Energie sparen in der Küche",
    excerpt: "Mit den richtigen Geräten bis zu 30% Energie beim Kochen sparen.",
    href: "/shop?category=kueche",
    readTime: "6 Min.",
    category: "Ratgeber",
    image: "/images/products/thermomix-tm7/1.jpg",
  },
];

interface EditorialContentSectionProps {
  items?: EditorialItem[];
}

export default function EditorialContentSection({ items = defaultEditorialContent }: EditorialContentSectionProps) {
  return (
    <section className="section-py bg-white" aria-label="Magazin und Ratgeber">
      <div className="container-hauselio">
        {/* Header */}
        <div className="text-center mb-6 md:mb-10">
          <p className="caption text-[var(--color-accent)] mb-3">Magazin</p>
          <h2 className="heading-2">Ratgeber, Rezepte & mehr</h2>
          <p className="body-large mt-2">
            Entdecken Sie unsere Tipps für mehr Genuss und Komfort
          </p>
        </div>

        {/* Mobile: blog cards scroll */}
        <div className="sm:hidden -mx-5 px-5 bg-gradient-to-b from-[var(--color-bg-secondary)] to-white py-6 -mt-6">
          <MobileHorizontalScroll className="px-0" autoScrollInterval={7000}>
            {items.map((content, i) => (
              <div key={i} className="snap-start shrink-0 w-[280px]">
                <Link href={content.href} className="block bg-white rounded-xl overflow-hidden shadow-sm border border-[var(--color-border-light)] hover:shadow-md transition-shadow group">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image src={content.image} alt={content.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="260px" />
                    <span className="absolute top-3 left-3 inline-flex items-center px-2 py-0.5 bg-white/90 backdrop-blur-sm text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)] rounded-md">
                      {content.type}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-1.5 line-clamp-2 leading-snug">
                      {content.title}
                    </h3>
                    <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2 mb-3">
                      {content.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[var(--color-text-muted)]">{content.readTime}</span>
                      <span className="text-xs font-semibold text-[var(--color-primary)] flex items-center gap-1 group-hover:gap-2 transition-[gap]">
                        Weiterlesen
                        <ChevronRight className="w-3 h-3" aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </MobileHorizontalScroll>
        </div>
        {/* Desktop: grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((content, i) => (
            <Link
              key={i}
              href={content.href}
              className="group bg-white rounded-xl overflow-hidden border border-[var(--color-border-light)] hover:border-[var(--color-primary)]/20 hover:shadow-lg transition-colors transition-shadow duration-300 animate-fade-in-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="aspect-[16/10] bg-[var(--color-bg-secondary)] relative overflow-hidden">
                <Image
                  src={content.image}
                  alt={content.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 inline-flex items-center px-2.5 py-1 bg-white/95 backdrop-blur-sm rounded-md text-xs font-bold text-[var(--color-text-primary)]">
                  {content.type}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-sm text-[var(--color-text-primary)] mb-1.5 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                  {content.title}
                </h3>
                <p className="text-xs text-[var(--color-text-muted)] mb-3 line-clamp-2 leading-relaxed">
                  {content.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--color-text-muted)]">
                    {content.readTime} Lesezeit
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-primary)] group-hover:gap-1.5 transition-transform">
                    Weiterlesen
                    <ArrowRight className="w-3 h-3" aria-hidden="true" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
