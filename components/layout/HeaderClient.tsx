"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X, ChevronDown, ChevronRight, Phone, ArrowRight, Heart, Truck, Shield, RotateCcw, User, ShoppingBag } from "lucide-react";
import Image from "next/image";
import MiniCart from "@/components/layout/MiniCart";
import SearchDropdown from "@/components/layout/SearchDropdown";
import { navCategories } from "@/lib/navigation";
import { TRUST_BAR_RATING, TRUST_BAR_REVIEW_COUNT, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";

export default function HeaderClient() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const [expandedMobileCat, setExpandedMobileCat] = useState<string | null>(null);
  const [promoDismissed, setPromoDismissed] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("hauselio-promo-dismissed");
    if (dismissed) setPromoDismissed(true);
  }, []);

  const dismissPromo = () => {
    setPromoDismissed(true);
    sessionStorage.setItem("hauselio-promo-dismissed", "1");
  };

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 60);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMegaEnter = useCallback((href: string) => {
    setActiveMega(href);
  }, []);

  const handleMegaLeave = useCallback(() => {
    setActiveMega(null);
  }, []);

  const handleMegaFocus = useCallback((href: string) => {
    setActiveMega(href);
  }, []);

  const handleMegaBlur = useCallback(() => {
    setActiveMega(null);
  }, []);

  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mobileMenuOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        return;
      }
      if (e.key !== "Tab" || !mobileMenuRef.current) return;
      const focusable = mobileMenuRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    const firstFocusable = mobileMenuRef.current?.querySelector<HTMLElement>(
      'a[href], button:not([disabled])'
    );
    firstFocusable?.focus();
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  const handleSearchFocus = () => {
    setSearchOpen(true);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-[background,box-shadow] duration-200 ${
        scrolled
          ? "glass-premium border-b border-[var(--color-border-light)] shadow-[var(--shadow-md)]"
          : "bg-white border-b border-[var(--color-border-light)]"
      }`}
    >
      <div className="brand-stripe" />

      {/* Promo Banner — dismissible */}
      {!promoDismissed && (
        <div className="promo-banner">
          <div className="container-hauselio flex items-center justify-center h-8 gap-2 relative">
            <span className="hidden sm:inline">🚚</span>
            <span className="font-medium">
              Kostenloser Versand ab {FREE_SHIPPING_THRESHOLD}€ · 30 Tage Rückgabe
            </span>
            <button
              onClick={dismissPromo}
              aria-label="Banner schließen"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main header row: Logo | Search | Actions */}
      <div className="container-hauselio">
        <div className="flex items-center gap-4 h-16 md:h-[68px]">
          {/* Logo — larger */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <Image
              src="/logos/logoprincipale.png"
              alt="HAUSELIO"
              width={160}
              height={50}
              priority
              className="h-9 md:h-11 w-auto transition-transform duration-500 group-hover:scale-105"
            />
          </Link>

          {/* Search input — desktop (prominent, MediaMarkt/Coolblue pattern) */}
          <div className="hidden lg:flex items-center flex-1 max-w-xl mx-4">
            <div className="relative w-full header-search-input">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[var(--color-text-muted)]" />
              <input
                ref={searchInputRef}
                type="text"
                onFocus={handleSearchFocus}
                placeholder="Was suchst du?"
                aria-label="Produkte suchen"
                className="w-full h-full pl-11 pr-4 bg-transparent text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none"
              />
            </div>
          </div>

          {/* Actions: Search (mobile) + Account + Wishlist + Cart + Menu */}
          <div className="flex items-center gap-0.5 ml-auto">
            {/* Mobile: search icon */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="lg:hidden w-11 h-11 flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-50)] rounded-xl transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-primary)]"
              aria-label="Suche"
              aria-expanded={searchOpen}
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Account */}
            <Link
              href="/konto"
              className="hidden lg:flex w-11 h-11 items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-50)] rounded-xl transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-primary)]"
              aria-label="Mein Konto"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Wishlist */}
            <Link
              href="/wunschliste"
              className="hidden lg:flex w-11 h-11 items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-50)] rounded-xl transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-primary)]"
              aria-label="Wunschliste"
            >
              <Heart className="w-5 h-5" />
            </Link>

            {/* Cart */}
            <MiniCart />

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-11 h-11 flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-50)] rounded-xl transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-primary)]"
              aria-label="Menü"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Category navigation tabs — desktop */}
      <nav
        aria-label="Kategorien"
        className="hidden lg:block border-t border-[var(--color-border-light)]"
        onMouseLeave={handleMegaLeave}
      >
        <div className="container-hauselio">
          <div className="flex items-center gap-1 h-11 overflow-x-auto scrollbar-hide">
            {navCategories.map((cat) => (
              <div
                key={cat.href}
                className="relative shrink-0"
                onMouseEnter={() => handleMegaEnter(cat.href)}
              >
                <Link
                  href={cat.href}
                  onFocus={() => handleMegaFocus(cat.href)}
                  onBlur={handleMegaBlur}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setActiveMega(null);
                      (e.target as HTMLElement).blur();
                    }
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveMega(activeMega === cat.href ? null : cat.href);
                    }
                  }}
                  aria-current={pathname.startsWith(cat.href) ? "page" : undefined}
                  className={`header-nav-tab flex items-center gap-1 ${
                    activeMega === cat.href || pathname.startsWith(cat.href)
                      ? "active"
                      : ""
                  }`}
                >
                  {cat.name}
                  <ChevronDown
                    className={`w-3 h-3 transition-transform duration-300 ${
                      activeMega === cat.href ? "rotate-180" : ""
                    }`}
                  />
                </Link>

                {/* Mega menu dropdown */}
                <div
                  className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 transition-[opacity,visibility] duration-200 ${
                    activeMega === cat.href
                      ? "opacity-100 visible"
                      : "opacity-0 invisible pointer-events-none"
                  }`}
                  aria-label={`${cat.name} Kategorie`}
                >
                  <div className={`bg-white rounded-2xl shadow-[var(--shadow-2xl)] border border-[var(--color-border-light)] p-6 w-[420px] max-w-[calc(100vw-2rem)] transition-opacity duration-200 ${activeMega === cat.href ? "opacity-100" : "opacity-0"}`}>
                    <div className="flex items-center gap-4 mb-5 pb-4 border-b border-[var(--color-border-light)]">
                      <div className="w-12 h-12 bg-[var(--color-primary-50)] rounded-xl flex items-center justify-center">
                        <Image
                          src={cat.image}
                          alt={cat.name}
                          width={28}
                          height={28}
                          className="w-7 h-7 object-contain"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-[var(--color-text-primary)] text-sm">
                          {cat.name}
                        </h3>
                        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                          {cat.description}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-0.5" role="menu">
                      {cat.subcategories.map((sub, subIdx) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          role="menuitem"
                          tabIndex={activeMega === cat.href ? 0 : -1}
                          onKeyDown={(e) => {
                            const items = (e.currentTarget.closest('[role="menu"]') as HTMLElement)?.querySelectorAll('[role="menuitem"]') as NodeListOf<HTMLElement>;
                            if (!items) return;
                            if (e.key === "ArrowDown") {
                              e.preventDefault();
                              items[(subIdx + 1) % items.length]?.focus();
                            } else if (e.key === "ArrowUp") {
                              e.preventDefault();
                              items[(subIdx - 1 + items.length) % items.length]?.focus();
                            } else if (e.key === "Escape") {
                              setActiveMega(null);
                            }
                          }}
                          className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-50)] hover:text-[var(--color-primary)] transition-colors duration-200 group"
                        >
                          <span className="font-medium">{sub.name}</span>
                          <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-opacity transition-transform duration-200" />
                        </Link>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-[var(--color-border-light)]">
                      <Link
                        href={cat.href}
                        className="flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-[var(--color-primary)] hover:bg-[var(--color-primary-50)] rounded-lg transition-colors duration-200"
                      >
                        Alle {cat.name} ansehen
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Trust signals — compact, right-aligned */}
            <div className="ml-auto flex items-center gap-4 text-xs text-[var(--color-text-muted)] shrink-0 pl-4 border-l border-[var(--color-border-light)]">
              <span className="flex items-center gap-1">
                <Truck className="w-3 h-3 text-[var(--color-success)]" />
                Gratis ab {FREE_SHIPPING_THRESHOLD}€
              </span>
              <span className="hidden xl:flex items-center gap-1">
                <Shield className="w-3 h-3 text-[var(--color-success)]" />
                30 Tage Rückgabe
              </span>
              <span className="hidden xl:flex items-center gap-1">
                <RotateCcw className="w-3 h-3 text-[var(--color-success)]" />
                5 Jahre Garantie
              </span>
              <span className="hidden 2xl:flex items-center gap-1">
                <span className="font-semibold text-[var(--color-accent)]">{TRUST_BAR_RATING.toString().replace(".", ",")}/5</span>
                <span>({TRUST_BAR_REVIEW_COUNT})</span>
              </span>
            </div>
          </div>
        </div>
      </nav>

      <SearchDropdown isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile menu — slide-in from right */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-0 z-50" role="dialog" aria-modal="true" aria-label="Menü">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div ref={mobileMenuRef} className="absolute right-0 top-0 h-full w-[320px] max-w-[85vw] bg-white shadow-[var(--shadow-2xl)] animate-slide-in-right overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-[var(--color-border-light)]">
              <h2 className="font-bold text-[var(--color-text-primary)]">Menü</h2>
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Menü schließen"
                className="w-11 h-11 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-1">
              {navCategories.map((cat, i) => {
                const isExpanded = expandedMobileCat === cat.href;
                return (
                  <div
                    key={cat.href}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <div className="flex items-center">
                      <Link
                        href={cat.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3.5 px-3 py-3 rounded-xl text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-50)] hover:text-[var(--color-primary)] transition-colors duration-200 flex-1"
                      >
                        <div className="w-10 h-10 bg-[var(--color-primary-50)] rounded-lg flex items-center justify-center shrink-0">
                          <Image
                            src={cat.image}
                            alt=""
                            width={24}
                            height={24}
                            className="w-6 h-6 object-contain"
                          />
                        </div>
                        <span className="font-medium text-sm">{cat.name}</span>
                      </Link>
                      {cat.subcategories.length > 0 && (
                        <button
                          onClick={() => setExpandedMobileCat(isExpanded ? null : cat.href)}
                          className="w-11 h-11 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-primary)] rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                          aria-label={`${cat.name} ${isExpanded ? "schließen" : "öffnen"}`}
                          aria-expanded={isExpanded}
                        >
                          <ChevronRight
                            className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`}
                          />
                        </button>
                      )}
                    </div>
                    {isExpanded && cat.subcategories.length > 0 && (
                      <div className="ml-[52px] mt-1 space-y-0.5 border-l-2 border-[var(--color-primary-50)] pl-3">
                        {cat.subcategories.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-3 py-2 rounded-lg text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-50)] transition-colors duration-200"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="p-5 border-t border-[var(--color-border-light)] mt-2 space-y-1">
              <Link
                href="/konto"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-3 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-50)]"
              >
                <User className="w-4 h-4" />
                Mein Konto
              </Link>
              <Link
                href="/kontakt"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-3 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-50)]"
              >
                <Phone className="w-4 h-4" />
                Kontakt
              </Link>
              <Link
                href="/impressum"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-3 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-50)]"
              >
                Impressum
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
