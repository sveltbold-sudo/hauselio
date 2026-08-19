"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Check, Copy, ArrowRight, Download, AlertCircle } from "lucide-react";

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

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const [orderEmail, setOrderEmail] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [orderLoading, setOrderLoading] = useState(true);
  const [orderError, setOrderError] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);

  useEffect(() => {
    if (orderId) {
      const storedEmail = sessionStorage.getItem(`order_${orderId}`);
      if (storedEmail) {
        setOrderEmail(storedEmail);
        sessionStorage.removeItem(`order_${orderId}`);
      } else {
        setShowEmailForm(true);
        setOrderLoading(false);
      }
    }
  }, [orderId]);

  useEffect(() => {
    if (orderId && orderEmail) {
      fetch(`/api/bestellungen?orderNumber=${encodeURIComponent(orderId)}&email=${encodeURIComponent(orderEmail)}`)
        .then((r) => {
          if (!r.ok) throw new Error("Bestellung nicht gefunden");
          return r.json();
        })
        .then((data) => setOrder(data.order))
        .catch(() => {
          setOrderError("Bestellung konnte nicht geladen werden. Bitte überprüfen Sie Ihre E-Mail und Bestellnummer.");
        })
        .finally(() => setOrderLoading(false));

      fetch("/api/bank")
        .then((r) => r.json())
        .then((data) => {
          if (data.bank) {
            setBankDetails({
              accountName: data.bank.accountName || "HAUSELIO GmbH",
              iban: data.bank.iban || "",
              bic: data.bank.bic || "",
            });
          }
        })
        .catch(() => {
          setBankDetails(null);
        });
    }
  }, [orderId, orderEmail]);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!orderId) {
    return (
      <div className="container-hauselio py-24 text-center max-w-2xl mx-auto">
        <h1 className="heading-2 mb-4">Keine Bestellung gefunden</h1>
        <p className="body-large mb-10">
          Es wurde keine Bestellnummer angegeben. Bitte geben Sie Ihre Bestellung über den normalen Checkout-Prozess auf.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--color-orange)] text-white font-semibold rounded-xl hover:bg-[var(--color-orange-hover)] transition-colors"
        >
          Zur Boutique
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container-hauselio py-16 text-center max-w-2xl mx-auto">
      {/* Success Icon */}
      <div className="w-20 h-20 bg-[var(--color-success-light)] rounded-full flex items-center justify-center mx-auto mb-8 animate-scale-in">
        <Check className="w-10 h-10 text-[var(--color-success)]" />
      </div>

      <h1 className="heading-2 mb-4">Vielen Dank für Ihre Bestellung!</h1>
      <p className="body-large mb-2">
        Ihre Bestellung wurde erfolgreich aufgegeben.
      </p>
      <p className="text-sm text-[var(--color-text-muted)] mb-8">
        Sie erhalten in Kürze eine Bestätigungs-E-Mail mit allen Details.
      </p>

      {/* Email input form (shown when sessionStorage is empty) */}
      {showEmailForm && !orderEmail && (
        <div className="bg-white rounded-2xl border border-[var(--color-border-light)] p-6 mb-8 text-left">
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
            className="flex gap-2"
          >
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="name@beispiel.de"
              required
              className="flex-1 px-4 py-2.5 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
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
          <div className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
          <div className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
          <div className="h-48 bg-gray-100 rounded-2xl animate-pulse" />
        </div>
      )}

      {/* Error state */}
      {orderError && !orderLoading && (
        <div aria-live="polite" className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8 text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
          <p className="text-sm text-red-700 font-medium">{orderError}</p>
        </div>
      )}

      {order && (
        <>
          {/* Order Number */}
          <div className="bg-[var(--color-bg)] rounded-2xl p-6 mb-6">
            <p className="text-sm text-[var(--color-text-muted)] mb-2">
              Bestellnummer
            </p>
            <div className="flex items-center justify-center gap-2">
              <p className="text-2xl font-black text-[var(--color-primary)]">
                {order.orderNumber}
              </p>
              <button
                onClick={() => copyToClipboard(order.orderNumber, "orderNumber")}
                aria-label="Bestellnummer kopieren"
                className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-white rounded-lg transition-colors"
              >
                {copied === "orderNumber" ? (
                  <Check className="w-4 h-4 text-[var(--color-success)]" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl border border-[var(--color-border-light)] p-6 mb-6 text-left">
            <h2 className="font-bold text-[var(--color-text-primary)] mb-4">
              Zusammenfassung
            </h2>
            <div className="space-y-2 mb-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
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
                <span>{formatPrice(order.total - order.shippingCost)}</span>
              </div>
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

          {/* Payment Instructions - SEPA */}
          {bankDetails && (
            <div className="bg-[var(--color-bg)] rounded-2xl border-2 border-[var(--color-primary)]/20 p-6 mb-8 text-left">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-50)] flex items-center justify-center">
                  <Download className="w-5 h-5 text-[var(--color-primary)]" />
                </div>
                <div>
                  <h2 className="font-bold text-[var(--color-text-primary)]">
                    Zahlungsinformationen
                  </h2>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    SEPA-Überweisung · 5 Werktage
                  </p>
                </div>
              </div>

              <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                Bitte überweisen Sie den Gesamtbetrag innerhalb von <strong>5 Werktagen</strong> auf
                folgendes Konto:
              </p>

              <div className="bg-white rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)]">Empfänger</p>
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">{bankDetails.accountName}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(bankDetails.accountName, "name")}
                    aria-label="Empfängername kopieren"
                    className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] rounded-lg transition-colors"
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
                    className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] rounded-lg transition-colors"
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
                    className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] rounded-lg transition-colors"
                  >
                    {copied === "bic" ? <Check className="w-3.5 h-3.5 text-[var(--color-success)]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="flex items-center justify-between border-t border-[var(--color-border-light)] pt-3">
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)]">Verwendungszweck</p>
                    <p className="text-lg font-black text-[var(--color-primary)]">{order.orderNumber}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(order.orderNumber, "reference")}
                    aria-label="Verwendungszweck kopieren"
                    className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] rounded-lg transition-colors"
                  >
                    {copied === "reference" ? <Check className="w-3.5 h-3.5 text-[var(--color-success)]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)]">Betrag</p>
                    <p className="text-lg font-black text-[var(--color-primary)]">
                      {formatPrice(order.total)}
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(formatPrice(order.total), "amount")}
                    aria-label="Betrag kopieren"
                    className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] rounded-lg transition-colors"
                  >
                    {copied === "amount" ? <Check className="w-3.5 h-3.5 text-[var(--color-success)]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-xs text-amber-800">
                  <strong>Hinweis:</strong> Ihre Bestellung wird erst nach Eingang der Zahlung versendet.
                  Bitte geben Sie die Bestellnummer als Verwendungszweck an.
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--color-orange)] text-white font-semibold rounded-xl hover:bg-[var(--color-orange-hover)] transition-colors"
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
    </div>
  );
}
