export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: "Ausstehend",
  PAYMENT_CONFIRMED: "Bezahlt",
  PROCESSING: "In Bearbeitung",
  SHIPPED: "Versendet",
  DELIVERED: "Geliefert",
  CANCELLED: "Storniert",
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  PENDING_PAYMENT: "bg-amber-100 text-amber-700",
  PAYMENT_CONFIRMED: "bg-green-100 text-green-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: "Ausstehend",
  CONFIRMED: "Bestätigt",
  FAILED: "Fehlgeschlagen",
  REFUNDED: "Erstattet",
};

export const ALLOWED_ORDER_STATUSES = [
  "PENDING_PAYMENT",
  "PAYMENT_CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

export const ALLOWED_PAYMENT_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "FAILED",
  "REFUNDED",
] as const;
