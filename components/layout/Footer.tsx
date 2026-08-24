import Link from "next/link";
import { Mail, Phone, Truck, Shield, CreditCard, Headphones } from "lucide-react";
import Image from "next/image";
import { footerCategories } from "@/lib/navigation";
import ScrollToTop from "@/components/layout/ScrollToTop";

const service = [
  { name: "Kontakt", href: "/kontakt" },
  { name: "Über uns", href: "/ueber-uns" },
  { name: "Hilfe & FAQ", href: "/kontakt#faq" },
  { name: "Wunschliste", href: "/wunschliste" },
  { name: "Garantie", href: "/garantie" },
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

const paymentMethods = [
  { name: "Vorkasse / SEPA", icon: "/images/payments/vorkasse.svg", available: true },
  { name: "PayPal", icon: "/images/payments/paypal.svg", available: false },
  { name: "Klarna", icon: "/images/payments/klarna.svg", available: false },
  { name: "Apple Pay", icon: "/images/payments/apple-pay.svg", available: false },
];

export default function Footer() {
  return (
    <footer className="bg-[var(--color-secondary)] text-white">
      {/* Trust badges bar */}
      <div className="border-b border-white/10">
        <div className="container-hauselio py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {trustBadges.map((badge) => (
              <div key={badge.label} className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <badge.icon className="w-4 h-4 text-[var(--color-primary)]" />
                </div>
                <span className="text-xs sm:text-sm text-white/80 font-medium">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="container-hauselio py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logos/logosecondaire.png"
                alt="HAUSELIO"
                width={110}
                height={33}
                className="h-8 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-sm text-white/70 leading-relaxed mb-6 max-w-xs">
              Moderne Haushaltsgeräte für ein komfortables Zuhause.
              Qualität, Innovation und Service — direkt aus Deutschland.
            </p>
          </div>

          {/* Kategorien */}
          <div className="lg:col-span-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-4">
              Kategorien
            </h2>
            <ul className="space-y-0" aria-label="Kategorien">
              {footerCategories.map((cat) => (
                <li key={cat.href}>
                  <Link
                    href={cat.href}
                    className="block px-2.5 py-2 min-h-[44px] flex items-center text-[13px] text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors duration-200"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service */}
          <div className="lg:col-span-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-4">
              Service
            </h2>
            <ul className="space-y-0" aria-label="Service">
              {service.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block px-2.5 py-2 min-h-[44px] flex items-center text-[13px] text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Rechtliches + Contact */}
          <div className="lg:col-span-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-4">
              Rechtliches
            </h2>
            <ul className="space-y-0 mb-6" aria-label="Rechtliches">
              {legal.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block px-2.5 py-2 min-h-[44px] flex items-center text-[13px] text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="space-y-0">
              <a
                href="mailto:support@hauselio.de"
                className="flex items-center gap-2 px-2.5 py-2 min-h-[44px] text-[13px] text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors duration-200"
              >
                <Mail className="w-3.5 h-3.5" />
                support@hauselio.de
              </a>
              <a
                href="tel:+493055578901"
                className="flex items-center gap-2 px-2.5 py-2 min-h-[44px] text-[13px] text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors duration-200"
              >
                <Phone className="w-3.5 h-3.5" />
                +49 (0)30 555 789 01
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar — payment methods + copyright */}
      <div className="border-t border-white/10">
        <div className="container-hauselio py-5">
          {/* Payment methods — only available */}
          <div className="flex flex-wrap justify-center gap-2 mb-2">
            {paymentMethods.filter(m => m.available).map((method) => (
              <div
                key={method.name}
                className="px-3 py-1.5 border rounded-md text-[11px] font-semibold flex items-center gap-2 bg-white/5 border-white/10 text-white/60"
              >
                <Image
                  src={method.icon}
                  alt={method.name}
                  width={32}
                  height={20}
                  className="h-4 w-auto"
                />
                {method.name}
              </div>
            ))}
          </div>
          <p className="text-center text-[11px] text-white/30">Weitere Zahlungsmethoden folgen</p>

          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-white/50">
              © 2026 HAUSELIO. Alle Rechte vorbehalten.
            </p>
            <ScrollToTop />
          </div>
        </div>
      </div>
    </footer>
  );
}
