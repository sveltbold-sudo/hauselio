export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: "Ausstehend",
  PAYMENT_CONFIRMED: "Bezahlt",
  PROCESSING: "In Bearbeitung",
  SHIPPED: "Versendet",
  DELIVERED: "Geliefert",
  CANCELLED: "Storniert",
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  PENDING_PAYMENT: "bg-[var(--color-accent-light)] text-[var(--color-accent)]",
  PAYMENT_CONFIRMED: "bg-[var(--color-success-light)] text-[var(--color-success)]",
  PROCESSING: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-[var(--color-success-light)] text-[var(--color-success)]",
  CANCELLED: "bg-[var(--color-danger-light)] text-[var(--color-danger)]",
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

export const VALID_ORDER_TRANSITIONS: Record<string, readonly string[]> = {
  PENDING_PAYMENT: ["PAYMENT_CONFIRMED", "CANCELLED"],
  PAYMENT_CONFIRMED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};
