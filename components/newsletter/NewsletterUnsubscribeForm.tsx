"use client";

import { useState, type FormEvent } from "react";

export default function NewsletterUnsubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter/unsubscribe-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "Ein Abmeldelink wurde an Ihre E-Mail-Adresse gesendet.");
      } else {
        setStatus("error");
        setMessage(data.error || "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.");
      }
    } catch {
      setStatus("error");
      setMessage("Netzwerkfehler. Bitte versuchen Sie es später erneut.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
        <svg className="mx-auto mb-3 h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <p className="text-lg font-semibold text-green-800">E-Mail gesendet</p>
        <p className="mt-2 text-sm text-green-700">{message}</p>
        <p className="mt-3 text-xs text-green-600">
          Überprüfen Sie auch Ihren Spam-Ordner, falls Sie die E-Mail nicht finden.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
      <label htmlFor="unsubscribe-email" className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
        E-Mail-Adresse
      </label>
      <input
        id="unsubscribe-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="ihre@email.de"
        className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 transition-colors"
        disabled={status === "loading"}
      />

      {status === "error" && (
        <p className="mt-2 text-sm text-red-600">{message}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-4 w-full rounded-xl bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40 focus:ring-offset-2"
      >
        {status === "loading" ? "Wird gesendet..." : "Abmeldelink anfordern"}
      </button>

      <p className="mt-4 text-xs text-[var(--color-text-muted)] text-center">
        Sie erhalten einen Link per E-Mail, um sich endgültig abzumelden. Dieser Link ist 30 Tage gültig.
      </p>
    </form>
  );
}
