"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/admin-constants";
import OrderBulkActions from "@/components/admin/OrderBulkActions";

interface Order {
  id: string;
  orderNumber: string;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  createdAt: string;
  total: number;
  status: string;
}

type SortKey = "orderNumber" | "customer" | "date" | "total" | "status";

function SortIcon({ active, dir }: { active: boolean; dir: "asc" | "desc" }) {
  if (!active) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-40" />;
  return dir === "asc"
    ? <ArrowUp className="w-3 h-3 ml-1 text-[var(--color-primary)]" />
    : <ArrowDown className="w-3 h-3 ml-1 text-[var(--color-primary)]" />;
}

export default function OrderTable({
  orders,
  total,
  totalPages,
  page,
  status,
  q,
}: {
  orders: Order[];
  total: number;
  totalPages: number;
  page: number;
  status?: string;
  q?: string;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const router = useRouter();

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sorted = useMemo(() => {
    if (!sortKey) return orders;
    return [...orders].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "orderNumber":
          cmp = a.orderNumber.localeCompare(b.orderNumber);
          break;
        case "customer":
          cmp = `${a.customerFirstName} ${a.customerLastName}`.localeCompare(
            `${b.customerFirstName} ${b.customerLastName}`,
            "de"
          );
          break;
        case "date":
          cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "total":
          cmp = Number(a.total) - Number(b.total);
          break;
        case "status":
          cmp = a.status.localeCompare(b.status);
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [orders, sortKey, sortDir]);

  const toggleAll = () => {
    if (selected.length === orders.length) {
      setSelected([]);
    } else {
      setSelected(orders.map((o) => o.id));
    }
  };

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-[var(--color-border-light)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full hidden md:table">
            <thead>
              <tr className="border-b border-[var(--color-border-light)] bg-gray-50">
                <th className="px-5 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={selected.length === orders.length && orders.length > 0}
                    onChange={toggleAll}
                    aria-label="Alle auswählen"
                    className="w-4 h-4 rounded border-gray-300 accent-[var(--color-primary)]"
                  />
                </th>
                <th
                  onClick={() => handleSort("orderNumber")}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleSort("orderNumber"); } }}
                  tabIndex={0}
                  role="columnheader"
                  className="text-left px-5 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase cursor-pointer select-none hover:text-[var(--color-primary)]"
                >
                  <span className="inline-flex items-center">
                    Bestellnr.
                    <SortIcon active={sortKey === "orderNumber"} dir={sortDir} />
                  </span>
                </th>
                <th
                  onClick={() => handleSort("customer")}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleSort("customer"); } }}
                  tabIndex={0}
                  role="columnheader"
                  className="text-left px-5 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase cursor-pointer select-none hover:text-[var(--color-primary)]"
                >
                  <span className="inline-flex items-center">
                    Kunde
                    <SortIcon active={sortKey === "customer"} dir={sortDir} />
                  </span>
                </th>
                <th
                  onClick={() => handleSort("date")}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleSort("date"); } }}
                  tabIndex={0}
                  role="columnheader"
                  className="text-left px-5 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase cursor-pointer select-none hover:text-[var(--color-primary)]"
                >
                  <span className="inline-flex items-center">
                    Datum
                    <SortIcon active={sortKey === "date"} dir={sortDir} />
                  </span>
                </th>
                <th
                  onClick={() => handleSort("total")}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleSort("total"); } }}
                  tabIndex={0}
                  role="columnheader"
                  className="text-left px-5 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase cursor-pointer select-none hover:text-[var(--color-primary)]"
                >
                  <span className="inline-flex items-center">
                    Betrag
                    <SortIcon active={sortKey === "total"} dir={sortDir} />
                  </span>
                </th>
                <th
                  onClick={() => handleSort("status")}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleSort("status"); } }}
                  tabIndex={0}
                  role="columnheader"
                  className="text-left px-5 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase cursor-pointer select-none hover:text-[var(--color-primary)]"
                >
                  <span className="inline-flex items-center">
                    Status
                    <SortIcon active={sortKey === "status"} dir={sortDir} />
                  </span>
                </th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase">
                  Aktionen
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((order) => (
                <tr
                  key={order.id}
                  className={`border-b border-[var(--color-border-light)] last:border-0 hover:bg-gray-50 ${
                    selected.includes(order.id) ? "bg-blue-50" : ""
                  }`}
                >
                  <td className="px-5 py-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(order.id)}
                      onChange={() => toggle(order.id)}
                      aria-label={`Bestellung ${order.orderNumber} auswählen`}
                      className="w-4 h-4 rounded border-gray-300 accent-[var(--color-primary)]"
                    />
                  </td>
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/bestellungen/${order.id}`}
                      className="text-sm font-medium text-[var(--color-primary)] hover:underline"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-sm text-[var(--color-text-primary)]">
                      {order.customerFirstName} {order.customerLastName}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {order.customerEmail}
                    </p>
                  </td>
                  <td className="px-5 py-3 text-sm text-[var(--color-text-secondary)]">
                    {new Date(order.createdAt).toLocaleDateString("de-DE")}
                  </td>
                  <td className="px-5 py-3 text-sm font-medium text-[var(--color-text-primary)]">
                    {formatPrice(Number(order.total))}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        ORDER_STATUS_COLORS[order.status] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {ORDER_STATUS_LABELS[order.status] || order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      href={`/admin/bestellungen/${order.id}`}
                      className="text-sm font-medium text-[var(--color-primary)] hover:underline"
                    >
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center text-sm text-[var(--color-text-muted)]"
                  >
                    Keine Bestellungen gefunden.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-[var(--color-border-light)]">
          {sorted.map((order) => (
            <div
              key={order.id}
              className={`p-4 ${selected.includes(order.id) ? "bg-blue-50" : ""}`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={selected.includes(order.id)}
                  onChange={() => toggle(order.id)}
                  aria-label={`Bestellung ${order.orderNumber} auswählen`}
                  className="w-4 h-4 rounded border-gray-300 accent-[var(--color-primary)] mt-1"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        href={`/admin/bestellungen/${order.id}`}
                        className="text-sm font-medium text-[var(--color-primary)] hover:underline"
                      >
                        {order.orderNumber}
                      </Link>
                      <p className="text-sm text-[var(--color-text-primary)]">
                        {order.customerFirstName} {order.customerLastName}
                      </p>
                    </div>
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${
                        ORDER_STATUS_COLORS[order.status] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {ORDER_STATUS_LABELS[order.status] || order.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        {new Date(order.createdAt).toLocaleDateString("de-DE")}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)] truncate max-w-[200px]">
                        {order.customerEmail}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-[var(--color-text-primary)]">
                        {formatPrice(Number(order.total))}
                      </p>
                      <Link
                        href={`/admin/bestellungen/${order.id}`}
                        className="text-xs font-medium text-[var(--color-primary)] hover:underline"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="px-5 py-12 text-center text-sm text-[var(--color-text-muted)]">
              Keine Bestellungen gefunden.
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--color-border-light)]">
            <p className="text-sm text-[var(--color-text-muted)]">
              {total} Bestellungen — Seite {page} von {totalPages}
            </p>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(
                (p) => (
                  <Link
                    key={p}
                    href={`/admin/bestellungen?page=${p}${status ? `&status=${status}` : ""}${q ? `&q=${q}` : ""}`}
                    aria-current={p === page ? "page" : undefined}
                    className={`px-3 py-1 rounded text-sm ${
                      p === page
                        ? "bg-[var(--color-primary)] text-white"
                        : "text-[var(--color-text-secondary)] hover:bg-gray-100"
                    }`}
                  >
                    {p}
                  </Link>
                )
              )}
            </div>
          </div>
        )}
      </div>

      <OrderBulkActions
        selectedIds={selected}
        onClearSelection={() => setSelected([])}
        onComplete={() => router.refresh()}
      />
    </>
  );
}
