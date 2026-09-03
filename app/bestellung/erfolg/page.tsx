"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import Input from "@/components/ui/Input";
import PaymentTimeline from "@/components/ui/PaymentTimeline";
import { Check, Copy, ArrowRight, AlertCircle, Truck, Clock, Shield, HelpCircle, ChevronDown } from "lucide-react";
import { trackPurchase } from "@/lib/analytics";

interface BankDetails {
  accountName: string;
  iban: string;
  bic: string;
}

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  shippingCost: number;
  items: {
    product: { name: string };
    quantity: number;
    price: number;
  }[];
}

function getOrderCouponDiscount(order: Order): number {
  const itemsSubtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const expectedTotal = itemsSubtotal - 0 + order.shippingCost;
  const diff = expectedTotal - order.total;
  return diff > 0.01 ? Math.round(diff * 100) / 100 : 0;
}

const faqItems = [
  {
    q: "Wann muss ich überweisen?",
    a: "Bitte überweisen Sie den Betrag innerhalb von 5 Werktagen. Ihre Bestellung wird danach umgehend versendet.",
  },
  {
    q: "Was passiert, wenn ich nicht überweise?",
    a: "Ohne Zahlungseingang können wir Ihre Bestellung leider nicht bearbeiten. Sie können jederzeit eine neue Bestellung aufgeben.",
  },
  {
    q: "Kann ich eine andere Zahlungsmethode verwenden?",
    a: "Derzeit bieten wir ausschließlich die Zahlung per Überweisung (Vorkasse) an – für maximale Sicherheit Ihrer Daten.",
  },
  {
    q: "Wann wird mein Paket versendet?",
    a: "Sobald Ihre Zahlung bei uns eingegangen ist, wird Ihre Bestellung innerhalb von 1-2 Werktagen versendet.",
  },
];

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const [orderEmail, setOrderEmail] = useState<string | null>(() => {
    if (orderId && typeof window !== "undefined") {
      const stored = sessionStorage.getItem(`order_${orderId}`);
      if (stored) {
        sessionStorage.removeItem(`order_${orderId}`);
        return stored;
      }
    }
    return null;
  });
  const [order, setOrder] = useState<Order | null>(null);
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [orderLoading, setOrderLoading] = useState(true);
  const [orderError, setOrderError] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(() => {
    if (orderId && typeof window !== "undefined") {
      return sessionStorage.getItem(`order_${orderId}`) === null;
    }
    return false;
  });
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(5 * 24 * 60 * 60);

  useEffect(() => {
    if (!orderId || orderLoading) return;
    const timer = setInterval(() => setRemaining((r) => (r > 0 ? r - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, [orderId, orderLoading]);

  useEffect(() => {
    if (orderId && orderEmail) {
      fetch(`/api/bestellungen?orderNumber=${encodeURIComponent(orderId)}&email=${encodeURIComponent(orderEmail)}`)
        .then((r) => {
          if (!r.ok) throw new Error("Bestellung nicht gefunden");
          return r.json();
        })
        .then((data) => {
          setOrder(data.order);
          // Calculate remaining time from order creation
          const orderDate = new Date(data.order.createdAt);
          const deadline = new Date(orderDate.getTime() + 5 * 24 * 60 * 60 * 1000);
          const now = new Date();
          const diff = Math.max(0, Math.floor((deadline.getTime() - now.getTime()) / 1000));
          setRemaining(diff);
          trackPurchase(data.order.orderNumber, data.order.total, data.order.items.length);
        })
        .catch(() => {
          setOrderError("Bestellung konnte nicht geladen werden. Bitte überprüfen Sie Ihre E-Mail und Bestellnummer.");
        })
        .finally(() => setOrderLoading(false));

      fetch("/api/bank")
        .then((r) => r.json())
        .then((data) => {
          if (data.bank) {
            setBankDetails({
              accountName: data.bank.accountName || "HAUSAURA GmbH",
              iban: data.bank.iban || "",
              bic: data.bank.bic || "",
            });
          }
        })
        .catch(() => {
          setBankDetails({
            accountName: "HAUSAURA GmbH",
            iban: "",
            bic: "",
          });
        });
    }
  }, [orderId, orderEmail]);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const timerDays = Math.floor(remaining / (24 * 60 * 60));
  const timerHours = String(Math.floor((remaining % (24 * 60 * 60)) / (60 * 60))).padStart(2, "0");
  const timerMin = String(Math.floor((remaining % (60 * 60)) / 60)).padStart(2, "0");

  if (!orderId) {
    return (
      <main id="main-content" className="container-hausaura py-24 text-center max-w-2xl mx-auto">
        <h1 className="heading-2 mb-4">Keine Bestellung gefunden</h1>
        <p className="body-large mb-10">
          Es wurde keine Bestellnummer angegeben. Bitte geben Sie Ihre Bestellung über den normalen Checkout-Prozess auf.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--color-accent)] text-white font-semibold rounded-xl hover:bg-[var(--color-accent-hover)] transition-colors"
        >
          Zum Shop
          <ArrowRight className="w-5 h-5" />
        </Link>
      </main>
    );
  }

  return (
    <main id="main-content" className="container-hausaura py-12 sm:py-16 max-w-3xl mx-auto">
      {/* Success Icon */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-[var(--color-success-light)] rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
          <Check className="w-10 h-10 text-[var(--color-success)]" />
        </div>
        <h1 className="heading-2 mb-3">Vielen Dank für Ihre Bestellung!</h1>
        <p className="body-large text-[var(--color-text-secondary)]">
          Ihre Bestellung wurde erfolgreich aufgegeben.
        </p>
      </div>

      {/* Payment reminder */}
      {remaining > 0 && (
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="flex items-center justify-center gap-2 px-5 py-3 bg-[var(--color-primary-50)] border border-[var(--color-primary)]/20 rounded-xl mb-6"
        >
          <Clock className="w-4 h-4 text-[var(--color-primary)]" />
          <span className="text-sm font-medium text-[var(--color-primary)]">
            Bitte bezahlen Sie innerhalb von {timerDays} {timerDays === 1 ? "Tag" : "Tagen"}, {timerHours} Stunden und {timerMin} Minuten
          </span>
        </div>
      )}

      {/* Timeline */}
      <div className="bg-white rounded-2xl border border-[var(--color-border-light)] p-5 sm:p-6 mb-6">
        <PaymentTimeline currentStep="payment-pending" />
      </div>

      {/* Delivery estimate */}
      <div className="flex items-center justify-center gap-2 text-sm text-[var(--color-text-secondary)] mb-8">
        <Truck className="w-4 h-4 text-[var(--color-text-muted)]" />
        <span>Voraussichtliche Lieferung: <strong>2-5 Werktage</strong> nach Zahlungseingang</span>
      </div>

      {/* Email input form (shown when sessionStorage is empty) */}
      {showEmailForm && !orderEmail && (
        <div className="bg-white rounded-2xl border border-[var(--color-border-light)] p-4 sm:p-6 mb-8 text-left">
          <p className="text-sm text-[var(--color-text-secondary)] mb-4">
            Geben Sie die E-Mail-Adresse ein, die Sie bei der Bestellung verwendet haben:
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (emailInput.trim()) {
                setOrderEmail(emailInput.trim());
                setShowEmailForm(false);
                setOrderLoading(true);
              }
            }}
            className="flex flex-col sm:flex-row gap-2"
          >
            <label htmlFor="email" className="sr-only">E-Mail-Adresse</label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="ihre@email.de"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              required
              autoComplete="email"
              inputMode="email"
              className="flex-1"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-[var(--color-primary)] text-white rounded-xl text-sm font-semibold hover:bg-[var(--color-primary-hover)] transition-colors"
            >
              Bestellung anzeigen
            </button>
          </form>
        </div>
      )}

      {/* Loading state */}
      {orderLoading && (
        <div className="space-y-4 mb-8">
          <div className="h-20 bg-[var(--color-bg-secondary)] rounded-2xl animate-pulse" />
          <div className="h-40 bg-[var(--color-bg-secondary)] rounded-2xl animate-pulse" />
          <div className="h-48 bg-[var(--color-bg-secondary)] rounded-2xl animate-pulse" />
        </div>
      )}

      {/* Error state */}
      {orderError && !orderLoading && (
        <div aria-live="polite" className="bg-[var(--color-danger-light)] border border-[var(--color-danger)]/20 rounded-2xl p-4 sm:p-6 mb-8 text-center">
          <AlertCircle className="w-8 h-8 text-[var(--color-danger)] mx-auto mb-3" />
          <p className="text-sm text-[var(--color-text-secondary)] font-medium">{orderError}</p>
        </div>
      )}

      {order && (
        <>
          {/* Order Number */}
          <div className="bg-white rounded-2xl border border-[var(--color-border-light)] p-4 sm:p-6 mb-6 text-center">
            <p className="text-sm text-[var(--color-text-muted)] mb-2">Bestellnummer</p>
            <div className="flex items-center justify-center gap-2">
              <p className="text-2xl font-extrabold text-[var(--color-primary)] tracking-tight">
                {order.orderNumber}
              </p>
              <button
                onClick={() => copyToClipboard(order.orderNumber, "orderNumber")}
                aria-label="Bestellnummer kopieren"
                className="p-2.5 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-bg-secondary)] rounded-lg transition-colors"
              >
                {copied === "orderNumber" ? (
                  <Check className="w-4 h-4 text-[var(--color-success)]" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] mt-2">
              Die Bestätigungs-E-Mail wurde an <strong>{orderEmail || "Ihre E-Mail-Adresse"}</strong> gesendet.
            </p>
          </div>

          {/* ═══ PAYMENT INSTRUCTIONS ═══ */}
          {bankDetails && (
            <div className="bg-white rounded-2xl border-2 border-[var(--color-primary)]/20 p-4 sm:p-6 mb-6 text-left">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)] flex items-center justify-center">
                  <span className="text-white text-lg font-bold">€</span>
                </div>
                <div>
                  <h2 className="font-bold text-lg text-[var(--color-text-primary)]">
                    Zahlungsinformationen
                  </h2>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Bitte überweisen Sie innerhalb von 5 Werktagen
                  </p>
                </div>
              </div>

              {!bankDetails.iban ? (
                <div className="bg-[var(--color-primary-50)] border border-[var(--color-primary)]/20 rounded-xl p-4 text-center">
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Die Bankverbindung wird geladen. Bitte überprüfen Sie auch Ihre Bestätigungs-E-Mail für die Zahlungsinformationen.
                  </p>
                </div>
              ) : (
              <>
              <div className="bg-[var(--color-primary)] text-white rounded-xl p-4 mb-4 text-center">
                <p className="text-xs text-white/70 mb-1 uppercase tracking-wider font-medium">Zu zahlender Betrag</p>
                <p className="text-3xl font-extrabold tracking-tight">{formatPrice(order.total)}</p>
              </div>

              {/* Reference - HERO */}
              <div className="bg-[var(--color-accent-light)] border border-[var(--color-accent)]/20 rounded-xl p-4 mb-4 text-center">
                <p className="text-xs text-[var(--color-text-muted)] mb-1 uppercase tracking-wider font-medium">Verwendungszweck</p>
                <div className="flex items-center justify-center gap-2">
                  <p className="text-2xl font-extrabold text-[var(--color-accent)] tracking-wider font-mono">
                    {order.orderNumber}
                  </p>
                  <button
                    onClick={() => copyToClipboard(order.orderNumber, "reference")}
                    aria-label="Verwendungszweck kopieren"
                    className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-accent)] hover:bg-white rounded-lg transition-colors"
                  >
                    {copied === "reference" ? <Check className="w-4 h-4 text-[var(--color-success)]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-[var(--color-text-muted)] mt-1">
                  Ohne Verwendungszweck kann Ihre Bestellung nicht zugeordnet werden
                </p>
              </div>

              {/* Bank details */}
              <div className="bg-[var(--color-bg-secondary)] rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)]">Empfänger</p>
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">{bankDetails.accountName}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(bankDetails.accountName, "name")}
                    aria-label="Empfängername kopieren"
                    className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-white rounded-lg transition-colors"
                  >
                    {copied === "name" ? <Check className="w-3.5 h-3.5 text-[var(--color-success)]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)]">IBAN</p>
                    <p className="text-sm font-semibold text-[var(--color-text-primary)] font-mono tracking-wide">{bankDetails.iban}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(bankDetails.iban, "iban")}
                    aria-label="IBAN kopieren"
                    className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-white rounded-lg transition-colors"
                  >
                    {copied === "iban" ? <Check className="w-3.5 h-3.5 text-[var(--color-success)]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)]">BIC</p>
                    <p className="text-sm font-semibold text-[var(--color-text-primary)] font-mono">{bankDetails.bic}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(bankDetails.bic, "bic")}
                    aria-label="BIC kopieren"
                    className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-white rounded-lg transition-colors"
                  >
                    {copied === "bic" ? <Check className="w-3.5 h-3.5 text-[var(--color-success)]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Security note */}
              <div className="flex items-start gap-2 mt-4 p-3 bg-[var(--color-success-light)] border border-[var(--color-success)]/20 rounded-xl">
                <Shield className="w-4 h-4 text-[var(--color-success)] shrink-0 mt-0.5" />
                <p className="text-xs text-[var(--color-text-secondary)]">
                  <strong>Sicherheit:</strong> Ihre Daten werden SSL-verschlüsselt übertragen. Wir speichern keine Bankdaten und haben keinen Zugriff auf Ihr Konto.
                </p>
              </div>
              </>
              )}
            </div>
          )}
          <div className="bg-white rounded-2xl border border-[var(--color-border-light)] p-4 sm:p-6 mb-6 text-left">
            <h2 className="font-bold text-[var(--color-text-primary)] mb-4">
              Zusammenfassung
            </h2>
            <div className="space-y-2 mb-4" role="list">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm" role="listitem">
                  <span className="text-[var(--color-text-secondary)]">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-[var(--color-border-light)] pt-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--color-text-secondary)]">Zwischensumme</span>
                <span>{formatPrice(order.items.reduce((sum, item) => sum + item.price * item.quantity, 0))}</span>
              </div>
              {getOrderCouponDiscount(order) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-success)]">Rabatt</span>
                  <span className="text-[var(--color-success)]">-{formatPrice(getOrderCouponDiscount(order))}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-[var(--color-text-secondary)]">Versand</span>
                <span className={order.shippingCost === 0 ? "text-[var(--color-success)]" : ""}>
                  {order.shippingCost === 0 ? "Kostenlos" : formatPrice(order.shippingCost)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-[var(--color-border-light)]">
                <span>Gesamt</span>
                <span className="text-[var(--color-primary)]">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* ═══ FAQ ═══ */}
          <div className="bg-white rounded-2xl border border-[var(--color-border-light)] p-4 sm:p-6 mb-8 text-left">
            <h2 className="font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[var(--color-primary)]" />
              Häufige Fragen zur Zahlung
            </h2>
            <div className="divide-y divide-[var(--color-border-light)]">
              {faqItems.map((item, i) => (
                <div key={i}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between py-3 text-left"
                    aria-expanded={openFaq === i}
                  >
                    <span className="text-sm font-semibold text-[var(--color-text-primary)]">{item.q}</span>
                    <ChevronDown className={`w-4 h-4 text-[var(--color-text-muted)] transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === i && (
                    <p className="text-sm text-[var(--color-text-secondary)] pb-3 leading-relaxed">
                      {item.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--color-accent)] text-white font-semibold rounded-xl hover:bg-[var(--color-accent-hover)] transition-colors"
        >
          Weiter einkaufen
          <ArrowRight className="w-5 h-5" />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 border-2 border-[var(--color-border)] text-[var(--color-text-secondary)] font-semibold rounded-xl hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
        >
          Zurück zur Startseite
        </Link>
      </div>
    </main>
  );
}
