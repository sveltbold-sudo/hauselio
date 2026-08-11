"use client";

import { useState } from "react";
import { Check } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Fehler bei der Anmeldung");
      }

      setIsSubscribed(true);
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section-py bg-gradient-to-br from-[var(--color-secondary)] via-[#1a2744] to-[var(--color-secondary)] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)]/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-primary)]/3 rounded-full blur-[100px]" />

      <div className="container-hauselio text-center relative z-10">
        <p className="caption text-[var(--color-primary)] mb-3">Newsletter</p>
        <h2 className="heading-1 text-white mb-4">
          Bleiben Sie auf dem Laufenden
        </h2>
        <p className="text-white/50 mb-10 max-w-xl mx-auto text-lg">
          Melden Sie sich für unseren Newsletter an und erhalten Sie exklusive
          Angebote und Neuigkeiten.
        </p>

        {isSubscribed ? (
          <div className="flex items-center justify-center gap-3 px-6 py-4 bg-green-500/10 border border-green-500/20 rounded-2xl max-w-lg mx-auto">
            <Check className="w-5 h-5 text-green-400" />
            <span className="text-green-300 font-semibold">
              Vielen Dank! Sie sind jetzt angemeldet.
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <label htmlFor="newsletter-email" className="sr-only">
              E-Mail-Adresse
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              placeholder="Ihre E-Mail-Adresse"
              className="flex-1 px-5 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-300"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-hover)] text-white font-semibold rounded-xl hover:opacity-90 transition-all duration-300 whitespace-nowrap shadow-lg shadow-blue-500/25 disabled:opacity-50"
            >
              {isSubmitting ? "Wird gesendet..." : "Anmelden"}
            </button>
          </form>
        )}

        {error && (
          <p className="text-sm text-red-300 mt-3">{error}</p>
        )}
      </div>
    </section>
  );
}
