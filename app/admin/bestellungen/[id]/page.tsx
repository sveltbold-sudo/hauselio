import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/admin-constants";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import UpdateOrderStatus from "@/components/admin/UpdateOrderStatus";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("ADMIN");
  const { id } = await params;

  let order;
  try {
    order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
  } catch (error) {
    console.error("[HAUSELIO] DB error in bestellungen/[id]:", error);
    notFound();
  }

  if (!order) {
    notFound();
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/bestellungen"
          className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Bestellung {order.orderNumber}
          </h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            {new Date(order.createdAt).toLocaleDateString("de-DE", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status */}
          <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-[var(--color-text-primary)] mb-1">
                  Status
                </h2>
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                          ORDER_STATUS_COLORS[order.status] || "bg-gray-100 text-gray-700"
                  }`}
                >
                        {ORDER_STATUS_LABELS[order.status] || order.status}
                </span>
              </div>
              <UpdateOrderStatus
                orderId={order.id}
                currentStatus={order.status}
              />
            </div>
          </div>

          {/* Products */}
          <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-6">
            <h2 className="font-bold text-[var(--color-text-primary)] mb-4">
              Produkte
            </h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 py-3 border-b border-[var(--color-border-light)] last:border-0"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.product && (
                      <Image
                        src={`/api/products/${item.productId}/image`}
                        alt={item.product.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">
                      {item.product?.name || "Produkt"}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {item.quantity} x {formatPrice(Number(item.price))}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-[var(--color-text-primary)]">
                    {formatPrice(Number(item.price) * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {(order.customerNotes || order.adminNotes) && (
            <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-6">
              <h2 className="font-bold text-[var(--color-text-primary)] mb-4">
                Notizen
              </h2>
              {order.customerNotes && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase mb-1">
                    Kundennotizen
                  </p>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {order.customerNotes}
                  </p>
                </div>
              )}
              {order.adminNotes && (
                <div>
                  <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase mb-1">
                    Admin-Notizen
                  </p>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {order.adminNotes}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-6">
            <h2 className="font-bold text-[var(--color-text-primary)] mb-4">
              Kunde
            </h2>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium text-[var(--color-text-primary)]">
                  {order.customerFirstName} {order.customerLastName}
                </span>
              </p>
              <p className="text-[var(--color-text-secondary)]">
                {order.customerEmail}
              </p>
              {order.customerPhone && (
                <p className="text-[var(--color-text-secondary)]">
                  {order.customerPhone}
                </p>
              )}
              <div className="pt-2 border-t border-[var(--color-border-light)]">
                <p className="text-[var(--color-text-secondary)]">
                  {order.customerAddress}
                </p>
                <p className="text-[var(--color-text-secondary)]">
                  {order.customerZip} {order.customerCity}
                </p>
                <p className="text-[var(--color-text-secondary)]">
                  {order.customerCountry}
                </p>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-6">
            <h2 className="font-bold text-[var(--color-text-primary)] mb-4">
              Zahlung
            </h2>
            <div className="space-y-2 text-sm">
              <p className="text-[var(--color-text-secondary)]">
                <span className="font-medium">Methode:</span> Virement SEPA
              </p>
              <p className="text-[var(--color-text-secondary)]">
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${
                    order.paymentStatus === "CONFIRMED"
                      ? "bg-green-100 text-green-700"
                      : order.paymentStatus === "FAILED"
                      ? "bg-red-100 text-red-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {order.paymentStatus === "CONFIRMED"
                    ? "Bestätigt"
                    : order.paymentStatus === "FAILED"
                    ? "Fehlgeschlagen"
                    : "Ausstehend"}
                </span>
              </p>
              {order.bankReference && (
                <p className="text-[var(--color-text-secondary)]">
                  <span className="font-medium">Referenz:</span>{" "}
                  {order.bankReference}
                </p>
              )}
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-6">
            <h2 className="font-bold text-[var(--color-text-primary)] mb-4">
              Versand
            </h2>
            <div className="space-y-2 text-sm">
              <p className="text-[var(--color-text-secondary)]">
                <span className="font-medium">Kosten:</span>{" "}
                {formatPrice(Number(order.shippingCost))}
              </p>
              {order.trackingNumber && (
                <p className="text-[var(--color-text-secondary)]">
                  <span className="font-medium">Tracking:</span>{" "}
                  {order.trackingNumber}
                </p>
              )}
            </div>
          </div>

          {/* Total */}
          <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-6">
            <h2 className="font-bold text-[var(--color-text-primary)] mb-4">
              Zusammenfassung
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">
                  Zwischensumme
                </span>
                <span className="font-medium">{formatPrice(Number(order.subtotal))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Versand</span>
                <span className="font-medium">
                  {formatPrice(Number(order.shippingCost))}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[var(--color-border-light)]">
                <span className="font-bold text-[var(--color-text-primary)]">
                  Gesamt
                </span>
                <span className="font-bold text-lg text-[var(--color-text-primary)]">
                  {formatPrice(Number(order.total))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
