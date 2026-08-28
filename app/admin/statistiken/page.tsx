"use client";

import { useEffect, useState, useTransition, useCallback } from "react";
import { TrendingUp, Package, ShoppingCart, Users } from "lucide-react";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

type DateRange = "all" | "7d" | "30d" | "90d";

const DATE_RANGE_OPTIONS: { value: DateRange; label: string }[] = [
  { value: "all", label: "Gesamt" },
  { value: "90d", label: "90 Tage" },
  { value: "30d", label: "30 Tage" },
  { value: "7d", label: "7 Tage" },
];

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  pendingOrders: number;
  activeProducts: number;
  avgOrderValue: number;
  topProducts: { name: string; orderCount: number; revenue: number }[];
  recentOrders: { orderNumber: string; total: number; status: string; createdAt: string }[];
  categoryStats: { name: string; productCount: number; totalRevenue: number }[];
}

export default function StatistikenPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>("all");
  const [, startTransition] = useTransition();

  const fetchStats = useCallback((range: DateRange) => {
    setLoading(true);
    fetch(`/api/admin/statistiken?range=${range}`)
      .then((res) => res.json())
      .then((data) => startTransition(() => setStats(data)))
      .catch((err) => logger.error("Failed to load data", { error: err }))
      .finally(() => setLoading(false));
  }, [startTransition]);

  useEffect(() => {
    fetchStats(dateRange);
  }, [dateRange, fetchStats]);

  const handleRangeChange = (range: DateRange) => {
    setDateRange(range);
  };

  if (loading) {
    return <div className="p-8 text-center text-[var(--color-text-muted)]">Laden...</div>;
  }

  if (!stats) {
    return <div className="p-8 text-center text-[var(--color-text-muted)]">Fehler beim Laden der Statistiken.</div>;
  }

  return (
    <div className="p-8">
      {/* Header with date range filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Statistiken</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Überblick über Ihren Shop</p>
        </div>
        <div className="flex items-center gap-1 bg-[var(--color-bg-secondary)] rounded-lg p-1">
          {DATE_RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleRangeChange(opt.value)}
              aria-pressed={dateRange === opt.value}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                dateRange === opt.value
                  ? "bg-white text-[var(--color-text-primary)] shadow-sm"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[var(--color-primary)]" aria-hidden="true" />
            </div>
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">Gesamtumsatz</p>
          <p className="text-2xl font-bold text-[var(--color-text-primary)]">
            {new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(stats.totalRevenue)}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-5">
          <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-[var(--color-accent)]" aria-hidden="true" />
            </div>
            <span className="text-xs text-[var(--color-text-muted)] font-medium">
              {stats.pendingOrders} ausstehend
            </span>
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">Bestellungen</p>
          <p className="text-2xl font-bold text-[var(--color-text-primary)]">{stats.totalOrders}</p>
        </div>

        <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-success)]/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-[var(--color-success)]" aria-hidden="true" />
            </div>
            <span className="text-xs text-[var(--color-text-muted)] font-medium">
              {stats.activeProducts} aktiv
            </span>
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">Produkte</p>
          <p className="text-2xl font-bold text-[var(--color-text-primary)]">{stats.totalProducts}</p>
        </div>

        <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-[var(--color-primary)]" aria-hidden="true" />
            </div>
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">Kunden</p>
          <p className="text-2xl font-bold text-[var(--color-text-primary)]">{stats.totalCustomers}</p>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Products */}
        <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-5">
          <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">Top Produkte</h2>
          {stats.topProducts.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)]">Noch keine Verkäufe.</p>
          ) : (
            <div className="space-y-3">
              {stats.topProducts.map((p, i) => {
                const maxRevenue = Math.max(...stats.topProducts.map((t) => t.revenue));
                const pct = maxRevenue > 0 ? (p.revenue / maxRevenue) * 100 : 0;
                return (
                  <div key={`${p.name}-${i}`} className="group">
                    <div className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-xs font-bold text-[var(--color-primary)]">
                          {i + 1}
                        </span>
                        <span className="text-sm text-[var(--color-text-primary)] truncate max-w-[160px]">{p.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                          {new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(p.revenue)}
                        </span>
                        <span className="text-xs text-[var(--color-text-muted)] block">{p.orderCount}x verkauft</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-[var(--color-bg-secondary)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--color-primary)] rounded-full transition-transform duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Category Stats */}
        <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-5">
          <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">Kategorien</h2>
          {stats.categoryStats.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)]">Keine Daten verfügbar.</p>
          ) : (
            <div className="space-y-3">
              {stats.categoryStats.map((cat, i) => {
                const maxRevenue = Math.max(...stats.categoryStats.map((c) => c.totalRevenue));
                const pct = maxRevenue > 0 ? (cat.totalRevenue / maxRevenue) * 100 : 0;
                const colors = ["bg-[var(--color-primary)]", "bg-[var(--color-accent)]", "bg-[var(--color-success)]", "bg-[var(--color-primary)]", "bg-[var(--color-text-muted)]"];
                return (
                  <div key={`${cat.name}-${i}`}>
                    <div className="flex items-center justify-between py-1">
                      <div>
                        <span className="text-sm text-[var(--color-text-primary)]">{cat.name}</span>
                        <span className="text-xs text-[var(--color-text-muted)] block">{cat.productCount} Produkte</span>
                      </div>
                      <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                        {new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(cat.totalRevenue)}
                      </span>
                    </div>
                    <div className="h-1.5 bg-[var(--color-bg-secondary)] rounded-full overflow-hidden">
                      <div
                        className={`h-full ${colors[i % colors.length]} rounded-full transition-transform duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-5">
        <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">Letzte Bestellungen</h2>
        {stats.recentOrders.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)]">Noch keine Bestellungen.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <caption className="sr-only">Letzte Bestellungen</caption>
              <thead>
                <tr className="border-b border-[var(--color-border-light)]">
                  <th className="text-left pb-2 text-xs font-semibold text-[var(--color-text-muted)] uppercase">Bestellung</th>
                  <th className="text-right pb-2 text-xs font-semibold text-[var(--color-text-muted)] uppercase">Betrag</th>
                  <th className="text-center pb-2 text-xs font-semibold text-[var(--color-text-muted)] uppercase">Status</th>
                  <th className="text-right pb-2 text-xs font-semibold text-[var(--color-text-muted)] uppercase">Datum</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order, i) => (
                  <tr key={i} className="border-b border-[var(--color-border-light)] last:border-0">
                    <td className="py-2 text-sm font-medium text-[var(--color-text-primary)]">{order.orderNumber}</td>
                    <td className="py-2 text-sm text-right text-[var(--color-text-primary)]">
                      {new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(order.total)}
                    </td>
                    <td className="py-2 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                         order.status === "DELIVERED" ? "bg-[var(--color-success)]/10 text-[var(--color-success)]" :
                         order.status === "SHIPPED" ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]" :
                         order.status === "CANCELLED" ? "bg-[var(--color-danger-light)] text-[var(--color-danger)]" :
                         "bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)]"
                      }`}>
                        {order.status === "DELIVERED" ? "Zugestellt" :
                         order.status === "SHIPPED" ? "Versand" :
                         order.status === "CANCELLED" ? "Storniert" :
                         "Ausstehend"}
                      </span>
                    </td>
                    <td className="py-2 text-xs text-right text-[var(--color-text-muted)]">
                      {new Date(order.createdAt).toLocaleDateString("de-DE")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
