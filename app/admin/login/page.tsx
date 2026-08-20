"use client";

import { useState, useRef, useCallback, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";

const THROTTLE_MS = 2000;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);
  const errorRef = useRef<HTMLDivElement>(null);
  const lastSubmitRef = useRef(0);

  const rawRedirect = searchParams.get("redirect") || "/admin";
  const redirect = rawRedirect.startsWith("/admin") ? rawRedirect : "/admin";

  useEffect(() => {
    document.title = "Admin-Anmeldung | HAUSELIO";
  }, []);

  const isLocked = lockoutSeconds > 0;

  useEffect(() => {
    if (!isLocked) return;
    const timer = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setError("");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isLocked]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds > 0) return;
    const now = Date.now();
    if (now - lastSubmitRef.current < THROTTLE_MS) return;
    lastSubmitRef.current = now;

    setIsLoading(true);
    setError("");
    setLockoutSeconds(0);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.retryAfterSec) {
          setLockoutSeconds(data.retryAfterSec);
        }
        throw new Error(data.error || "Anmeldung fehlgeschlagen");
      }

      router.push(redirect);
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ein Fehler ist aufgetreten";
      setError(message);
      setTimeout(() => errorRef.current?.focus(), 100);
    } finally {
      setIsLoading(false);
    }
  }, [email, password, redirect, router, lockoutSeconds]);

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return min > 0 ? `${min}:${String(sec).padStart(2, "0")}` : `${sec}s`;
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
            <div
              ref={errorRef}
              tabIndex={-1}
              role="alert"
              className="bg-[var(--color-danger-light)] border border-[var(--color-danger)]/20 rounded-xl p-4 text-sm text-[var(--color-danger)] mb-6 focus:outline-none focus:ring-2 focus:ring-[var(--color-danger)]/40"
            >
              <p>{error}</p>
              {lockoutSeconds > 0 && (
                <p className="mt-2 font-mono text-base font-bold">
                  Erneut versuchen in {formatTime(lockoutSeconds)}
                </p>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-email"
                className="block text-sm font-semibold text-[var(--color-text-primary)] mb-1.5"
              >
                E-Mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  maxLength={254}
                  disabled={lockoutSeconds > 0}
                  className="w-full pl-10 pr-4 py-3 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="admin@hauselio.de"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-sm font-semibold text-[var(--color-text-primary)] mb-1.5"
              >
                Passwort
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  maxLength={128}
                  disabled={lockoutSeconds > 0}
                  className="w-full pl-10 pr-12 py-3 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Passwort verbergen" : "Passwort anzeigen"}
                  disabled={lockoutSeconds > 0}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] disabled:opacity-50"
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
              disabled={isLoading || lockoutSeconds > 0}
              className="w-full py-3 bg-[var(--color-orange)] text-white font-semibold rounded-xl hover:bg-[var(--color-orange-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Wird angemeldet..." : lockoutSeconds > 0 ? `Gesperrt (${formatTime(lockoutSeconds)})` : "Anmelden"}
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
