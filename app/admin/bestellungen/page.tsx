import Link from "next/link";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { ORDER_STATUS_LABELS, ALLOWED_ORDER_STATUSES } from "@/lib/admin-constants";
import { logger } from "@/lib/logger";
import OrderTable from "@/components/admin/OrderTable";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await requireRole("ADMIN");
  const params = await searchParams;
  const status = typeof params.status === "string" ? params.status : undefined;
  const q = typeof params.q === "string" ? params.q : undefined;
  const page = Math.max(1, parseInt(typeof params.page === "string" ? params.page : "1", 10) || 1);
  const limit = 20;
  const skip = (page - 1) * limit;

  const where: Prisma.OrderWhereInput = {};
  if (status && ALLOWED_ORDER_STATUSES.includes(status as typeof ALLOWED_ORDER_STATUSES[number])) {
    where.status = status as typeof ALLOWED_ORDER_STATUSES[number];
  }
  if (q) {
    where.OR = [
      { orderNumber: { contains: q, mode: "insensitive" } },
      { customerEmail: { contains: q, mode: "insensitive" } },
      { customerFirstName: { contains: q, mode: "insensitive" } },
      { customerLastName: { contains: q, mode: "insensitive" } },
    ];
  }

  let orders: Awaited<ReturnType<typeof prisma.order.findMany>> = [];
  let total = 0;
  let dbError = false;

  try {
    [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);
  } catch (error) {
    logger.error("admin/bestellungen: DB error", error);
    dbError = true;
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
        Bestellungen
      </h1>

      {dbError && (
        <div role="alert" className="bg-[var(--color-danger-light)] border border-[var(--color-danger)]/20 rounded-xl p-4 mb-6 text-sm text-[var(--color-text-secondary)]">
          Bestellungen konnten nicht geladen werden. Bitte versuchen Sie es später erneut.
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-4 mb-6">
        <form role="search" aria-label="Bestellungen filtern" className="flex flex-wrap gap-3">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Suche (Nr., Name, E-Mail)…"
            aria-label="Bestellungen suchen"
            className="flex-1 min-w-[200px] px-4 py-3 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
          />
          <select
            name="status"
            defaultValue={status}
            aria-label="Status filtern"
            className="px-4 py-3 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
          >
            <option value="">Alle Status</option>
            {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="px-4 py-3 bg-[var(--color-primary)] text-white rounded-xl text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            Filtern
          </button>
          {(status || q) && (
            <Link
              href="/admin/bestellungen"
              className="px-4 py-3 border border-[var(--color-border)] rounded-xl text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] transition-colors"
            >
              Filter zurücksetzen
            </Link>
          )}
        </form>
      </div>

      {/* Orders Table */}
      <OrderTable
        orders={orders.map((o) => ({
          ...o,
          createdAt: o.createdAt.toISOString(),
          total: Number(o.total),
        }))}
        total={total}
        totalPages={totalPages}
        page={page}
        status={status}
        q={q}
      />
    </div>
  );
}
