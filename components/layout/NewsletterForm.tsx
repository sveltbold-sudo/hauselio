"use client";

import { Check } from "lucide-react";
import { useNewsletter } from "@/hooks/useNewsletter";

export default function NewsletterForm() {
  const { email, setEmail, isSubmitting, isSubscribed, error, handleSubmit } = useNewsletter();

  if (isSubscribed) {
    return (
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-success)]/10 border border-[var(--color-success)]/20 rounded-xl">
        <Check className="w-4 h-4 text-[var(--color-success)]" />
        <span className="text-sm text-[var(--color-success)]">Erfolgreich angemeldet! Bitte bestätigen Sie Ihre E-Mail.</span>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex gap-2" aria-label="Newsletter-Anmeldung">
        <label htmlFor="footer-newsletter-email" className="sr-only">
          E-Mail-Adresse
        </label>
        <input
          id="footer-newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => { setEmail(e.target.value); }}
          placeholder="Ihre E-Mail"
          className="flex-1 px-4 py-2.5 min-h-[44px] bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus:border-transparent transition-colors duration-300"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          aria-label="Newsletter abonnieren"
          className="px-5 py-2.5 min-h-[44px] bg-[var(--color-primary)] text-white text-sm font-semibold rounded-xl hover:bg-[var(--color-primary-hover)] transition-colors transition-transform duration-300 active:scale-[0.97] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-primary)]"
        >
          {isSubmitting ? "Wird gesendet…" : "Anmelden"}
        </button>
      </form>
      {error && (
        <p className="text-xs text-[var(--color-danger)] mt-2" role="alert">{error}</p>
      )}
    </>
  );
}
