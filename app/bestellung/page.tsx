"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CreditCard, AlertTriangle, ArrowLeft, ArrowRight, Check as CheckIcon, Truck, Shield, User, FileText, Lock, Clock, HelpCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ProductImage from "@/components/product/ProductImage";
import { formatPrice, getVatLabel } from "@/lib/utils";
import { useCartStore, selectTotal } from "@/lib/store";
import { getShippingCost, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { trackBeginCheckout } from "@/lib/analytics";

interface PriceChange {
  id: string;
  name: string;
  oldPrice: number;
  newPrice: number;
  quantity: number;
}

type Step = "address" | "review";

export default function BestellungPage() {
  const router = useRouter();
  const { items, clearCart, coupon, updatePrice, removeItem } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<Step>("address");
  const [priceChanges, setPriceChanges] = useState<PriceChange[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const orderSubmitted = useRef(false);
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

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/customer/me");
        if (res.ok) {
          const data = await res.json();
          if (data.customer) {
            setFormData((prev) => ({
              ...prev,
              email: prev.email || data.customer.email || "",
              firstName: prev.firstName || (data.customer.name || "").split(" ")[0] || "",
              lastName: prev.lastName || (data.customer.name || "").split(" ").slice(1).join(" ") || "",
              phone: prev.phone || data.customer.phone || "",
              address: prev.address || data.customer.address || "",
              zip: prev.zip || data.customer.zip || "",
              city: prev.city || data.customer.city || "",
              country: prev.country || data.customer.country || "DE",
              notes: prev.notes,
            }));
          }
        }
      } catch {
        // Silently fail — user can fill manually
      }
    }
    if (mounted) loadProfile();
  }, [mounted]);

  const total = useCartStore(selectTotal);
  const shippingCost = getShippingCost(total);
  const couponDiscount = coupon ? total * (coupon.discountPercent / 100) : 0;
  const finalTotal = total - couponDiscount + shippingCost;

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
    } else {
      const plzValid = formData.country === "DE"
        ? /^\d{5}$/.test(formData.zip)
        : /^\d{4}$/.test(formData.zip);
      if (!plzValid) {
        newErrors.zip = formData.country === "DE"
          ? "Deutsche PLZ muss 5 Ziffern enthalten"
          : "PLZ muss 4 Ziffern enthalten (AT/CH)";
      }
    }

    if (formData.phone && !/^[\d\s\+\-\(\)]{7,20}$/.test(formData.phone)) {
      newErrors.phone = "Ungültige Telefonnummer";
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
        const invalidItems: string[] = [];

        for (const item of data.items) {
          if (!item.valid) {
            invalidItems.push(item.name || item.id);
            removeItem(item.id);
          } else if (item.priceChanged) {
            changes.push({
              id: item.id,
              name: item.name,
              oldPrice: item.oldPrice,
              newPrice: item.newPrice,
              quantity: item.quantity,
            });
            updatePrice(item.id, item.newPrice);
          }
        }

        if (invalidItems.length > 0) {
          setOrderError(
            `${invalidItems.length === 1 ? "Ein Artikel ist" : `${invalidItems.length} Artikel sind`} nicht mehr verfügbar und wurde aus dem Warenkorb entfernt: ${invalidItems.join(", ")}`
          );
        }

        setPriceChanges(changes);
      } catch {
        setOrderError("Preisüberprüfung fehlgeschlagen. Bitte versuchen Sie es erneut.");
      } finally {
        setIsValidating(false);
      }
    }

    validateCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, updatePrice]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleNextStep = () => {
    if (!validate()) return;
    setStep("review");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (orderSubmitted.current) return;
    orderSubmitted.current = true;
    setOrderError("");
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
          couponCode: coupon?.code || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Fehler bei der Bestellung");
      }

      sessionStorage.setItem(`order_${data.order.orderNumber}`, formData.email);
      orderSubmitted.current = true;
      const checkoutItems: { id: string; name: string; price: number; quantity: number }[] = items.map((item) => ({ id: item.id, name: item.name, price: item.price, quantity: item.quantity }));
      trackBeginCheckout(finalTotal, checkoutItems);
      clearCart();
      router.push(`/bestellung/erfolg?order=${data.order.orderNumber}`);
      clearCartTimerRef.current = setTimeout(() => {
        sessionStorage.removeItem(`order_${data.order.orderNumber}`);
        clearCartTimerRef.current = null;
      }, 120000);
    } catch (error) {
      orderSubmitted.current = false;
      setOrderError(error instanceof Error ? error.message : "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (mounted && items.length === 0 && !orderSubmitted.current && !isValidating) {
      router.replace("/warenkorb");
    }
  }, [mounted, items.length, isValidating, router]);

  if (!mounted) {
    return (
      <main id="main-content" className="container-hausaura py-20 text-center">
        <h1 className="heading-2 mb-4 sr-only">Bestellung</h1>
        <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-[var(--color-text-muted)] mt-4">Wird geladen…</p>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main id="main-content" className="container-hausaura py-20 text-center">
        <h1 className="sr-only">Bestellung</h1>
        <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-[var(--color-text-muted)] mt-4">Wird weitergeleitet…</p>
      </main>
    );
  }

  return (
    <main id="main-content" className="container-hausaura py-6 sm:py-8">
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
        <h1 className="heading-1 mb-4">Sicher bestellen</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1 flex items-center gap-1.5">
          <User className="w-4 h-4" />
          Kein Konto erforderlich · Schnell & einfach
        </p>
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
        <div className="w-4 sm:w-8 h-px bg-[var(--color-border)]" />
        <span
          className={`flex items-center gap-2 text-sm font-bold ${step === "address" ? "text-[var(--color-primary)]" : "text-[var(--color-success)]"}`}
          aria-current={step === "address" ? "step" : undefined}
        >
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === "address" ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-success)] text-white"}`}>
            {step === "review" ? <CheckIcon className="w-3.5 h-3.5" /> : "2"}
          </span>
          <span className="hidden sm:inline">Adresse</span>
        </span>
        <div className="w-4 sm:w-8 h-px bg-[var(--color-border)]" />
        <span className={`flex items-center gap-2 text-sm font-bold ${step === "review" ? "text-[var(--color-primary)]" : "text-[var(--color-text-muted)]"}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === "review" ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)]"}`}>
            3
          </span>
          <span className="hidden sm:inline">Bestätigung</span>
        </span>
      </nav>

      {/* Price change warnings */}
      {priceChanges.length > 0 && (
        <div role="alert" className="bg-[var(--color-danger-light)] border border-[var(--color-danger)]/20 rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-[var(--color-danger)]" />
            <h2 className="font-bold text-[var(--color-danger)]">Preisänderungen</h2>
          </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Error summary */}
          {Object.keys(errors).length > 0 && (
            <div role="alert" aria-live="assertive" className="p-4 bg-[var(--color-danger-light)] border border-[var(--color-danger)]/20 rounded-xl">
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

          {/* ===== STEP 1: ADDRESS ===== */}
          {step === "address" && (
            <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }} aria-label="Adressformular">
              {/* Contact */}
              <div className="bg-white rounded-2xl border border-[var(--color-border-light)] p-4 sm:p-6 mb-6">
                <h2 className="heading-3 mb-5 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-xs font-bold">1</span>
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
                <p className="text-xs text-[var(--color-text-muted)] mt-3">
                  Wir senden Ihre Bestellbestätigung und Zahlungsdaten an diese Adresse.
                </p>
              </div>

              {/* Shipping */}
              <div className="bg-white rounded-2xl border border-[var(--color-border-light)] p-4 sm:p-6 mb-6">
                <h2 className="heading-3 mb-5 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-xs font-bold">2</span>
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
                    pattern="\d{4,5}"
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
                      className="block w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 min-h-[44px] text-sm text-[var(--color-text-primary)] shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] hover:border-[var(--color-border)]"
                    >
                      <option value="DE">Deutschland</option>
                      <option value="AT">Österreich</option>
                      <option value="CH">Schweiz</option>
                    </select>
                  </div>
                </div>


              </div>

              {/* Notes */}
              <div className="bg-white rounded-2xl border border-[var(--color-border-light)] p-4 sm:p-6 mb-6">
                <label htmlFor="checkout-notes" className="block text-sm font-semibold text-[var(--color-text-primary)] mb-2">
                  Bestellhinweise (optional)
                </label>
                <textarea
                  id="checkout-notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="block w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-text-primary)] shadow-sm transition-colors placeholder:text-[var(--color-text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] hover:border-[var(--color-border)] resize-none min-h-[100px]"
                  placeholder="Klingel links, Hinterhof, Etage…"
                />
              </div>

              {/* Continue button */}
              <Button type="submit" className="w-full" size="lg">
                Weiter zur Bestätigung
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </form>
          )}

          {/* ===== STEP 2: REVIEW ===== */}
          {step === "review" && (
            <>
              {/* Back button */}
              <button
                onClick={() => { setStep("address"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="inline-flex items-center gap-2 py-2 min-h-[44px] text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Zurück zur Adresse
              </button>

              {/* Address summary */}
              <div className="bg-white rounded-2xl border border-[var(--color-border-light)] p-4 sm:p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="heading-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[var(--color-primary)]" />
                    Ihre Daten
                  </h2>
                  <button
                    onClick={() => setStep("address")}
                    className="min-h-[44px] px-3 py-2 text-xs font-semibold text-[var(--color-primary)] hover:underline rounded-lg hover:bg-[var(--color-primary-50)] transition-colors"
                  >
                    Ändern
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[var(--color-text-muted)] mb-0.5">E-Mail</p>
                    <p className="font-medium text-[var(--color-text-primary)]">{formData.email}</p>
                  </div>
                  {formData.phone && (
                    <div>
                      <p className="text-[var(--color-text-muted)] mb-0.5">Telefon</p>
                      <p className="font-medium text-[var(--color-text-primary)]">{formData.phone}</p>
                    </div>
                  )}
                  <div className="sm:col-span-2">
                    <p className="text-[var(--color-text-muted)] mb-0.5">Lieferadresse</p>
                    <p className="font-medium text-[var(--color-text-primary)]">
                      {formData.firstName} {formData.lastName}<br />
                      {formData.address}<br />
                      {formData.zip} {formData.city}<br />
                      {formData.country === "DE" ? "Deutschland" : formData.country === "AT" ? "Österreich" : "Schweiz"}
                    </p>
                  </div>
                  {formData.notes && (
                    <div className="sm:col-span-2">
                      <p className="text-[var(--color-text-muted)] mb-0.5">Hinweise</p>
                      <p className="font-medium text-[var(--color-text-primary)]">{formData.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment method */}
              <div className="bg-white rounded-2xl border border-[var(--color-border-light)] p-4 sm:p-6 mb-6">
                <h2 className="heading-3 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[var(--color-primary)]" />
                  Zahlungsart
                </h2>
                <div className="bg-[var(--color-primary-50)] border border-[var(--color-primary)]/20 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--color-text-primary)]">
                        Überweisung (Vorkasse)
                      </p>
                      <p className="text-sm text-[var(--color-text-secondary)]">
                        Sicher & datenschutzkonform
                      </p>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 mt-3">
                    <p className="text-xs text-[var(--color-text-muted)] mb-3 font-medium uppercase tracking-wider">So geht es weiter:</p>
                    <div className="space-y-3">
                      {[
                        { step: "1", text: "Bestellung abschließen", icon: CheckIcon },
                        { step: "2", text: "Bankverbindung per E-Mail erhalten", icon: HelpCircle },
                        { step: "3", text: "Überweisung tätigen (innerhalb 5 Werktagen)", icon: Clock },
                        { step: "4", text: "Versand nach Zahlungseingang", icon: Truck },
                      ].map((item) => (
                        <div key={item.step} className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-xs font-bold shrink-0">
                            {item.step}
                          </span>
                          <span className="text-sm text-[var(--color-text-secondary)]">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
                  <Truck className="w-4 h-4 text-[var(--color-text-muted)] shrink-0" />
                  <span>Voraussichtliche Lieferung: <strong>2-5 Werktage</strong> nach Zahlungseingang</span>
                </div>
                <div className="mt-3 flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
                  <Lock className="w-4 h-4 text-[var(--color-success)] shrink-0" />
                  <span>SSL-verschlüsselt · Keine sensiblen Daten nötig</span>
                </div>
              </div>

              {/* Trust signals */}
              <div className="bg-[var(--color-bg-secondary)] rounded-2xl p-4 sm:p-5 mb-6">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                    <Shield className="w-4 h-4 text-[var(--color-success)]" />
                    <span>SSL-Verschlüsselung</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                    <Truck className="w-4 h-4 text-[var(--color-success)]" />
                    <span>Kostenloser Versand ab 50€</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                    <CheckIcon className="w-4 h-4 text-[var(--color-success)]" />
                    <span>30 Tage Rückgaberecht</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                    <Lock className="w-4 h-4 text-[var(--color-success)]" />
                    <span>Keine versteckten Kosten</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-[var(--color-border-light)] flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                  <CreditCard className="w-4 h-4 text-[var(--color-success)]" />
                  <span>Kein Konto erforderlich · Keine Kreditkarte nötig</span>
                </div>
              </div>

              {/* Order button */}
              <Button
                onClick={handleSubmit}
                className="w-full shadow-lg shadow-[var(--color-primary)]/20 hover:shadow-[var(--color-primary)]/30 hover:shadow-xl"
                size="lg"
                isLoading={isLoading}
                disabled={isValidating}
              >
                <CheckIcon className="w-5 h-5 mr-2" />
                Jetzt verbindlich bestellen · {formatPrice(finalTotal)}
              </Button>
              <p className="text-xs text-center text-[var(--color-text-muted)] mt-3">
                Mit der Bestellung akzeptieren Sie unsere{" "}
                <Link href="/agb" className="text-[var(--color-primary)] hover:underline">AGB</Link>{" "}
                und{" "}
                <Link href="/widerruf" className="text-[var(--color-primary)] hover:underline">Widerrufsrecht</Link>.
              </p>

              {orderError && (
                <div aria-live="polite" className="mt-4 bg-[var(--color-danger-light)] border border-[var(--color-danger)]/20 rounded-xl p-4 text-sm text-[var(--color-text-secondary)]">
                  {orderError}
                </div>
              )}
            </>
          )}
        </div>

        {/* Summary — always visible */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-[var(--color-border-light)] p-4 sm:p-6 lg:sticky lg:top-24">
            <h2 className="heading-3 mb-4">
              Ihre Bestellung
            </h2>

            {/* Items */}
            <ul className="space-y-3 mb-4 max-h-48 overflow-y-auto list-none">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[var(--color-bg-secondary)] rounded-xl overflow-hidden flex-shrink-0">
                    <ProductImage src={item.image} alt={item.name} size="sm" />
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
            <div className="space-y-3 border-t border-[var(--color-border-light)] pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--color-text-secondary)]">Zwischensumme</span>
                <span className="font-semibold">{formatPrice(total)}</span>
              </div>
              {shippingCost > 0 && total < FREE_SHIPPING_THRESHOLD && (
                <div className="bg-[var(--color-primary-50)] rounded-xl p-3">
                  <p className="text-xs text-[var(--color-primary)] font-medium">
                    Noch {formatPrice(FREE_SHIPPING_THRESHOLD - total)} bis zum kostenlosen Versand
                  </p>
                </div>
              )}
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
              {coupon && (
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-success)]">Rabatt ({coupon.label})</span>
                  <span className="font-semibold text-[var(--color-success)]">-{formatPrice(couponDiscount)}</span>
                </div>
              )}
              <div className="border-t border-[var(--color-border-light)] pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-[var(--color-text-primary)]">Gesamt</span>
                  <span className="font-bold text-2xl text-[var(--color-text-primary)] tabular-nums">
                    {formatPrice(finalTotal)}
                  </span>
                </div>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">{getVatLabel(formData.country)}</p>
              </div>
            </div>

            {/* Trust */}
            <ul className="mt-4 pt-4 border-t border-[var(--color-border-light)] space-y-2 list-none">
              <li className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                <Truck className="w-4 h-4 text-[var(--color-success)]" />
                <span>Versand in DE/AT/CH</span>
              </li>
              <li className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                <Shield className="w-4 h-4 text-[var(--color-success)]" />
                <span>Sichere Datenübertragung</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
