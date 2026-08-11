import { Truck, Shield, Headphones } from "lucide-react";
import HeaderClient from "@/components/layout/HeaderClient";

export default function Header() {
  return (
    <>
      <div className="bg-[var(--color-secondary)] text-[#CBD5E1] text-xs hidden md:block">
        <div className="container-hauselio flex items-center justify-between h-9">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              Kostenloser Versand ab 50€
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              14 Tage Widerrufsrecht
            </span>
            <span className="flex items-center gap-1.5">
              <Headphones className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              Deutsche Kundenbetreuung
            </span>
          </div>
          <div className="flex items-center gap-5">
            <a href="/kontakt" className="hover:text-white transition-colors duration-200">
              Kontakt
            </a>
            <a href="/impressum" className="hover:text-white transition-colors duration-200">
              Impressum
            </a>
          </div>
        </div>
      </div>
      <HeaderClient />
    </>
  );
}
