"use client";

import Link from "next/link";
import { Mail, Phone, Truck, Shield, CreditCard, Headphones, Lock, Award, BadgeCheck } from "lucide-react";
import Image from "next/image";
import { footerCategories } from "@/lib/navigation";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import NewsletterForm from "@/components/layout/NewsletterForm";

const footerLinkClass = "block px-2.5 py-2 min-h-[44px] flex items-center text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors duration-250";

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
  { name: "Barrierefreiheit", href: "/barrierefreiheit" },
];

const trustBadges = [
  { id: "shipping", icon: Truck, label: `Kostenloser Versand ab ${FREE_SHIPPING_THRESHOLD}€` },
  { id: "secure", icon: Shield, label: "Sicher einkaufen" },
  { id: "payment", icon: CreditCard, label: "Einfache Zahlung" },
  { id: "support", icon: Headphones, label: "Deutsche Kundenbetreuung" },
];

const paymentMethods = [
  { name: "Vorkasse / SEPA", icon: "/images/payments/vorkasse.svg" },
];

export default function Footer() {
  return (
    <footer className="bg-[var(--color-secondary)] text-white pb-[env(safe-area-inset-bottom,0px)]">
      {/* Trust badges bar */}
      <div className="border-b border-white/10">
        <div className="container-hauselio py-6">
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4" role="list">
            {trustBadges.map((badge) => (
              <li key={badge.id} className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <badge.icon className="w-4 h-4 text-white/70" aria-hidden="true" />
                </div>
                <span className="text-xs sm:text-sm text-white font-medium">{badge.label}</span>
              </li>
            ))}
          </ul>
          {/* Trustpilot / Kiyoh scores */}
          <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center gap-4 sm:gap-6">
            <span className="text-xs text-white/60">Kundenbewertung:</span>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-[var(--color-accent)]">4,8/5</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-[var(--color-accent)]">9,2/10</span>
              <span className="text-xs text-white/60">— KiyoBewertungen</span>
            </div>
          </div>
          {/* Trust seals */}
          <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2 text-white/60">
              <Lock className="w-4 h-4 text-[var(--color-success)]" aria-hidden="true" />
              <span className="text-xs font-medium">SSL-verschlüsselt</span>
            </div>
            <div className="flex items-center gap-2 text-white/60">
              <Shield className="w-4 h-4 text-[var(--color-success)]" aria-hidden="true" />
              <span className="text-xs font-medium">TÜV-geprüft</span>
            </div>
            <div className="flex items-center gap-2 text-white/60">
              <Award className="w-4 h-4 text-[var(--color-accent)]" aria-hidden="true" />
              <span className="text-xs font-medium">Geprüfter Shop</span>
            </div>
            <div className="flex items-center gap-2 text-white/60">
              <BadgeCheck className="w-4 h-4 text-[var(--color-success)]" aria-hidden="true" />
              <span className="text-xs font-medium">30 Tage Rückgaberecht</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="container-hauselio py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8">
          {/* Brand + Newsletter */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logos/logosecondaire.png"
                alt="HAUSAURA"
                width={110}
                height={33}
                sizes="110px"
                className="h-8 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-sm text-white/70 leading-relaxed mb-6">
              Moderne Haushaltsgeräte für ein komfortables Zuhause.
              Qualität, Innovation und Service — direkt aus Deutschland.
            </p>

            {/* Newsletter */}
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-wider text-white/50 mb-3">
                Newsletter
              </p>
              <p className="text-xs text-white/50 mb-3">
                Angebote, Neuigkeiten & Tipps — direkt in Ihr Postfach.
              </p>
              <NewsletterForm />
            </div>

            {/* Social links */}
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/hausaura"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="HAUSAURA auf Instagram"
                className="w-11 h-11 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors duration-250"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Kategorien */}
          <div className="lg:col-span-3 md:border-l md:border-white/10 md:pl-8">
            <p className="text-xs font-bold uppercase tracking-wider text-white/50 mb-4">
              Kategorien
            </p>
            <nav aria-label="Kategorien">
              <ul className="space-y-0">
                {footerCategories.map((cat) => (
                  <li key={cat.href}>
                    <Link href={cat.href} className={footerLinkClass}>
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Service */}
          <div className="lg:col-span-2 md:border-l md:border-white/10 md:pl-8">
            <p className="text-xs font-bold uppercase tracking-wider text-white/50 mb-4">
              Service
            </p>
            <nav aria-label="Service">
              <ul className="space-y-0">
                {service.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={footerLinkClass}>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Rechtliches + Contact */}
          <div className="lg:col-span-3 md:border-l md:border-white/10 md:pl-8">
            <p className="text-xs font-bold uppercase tracking-wider text-white/50 mb-4">
              Rechtliches
            </p>
            <nav aria-label="Rechtliches">
              <ul className="space-y-0 mb-6">
                {legal.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={footerLinkClass}>
                      {item.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <CookieSettingsButton />
                </li>
              </ul>
            </nav>

            <div className="space-y-0">
              <a
                href="mailto:hilfe@hausaura.de"
                className="flex items-center gap-2 px-2.5 py-2 min-h-[44px] text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors duration-250"
              >
                <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                hilfe@hausaura.de
              </a>
              <a
                href="tel:+493055578901"
                className="flex items-center gap-2 px-2.5 py-2 min-h-[44px] text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors duration-250"
              >
                <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                +49 (0)30 555 789 01
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar — payment methods + copyright */}
      <div className="border-t border-white/10">
        <div className="container-hauselio py-5">
          {/* Payment methods — icon only */}
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            {paymentMethods.map((method) => (
              <div
                key={method.name}
                className="px-3 py-1.5 border rounded-lg bg-white/5 border-white/10"
                title={method.name}
              >
                <Image
                  src={method.icon}
                  alt={method.name}
                  width={32}
                  height={20}
                  className="h-4 w-auto opacity-80"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-white/60">
              © {new Date().getFullYear()} HAUSAURA. Alle Rechte vorbehalten.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
