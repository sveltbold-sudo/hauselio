import { Truck, Shield, Headphones, Phone } from "lucide-react";
import Link from "next/link";
import HeaderClient from "@/components/layout/HeaderClient";

export default function Header() {
  return (
    <>
      <nav aria-label="Service-Navigation" className="bg-[var(--color-secondary)] text-[#CBD5E1] text-[11px] hidden md:block">
        <div className="container-hauselio flex items-center justify-between h-8">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              Kostenloser Versand ab 50€
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              30 Tage Rückgabe
            </span>
            <span className="flex items-center gap-1.5">
              <Headphones className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              Deutsche Kundenbetreuung
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:+493055578901" className="flex items-center gap-1.5 hover:text-white transition-colors duration-200">
              <Phone className="w-3 h-3" />
              +49 (0)30 555 789 01
            </a>
            <Link href="/kontakt" className="hover:text-white transition-colors duration-200">
              Kontakt
            </Link>
            <Link href="/impressum" className="hover:text-white transition-colors duration-200">
              Impressum
            </Link>
          </div>
        </div>
      </nav>
      <HeaderClient />
    </>
  );
}
