"use client";

import { useMemo, useEffect, useState, useTransition } from "react";
import { Search, Mail, Phone, MapPin } from "lucide-react";

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
}

export default function KundenPage() {
  const [data, setData] = useState<PaginatedResponse | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [, startTransition] = useTransition();

  useEffect(() => {
    fetch("/api/admin/kunden")
      .then((r) => r.json())
      .then((d: PaginatedResponse) => startTransition(() => setData(d)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [startTransition]);

  const customers = data?.customers ?? [];
  const pagination = data?.pagination;

  const filtered = useMemo(
    () =>
      customers.filter(
        (c) =>
          c.email.toLowerCase().includes(search.toLowerCase()) ||
          `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
          c.city.toLowerCase().includes(search.toLowerCase())
      ),
    [customers, search]
  );

  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);

  return (
    <div className="p-8">
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
              ? new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(totalRevenue / customers.length)
              : "0 €"}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
        <input
          type="text"
          placeholder="Kunden suchen (Name, E-Mail, Stadt)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)]"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[var(--color-border-light)] overflow-hidden">
        <table className="w-full">
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
                  Laden...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-[var(--color-text-muted)]">
                  Keine Kunden gefunden.
                </td>
              </tr>
            ) : (
              filtered.map((customer) => (
                <tr key={customer.email} className="border-b border-[var(--color-border-light)] last:border-0 hover:bg-[var(--color-bg)]">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-semibold text-[var(--color-text-primary)]">
                        {customer.firstName} {customer.lastName}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)]">{customer.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {customer.phone && (
                      <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {customer.phone}
                      </p>
                    )}
                    <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {customer.email}
                    </p>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
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
    </div>
  );
}
