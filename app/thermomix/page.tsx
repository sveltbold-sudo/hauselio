import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { SITE_URL, SITE_NAME } from "@/lib/constants";
import { Shield, Truck, RotateCcw, Star, ChevronRight, Check } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

export const revalidate = 300;

const THERMOMIX_SLUGS = ["thermomix-tm7", "thermomix-tm6", "vorwerk-thermomix-tm5"];

export const metadata: Metadata = {
  title: "Thermomix kaufen — TM7, TM6 & Zubehör | HAUSAURA",
  description:
    "Thermomix zum Bestpreis kaufen. TM7, TM6 & Zubehör. Kostenloser Versand, 2 Jahre Gewährleistung, 30 Tage Rückgaberecht. Unabhängiger Online-Händler.",
  alternates: { canonical: `${SITE_URL}/thermomix` },
  openGraph: {
    title: "Thermomix kaufen — Bestpreis bei HAUSAURA",
    description: "Thermomix TM7, TM6 & Zubehör zum Bestpreis. Kostenloser Versand. 2 Jahre Garantie.",
    url: `${SITE_URL}/thermomix`,
    siteName: SITE_NAME,
    locale: "de_DE",
    type: "website",
    images: [{ url: `${SITE_URL}/logos/logoprincipale.png`, width: 1200, height: 630, alt: "Thermomix bei HAUSAURA kaufen" }],
  },
};

async function getThermomixProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { slug: { in: THERMOMIX_SLUGS } },
      select: {
        id: true, name: true, slug: true, price: true, originalPrice: true,
        rating: true, reviewCount: true, isNew: true, isPromo: true,
        brand: { select: { name: true } },
        images: { select: { url: true }, take: 1, orderBy: { position: "asc" as const } },
      },
    });
    return THERMOMIX_SLUGS.map((slug) => products.find((p) => p.slug === slug))
      .filter((p): p is NonNullable<typeof p> => p != null)
      .map((p) => ({
        id: p.id, name: p.name, slug: p.slug,
        price: Number(p.price), originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
        image: p.images[0]?.url || "/images/placeholder-product.svg",
        rating: Number(p.rating), reviewCount: p.reviewCount,
        isNew: p.isNew, isPromo: p.isPromo, brand: p.brand?.name || null,
      }));
  } catch { return []; }
}

const usps = [
  { icon: Truck, label: "Kostenloser Versand", desc: "Ab 50€ — auch bei Thermomix" },
  { icon: Shield, label: "2 Jahre Gewährleistung", desc: "Gesetzliche Gewährleistung auf Neugeräte" },
  { icon: RotateCcw, label: "30 Tage Rückgabe", desc: "Risikolos bestellen & testen" },
  { icon: Star, label: "4,4/5 Bewertung", desc: "Über 470 verifizierte Bewertungen" },
];

const features = [
  "Über 80 Kochfunktionen — kochen, dünsten, braten, mixen, wiegen",
  "Varoma-Dampfgaren für gesunde Ernährung",
  "Integrierte Waage mit 0,1g Genauigkeit",
  "Rezeptbuch mit tausenden Rezepten",
  "Thermomix Friend Kompatibel (TM6 & TM7)",
  "Fernsteuerung per Thermomix App",
];

const faqs = [
  { q: "Was kostet ein Thermomix bei HAUSAURA?", a: "Der Thermomix TM7 ist ab 1.295€ bei uns erhältlich. Der TM6 ist ab 1.133€ verfügbar. Alle Preise sind inklusive MwSt. und der Versand ist kostenlos." },
  { q: "Bekomme ich eine Garantie?", a: "Ja, auf alle Thermomix-Neugeräte gilt die gesetzliche 2 Jahre Gewährleistung." },
  { q: "Kann ich den Thermomix zurückgeben?", a: "Ja, Sie haben 30 Tage Rückgaberecht. Das Gerät muss in der Originalverpackung sein." },
  { q: "Unterschied TM7 vs TM6?", a: "Der TM7 bietet mehr Leistung (1800W), ein größeres Display und zusätzliche Funktionen. Der TM6 bleibt ein exzellenter Allrounder zum besseren Preis." },
];

export default async function ThermomixPage() {
  const products = await getThermomixProducts();

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Startseite", url: SITE_URL },
        { name: "Thermomix", url: `${SITE_URL}/thermomix` },
      ]} />

      <main id="main-content">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[var(--color-bg)] via-white to-[var(--color-bg-secondary)]">
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 70% 20%, rgba(232,120,5,0.06), transparent 60%)" }} />
          <div className="relative container-hausaura py-12 md:py-20">
            <div className="max-w-3xl">
              <p className="caption text-[var(--color-accent)] mb-3">Original Thermomix-Neugeräte</p>
              <h1 className="heading-1 mb-4">
                Thermomix <span className="text-[var(--color-accent)]">kaufen</span>
              </h1>
              <p className="body-large mb-6 max-w-xl">
                Entdecken Sie den Thermomix bei HAUSAURA — zum Bestpreis, mit kostenlosem Versand und 2 Jahre Garantie.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="#produkte"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl font-semibold hover:bg-[var(--color-primary-hover)] transition-colors"
                >
                  Thermomix entdecken
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  href="#vorteile"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-[var(--color-border)] rounded-xl font-semibold hover:bg-[var(--color-bg-secondary)] transition-colors"
                >
                  Vorteile & Garantie
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* USPs */}
        <section className="border-y border-[var(--color-border-light)] bg-white" id="vorteile">
          <div className="container-hausaura py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {usps.map((u) => (
                <div key={u.label} className="flex items-start gap-3 p-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-secondary)] flex items-center justify-center shrink-0">
                    <u.icon className="w-5 h-5 text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[var(--color-text-primary)]">{u.label}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{u.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products */}
        <section className="section-py" id="produkte">
          <div className="container-hausaura">
            <h2 className="heading-2 mb-8">Unsere Thermomix-Modelle</h2>
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {products.map((p) => (
                  <div key={p.id}>
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[var(--color-text-muted)]">Produkte werden geladen…</p>
            )}
          </div>
        </section>

        {/* Features */}
        <section className="section-py bg-[var(--color-bg-secondary)]">
          <div className="container-hausaura">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <p className="caption text-[var(--color-accent)] mb-3">Warum Thermomix?</p>
              <h2 className="heading-2 mb-4">Das ultimative Küchengerät</h2>
              <p className="body-large">
                Der Thermomix ersetzt über 20 Küchengeräte in einem einzigen Gerät. Sparen Sie Platz, Geld und Zeit in Ihrer Küche.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {features.map((f) => (
                <div key={f} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-[var(--color-border-light)]">
                  <Check className="w-5 h-5 text-[var(--color-success)] shrink-0 mt-0.5" />
                  <span className="text-sm text-[var(--color-text-secondary)]">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section-py">
          <div className="container-hausaura max-w-3xl">
            <h2 className="heading-2 mb-8 text-center">Häufige Fragen</h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <details key={faq.q} className="group bg-white border border-[var(--color-border-light)] rounded-xl overflow-hidden">
                  <summary className="flex items-center justify-between p-5 cursor-pointer text-sm font-bold text-[var(--color-text-primary)]">
                    {faq.q}
                    <ChevronRight className="w-4 h-4 text-[var(--color-text-muted)] transition-transform group-open:rotate-90" />
                  </summary>
                  <div className="px-5 pb-5 text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="section-py bg-[var(--color-primary)] text-white text-center">
          <div className="container-hausaura">
            <h2 className="heading-2 text-white mb-4">Bereit für Ihren Thermomix?</h2>
            <p className="body-large text-white/80 mb-6 max-w-xl mx-auto">
              Bestellen Sie jetzt und erhalten Sie kostenlosen Versand, 2 Jahre Gewährleistung und 30 Tage Rückgaberecht.
            </p>
            <Link
              href="#produkte"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[var(--color-primary)] rounded-xl font-bold text-lg hover:bg-white/90 transition-colors"
            >
              Jetzt bestellen
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
