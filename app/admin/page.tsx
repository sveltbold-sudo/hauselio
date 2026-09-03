import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import {
  Euro,
  ShoppingCart,
  Package,
  Clock,
  Users,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/admin-constants";
import AlgoliaSyncButton from "@/components/admin/AlgoliaSyncButton";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

async function fetchDashboardData() {
  const [
    totalOrders,
    totalProducts,
    pendingOrders,
    totalRevenue,
    totalCustomers,
    recentOrders,
    overdueOrders,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.order.count({ where: { status: "PENDING_PAYMENT" } }),
    prisma.order.aggregate({ _sum: { total: true }, where: { status: { not: "CANCELLED" } } }),
    prisma.$queryRaw<[{ count: bigint }]>`SELECT COUNT(DISTINCT "customerEmail") as count FROM "Order"`.then(
      (rows) => Number(rows[0]?.count || 0)
    ),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),
    prisma.order.count({
      where: {
        status: "PENDING_PAYMENT",
        createdAt: { lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    }),
  ]);

  return { totalOrders, totalProducts, pendingOrders, totalRevenue, totalCustomers, recentOrders, overdueOrders };
}

export default async function AdminDashboard() {
  await requireRole("ADMIN");

  let data;
  try {
    data = await fetchDashboardData();
  } catch (dbError) {
    logger.error("Dashboard DB error:", dbError);
    return (
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
          Dashboard
        </h1>
        <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-[var(--color-danger)] mx-auto mb-4" />
          <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
            Datenbank nicht erreichbar
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] mb-4">
            Die Verbindung zur Datenbank konnte nicht hergestellt werden. Bitte versuchen Sie es später erneut.
          </p>
          <Link
            href="/admin"
            className="inline-flex px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            Erneut versuchen
          </Link>
        </div>
      </div>
    );
  }

  const { totalOrders, totalProducts, pendingOrders, totalRevenue, totalCustomers, recentOrders, overdueOrders } = data;

  const stats = [
    {
      name: "Gesamtumsatz",
      value: formatPrice(Number(totalRevenue._sum.total || 0)),
      icon: Euro,
      color: "bg-[var(--color-success)]",
    },
    {
      name: "Bestellungen",
      value: totalOrders.toString(),
      icon: ShoppingCart,
      color: "bg-[var(--color-primary)]",
    },
    {
      name: "Produkte",
      value: totalProducts.toString(),
      icon: Package,
      color: "bg-[var(--color-primary)]",
    },
    {
      name: "Ausstehend",
      value: pendingOrders.toString(),
      icon: Clock,
      color: pendingOrders > 0 ? "bg-[var(--color-danger)]" : "bg-[var(--color-bg-secondary)]",
    },
    {
      name: "Unbezahlt >7T",
      value: overdueOrders.toString(),
      icon: AlertTriangle,
      color: overdueOrders > 0 ? "bg-[var(--color-danger)]" : "bg-[var(--color-bg-secondary)]",
    },
    {
      name: "Kunden",
      value: totalCustomers.toString(),
      icon: Users,
      color: "bg-[var(--color-primary)]",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
        Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.name}
            aria-label={`${stat.name}: ${stat.value}`}
            className="bg-white rounded-xl border border-[var(--color-border-light)] p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {stat.name}
                </p>
                <p className="text-2xl font-bold text-[var(--color-text-primary)] mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Algolia Sync */}
      <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-5 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-[var(--color-text-primary)]">Suche (Algolia)</h2>
            <p className="text-sm text-[var(--color-text-muted)]">Alle Produkte mit der Suchmaschine synchronisieren</p>
          </div>
          <AlgoliaSyncButton />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-[var(--color-border-light)]">
          <div className="flex items-center justify-between p-5 border-b border-[var(--color-border-light)]">
            <h2 className="font-bold text-[var(--color-text-primary)]">
              Neueste Bestellungen
            </h2>
            <Link
              href="/admin/bestellungen"
              className="text-sm font-medium text-[var(--color-primary)] hover:underline"
            >
              Alle ansehen
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <caption className="sr-only">Letzte Bestellungen</caption>
              <thead>
                <tr className="border-b border-[var(--color-border-light)]">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase">
                    Bestellnr.
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase">
                    Kunde
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase">
                    Betrag
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-[var(--color-border-light)] last:border-0 hover:bg-[var(--color-bg)]"
                  >
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
                    <td className="px-5 py-3 text-sm font-medium text-[var(--color-text-primary)]">
                      {formatPrice(Number(order.total))}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          ORDER_STATUS_COLORS[order.status] || "bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)]"
                        }`}
                      >
                        {ORDER_STATUS_LABELS[order.status] || order.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-8 text-center text-sm text-[var(--color-text-muted)]"
                    >
                      Noch keine Bestellungen vorhanden.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
