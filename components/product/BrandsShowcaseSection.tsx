import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const brands = [
  {
    name: "Miele",
    logo: "/images/brands/miele.svg",
    color: "#c4001a",
    specialty: "Premium Haushaltsgeräte",
  },
  {
    name: "Bosch",
    logo: "/images/brands/bosch.svg",
    color: "#e30613",
    specialty: "Technische Exzellenz",
  },
  {
    name: "Samsung",
    logo: "/images/brands/samsung.svg",
    color: "#1428a0",
    specialty: "Smart Home Pionier",
  },
  {
    name: "Dyson",
    logo: "/images/brands/dyson.svg",
    color: "#cc0033",
    specialty: "Innovative Technologie",
  },
  {
    name: "KitchenAid",
    logo: "/images/brands/kitchenaid.svg",
    color: "#cc0000",
    specialty: "Küchenklassiker",
  },
  {
    name: "Jura",
    logo: "/images/brands/jura.svg",
    color: "#1a1a1a",
    specialty: "Premium Kaffee",
  },
  {
    name: "DeLonghi",
    logo: "/images/brands/delonghi.svg",
    color: "#003366",
    specialty: "Kaffee & Küche",
  },
  {
    name: "Siemens",
    logo: "/images/brands/siemens.svg",
    color: "#009999",
    specialty: "Smart Geräte",
  },
];

export default function BrandsShowcaseSection() {
  return (
    <section className="section-py bg-[var(--color-bg)]">
      <div className="container-hauselio">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="caption text-[var(--color-primary)] mb-3">Marken</p>
          <h2 className="heading-2">Unsere Premium-Marken</h2>
          <p className="body-large mt-2">
            Entdecken Sie die führenden Hersteller für Haushaltsgeräte
          </p>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {brands.map((brand, i) => (
            <Link
              key={brand.name}
              href={`/shop?brand=${encodeURIComponent(brand.name.toLowerCase())}`}
              className="group bg-white rounded-2xl p-6 border border-[var(--color-border-light)] hover:border-[var(--color-primary)]/30 hover:shadow-lg transition-all duration-500 text-center animate-fade-in-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {/* Logo */}
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 overflow-hidden"
                style={{ backgroundColor: `${brand.color}10` }}
              >
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>

              <h3 className="font-bold text-[var(--color-text-primary)] mb-1 group-hover:text-[var(--color-primary)] transition-colors">
                {brand.name}
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">
                {brand.specialty}
              </p>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-[var(--color-border)] rounded-xl font-semibold text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-300"
          >
            Alle Marken entdecken
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Marquee Brand Logos */}
        <div className="mt-16 overflow-hidden">
          <div className="animate-marquee flex gap-12 items-center">
            {[...brands, ...brands].map((brand, i) => (
              <div
                key={i}
                className="flex-shrink-0 opacity-30 hover:opacity-100 transition-opacity duration-300"
              >
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={80}
                  height={40}
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
