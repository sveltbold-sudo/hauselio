"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";

function PasswortZuruecksetzenForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await fetch("/api/customer/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Fehler beim Senden");
      setEmailSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler. Bitte versuchen Sie es erneut.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwörter stimmen nicht überein.");
      return;
    }

    if (password.length < 8) {
      setError("Passwort muss mindestens 8 Zeichen lang sein.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/customer/reset-password/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Fehler beim Zurücksetzen des Passworts");
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Zurücksetzen des Passworts. Bitte versuchen Sie es erneut.");
    } finally {
      setIsLoading(false);
    }
  };

  // No token → show email request form
  if (!token) {
    if (emailSent) {
      return (
        <main id="main-content" className="container-hausaura py-12">
          <Breadcrumb items={[{ label: "Startseite", href: "/" }, { label: "Passwort zurücksetzen" }]} />

          <div className="max-w-md mx-auto text-center">
            <CheckCircle2 className="w-12 h-12 text-[var(--color-success)] mx-auto mb-4" />
            <h1 className="heading-1 mb-4">E-Mail gesendet</h1>
            <p className="text-[var(--color-text-muted)] mb-6">
              Falls ein Konto mit dieser E-Mail-Adresse existiert, haben wir Ihnen einen Link zum Zurücksetzen des Passworts gesendet. Bitte überprüfen Sie Ihren Posteingang.
            </p>
            <Link
              href="/konto"
              className="inline-block px-6 py-3 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-xl hover:bg-[var(--color-primary-hover)] transition-colors"
            >
              Zurück zur Anmeldung
            </Link>
          </div>
        </main>
      );
    }

    return (
      <main id="main-content" className="container-hausaura py-12">
        <Breadcrumb items={[{ label: "Startseite", href: "/" }, { label: "Passwort vergessen" }]} />

        <div className="max-w-md mx-auto">
          <h1 className="heading-1 text-center mb-4">Passwort vergessen?</h1>
          <p className="text-[var(--color-text-muted)] text-center mb-8">
            Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link zum Zurücksetzen Ihres Passworts.
          </p>

          <form onSubmit={handleRequestReset} className="space-y-4">
            {error && (
              <div role="alert" className="p-3 bg-[var(--color-danger-light)] text-[var(--color-danger)] text-sm rounded-xl">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">E-Mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@beispiel.de"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-xl hover:bg-[var(--color-primary-hover)] transition-colors min-h-[44px] disabled:opacity-50"
            >
              {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Wird gesendet…</> : "Link zum Zurücksetzen senden"}
            </button>
          </form>

          <p className="text-center text-xs text-[var(--color-text-muted)] mt-6">
            <Link href="/konto" className="text-[var(--color-primary)] hover:underline">
              Zurück zur Anmeldung
            </Link>
          </p>
        </div>
      </main>
    );
  }

  // Token present → success state
  if (success) {
    return (
      <main id="main-content" className="container-hausaura py-12">
        <Breadcrumb items={[{ label: "Startseite", href: "/" }, { label: "Passwort zurückgesetzt" }]} />

        <div className="max-w-md mx-auto text-center">
          <CheckCircle2 className="w-12 h-12 text-[var(--color-success)] mx-auto mb-4" />
          <h1 className="heading-1 mb-4">Passwort zurückgesetzt</h1>
          <p className="text-[var(--color-text-muted)] mb-6">
            Ihr Passwort wurde erfolgreich geändert. Sie können sich jetzt mit Ihrem neuen Passwort anmelden.
          </p>
          <Link
            href="/konto"
            className="inline-block px-6 py-3 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-xl hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            Jetzt anmelden
          </Link>
        </div>
      </main>
    );
  }

  // Token present → show password reset form
  return (
    <main id="main-content" className="container-hausaura py-12">
      <Breadcrumb items={[{ label: "Startseite", href: "/" }, { label: "Passwort zurücksetzen" }]} />

      <div className="max-w-md mx-auto">
        <h1 className="heading-1 text-center mb-8">Neues Passwort festlegen</h1>

        <form onSubmit={handleResetPassword} className="space-y-4">
          {error && (
            <div role="alert" className="p-3 bg-[var(--color-danger-light)] text-[var(--color-danger)] text-sm rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Neues Passwort</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mindestens 8 Zeichen"
                className="w-full pl-10 pr-12 py-3 bg-white border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-colors"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Passwort bestätigen</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Passwort wiederholen"
                className="w-full pl-10 pr-12 py-3 bg-white border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-colors"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-xl hover:bg-[var(--color-primary-hover)] transition-colors min-h-[44px] disabled:opacity-50"
          >
            {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Wird gespeichert…</> : "Passwort zurücksetzen"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function PasswortZuruecksetzenPage() {
  return (
    <Suspense
      fallback={
        <main id="main-content" className="container-hausaura py-20 text-center">
          <h1 className="sr-only">Passwort zurücksetzen</h1>
          <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto" />
        </main>
      }
    >
      <PasswortZuruecksetzenForm />
    </Suspense>
  );
}
