"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useScrollLock } from "@/hooks/useScrollLock";
import { Search, Menu, X, ChevronDown, ChevronRight, Phone, ArrowRight, Heart, Truck, Shield, RotateCcw, User } from "lucide-react";
import Image from "next/image";
import MiniCart from "@/components/layout/MiniCart";
import SearchDropdown from "@/components/layout/SearchDropdown";
import { trackSearch } from "@/lib/analytics";
import { useWishlistStore } from "@/lib/wishlist";
import CategoryIcon from "@/components/ui/CategoryIcon";
import { navCategories } from "@/lib/navigation";
import { TRUST_BAR_RATING, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function HeaderClient() {
  const pathname = usePathname();
  const router = useRouter();
  const prefersReduced = useReducedMotion();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchActiveIndex, setSearchActiveIndex] = useState(-1);
  const [searchResultCount, setSearchResultCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const [expandedMobileCat, setExpandedMobileCat] = useState<string | null>(null);
  const [promoDismissed, setPromoDismissed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const megaCloseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const megaNavRef = useRef<HTMLElement>(null);
  const [megaPos, setMegaPos] = useState<{ left: number; width: number }>({ left: 0, width: 0 });

  useEffect(() => {
    return () => {
      if (megaCloseTimeoutRef.current) clearTimeout(megaCloseTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("HAUSAURA-promo-dismissed");
    if (dismissed) setPromoDismissed(true);
  }, []);

  const dismissPromo = () => {
    setPromoDismissed(true);
    sessionStorage.setItem("HAUSAURA-promo-dismissed", "1");
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
      if (megaCloseTimeoutRef.current) {
        clearTimeout(megaCloseTimeoutRef.current);
        megaCloseTimeoutRef.current = null;
      }
      setActiveMega(null);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!activeMega) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".mega-menu-panel") && !target.closest("[aria-haspopup]")) {
        setActiveMega(null);
      }
    };
    document.addEventListener("click", handleClick, { passive: true });
    return () => document.removeEventListener("click", handleClick);
  }, [activeMega]);

  useEffect(() => {
    if (!searchOpen || isMobile) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchQuery("");
        setSearchActiveIndex(-1);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown, { passive: true });
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [searchOpen, isMobile]);

  useEffect(() => {
    if (!searchOpen) return;
    requestAnimationFrame(() => {
      if (isMobile) {
        mobileSearchInputRef.current?.focus();
      } else {
        searchInputRef.current?.focus();
      }
    });
  }, [searchOpen, isMobile]);

  const handleMegaEnter = useCallback((href: string, e: React.MouseEvent) => {
    if (megaCloseTimeoutRef.current) {
      clearTimeout(megaCloseTimeoutRef.current);
      megaCloseTimeoutRef.current = null;
    }
    const tab = e.currentTarget;
    const nav = megaNavRef.current;
    if (tab && nav) {
      const tabRect = tab.getBoundingClientRect();
      const navRect = nav.getBoundingClientRect();
      setMegaPos({
        left: tabRect.left - navRect.left,
        width: tabRect.width,
      });
    }
    setActiveMega(href);
  }, []);

  const handleMegaLeave = useCallback(() => {
    megaCloseTimeoutRef.current = setTimeout(() => {
      setActiveMega(null);
      megaCloseTimeoutRef.current = null;
    }, 120);
  }, []);

  const handleMegaFocus = useCallback((href: string) => {
    setActiveMega(href);
  }, []);

  const handleMegaBlur = useCallback(() => {
    setActiveMega(null);
  }, []);

  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useScrollLock(mobileMenuOpen);
  useScrollLock(searchOpen && isMobile);

  useEffect(() => {
    if (!mobileMenuOpen) setExpandedMobileCat(null);
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

  const handleSearchFocus = useCallback(() => {
    setSearchOpen(true);
  }, []);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!searchOpen) return;
    if (e.key === "Escape") {
      setSearchOpen(false);
      setSearchQuery("");
      setSearchActiveIndex(-1);
      searchInputRef.current?.blur();
      mobileSearchInputRef.current?.blur();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSearchActiveIndex((prev) => (prev < searchResultCount - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSearchActiveIndex((prev) => (prev > 0 ? prev - 1 : searchResultCount - 1));
    } else if (e.key === "Enter" && searchActiveIndex >= 0) {
      e.preventDefault();
      document.getElementById(`search-result-${searchActiveIndex}`)?.click();
    } else if (e.key === "Enter" && searchQuery.trim()) {
      trackSearch(searchQuery.trim());
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleSearchSelect = useCallback((slug: string) => {
    router.push(`/produkt/${slug}`);
    setSearchOpen(false);
    setSearchQuery("");
  }, [router]);

  const handleSearchClear = useCallback(() => {
    setSearchQuery("");
    setSearchActiveIndex(-1);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-[box-shadow] duration-200 touch-action-manipulation ${
        scrolled ? "shadow-[var(--shadow-md)]" : ""
      }`}
    >
      {/* Brand stripe — hidden when scrolled */}
      <div
        className={`brand-stripe transition-[height,opacity] duration-300 overflow-hidden pt-[env(safe-area-inset-top,0px)] ${
          scrolled ? "h-0 opacity-0" : "opacity-100"
        }`}
      />

      {/* Promo Banner — hidden when scrolled */}
      {!promoDismissed && (
        <div
          className={`overflow-hidden transition-[max-height,opacity] duration-300 ${
            scrolled ? "max-h-0 opacity-0" : "max-h-12 opacity-100"
          }`}
        >
          <div className="promo-banner">
            <div className="container-hausaura flex items-center justify-center h-8 gap-2 relative">
              <span className="hidden sm:inline" aria-hidden="true">🚚</span>
              <span className="font-medium text-xs sm:text-sm">
                Kostenloser Versand ab {FREE_SHIPPING_THRESHOLD}€ · 30 Tage Rückgabe
              </span>
              <button
                onClick={dismissPromo}
                aria-label="Banner schließen"
                className="absolute right-2 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] p-2 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main header row: Logo | Search | Actions */}
      <div className="container-hausaura relative">
        <div className="flex items-center gap-2 sm:gap-4 h-14 md:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0 group">
            <Image
              src="/logos/logoprincipale.png"
              alt="HAUSAURA"
              width={160}
              height={50}
              priority
              className="h-8 md:h-10 w-auto transition-transform duration-500 group-hover:scale-105"
            />
          </Link>

          {/* Search input — desktop */}
          <div ref={searchContainerRef} className="hidden lg:flex items-center flex-1 max-w-xl mx-4 relative">
            <div className="relative w-full header-search-input">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[var(--color-text-muted)]" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setSearchActiveIndex(-1); }}
                onFocus={handleSearchFocus}
                onKeyDown={handleSearchKeyDown}
                placeholder="Was suchst du?"
                aria-label="Produkte suchen"
                role="combobox"
                aria-expanded={searchOpen && searchQuery.trim().length >= 2}
                aria-controls={searchOpen && searchQuery.trim().length >= 2 ? "search-results-list" : undefined}
                aria-autocomplete="list"
                aria-activedescendant={searchActiveIndex >= 0 && searchActiveIndex < searchResultCount ? `search-result-${searchActiveIndex}` : undefined}
                className="w-full h-full pl-11 pr-4 bg-transparent text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none"
              />
            </div>
            {!isMobile && (
              <SearchDropdown
                isOpen={searchOpen}
                onClose={() => setSearchOpen(false)}
                query={searchQuery}
                activeIndex={searchActiveIndex}
                resultCount={searchResultCount}
                onResultCountChange={setSearchResultCount}
                onSelect={handleSearchSelect}
                onClear={handleSearchClear}
              />
            )}
          </div>

          {/* Actions: Search (mobile) + Wishlist + Cart + Menu */}
          <div className="flex items-center gap-0.5 sm:gap-1 ml-auto shrink-0">
            {/* Mobile: search icon */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="lg:hidden w-11 h-11 flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-50)] rounded-xl transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-primary)]"
              aria-label="Suche"
              aria-expanded={searchOpen}
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist — mobile */}
            <Link
              href="/wunschliste"
              className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors transition-transform active:scale-95 relative"
              aria-label="Wunschliste"
            >
              <Heart className="w-5 h-5" />
              <WishlistBadge />
            </Link>

            {/* Account — desktop only */}
            <Link
              href="/konto"
              className="hidden lg:flex w-11 h-11 items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-50)] rounded-xl transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-primary)]"
              aria-label="Mein Konto"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Wishlist — desktop */}
            <Link
              href="/wunschliste"
              className="hidden lg:flex w-11 h-11 items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-50)] rounded-xl transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-primary)] relative"
              aria-label="Wunschliste"
            >
              <Heart className="w-5 h-5" />
              <WishlistBadge />
            </Link>

            {/* Cart */}
            <MiniCart />

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-11 h-11 flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-50)] rounded-xl transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-primary)]"
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
        ref={megaNavRef}
        aria-label="Kategorien"
        className="hidden lg:block relative border-t border-[var(--color-border-light)]"
      >
        <div className="container-hausaura">
          <div className="flex items-center gap-1 h-11">
            {navCategories.map((cat) => (
              <div
                key={cat.href}
                className="relative shrink-0"
                onMouseEnter={(e) => handleMegaEnter(cat.href, e)}
                onMouseLeave={handleMegaLeave}
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
                  }}
                  aria-current={pathname.startsWith(cat.href) ? "page" : undefined}
                  aria-haspopup="true"
                  aria-expanded={activeMega === cat.href}
                  className={`header-nav-tab flex items-center gap-1 ${
                    pathname.startsWith(cat.href) ? "active" : ""
                  } ${activeMega === cat.href ? "hovered" : ""}`}
                >
                  {cat.name}
                  <ChevronDown
                    aria-hidden="true"
                    className={`w-3 h-3 transition-transform duration-300 ${
                      activeMega === cat.href ? "rotate-180" : ""
                    }`}
                  />
                </Link>
              </div>
            ))}

            {/* Trust signals — compact, right-aligned */}
            <div className="ml-auto flex items-center gap-4 text-xs text-[var(--color-text-muted)] shrink-0 pl-4 border-l border-[var(--color-border-light)]">
              <span className="flex items-center gap-1">
                <Truck className="w-3 h-3 text-[var(--color-success)]" />
                Gratis ab {FREE_SHIPPING_THRESHOLD}€
              </span>
              <span className="hidden lg:flex items-center gap-1">
                <Shield className="w-3 h-3 text-[var(--color-success)]" />
                30 Tage Rückgabe
              </span>
              <span className="hidden lg:flex items-center gap-1">
                <RotateCcw className="w-3 h-3 text-[var(--color-success)]" />
                5 Jahre Garantie
              </span>
              <span className="hidden xl:flex items-center gap-1">
                <span className="font-semibold text-[var(--color-accent)]">{TRUST_BAR_RATING.toString().replace(".", ",")}/5</span>
              </span>
              {/* Payment icons */}
              <span className="hidden 2xl:flex items-center gap-1.5 pl-3 border-l border-[var(--color-border-light)]">
                <span className="px-1.5 py-0.5 bg-[var(--color-bg-secondary)] rounded text-[10px] font-bold text-[var(--color-text-muted)]">Vorkasse</span>
              </span>
            </div>
          </div>
        </div>

        {/* Mega menu dropdowns */}
        {navCategories.map((cat) => (
          <div
            key={`mega-${cat.href}`}
            onMouseEnter={() => {
              if (megaCloseTimeoutRef.current) {
                clearTimeout(megaCloseTimeoutRef.current);
                megaCloseTimeoutRef.current = null;
              }
            }}
            onMouseLeave={handleMegaLeave}
            className={`mega-menu-panel absolute top-full left-0 right-0 z-[55] transition-[opacity,visibility] duration-200 ${
              activeMega === cat.href
                ? "opacity-100 visible"
                : "opacity-0 invisible pointer-events-none"
            }`}
          >
            <div className="container-hausaura">
              <div className="pt-1 pb-2">
                <div
                  className={`bg-white rounded-2xl shadow-[var(--shadow-2xl)] border border-[var(--color-border-light)] p-6 transition-opacity duration-200 ${activeMega === cat.href ? "opacity-100" : "opacity-0"}`}
                  style={{
                    position: "absolute",
                    left: `${megaPos.left}px`,
                    width: "fit-content",
                    maxWidth: `calc(100vw - ${megaPos.left}px - 1rem)`,
                  }}
                  onMouseLeave={handleMegaLeave}
                >
                  <div className="flex items-center gap-4 mb-5 pb-4 border-b border-[var(--color-border-light)]">
                    <div className="w-12 h-12 bg-[var(--color-accent-soft)] rounded-xl flex items-center justify-center">
                      <CategoryIcon category={cat.icon} className="w-6 h-6 text-[var(--color-accent)]" />
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
          </div>
        ))}
      </nav>

      {/* Mobile search overlay — full-screen */}
      {searchOpen && (
        <div className="lg:hidden fixed inset-0 top-0 z-[60] bg-white flex flex-col" role="dialog" aria-modal="true" aria-label="Suche">
          <div className="flex items-center gap-2 px-4 py-3 pt-[calc(12px+env(safe-area-inset-top,0px))] border-b border-[var(--color-border-light)]">
            <Search className="w-5 h-5 text-[var(--color-text-muted)] shrink-0" />
            <input
              ref={mobileSearchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setSearchActiveIndex(-1); }}
              onKeyDown={handleSearchKeyDown}
              placeholder="Was suchst du?"
              aria-label="Produkte suchen"
              role="combobox"
              aria-expanded={searchQuery.trim().length >= 2}
              aria-controls={searchQuery.trim().length >= 2 ? "search-results-list" : undefined}
              aria-autocomplete="list"
              aria-activedescendant={searchActiveIndex >= 0 && searchActiveIndex < searchResultCount ? `search-result-${searchActiveIndex}` : undefined}
              className="flex-1 bg-transparent text-base text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none"
            />
            <button
              onClick={() => { setSearchOpen(false); setSearchQuery(""); setSearchActiveIndex(-1); }}
              className="w-11 h-11 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded-lg transition-colors"
              aria-label="Suche schließen"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {isMobile && searchQuery.trim().length >= 2 ? (
              <SearchDropdown
                isOpen={true}
                onClose={() => { setSearchOpen(false); setSearchQuery(""); setSearchActiveIndex(-1); }}
                query={searchQuery}
                activeIndex={searchActiveIndex}
                resultCount={searchResultCount}
                onResultCountChange={setSearchResultCount}
                onSelect={handleSearchSelect}
                onClear={handleSearchClear}
                inline
              />
            ) : (
              <div className="p-6 text-center">
                <Search className="w-8 h-8 text-[var(--color-text-muted)] mx-auto mb-3" />
                <p className="text-sm text-[var(--color-text-muted)]">
                  Tippen Sie mindestens 2 Zeichen
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile menu — slide-in from right */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-0 z-[60]" role="dialog" aria-modal="true" aria-label="Menü">
          <div
            className={`absolute inset-0 bg-black/40 backdrop-blur-sm ${prefersReduced ? "" : "animate-fade-in"}`}
            onClick={() => setMobileMenuOpen(false)}
          />
          <div ref={mobileMenuRef} className={`absolute right-0 top-0 h-full w-[320px] max-w-[85vw] bg-white shadow-[var(--shadow-2xl)] overflow-y-auto ${prefersReduced ? "" : "animate-slide-in-right"}`}>
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
                    className={`${prefersReduced ? "" : "animate-fade-in-up"}`}
                    style={prefersReduced ? undefined : { animationDelay: `${i * 40}ms` }}
                  >
                    <div className="flex items-center">
                      <Link
                        href={cat.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3.5 px-3 py-3 rounded-xl text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-50)] hover:text-[var(--color-primary)] transition-colors duration-200 flex-1"
                      >
                        <div className="w-10 h-10 bg-[var(--color-accent-soft)] rounded-lg flex items-center justify-center shrink-0">
                          <CategoryIcon category={cat.icon} className="w-5 h-5 text-[var(--color-accent)]" />
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
                            className="block px-3 py-2.5 min-h-[44px] rounded-lg text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-50)] transition-colors duration-200"
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
                href="/wunschliste"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-3 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-50)]"
              >
                <Heart className="w-4 h-4" />
                Wunschliste
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

function WishlistBadge() {
  const items = useWishlistStore((s) => s.items);
  if (items.length === 0) return null;
  return (
    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-[var(--color-danger)] text-white text-[10px] font-bold rounded-full px-1">
      {items.length > 99 ? "99+" : items.length}
    </span>
  );
}
