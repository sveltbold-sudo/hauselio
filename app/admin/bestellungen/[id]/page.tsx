import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/admin-constants";
import { logger } from "@/lib/logger";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Receipt, Clock, FileText, Send, Download } from "lucide-react";
import UpdateOrderStatus from "@/components/admin/UpdateOrderStatus";
import OrderNotes from "@/components/admin/OrderNotes";
import ResendReceiptButton from "@/components/admin/ResendReceiptButton";

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
      select: {
        id: true,
        orderNumber: true,
        status: true,
        createdAt: true,
        customerFirstName: true,
        customerLastName: true,
        customerEmail: true,
        customerPhone: true,
        customerAddress: true,
        customerZip: true,
        customerCity: true,
        customerCountry: true,
        customerNotes: true,
        adminNotes: true,
        paymentMethod: true,
        paymentStatus: true,
        bankReference: true,
        paymentProofUrl: true,
        reminderCount: true,
        lastReminderAt: true,
        invoiceNumber: true,
        shippingCost: true,
        trackingNumber: true,
        subtotal: true,
        couponDiscount: true,
        total: true,
        items: {
          select: {
            id: true,
            quantity: true,
            price: true,
            productId: true,
            product: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  } catch (error) {
    logger.error("bestellungen/[id]: DB error", error);
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
          aria-label="Zurück zu Bestellungen"
          className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] rounded-lg transition-colors"
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
                          ORDER_STATUS_COLORS[order.status] || "bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]"
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
                  <div className="w-16 h-16 bg-[var(--color-bg-secondary)] rounded-lg overflow-hidden flex-shrink-0">
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
          <OrderNotes
            orderId={order.id}
            initialAdminNotes={order.adminNotes || ""}
            initialTrackingNumber={order.trackingNumber || ""}
            initialBankReference={order.bankReference || ""}
          />
          {order.customerNotes && (
            <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-6">
              <h2 className="font-bold text-[var(--color-text-primary)] mb-4">
                Kundennotizen
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)] whitespace-pre-wrap">
                {order.customerNotes}
              </p>
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
              {order.invoiceNumber && (
                <p className="text-[var(--color-text-secondary)]">
                  <span className="font-medium">Rechnungsnr.:</span>{" "}
                  <span className="font-mono font-bold text-[var(--color-primary)]">{order.invoiceNumber}</span>
                </p>
              )}
              <p className="text-[var(--color-text-secondary)]">
                <span className="font-medium">Methode:</span> {order.paymentMethod || "\u00dcberweisung (SEPA)"}
              </p>
              <p className="text-[var(--color-text-secondary)]">
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${
                    order.paymentStatus === "CONFIRMED"
                      ? "bg-[var(--color-success-light)] text-[var(--color-success)]"
                      : order.paymentStatus === "FAILED"
                      ? "bg-[var(--color-danger-light)] text-[var(--color-danger)]"
                      : "bg-[var(--color-accent-light)] text-[var(--color-accent)]"
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
              {order.reminderCount > 0 && (
                <p className="text-[var(--color-text-secondary)]">
                  <span className="font-medium">Erinnerungen:</span>{" "}
                  {order.reminderCount}
                  {order.lastReminderAt && (
                    <span className="text-[var(--color-text-muted)] ml-1">
                      (letzte: {new Date(order.lastReminderAt).toLocaleDateString("de-DE")})
                    </span>
                  )}
                </p>
              )}
            </div>
            {order.paymentStatus === "CONFIRMED" && order.invoiceNumber && (
              <div className="mt-4 pt-4 border-t border-[var(--color-border-light)] space-y-2">
                <a
                  href={`/api/admin/bestellungen/${order.id}/invoice`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Rechnung als PDF herunterladen
                </a>
                <ResendReceiptButton orderId={order.id} />
              </div>
            )}
          </div>

          {/* Payment Proof */}
          {order.paymentProofUrl && (
            <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-6">
              <h2 className="font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                Zahlungsnachweis
              </h2>
              <a href={order.paymentProofUrl} target="_blank" rel="noopener noreferrer">
                <Image
                  src={order.paymentProofUrl}
                  alt="Zahlungsnachweis"
                  width={400}
                  height={300}
                  className="rounded-lg border border-[var(--color-border-light)] object-cover"
                  unoptimized
                />
              </a>
            </div>
          )}

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
              {Number(order.couponDiscount) > 0 && (
                <div className="flex justify-between">
                  <span className="text-[var(--color-success)]">Rabatt</span>
                  <span className="font-medium text-[var(--color-success)]">-{formatPrice(Number(order.couponDiscount))}</span>
                </div>
              )}
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
