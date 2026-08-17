import Link from "next/link";
import { Mail, Phone, Truck, Shield, CreditCard, Headphones } from "lucide-react";
import Image from "next/image";
import { footerCategories } from "@/lib/navigation";
import NewsletterForm from "@/components/layout/NewsletterForm";
import ScrollToTop from "@/components/layout/ScrollToTop";

const service = [
  { name: "Kontakt", href: "/kontakt" },
  { name: "Über uns", href: "/ueber-uns" },
  { name: "Hilfe & FAQ", href: "/kontakt#faq" },
  { name: "Rückgabe", href: "/widerruf" },
  { name: "Garantie", href: "/agb" },
  { name: "Versandinformationen", href: "/versand" },
];

const legal = [
  { name: "Impressum", href: "/impressum" },
  { name: "Datenschutz", href: "/datenschutz" },
  { name: "AGB", href: "/agb" },
  { name: "Widerrufsrecht", href: "/widerruf" },
];

const trustBadges = [
  { icon: Truck, label: "Kostenloser Versand ab 50€" },
  { icon: Shield, label: "Sicher einkaufen" },
  { icon: CreditCard, label: "Einfache Zahlung" },
  { icon: Headphones, label: "Deutsche Kundenbetreuung" },
];

export default function Footer() {
  return (
    <footer className="bg-[var(--color-secondary)] text-white">
      <div className="border-b border-white/10">
        <div className="container-hauselio py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustBadges.map((badge) => (
              <div key={badge.label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <badge.icon className="w-5 h-5 text-[var(--color-primary)]" />
                </div>
                <span className="text-sm text-white/80 font-medium">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container-hauselio py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block mb-5">
              <Image
                src="/logos/logosecondaire.png"
                alt="HAUSELIO"
                width={120}
                height={36}
                className="h-9 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-sm text-white/80 leading-relaxed mb-8 max-w-sm">
              Moderne Haushaltsgeräte für ein komfortables Zuhause.
              Qualität, Innovation und Service — direkt aus Deutschland.
            </p>

            <div className="mb-8">
              <h2 className="text-xs font-bold uppercase tracking-wider text-white/70 mb-3">
                Newsletter
              </h2>
              <p className="text-sm text-white/80 mb-4">
                Exklusive Angebote und Neuigkeiten.
              </p>
              <NewsletterForm />
            </div>
          </div>

          <div className="lg:col-span-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white/70 mb-5">
              Kategorien
            </h2>
            <ul className="space-y-1" aria-label="Kategorien">
              {footerCategories.map((cat) => (
                <li key={cat.href}>
                  <Link
                    href={cat.href}
                    className="block px-3 py-2.5 min-h-[44px] flex items-center text-sm text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors duration-300"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white/70 mb-5">
              Service
            </h2>
            <ul className="space-y-1" aria-label="Service">
              {service.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block px-3 py-2.5 min-h-[44px] flex items-center text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white/70 mb-5">
              Rechtliches
            </h2>
            <ul className="space-y-1 mb-8" aria-label="Rechtliches">
              {legal.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block px-3 py-2.5 min-h-[44px] flex items-center text-sm text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="space-y-1">
              <a
                href="mailto:support@hauselio.de"
                className="flex items-center gap-2 px-3 py-2.5 min-h-[44px] text-sm text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors duration-300"
              >
                <Mail className="w-4 h-4" />
                support@hauselio.de
              </a>
              <a
                href="tel:+493055578901"
                className="flex items-center gap-2 px-3 py-2.5 min-h-[44px] text-sm text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors duration-300"
              >
                <Phone className="w-4 h-4" />
                +49 (0)30 555 789 01
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-hauselio py-6">
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {["SEPA-Überweisung", "Vorkasse"].map((method) => (
              <div
                key={method}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold text-white/70"
              >
                {method}
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/80">
              © {new Date().getFullYear()} HAUSELIO. Alle Rechte vorbehalten.
            </p>
            <ScrollToTop />
          </div>
        </div>
      </div>
    </footer>
  );
}
