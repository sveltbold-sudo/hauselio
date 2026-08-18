"use client";

import { Check } from "lucide-react";
import { useNewsletter } from "@/hooks/useNewsletter";

export default function NewsletterSection() {
  const { email, setEmail, isSubmitting, isSubscribed, error, handleSubmit } = useNewsletter();

  return (
    <section className="section-py bg-[var(--color-primary)] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/3 rounded-full blur-[80px]" />

      <div className="container-hauselio text-center relative z-10">
        <p className="caption text-white/50 mb-3">Newsletter</p>
        <h2 className="heading-1 text-white mb-3">
          Bleiben Sie auf dem Laufenden
        </h2>
        <p className="text-white/70 mb-8 max-w-lg mx-auto">
          Exklusive Angebote und Neuigkeiten direkt in Ihr Postfach.
        </p>

        {isSubscribed ? (
          <div className="flex items-center justify-center gap-3 px-6 py-4 bg-white/10 border border-white/20 rounded-2xl max-w-lg mx-auto">
            <Check className="w-5 h-5 text-green-400" />
            <span className="text-white font-semibold text-sm">
              Vielen Dank! Bitte bestätigen Sie Ihre E-Mail-Adresse.
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
              onChange={(e) => { setEmail(e.target.value); }}
              placeholder="Ihre E-Mail-Adresse"
              className="flex-1 px-5 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-200 text-sm"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-white text-[var(--color-primary)] font-semibold rounded-xl hover:bg-white/90 transition-all duration-200 whitespacenowrap text-sm disabled:opacity-50"
            >
              {isSubmitting ? "Wird gesendet..." : "Anmelden"}
            </button>
          </form>
        )}

        {error && (
          <p className="text-sm text-red-300 mt-3" role="alert">{error}</p>
        )}
      </div>
    </section>
  );
}
