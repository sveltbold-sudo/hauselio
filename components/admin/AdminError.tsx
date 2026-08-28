"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { logger } from "@/lib/logger";

interface AdminErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
  title: string;
  description: string;
}

export default function AdminError({ error, reset, title, description }: AdminErrorProps) {
  useEffect(() => {
    logger.error("admin-page", error, { page: title });
  }, [error, title]);

  return (
    <div className="p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-[var(--color-danger-light)] flex items-center justify-center mx-auto mb-6">
        <AlertTriangle className="w-8 h-8 text-[var(--color-danger)]" />
      </div>
      <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">{title}</h2>
      <p className="text-[var(--color-text-muted)] mb-6">{description}</p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
        >
          Erneut versuchen
        </button>
        <Link
          href="/admin"
          className="px-4 py-2 border border-[var(--color-border)] text-[var(--color-text-secondary)] rounded-lg text-sm font-medium hover:bg-[var(--color-bg-secondary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
