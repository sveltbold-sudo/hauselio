"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { useNewsletter } from "@/hooks/useNewsletter";

export default function NewsletterSection() {
  const { email, setEmail, isSubmitting, isSubscribed, error, handleSubmit } = useNewsletter();

  return (
    <section className="relative section-py bg-[var(--color-primary)] overflow-hidden" aria-label="Newsletter">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-30">
        <Image
          src="/images/illustrations/newsletter-bg.svg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      
      <div className="relative container-hausaura text-center">
        <p className="caption text-white/50 mb-3">Newsletter</p>
        <h2 className="heading-2 text-white mb-2">
          10% Rabatt auf Ihre erste Bestellung
        </h2>
        <p className="text-sm text-white/60 mb-5 max-w-md mx-auto">
          Melden Sie sich an und erhalten Sie exklusive Vorteile direkt in Ihr Postfach.
        </p>

        {/* Value bullets */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-6 max-w-lg mx-auto">
          {[
            "Exklusive Angebote",
            "Neue Produktlaunches",
            "Ratgeber & Tipps",
          ].map((item) => (
            <div key={item} className="flex items-center gap-1.5 text-white/80 text-xs font-medium">
              <Check className="w-3.5 h-3.5 text-[var(--color-success)]" />
              {item}
            </div>
          ))}
        </div>

        {isSubscribed ? (
          <div className="flex items-center justify-center gap-3 px-5 py-3 bg-white/10 border border-white/20 rounded-xl max-w-md mx-auto">
            <Check className="w-5 h-5 text-[var(--color-success)]" />
            <span className="text-white font-semibold text-sm">
              Vielen Dank! Bitte bestätigen Sie Ihre E-Mail-Adresse.
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
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
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus:bg-white/15 transition-colors duration-200 text-sm"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-3 bg-white text-[var(--color-primary)] font-semibold rounded-xl hover:bg-white/90 active:scale-[0.97] transition-colors transition-transform duration-200 whitespace-nowrap text-sm disabled:opacity-50"
            >
              {isSubmitting ? "Wird gesendet…" : "Anmelden"}
            </button>
          </form>
        )}

        {error && (
          <p className="text-sm text-white mt-2" role="alert">{error}</p>
        )}

        <p className="text-xs text-white/55 mt-3">
          Kein Spam. Abmeldung jederzeit möglich. Bestätigung per Klick in der E-Mail.
        </p>
        <p className="text-xs text-white/40 mt-1">
          Über 2.500+ zufriedene Abonnenten
        </p>
      </div>
    </section>
  );
}
