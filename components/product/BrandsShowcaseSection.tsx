import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import MobileHorizontalScroll from "@/components/ui/MobileHorizontalScroll";
import { BRAND_COLORS } from "@/lib/brand-colors";

interface Brand {
  name: string;
  slug: string;
  logo: string;
  color: string;
  specialty: string;
}

interface BrandsShowcaseSectionProps {
  brands?: Brand[];
}

const defaultBrands: Brand[] = [
  { name: "Miele", slug: "miele", logo: "/images/brands/miele.svg", color: BRAND_COLORS.miele!, specialty: "Premium Haushaltsgeräte" },
  { name: "Bosch", slug: "bosch", logo: "/images/brands/bosch.svg", color: BRAND_COLORS.bosch!, specialty: "Technische Exzellenz" },
  { name: "Samsung", slug: "samsung", logo: "/images/brands/samsung.svg", color: BRAND_COLORS.samsung!, specialty: "Smart Home Pionier" },
  { name: "Dyson", slug: "dyson", logo: "/images/brands/dyson.svg", color: BRAND_COLORS.dyson!, specialty: "Innovative Technologie" },
  { name: "KitchenAid", slug: "kitchenaid", logo: "/images/brands/kitchenaid.svg", color: BRAND_COLORS.kitchenaid!, specialty: "Küchenklassiker" },
  { name: "Jura", slug: "jura", logo: "/images/brands/jura.svg", color: BRAND_COLORS.jura!, specialty: "Premium Kaffee" },
  { name: "DeLonghi", slug: "delonghi", logo: "/images/brands/delonghi.svg", color: BRAND_COLORS["de'longhi"]!, specialty: "Kaffee & Küche" },
  { name: "Siemens", slug: "siemens", logo: "/images/brands/siemens.svg", color: BRAND_COLORS.siemens!, specialty: "Smart Geräte" },
];

export default function BrandsShowcaseSection({ brands = defaultBrands }: BrandsShowcaseSectionProps) {
  return (
    <section className="section-py bg-[var(--color-bg-secondary)]" aria-label="Unsere Marken">
      <div className="container-hausaura">
        {/* Header */}
        <div className="text-center mb-6 md:mb-10">
          <p className="caption text-[var(--color-primary)] mb-3">Marken</p>
          <h2 className="heading-2">Unsere Premium-Marken</h2>
          <p className="body-large mt-2">
            Die führenden Hersteller für Haushaltsgeräte
          </p>
        </div>

        {/* Mobile: logo cloud scroll */}
        <div className="sm:hidden -mx-5 px-5 bg-gradient-to-b from-[var(--color-bg-secondary)] to-white py-6 -mt-6">
          <MobileHorizontalScroll className="px-0" autoScrollInterval={7000}>
            {brands.map((brand) => (
              <Link
                key={brand.name}
                href={`/shop?brand=${encodeURIComponent(brand.slug)}`}
                className="snap-start shrink-0 w-[140px] block"
              >
                <div className="bg-white rounded-xl p-4 border border-[var(--color-border-light)] flex flex-col items-center gap-2 hover:border-[var(--color-primary)]/30 hover:shadow-sm transition-[border-color,box-shadow] duration-300 group">
                  <div className="w-14 h-14 rounded-xl bg-[var(--color-bg-secondary)] flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
                    {brand.logo ? (
                      <Image src={brand.logo} alt={brand.name} width={40} height={40} sizes="56px" className="w-10 h-10 object-contain" />
                    ) : (
                      <span className="text-lg font-bold text-[var(--color-text-muted)]">{brand.name.charAt(0)}</span>
                    )}
                  </div>
                   <p className="text-xs font-semibold text-[var(--color-text-primary)] text-center leading-tight">{brand.name}</p>
                </div>
              </Link>
            ))}
          </MobileHorizontalScroll>
        </div>
        {/* Desktop: grid */}
        <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {brands.map((brand, i) => (
            <Link
              key={brand.name}
              href={`/shop?brand=${encodeURIComponent(brand.slug)}`}
              className="group bg-white rounded-xl p-5 border border-[var(--color-border-light)] hover:border-[var(--color-primary)]/20 hover:shadow-md active:scale-[0.98] transition-colors transition-shadow transition-transform duration-300 text-center animate-fade-in-up"
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
              <p className="text-xs text-[var(--color-text-muted)]">{brand.specialty}</p>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-[var(--color-border)] rounded-xl text-sm font-semibold text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors duration-300"
          >
            Alle Marken entdecken
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
