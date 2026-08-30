"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Mail, Lock, Eye, EyeOff, ShoppingBag, Heart, Settings, LogOut } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function KontoPage() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setName("Thomas Brenner");
    setEmail("info@hauselio.de");
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setName("Neuer Kunde");
    setEmail(email);
  };

  if (isLoggedIn) {
    return (
      <main id="main-content" className="container-hauselio py-12">
        <Breadcrumb items={[{ label: "Startseite", href: "/" }, { label: "Mein Konto" }]} />

        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-2xl font-bold">
              {name.charAt(0)}
            </div>
            <div>
              <h1 className="heading-2">{name}</h1>
              <p className="text-[var(--color-text-muted)] text-sm">{email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/shop"
              className="flex items-center gap-3 p-5 bg-white rounded-2xl border border-[var(--color-border-light)] hover:shadow-md transition-shadow"
            >
              <ShoppingBag className="w-5 h-5 text-[var(--color-primary)]" />
              <div>
                <div className="font-bold text-sm">Meine Bestellungen</div>
                <div className="text-xs text-[var(--color-text-muted)]">Bestellverlauf anzeigen</div>
              </div>
            </Link>

            <Link
              href="/wunschliste"
              className="flex items-center gap-3 p-5 bg-white rounded-2xl border border-[var(--color-border-light)] hover:shadow-md transition-shadow"
            >
              <Heart className="w-5 h-5 text-[var(--color-primary)]" />
              <div>
                <div className="font-bold text-sm">Wunschliste</div>
                <div className="text-xs text-[var(--color-text-muted)]">Gespeicherte Produkte</div>
              </div>
            </Link>

            <div className="flex items-center gap-3 p-5 bg-white rounded-2xl border border-[var(--color-border-light)]">
              <Settings className="w-5 h-5 text-[var(--color-primary)]" />
              <div>
                <div className="font-bold text-sm">Kontoeinstellungen</div>
                <div className="text-xs text-[var(--color-text-muted)]">Persönliche Daten</div>
              </div>
            </div>

            <button
              onClick={() => { setIsLoggedIn(false); setName(""); setEmail(""); setPassword(""); }}
              className="flex items-center gap-3 p-5 bg-white rounded-2xl border border-[var(--color-border-light)] hover:shadow-md transition-shadow text-left"
            >
              <LogOut className="w-5 h-5 text-[var(--color-danger)]" />
              <div>
                <div className="font-bold text-sm text-[var(--color-danger)]">Abmelden</div>
                <div className="text-xs text-[var(--color-text-muted)]">Konto verlassen</div>
              </div>
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="container-hauselio py-12">
      <Breadcrumb items={[{ label: "Startseite", href: "/" }, { label: "Mein Konto" }]} />

      <div className="max-w-md mx-auto">
        <h1 className="heading-1 text-center mb-8">Mein Konto</h1>

        <div className="flex bg-[var(--color-bg-secondary)] rounded-xl p-1 mb-8">
          <button
            onClick={() => setTab("login")}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
              tab === "login"
                ? "bg-white text-[var(--color-primary)] shadow-sm"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            Anmelden
          </button>
          <button
            onClick={() => setTab("register")}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
              tab === "register"
                ? "bg-white text-[var(--color-primary)] shadow-sm"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            Registrieren
          </button>
        </div>

        {tab === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
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

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Passwort</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-white border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-colors"
                  required
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

            <button
              type="submit"
              className="w-full py-3 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-xl hover:bg-[var(--color-primary-hover)] transition-colors min-h-[44px]"
            >
              Anmelden
            </button>

            <p className="text-center text-xs text-[var(--color-text-muted)]">
              <Link href="/kontakt" className="text-[var(--color-primary)] hover:underline">
                Passwort vergessen?
              </Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ihr Name"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-colors"
                  required
                />
              </div>
            </div>

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

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Passwort</label>
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

            <button
              type="submit"
              className="w-full py-3 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-xl hover:bg-[var(--color-primary-hover)] transition-colors min-h-[44px]"
            >
              Konto erstellen
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
