"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Star,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Users,
  Tag,
  BarChart3,
  Ticket,
  MessageSquareQuote,
  Shield,
  Bookmark,
} from "lucide-react";

interface AdminSidebarProps {
  admin: { email: string; role: string };
  children: React.ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Produkte", href: "/admin/produkte", icon: Package },
  { name: "Bestellungen", href: "/admin/bestellungen", icon: ShoppingCart },
  { name: "Kunden", href: "/admin/kunden", icon: Users },
  { name: "Bewertungen", href: "/admin/bewertungen", icon: Star },
  { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
  { name: "Kategorien", href: "/admin/kategorien", icon: Tag },
  { name: "Marken", href: "/admin/marken", icon: Bookmark },
  { name: "Gutscheine", href: "/admin/coupons", icon: Ticket },
  { name: "Newsletter", href: "/admin/newsletter", icon: Mail },
  { name: "Statistiken", href: "/admin/statistiken", icon: BarChart3 },
  { name: "Admins", href: "/admin/admin-users", icon: Shield },
  { name: "Einstellungen", href: "/admin/einstellungen", icon: Settings },
];

export default function AdminSidebar({ admin, children }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!userMenuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [userMenuOpen]);

  useEffect(() => {
    if (!sidebarOpen) return;
    closeButtonRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSidebarOpen(false);
        return;
      }
      if (e.key !== "Tab" || !sidebarRef.current) return;
      const focusable = sidebarRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
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
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [sidebarOpen]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      // Logout request failed — still redirect to clear local state
    }
    router.push("/admin/login");
    router.refresh();
  };

  // Don't show sidebar on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      {/* Skip to content — accessibility */}
      <a
        href="#admin-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[var(--color-primary)] focus:text-white focus:rounded-lg focus:text-sm focus:font-medium focus:shadow-lg focus:outline-none"
      >
        Zum Inhalt springen
      </a>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          aria-hidden="true"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[var(--color-primary)] transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-white/10">
            <Link href="/admin" className="text-white font-extrabold text-xl">
              HAUSAURA
            </Link>
            <button
              ref={closeButtonRef}
              onClick={() => setSidebarOpen(false)}
              aria-label="Menü schließen"
              className="lg:hidden p-1 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav aria-label="Admin-Hauptnavigation" className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-inset ${
                    isActive
                      ? "bg-white/15 text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User */}
          <div className="p-4 border-t border-white/10" ref={userMenuRef}>
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-white/80 hover:bg-white/10 transition-colors"
              >
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold">
                    {admin.email.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium truncate">{admin.email}</p>
                  <p className="text-xs text-white/50">{admin.role}</p>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {userMenuOpen && (
                <div
                  role="menu"
                  className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-lg border border-[var(--color-border-light)] overflow-hidden"
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setUserMenuOpen(false);
                    }
                    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                      e.preventDefault();
                      const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>("[role='menuitem']"));
                      if (items.length === 0) return;
                      const current = items.findIndex((el) => el === document.activeElement);
                      const next = e.key === "ArrowDown"
                        ? current < items.length - 1 ? current + 1 : 0
                        : current > 0 ? current - 1 : items.length - 1;
                      items[next]?.focus();
                    }
                  }}
                >
                  <button
                    role="menuitem"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] focus-visible:outline-none focus:bg-[var(--color-bg)]"
                  >
                    <LogOut className="w-4 h-4" />
                    Abmelden
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-[var(--color-border-light)] flex items-center px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            aria-label="Menü öffnen"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
          >
            Website ansehen →
          </Link>
        </header>

        {/* Page content */}
        <main id="admin-content" className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
