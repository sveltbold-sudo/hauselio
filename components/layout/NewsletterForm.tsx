"use client";

import { useState } from "react";
import { Check } from "lucide-react";

export default function NewsletterForm() {
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

  if (isSubscribed) {
    return (
      <div className="flex items-center gap-2 px-4 py-2.5 bg-green-500/10 border border-green-500/20 rounded-xl">
        <Check className="w-4 h-4 text-green-400" />
        <span className="text-sm text-green-300">Erfolgreich angemeldet!</span>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <label htmlFor="footer-newsletter-email" className="sr-only">
          E-Mail-Adresse
        </label>
        <input
          id="footer-newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(""); }}
          placeholder="Ihre E-Mail"
          className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-300"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-xl hover:bg-[var(--color-primary-hover)] transition-all duration-300 active:scale-[0.97] disabled:opacity-50"
        >
          {isSubmitting ? "..." : "OK"}
        </button>
      </form>
      {error && (
        <p className="text-xs text-red-400 mt-2">{error}</p>
      )}
    </>
  );
}
