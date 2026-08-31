"use client";

import Link from "next/link";
import { PackageOpen, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main id="main-content" className="container-hauselio py-24 text-center max-w-2xl mx-auto">
      <div className="w-20 h-20 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center mx-auto mb-6">
        <PackageOpen className="w-10 h-10 text-[var(--color-border)]" />
      </div>
      <h1 className="heading-1 mb-4">Seite nicht gefunden</h1>
      <p className="body-large text-[var(--color-text-secondary)] mb-8">
        Die von Ihnen gesuchte Seite existiert nicht oder wurde verschoben.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:bg-[var(--color-primary-hover)] transition-colors"
        >
          <Home className="w-4 h-4" />
          Zur Startseite
        </Link>
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 px-6 py-3 border border-[var(--color-border)] text-[var(--color-text-secondary)] font-semibold rounded-xl hover:bg-[var(--color-bg-secondary)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück
        </button>
      </div>
    </main>
  );
}
