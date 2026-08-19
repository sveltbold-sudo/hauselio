import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface Brand {
  name: string;
  logo: string;
  color: string;
  specialty: string;
}

interface BrandsShowcaseSectionProps {
  brands?: Brand[];
}

const defaultBrands: Brand[] = [
  { name: "Miele", logo: "/images/brands/miele.svg", color: "#c4001a", specialty: "Premium Haushaltsgeräte" },
  { name: "Bosch", logo: "/images/brands/bosch.svg", color: "#e30613", specialty: "Technische Exzellenz" },
  { name: "Samsung", logo: "/images/brands/samsung.svg", color: "#1428a0", specialty: "Smart Home Pionier" },
  { name: "Dyson", logo: "/images/brands/dyson.svg", color: "#cc0033", specialty: "Innovative Technologie" },
  { name: "KitchenAid", logo: "/images/brands/kitchenaid.svg", color: "#cc0000", specialty: "Küchenklassiker" },
  { name: "Jura", logo: "/images/brands/jura.svg", color: "#1a1a1a", specialty: "Premium Kaffee" },
  { name: "DeLonghi", logo: "/images/brands/delonghi.svg", color: "#003366", specialty: "Kaffee & Küche" },
  { name: "Siemens", logo: "/images/brands/siemens.svg", color: "#009999", specialty: "Smart Geräte" },
];

export default function BrandsShowcaseSection({ brands = defaultBrands }: BrandsShowcaseSectionProps) {
  return (
    <section className="section-py bg-[var(--color-bg-secondary)]">
      <div className="container-hauselio">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="caption text-[var(--color-primary)] mb-3">Marken</p>
          <h2 className="heading-2">Unsere Premium-Marken</h2>
          <p className="body-large mt-2">
            Die führenden Hersteller für Haushaltsgeräte
          </p>
        </div>

        {/* Brands Grid — compact 4-col like MediaMarkt */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {brands.map((brand, i) => (
            <Link
              key={brand.name}
              href={`/shop?brand=${encodeURIComponent(brand.name.toLowerCase())}`}
              className="group bg-white rounded-xl p-5 border border-[var(--color-border-light)] hover:border-[var(--color-primary)]/20 hover:shadow-md active:scale-[0.98] transition-all duration-300 text-center animate-fade-in-up"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div
                className="w-16 h-16 mx-auto mb-3 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 overflow-hidden"
                style={{ backgroundColor: `${brand.color}08` }}
              >
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <h3 className="font-bold text-sm text-[var(--color-text-primary)] mb-0.5 group-hover:text-[var(--color-primary)] transition-colors">
                {brand.name}
              </h3>
              <p className="text-[10px] text-[var(--color-text-muted)]">{brand.specialty}</p>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-[var(--color-border)] rounded-lg text-sm font-semibold text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-300"
          >
            Alle Marken entdecken
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
