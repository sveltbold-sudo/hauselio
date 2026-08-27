"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CreditCard, AlertTriangle, ArrowLeft, Check as CheckIcon } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ProductImage from "@/components/product/ProductImage";
import { formatPrice } from "@/lib/utils";
import { useCartStore, selectTotal } from "@/lib/store";
import { getShippingCost } from "@/lib/constants";

interface PriceChange {
  id: string;
  name: string;
  oldPrice: number;
  newPrice: number;
  quantity: number;
}

interface InvalidItem {
  id: string;
  error: string;
}

export default function BestellungPage() {
  const router = useRouter();
  const { items, clearCart, updateQuantity, removeItem } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [priceChanges, setPriceChanges] = useState<PriceChange[]>([]);
  const [invalidItems, setInvalidItems] = useState<InvalidItem[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    country: "DE",
    notes: "",
  });

  const total = useCartStore(selectTotal);
  const shippingCost = getShippingCost(total);
  const finalTotal = total + shippingCost;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "E-Mail ist erforderlich";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Ungültige E-Mail-Adresse";
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Vorname ist erforderlich";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Nachname ist erforderlich";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Adresse ist erforderlich";
    }

    if (!formData.zip.trim()) {
      newErrors.zip = "PLZ ist erforderlich";
    } else if (!/^\d{5}$/.test(formData.zip)) {
      newErrors.zip = "PLZ muss genau 5 Ziffern enthalten";
    }

    if (!formData.city.trim()) {
      newErrors.city = "Stadt ist erforderlich";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const hasValidated = useRef(false);
  const clearCartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (clearCartTimerRef.current) {
        clearTimeout(clearCartTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (items.length === 0 || hasValidated.current) return;
    hasValidated.current = true;

    async function validateCart() {
      setIsValidating(true);
      try {
        const res = await fetch("/api/cart/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map((item) => ({
              id: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
          }),
        });

        if (!res.ok) return;

        const data = await res.json();

        const changes: PriceChange[] = [];
        const invalid: InvalidItem[] = [];

        for (const item of data.items) {
          if (!item.valid) {
            invalid.push({ id: item.id, error: item.error });
          } else if (item.priceChanged) {
            changes.push({
              id: item.id,
              name: item.name,
              oldPrice: item.oldPrice,
              newPrice: item.newPrice,
              quantity: item.quantity,
            });
            updateQuantity(item.id, item.quantity);
          }
        }

        setPriceChanges(changes);
        setInvalidItems(invalid);

        for (const item of data.items) {
          if (item.valid && !item.priceChanged) {
            updateQuantity(item.id, item.quantity);
          }
        }

        for (const inv of invalid) {
          removeItem(inv.id);
        }
      } catch {
        setOrderError("Preisüberprüfung fehlgeschlagen. Bitte versuchen Sie es erneut.");
      } finally {
        setIsValidating(false);
      }
    }

    validateCart();
  }, [items, removeItem, updateQuantity]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderError("");

    if (!validate()) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/bestellungen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone || undefined,
          address: formData.address,
          city: formData.city,
          zip: formData.zip,
          country: formData.country,
          notes: formData.notes || undefined,
          items: items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Fehler bei der Bestellung");
      }

      sessionStorage.setItem(`order_${data.order.orderNumber}`, formData.email);
      clearCart();
      router.push(`/bestellung/erfolg?order=${data.order.orderNumber}`);
      clearCartTimerRef.current = setTimeout(() => {
        sessionStorage.removeItem(`order_${data.order.orderNumber}`);
        clearCartTimerRef.current = null;
      }, 5000);
    } catch (error) {
      setOrderError(error instanceof Error ? error.message : "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!mounted) return;
    if (items.length === 0) {
      router.replace("/warenkorb");
    }
  }, [mounted, items.length, router]);

  if (!mounted) {
    return (
      <main className="container-hauselio py-20 text-center">
        <h1 className="heading-2 mb-4 sr-only">Bestellung</h1>
        <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-[var(--color-text-muted)] mt-4">Wird geladen…</p>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="container-hauselio py-20 text-center">
        <h1 className="sr-only">Bestellung</h1>
        <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-[var(--color-text-muted)] mt-4">Wird weitergeleitet…</p>
      </main>
    );
  }

  return (
    <main id="main-content" className="container-hauselio py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-10">
        <Link
          href="/warenkorb"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zum Warenkorb
        </Link>
        <p className="caption text-[var(--color-primary)] mb-3">Checkout</p>
        <h1 className="heading-1">Kasse</h1>
      </div>

      {/* Step indicator */}
      <nav className="flex items-center justify-center gap-2 mb-6 sm:mb-10" aria-label="Bestellschritte">
        <Link
          href="/warenkorb"
          className="flex items-center gap-2 text-sm text-[var(--color-success)] font-semibold"
        >
          <span className="w-6 h-6 rounded-full bg-[var(--color-success)] text-white flex items-center justify-center text-xs">
            <CheckIcon className="w-3.5 h-3.5" />
          </span>
          <span className="hidden sm:inline">Warenkorb</span>
        </Link>
        <div className="w-8 h-px bg-[var(--color-border)]" />
        <span className="flex items-center gap-2 text-sm text-[var(--color-primary)] font-bold" aria-current="step">
          <span className="w-6 h-6 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-xs">
            2
          </span>
          <span className="hidden sm:inline">Kasse</span>
        </span>
        <div className="w-8 h-px bg-[var(--color-border)]" />
        <span className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
          <span className="w-6 h-6 rounded-full bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] flex items-center justify-center text-xs">
            3
          </span>
          <span className="hidden sm:inline">Bestätigung</span>
        </span>
      </nav>

      {/* Price change warnings */}
      {priceChanges.length > 0 && (
        <div className="bg-[var(--color-danger-light)] border border-[var(--color-danger)]/20 rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-[var(--color-danger)]" />
            <h2 className="font-bold text-[var(--color-danger)]">Preisänderungen</h2>
          </div>
          <p className="text-sm text-[var(--color-text-secondary)] mb-3">
            Die Preise einiger Artikel haben sich geändert:
          </p>
          <div className="space-y-2">
            {priceChanges.map((change) => (
              <div key={change.id} className="flex items-center justify-between text-sm">
                <span className="text-[var(--color-text-primary)]">{change.name} × {change.quantity}</span>
                <span>
                  <span className="line-through text-[var(--color-text-muted)] mr-2">{formatPrice(change.oldPrice * change.quantity)}</span>
                  <span className="font-bold text-[var(--color-text-primary)]">{formatPrice(change.newPrice * change.quantity)}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invalid items warnings */}
      {invalidItems.length > 0 && (
        <div className="bg-[var(--color-danger-light)] border border-[var(--color-danger)]/20 rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-[var(--color-danger)]" />
            <h2 className="font-bold text-[var(--color-danger)]">Nicht verfügbare Artikel</h2>
          </div>
          <div className="space-y-1">
            {invalidItems.map((item) => (
              <p key={item.id} className="text-sm text-[var(--color-text-secondary)]">{item.error}</p>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} aria-label="Bestellformular">
        {/* Error summary for screen readers */}
        {Object.keys(errors).length > 0 && (
          <div role="alert" className="mb-6 p-4 bg-[var(--color-danger-light)] border border-[var(--color-danger)]/20 rounded-xl">
            <p className="text-sm font-semibold text-[var(--color-danger)] mb-2">Bitte korrigieren Sie folgende Fehler:</p>
            <ul className="list-disc list-inside text-sm text-[var(--color-text-secondary)] space-y-1">
              {Object.entries(errors).map(([field, msg]) => (
                <li key={field}>
                  <a href={`#${field}`} className="underline hover:text-[var(--color-text-primary)]">{msg}</a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact */}
            <div className="bg-white rounded-2xl border border-[var(--color-border-light)] p-4 sm:p-6">
              <h2 className="heading-3 mb-5">
                Kontaktdaten
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  id="email"
                  label="E-Mail"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                />
                <Input
                  id="phone"
                  label="Telefon (optional)"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Shipping */}
            <div className="bg-white rounded-2xl border border-[var(--color-border-light)] p-4 sm:p-6">
              <h2 className="heading-3 mb-5">
                Lieferadresse
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  id="firstName"
                  label="Vorname"
                  name="firstName"
                  required
                  autoComplete="given-name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  error={errors.firstName}
                />
                <Input
                  id="lastName"
                  label="Nachname"
                  name="lastName"
                  required
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  error={errors.lastName}
                />
                <div className="md:col-span-2">
                  <Input
                    id="address"
                    label="Adresse"
                    name="address"
                    required
                    autoComplete="street-address"
                    value={formData.address}
                    onChange={handleInputChange}
                    error={errors.address}
                  />
                </div>
                <Input
                  id="zip"
                  label="PLZ"
                  name="zip"
                  required
                  inputMode="numeric"
                  pattern="\d{5}"
                  autoComplete="postal-code"
                  value={formData.zip}
                  onChange={handleInputChange}
                  error={errors.zip}
                />
                <Input
                  id="city"
                  label="Stadt"
                  name="city"
                  required
                  autoComplete="address-level2"
                  value={formData.city}
                  onChange={handleInputChange}
                  error={errors.city}
                />
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
                    Land
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    autoComplete="country"
                    className="block w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 min-h-[44px] text-sm text-[var(--color-text-primary)] shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--color-text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] hover:border-[var(--color-border)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="DE">Deutschland</option>
                    <option value="AT">Österreich</option>
                    <option value="CH">Schweiz</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div className="bg-white rounded-2xl border border-[var(--color-border-light)] p-4 sm:p-6">
              <h2 className="heading-3 mb-5">
                Zahlungsart
              </h2>
              <div className="bg-[var(--color-primary-50)] border border-[var(--color-primary)]/20 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-[var(--color-primary)]" />
                  <div>
                    <p className="font-semibold text-[var(--color-text-primary)]">
                      Überweisung (SEPA)
                    </p>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Sie erhalten nach der Bestellung die Bankverbindung per E-Mail.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-2xl border border-[var(--color-border-light)] p-4 sm:p-6">
              <label htmlFor="checkout-notes" className="block text-sm font-semibold text-[var(--color-text-primary)] mb-2">
                Bestellhinweise (optional)
              </label>
              <textarea
                id="checkout-notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="block w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-text-primary)] shadow-sm transition-colors placeholder:text-[var(--color-text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] hover:border-[var(--color-border)] disabled:cursor-not-allowed disabled:opacity-50 resize-none min-h-[100px]"
                placeholder="Besondere Wünsche oder Hinweise…"
              />
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-[var(--color-border-light)] p-4 sm:p-6 sticky top-24">
              <h2 className="heading-3 mb-6">
                Ihre Bestellung
              </h2>

              {/* Items */}
              <ul className="space-y-3 mb-6 max-h-64 overflow-y-auto list-none">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[var(--color-bg-secondary)] rounded-xl overflow-hidden flex-shrink-0">
                      <ProductImage
                        src={item.image}
                        alt={item.name}
                        size="sm"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        {item.quantity} x {formatPrice(item.price)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-[var(--color-text-primary)] tabular-nums">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </li>
                ))}
              </ul>

              {/* Totals */}
              <div className="space-y-3 mb-6 border-t border-[var(--color-border-light)] pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-secondary)]">Zwischensumme</span>
                  <span className="font-semibold">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-secondary)]">Versand</span>
                  <span className="font-semibold">
                    {shippingCost === 0 ? (
                      <span className="text-[var(--color-success)]">Kostenlos</span>
                    ) : (
                      formatPrice(shippingCost)
                    )}
                  </span>
                </div>
                <div className="border-t border-[var(--color-border-light)] pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-[var(--color-text-primary)]">Gesamt</span>
                    <span className="font-bold text-xl text-[var(--color-text-primary)] tabular-nums">
                      {formatPrice(finalTotal)}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">inkl. 19% MwSt.</p>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={isLoading}
                disabled={isValidating || invalidItems.length > 0}
              >
                Bestellung aufgeben
              </Button>
              <p className="text-xs text-center text-[var(--color-text-muted)] mt-2">Sichere Bestellung · 30 Tage Rückgaberecht</p>

              {orderError && (
                <div aria-live="polite" className="mt-4 bg-[var(--color-danger-light)] border border-[var(--color-danger)]/20 rounded-xl p-4 text-sm text-[var(--color-text-secondary)]">
                  {orderError}
                </div>
              )}

              <p className="text-xs text-[var(--color-text-muted)] text-center mt-4">
                Mit der Bestellung akzeptieren Sie unsere{" "}
                <Link href="/agb" className="text-[var(--color-primary)] hover:underline">
                  AGB
                </Link>{" "}
                und{" "}
                <Link href="/widerruf" className="text-[var(--color-primary)] hover:underline">
                  Widerrufsrecht
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}
