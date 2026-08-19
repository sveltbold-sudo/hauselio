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
          <p className="text-center text-[10px] text-white/30">Weitere Zahlungsmethoden folgen</p>

          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-white/50">
              © {new Date().getFullYear()} HAUSELIO. Alle Rechte vorbehalten.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors" aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors" aria-label="YouTube">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
            <ScrollToTop />
          </div>
        </div>
      </div>
    </footer>
  );
}
