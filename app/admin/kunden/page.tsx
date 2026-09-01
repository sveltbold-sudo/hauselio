"use client";

import { useMemo, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Search, Mail, Phone, MapPin } from "lucide-react";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

interface Customer {
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  address: string;
  city: string;
  zip: string;
  country: string;
  orderCount: number;
  totalSpent: number;
}

interface PaginatedResponse {
  customers: Customer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  stats: {
    totalRevenue: number;
    totalCustomers: number;
  };
}

export default function KundenPage() {
  const [data, setData] = useState<PaginatedResponse | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/kunden?page=${page}&limit=20&search=${encodeURIComponent(debouncedSearch)}`)
      .then((r) => r.json())
      .then((d: PaginatedResponse) => startTransition(() => setData(d)))
      .catch((err) => {
        logger.error("Failed to load data", { error: err });
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [page, debouncedSearch, startTransition]);

  const customers = useMemo(() => data?.customers ?? [], [data?.customers]);
  const pagination = data?.pagination;
  const stats = data?.stats;

  const totalRevenue = stats?.totalRevenue ?? 0;
  const totalCustomers = stats?.totalCustomers ?? 0;
  const avgRevenue = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

  return (
    <div>
      {error && (
        <div role="alert" className="bg-[var(--color-danger-light)] border border-[var(--color-danger)]/20 rounded-xl p-4 mb-6 text-sm text-[var(--color-text-secondary)]">
          Kunden konnten nicht geladen werden. Bitte versuchen Sie es später erneut.
        </div>
      )}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Kunden</h1>
        <p className="text-[var(--color-text-secondary)] mt-1">
          {pagination?.total ?? customers.length} registrierte Kunden
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-4">
          <p className="text-sm text-[var(--color-text-muted)]">Gesamtkunden</p>
          <p className="text-2xl font-bold text-[var(--color-text-primary)]">{pagination?.total ?? customers.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-4">
          <p className="text-sm text-[var(--color-text-muted)]">Gesamtumsatz</p>
          <p className="text-2xl font-bold text-[var(--color-primary)]">
            {new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(totalRevenue)}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-4">
          <p className="text-sm text-[var(--color-text-muted)]">Ø Umsatz/Kunde</p>
          <p className="text-2xl font-bold text-[var(--color-text-primary)]">
            {customers.length > 0
              ? new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(avgRevenue)
              : "0 €"}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
        <input
          type="text"
          placeholder="Kunden suchen (Name, E-Mail, Stadt)…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Kunden suchen"
          className="w-full pl-10 pr-4 py-3 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[var(--color-border-light)] overflow-hidden">
        <table className="w-full">
          <caption className="sr-only">Kundenliste</caption>
          <thead>
            <tr className="border-b border-[var(--color-border-light)] bg-[var(--color-bg)]">
              <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase">Kunde</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase hidden md:table-cell">Kontakt</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase hidden lg:table-cell">Adresse</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase">Bestellungen</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase">Umsatz</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-[var(--color-text-muted)]">
                  Laden…
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-[var(--color-text-muted)]">
                  Keine Kunden gefunden.
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.email} className="border-b border-[var(--color-border-light)] last:border-0 hover:bg-[var(--color-bg)]">
                  <td className="px-4 py-3">
                    <Link href={`/admin/kunden/${encodeURIComponent(customer.email)}`} className="block">
                      <p className="font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-primary)]">
                        {customer.firstName} {customer.lastName}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)]">{customer.email}</p>
                    </Link>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {customer.phone && (
                      <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1">
                        <Phone className="w-3 h-3" aria-hidden="true" /> {customer.phone}
                      </p>
                    )}
                    <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1">
                      <Mail className="w-3 h-3" aria-hidden="true" /> {customer.email}
                    </p>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1">
                      <MapPin className="w-3 h-3" aria-hidden="true" />
                      {customer.zip} {customer.city}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-bold">
                      {customer.orderCount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      {new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(customer.totalSpent)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-[var(--color-text-muted)]">
            Seite {pagination.page} von {pagination.pages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-[var(--color-border-light)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Zurück
            </button>
            <button
              onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
              disabled={page === pagination.pages}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-[var(--color-border-light)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Weiter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
