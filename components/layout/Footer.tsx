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

const paymentMethods = [
  { name: "Vorkasse", icon: "🏦" },
  { name: "SEPA", icon: "💳" },
  { name: "PayPal", icon: "🅿️" },
  { name: "Klarna", icon: "🟠" },
  { name: "Visa", icon: "💳" },
  { name: "Mastercard", icon: "💳" },
];

export default function Footer() {
  return (
    <footer className="bg-[var(--color-secondary)] text-white">
      {/* Trust badges bar */}
      <div className="border-b border-white/10">
        <div className="container-hauselio py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustBadges.map((badge) => (
              <div key={badge.label} className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <badge.icon className="w-4 h-4 text-[var(--color-primary)]" />
                </div>
                <span className="text-[13px] text-white/80 font-medium">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="container-hauselio py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand + Newsletter */}
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

            <div>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-white/50 mb-2.5">
                Newsletter
              </h2>
              <p className="text-xs text-white/60 mb-3">
                Exklusive Angebote und Neuigkeiten.
              </p>
              <NewsletterForm />
            </div>
          </div>

          {/* Kategorien */}
          <div className="lg:col-span-3">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-white/50 mb-4">
              Kategorien
            </h2>
            <ul className="space-y-0" aria-label="Kategorien">
              {footerCategories.map((cat) => (
                <li key={cat.href}>
                  <Link
                    href={cat.href}
                    className="block px-2.5 py-2 min-h-[40px] flex items-center text-[13px] text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors duration-200"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service */}
          <div className="lg:col-span-2">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-white/50 mb-4">
              Service
            </h2>
            <ul className="space-y-0" aria-label="Service">
              {service.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block px-2.5 py-2 min-h-[40px] flex items-center text-[13px] text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Rechtliches + Contact */}
          <div className="lg:col-span-3">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-white/50 mb-4">
              Rechtliches
            </h2>
            <ul className="space-y-0 mb-6" aria-label="Rechtliches">
              {legal.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block px-2.5 py-2 min-h-[40px] flex items-center text-[13px] text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="space-y-0">
              <a
                href="mailto:support@hauselio.de"
                className="flex items-center gap-2 px-2.5 py-2 min-h-[40px] text-[13px] text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors duration-200"
              >
                <Mail className="w-3.5 h-3.5" />
                support@hauselio.de
              </a>
              <a
                href="tel:+493055578901"
                className="flex items-center gap-2 px-2.5 py-2 min-h-[40px] text-[13px] text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors duration-200"
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
          {/* Payment methods */}
          <div className="flex flex-wrap justify-center gap-2 mb-5">
            {paymentMethods.map((method) => (
              <div
                key={method.name}
                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-md text-[11px] font-semibold text-white/60 flex items-center gap-1.5"
              >
                <span>{method.icon}</span>
                {method.name}
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-white/50">
              © {new Date().getFullYear()} HAUSELIO. Alle Rechte vorbehalten.
            </p>
            <ScrollToTop />
          </div>
        </div>
      </div>
    </footer>
  );
}
