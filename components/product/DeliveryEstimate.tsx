"use client";

import { useState, useEffect } from "react";
import { getEstimatedDeliveryDate } from "@/lib/delivery";

export default function DeliveryEstimate() {
  const [delivery, setDelivery] = useState<{ from: string; to: string } | null>(null);

  useEffect(() => {
    setDelivery(getEstimatedDeliveryDate());
  }, []);

  if (!delivery) return <span className="text-xs text-[var(--color-text-muted)]">--</span>;

  return (
    <span className="text-xs text-[var(--color-text-muted)]">
      {delivery.from} - {delivery.to}
    </span>
  );
}
