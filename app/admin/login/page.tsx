"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const rawRedirect = searchParams.get("redirect") || "/admin";
  const redirect = rawRedirect.startsWith("/admin") ? rawRedirect : "/admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Anmeldung fehlgeschlagen");
      }

      router.push(redirect);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-[var(--color-primary)]">
            HAUSELIO
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-2">
            Admin-Bereich
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[var(--color-border-light)] p-8 shadow-sm">
          <div className="flex items-center justify-center w-12 h-12 bg-[var(--color-primary)] rounded-xl mx-auto mb-6">
            <Lock className="w-6 h-6 text-white" />
          </div>

          <h2 className="text-xl font-bold text-center text-[var(--color-text-primary)] mb-6">
            Anmeldung
          </h2>

          {error && (
            <div className="bg-[var(--color-danger-light)] border border-[var(--color-danger)]/20 rounded-xl p-4 text-sm text-[var(--color-danger)] mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[var(--color-text-primary)] mb-1.5">
                E-Mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)] transition-all"
                  placeholder="admin@hauselio.de"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--color-text-primary)] mb-1.5">
                Passwort
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-12 py-3 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)] transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[var(--color-orange)] text-white font-semibold rounded-xl hover:bg-[var(--color-orange-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Wird angemeldet..." : "Anmelden"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[var(--color-text-muted)] mt-6">
          HAUSELIO Admin Panel © 2026
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="text-[var(--color-text-muted)]">Laden...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
