"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X, Clock } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const FALLBACK_NUMBER = "+4915259140453";
const WHATSAPP_MESSAGE = "Hallo! Ich habe eine Frage zu HAUSAURA.";

export default function WhatsAppChat() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [pulse, setPulse] = useState(true);
  const [phone, setPhone] = useState(FALLBACK_NUMBER);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/kontakt/settings", { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error("API error");
        return r.json();
      })
      .then((data) => {
        if (data.contactPhone) setPhone(data.contactPhone);
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const wasDismissed = sessionStorage.getItem("HAUSAURA-whatsapp-dismissed");
    if (wasDismissed) {
      setDismissed(true);
      return;
    }

    const timer = setTimeout(() => {
      setVisible(true);
    }, 12000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => setPulse(false), 6000);
    return () => clearTimeout(timer);
  }, [visible]);

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    sessionStorage.setItem("HAUSAURA-whatsapp-dismissed", "1");
  };

  const handleOpen = () => {
    const cleaned = phone.replace(/[^0-9]/g, "").replace(/^490/, "49");
    const url = `https://wa.me/${cleaned}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    handleDismiss();
  };

  if (dismissed || !visible) return null;

  return (
    <div className={`fixed bottom-[calc(5rem+env(safe-area-inset-bottom,0px))] right-4 sm:bottom-6 sm:right-6 z-[80] flex flex-col items-end gap-3 ${prefersReduced ? "" : "animate-in fade-in slide-in-from-bottom-4 duration-300"}`}>
      {/* Tooltip */}
      <div className="relative bg-white rounded-2xl shadow-[var(--shadow-2xl)] border border-[var(--color-border-light)] p-4 max-w-[260px]">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 min-w-[44px] min-h-[44px] p-2 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded-full hover:bg-[var(--color-bg-secondary)] transition-colors"
          aria-label="Schließen"
        >
          <X className="w-3.5 h-3.5" />
        </button>
        <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">
          Fragen? Schreiben Sie uns!
        </p>
        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-2">
          Schnelle Hilfe per WhatsApp — wir antworten innerhalb weniger Stunden.
        </p>
        <div className="flex items-center gap-1.5 text-[10px] text-[var(--color-text-muted)]">
          <Clock className="w-3 h-3" />
          <span>Mo–Fr 9–18 Uhr</span>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={handleOpen}
        className={`w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 ${pulse && !prefersReduced ? "animate-pulse" : ""}`}
        aria-label="WhatsApp Chat öffnen"
      >
        <MessageCircle className="w-7 h-7 text-white" />
      </button>
    </div>
  );
}
