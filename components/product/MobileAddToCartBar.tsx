"use client";

import { ShoppingBag, Check } from "lucide-react";
import Button from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

interface MobileAddToCartBarProps {
  name: string;
  price: number;
  added: boolean;
  onAddToCart: () => void;
}

export default function MobileAddToCartBar({ name, price, added, onAddToCart }: MobileAddToCartBarProps) {
  return (
    <div className="sticky-bottom-bar lg:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }} role="complementary" aria-label="Schnellzugriff">
      <div className="flex items-center gap-3 max-w-lg mx-auto px-4 py-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-[var(--color-text-muted)] truncate">{name}</p>
          <p className="font-bold text-sm text-[var(--color-text-primary)]">{formatPrice(price)}</p>
        </div>
        <Button
          onClick={onAddToCart}
          aria-label={added ? "Zum Warenkorb hinzugefügt" : "In den Warenkorb"}
          className={`transition-colors duration-300 ${added ? "bg-[var(--color-success)] hover:bg-[var(--color-success)]" : ""}`}
          size="md"
        >
          {added ? <Check className="w-4 h-4" /> : <><ShoppingBag className="w-4 h-4" /> <span className="hidden sm:inline">In den Warenkorb</span></>}
        </Button>
      </div>
    </div>
  );
}
