"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin, ShoppingBag } from "lucide-react";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/admin-constants";

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: OrderItem[];
}

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

export default function CustomerDetailPage({
  params,
}: {
  params: Promise<{ email: string }>;
}) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    params.then(({ email }) => {
      fetch(`/api/admin/kunden/${encodeURIComponent(email)}`)
        .then((r) => {
          if (!r.ok) throw new Error("Not found");
          return r.json();
        })
        .then((data) => {
          setCustomer(data.customer);
          setOrders(data.orders);
        })
        .catch(() => setError(true))
        .finally(() => setLoading(false));
    });
  }, [params]);

  if (loading) {
    return (
      <div className="p-8 text-center text-[var(--color-text-muted)]" role="status" aria-label="Wird geladen">
        Laden...
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="p-8 text-center">
        <p className="text-[var(--color-danger)] mb-4" role="alert">Kunde nicht gefunden.</p>
        <Link href="/admin/kunden" className="text-sm text-[var(--color-primary)] hover:underline">
          Zurück zur Kundenübersicht
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/kunden"
          aria-label="Zurück"
          className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            {customer.firstName} {customer.lastName}
          </h1>
          <p className="text-[var(--color-text-secondary)] text-sm">{customer.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Customer Info */}
        <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-6">
          <h2 className="font-bold text-[var(--color-text-primary)] mb-4">Kundendaten</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <Mail className="w-4 h-4 text-[var(--color-text-muted)]" aria-hidden="true" />
              <a href={`mailto:${customer.email}`} className="hover:text-[var(--color-primary)]">{customer.email}</a>
            </div>
            {customer.phone && (
              <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                <Phone className="w-4 h-4 text-[var(--color-text-muted)]" aria-hidden="true" />
                <a href={`tel:${customer.phone}`} className="hover:text-[var(--color-primary)]">{customer.phone}</a>
              </div>
            )}
            <div className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
              <MapPin className="w-4 h-4 text-[var(--color-text-muted)] mt-0.5" aria-hidden="true" />
              <span>{customer.address}<br />{customer.zip} {customer.city}<br />{customer.country}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-5">
            <p className="text-sm text-[var(--color-text-muted)]">Bestellungen</p>
            <p className="text-2xl font-bold text-[var(--color-text-primary)]">{customer.orderCount}</p>
          </div>
          <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-5">
            <p className="text-sm text-[var(--color-text-muted)]">Gesamtumsatz</p>
            <p className="text-2xl font-bold text-[var(--color-primary)]">
              {new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(customer.totalSpent)}
            </p>
          </div>
        </div>
      </div>

      {/* Orders */}
      <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-6">
        <h2 className="font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5" aria-hidden="true" />
          Bestellhistorie ({orders.length})
        </h2>
        {orders.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)]">Keine Bestellungen vorhanden.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border border-[var(--color-border-light)] rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/bestellungen/${order.id}`}
                      className="text-sm font-semibold text-[var(--color-primary)] hover:underline"
                    >
                      {order.orderNumber}
                    </Link>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      ORDER_STATUS_COLORS[order.status] ?? "bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)]"
                    }`}>
                      {ORDER_STATUS_LABELS[order.status] ?? order.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                      {new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(order.total)}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {new Date(order.createdAt).toLocaleDateString("de-DE")}
                    </p>
                  </div>
                </div>
                {order.items.length > 0 && (
                  <div className="mt-2 text-xs text-[var(--color-text-muted)]">
                    {order.items.map((item, i) => (
                      <span key={i}>
                        {item.productName} x{item.quantity}{i < order.items.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
