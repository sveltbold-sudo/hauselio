"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid3X3, Search, ShoppingBag, User } from "lucide-react";
import { useCartStore, selectItemCount } from "@/lib/store";

const navItems = [
  { href: "/", icon: Home, label: "Start" },
  { href: "/shop", icon: Grid3X3, label: "Kategorien" },
  { href: "/shop?suche=", icon: Search, label: "Suche" },
  { href: "/warenkorb", icon: ShoppingBag, label: "Warenkorb" },
  { href: "/konto", icon: User, label: "Konto" },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const itemCount = useCartStore(selectItemCount);

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-[90] lg:hidden bg-white border-t border-[var(--color-border-light)] pb-[env(safe-area-inset-bottom,0px)]"
    >
      <ul className="flex items-center justify-around h-14 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`relative flex flex-col items-center justify-center min-w-[52px] min-h-[48px] gap-0.5 text-xs transition-colors ${
                  isActive
                    ? "text-[var(--color-accent)] font-semibold"
                    : "text-[var(--color-text-muted)]"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
                {item.href === "/warenkorb" && itemCount > 0 && (
                  <span
                    className="absolute -top-1 right-1 w-4 h-4 bg-[var(--color-accent)] text-white text-xs font-bold rounded-full flex items-center justify-center"
                    aria-label={`${itemCount} Artikel im Warenkorb`}
                  >
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
