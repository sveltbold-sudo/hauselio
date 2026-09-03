"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff, ShoppingBag, Heart, Settings, LogOut, Loader2, User, Phone, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { formatPrice } from "@/lib/utils";

interface Customer {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  address?: string | null;
  zip?: string | null;
  city?: string | null;
  country?: string | null;
  createdAt?: string;
}

interface OrderItem {
  name: string;
  slug: string;
  image: string | null;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderNumber: string;
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  total: number;
  shippingCost: number;
  createdAt: string;
  items: OrderItem[];
}

export default function KontoPage() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [error, setError] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  // Profile form state
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileAddress, setProfileAddress] = useState("");
  const [profileZip, setProfileZip] = useState("");
  const [profileCity, setProfileCity] = useState("");
  const [profileCountry, setProfileCountry] = useState("DE");

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/customer/me")
      .then((r) => {
        if (!r.ok) return null;
        return r.json();
      })
      .then((data) => {
        if (data?.customer) {
          setCustomer(data.customer);
          setProfileName(data.customer.name || "");
          setProfilePhone(data.customer.phone || "");
          setProfileAddress(data.customer.address || "");
          setProfileZip(data.customer.zip || "");
          setProfileCity(data.customer.city || "");
          setProfileCountry(data.customer.country || "DE");
        }
      })
      .catch(() => {})
      .finally(() => setIsAuthLoading(false));
  }, []);

  useEffect(() => {
    if (!customer?.email) return;
    setOrdersLoading(true);
    fetch("/api/customer/orders")
      .then((r) => {
        if (!r.ok) return { orders: [] };
        return r.json();
      })
      .then((data) => setOrders(data.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false));
  }, [customer?.email]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await fetch("/api/customer/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Anmeldung fehlgeschlagen");
      setCustomer(data.customer);
      setProfileName(data.customer.name || "");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await fetch("/api/customer/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registrierung fehlgeschlagen");
      setCustomer(data.customer);
      setProfileName(data.customer.name || "");
      setEmail("");
      setPassword("");
      setName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/customer/logout", { method: "POST" });
    } catch {}
    setCustomer(null);
    setProfileName("");
    setProfilePhone("");
    setProfileAddress("");
    setProfileZip("");
    setProfileCity("");
    setProfileCountry("DE");
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");
    setIsProfileLoading(true);

    if (profileZip && !/^\d{4,5}$/.test(profileZip)) {
      setProfileError("PLZ muss 4 oder 5 Ziffern enthalten");
      setIsProfileLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/customer/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profileName,
          phone: profilePhone || null,
          address: profileAddress || null,
          zip: profileZip || null,
          city: profileCity || null,
          country: profileCountry,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Fehler beim Speichern");
      setCustomer((prev) => prev ? { ...prev, ...data.customer } : prev);
      setProfileSuccess("Profil erfolgreich aktualisiert.");
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "Fehler beim Speichern.");
    } finally {
      setIsProfileLoading(false);
    }
  };

  if (isAuthLoading) {
    return (
      <main id="main-content" className="container-hausaura py-20 text-center">
        <h1 className="sr-only">Mein Konto</h1>
        <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto" />
      </main>
    );
  }

  if (customer) {
    return (
      <main id="main-content" className="container-hausaura py-12">
        <Breadcrumb items={[{ label: "Startseite", href: "/" }, { label: "Mein Konto" }]} />

        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-2xl font-bold">
              {customer.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="heading-2">{customer.name}</h1>
              <p className="text-[var(--color-text-muted)] text-sm">{customer.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            <div
              className="flex items-center gap-3 p-5 bg-white rounded-2xl border border-[var(--color-border-light)] hover:shadow-md transition-shadow"
            >
              <ShoppingBag className="w-5 h-5 text-[var(--color-primary)]" />
              <div className="flex-1">
                <div className="font-bold text-sm">Meine Bestellungen</div>
                <div className="text-xs text-[var(--color-text-muted)]">
                  {ordersLoading ? "Wird geladen…" : orders.length === 0 ? "Noch keine Bestellungen" : `${orders.length} Bestellung${orders.length > 1 ? "en" : ""}`}
                </div>
              </div>
            </div>

            <Link
              href="/wunschliste"
              className="flex items-center gap-3 p-5 bg-white rounded-2xl border border-[var(--color-border-light)] hover:shadow-md transition-shadow"
            >
              <Heart className="w-5 h-5 text-[var(--color-primary)]" />
              <div>
                <div className="font-bold text-sm">Wunschliste</div>
                <div className="text-xs text-[var(--color-text-muted)]">Gespeicherte Produkte</div>
              </div>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 p-5 bg-white rounded-2xl border border-[var(--color-border-light)] hover:shadow-md transition-shadow text-left"
            >
              <LogOut className="w-5 h-5 text-[var(--color-danger)]" />
              <div>
                <div className="font-bold text-sm text-[var(--color-danger)]">Abmelden</div>
                <div className="text-xs text-[var(--color-text-muted)]">Konto verlassen</div>
              </div>
            </button>
          </div>

          {/* Orders section */}
          {orders.length > 0 && (
            <div className="bg-white rounded-2xl border border-[var(--color-border-light)] mb-10">
              <div className="p-5 border-b border-[var(--color-border-light)]">
                <h2 className="heading-3 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[var(--color-primary)]" />
                  Bestellungen
                </h2>
              </div>
              <div className="divide-y divide-[var(--color-border-light)]">
                {orders.map((order) => {
                  const isExpanded = expandedOrder === order.id;
                  const statusLabel: Record<string, string> = {
                    PENDING: "Ausstehend",
                    CONFIRMED: "Bestätigt",
                    SHIPPED: "Versandt",
                    DELIVERED: "Zugestellt",
                    CANCELLED: "Storniert",
                  };
                  const statusColor: Record<string, string> = {
                    PENDING: "bg-yellow-100 text-yellow-800",
                    CONFIRMED: "bg-blue-100 text-blue-800",
                    SHIPPED: "bg-purple-100 text-purple-800",
                    DELIVERED: "bg-green-100 text-green-800",
                    CANCELLED: "bg-red-100 text-red-800",
                  };
                  const orderDate = new Date(order.createdAt).toLocaleDateString("de-DE", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  });
                  return (
                    <div key={order.id}>
                      <button
                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                        aria-expanded={isExpanded}
                        className="w-full flex items-center gap-4 p-5 text-left hover:bg-[var(--color-bg-secondary)] transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-bold text-sm text-[var(--color-text-primary)]">
                              Bestell-Nr. {order.orderNumber}
                            </span>
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[order.status] || "bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]"}`}>
                              {statusLabel[order.status] || order.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
                            <span>{orderDate}</span>
                            <span>Gesamtbetrag: {formatPrice(order.total)}</span>
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-[var(--color-text-muted)] flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-[var(--color-text-muted)] flex-shrink-0" />
                        )}
                      </button>
                      {isExpanded && (
                        <div className="px-5 pb-5">
                          <h3 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-3">Artikel</h3>
                          <div className="space-y-3">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-4 p-3 bg-[var(--color-bg-secondary)] rounded-xl">
                                <div className="w-14 h-14 bg-white border border-[var(--color-border-light)] rounded-xl overflow-hidden flex-shrink-0">
                                  {item.image ? (
                                    <Image src={item.image} alt={item.name} width={56} height={56} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[var(--color-text-muted)]">
                                      <ShoppingBag className="w-5 h-5" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-semibold text-sm text-[var(--color-text-primary)] truncate">{item.name}</div>
                                  <div className="text-xs text-[var(--color-text-muted)]">Menge: {item.quantity}</div>
                                </div>
                                  <div className="text-sm font-bold text-[var(--color-text-primary)]">
                                    {formatPrice(item.price)}
                                  </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 flex justify-end gap-4 text-sm">
                            {order.shippingCost > 0 && (
                              <span className="text-[var(--color-text-muted)]">Versand: {formatPrice(order.shippingCost)}</span>
                            )}
                            <span className="font-bold text-[var(--color-text-primary)]">Gesamt: {formatPrice(order.total)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Profile form */}
          <div className="bg-white rounded-2xl border border-[var(--color-border-light)] p-4 sm:p-6">
            <h2 className="heading-3 mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5 text-[var(--color-primary)]" />
              Kontoeinstellungen
            </h2>

            {profileSuccess && (
              <div role="status" className="p-3 bg-[var(--color-success-light)] text-[var(--color-success)] text-sm rounded-xl mb-4">
                {profileSuccess}
              </div>
            )}
            {profileError && (
              <div role="alert" className="p-3 bg-[var(--color-danger-light)] text-[var(--color-danger)] text-sm rounded-xl mb-4">
                {profileError}
              </div>
            )}

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label htmlFor="profile-name" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                  <input
                    id="profile-name"
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="profile-phone" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Telefon (optional)</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                  <input
                    id="profile-phone"
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    placeholder="+49 ..."
                    className="w-full pl-10 pr-4 py-3 bg-white border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="profile-address" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Adresse (optional)</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                  <input
                    id="profile-address"
                    type="text"
                    value={profileAddress}
                    onChange={(e) => setProfileAddress(e.target.value)}
                    placeholder="Straße und Hausnummer"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="profile-zip" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">PLZ</label>
                  <input
                    id="profile-zip"
                    type="text"
                    value={profileZip}
                    onChange={(e) => setProfileZip(e.target.value)}
                    placeholder="10435"
                    className="w-full px-4 py-3 bg-white border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-colors"
                  />
                </div>
                <div className="col-span-2">
                  <label htmlFor="profile-city" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Stadt</label>
                  <input
                    id="profile-city"
                    type="text"
                    value={profileCity}
                    onChange={(e) => setProfileCity(e.target.value)}
                    placeholder="Berlin"
                    className="w-full px-4 py-3 bg-white border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="profile-country" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Land</label>
                <select
                  id="profile-country"
                  value={profileCountry}
                  onChange={(e) => setProfileCountry(e.target.value)}
                  className="block w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 min-h-[44px] text-sm text-[var(--color-text-primary)] shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
                >
                  <option value="DE">Deutschland</option>
                  <option value="AT">Österreich</option>
                  <option value="CH">Schweiz</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isProfileLoading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-xl hover:bg-[var(--color-primary-hover)] transition-colors min-h-[44px] disabled:opacity-50"
              >
                {isProfileLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Wird gespeichert…</> : "Profil speichern"}
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="container-hausaura py-12">
      <Breadcrumb items={[{ label: "Startseite", href: "/" }, { label: "Mein Konto" }]} />

      <div className="max-w-md mx-auto">
        <h1 className="heading-1 text-center mb-4">Mein Konto</h1>

        <div
          role="tablist"
          aria-label="Anmeldung oder Registrierung"
          className="flex bg-[var(--color-bg-secondary)] rounded-xl p-1 mb-8"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") {
              e.preventDefault();
              setTab("register");
              setError("");
            } else if (e.key === "ArrowLeft") {
              e.preventDefault();
              setTab("login");
              setError("");
            }
          }}
        >
          <button
            role="tab"
            id="tab-login"
            aria-selected={tab === "login"}
            aria-controls="panel-login"
            tabIndex={tab === "login" ? 0 : -1}
            onClick={() => { setTab("login"); setError(""); }}
            className={`flex-1 min-h-[44px] py-2.5 text-sm font-semibold rounded-lg transition-colors ${
              tab === "login"
                ? "bg-white text-[var(--color-primary)] shadow-sm"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            Anmelden
          </button>
          <button
            role="tab"
            id="tab-register"
            aria-selected={tab === "register"}
            aria-controls="panel-register"
            tabIndex={tab === "register" ? 0 : -1}
            onClick={() => { setTab("register"); setError(""); }}
            className={`flex-1 min-h-[44px] py-2.5 text-sm font-semibold rounded-lg transition-colors ${
              tab === "register"
                ? "bg-white text-[var(--color-primary)] shadow-sm"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            Registrieren
          </button>
        </div>

        {tab === "login" ? (
          <form id="panel-login" role="tabpanel" aria-labelledby="tab-login" onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div role="alert" className="p-3 bg-[var(--color-danger-light)] text-[var(--color-danger)] text-sm rounded-xl">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">E-Mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@beispiel.de"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Passwort</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-white border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Passwort verbergen" : "Passwort anzeigen"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] p-2 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-xl hover:bg-[var(--color-primary-hover)] transition-colors min-h-[44px] disabled:opacity-50"
            >
              {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Wird angemeldet…</> : "Anmelden"}
            </button>

            <p className="text-center text-xs text-[var(--color-text-muted)]">
              <Link href="/passwort-zuruecksetzen" className="text-[var(--color-primary)] hover:underline">
                Passwort vergessen?
              </Link>
            </p>
          </form>
        ) : (
          <form id="panel-register" role="tabpanel" aria-labelledby="tab-register" onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div role="alert" className="p-3 bg-[var(--color-danger-light)] text-[var(--color-danger)] text-sm rounded-xl">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="register-name" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                <input
                  id="register-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ihr Name"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="register-email" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">E-Mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                <input
                  id="register-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@beispiel.de"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="register-password" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Passwort</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mindestens 8 Zeichen"
                  className="w-full pl-10 pr-12 py-3 bg-white border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-colors"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Passwort verbergen" : "Passwort anzeigen"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] p-2 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-xl hover:bg-[var(--color-primary-hover)] transition-colors min-h-[44px] disabled:opacity-50"
            >
              {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Wird erstellt…</> : "Konto erstellen"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
