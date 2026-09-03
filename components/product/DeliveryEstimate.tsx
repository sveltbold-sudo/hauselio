"use client";

import { useState, useEffect } from "react";
import { getEstimatedDeliveryDate } from "@/lib/delivery";

export default function DeliveryEstimate() {
  const [delivery, setDelivery] = useState<{ from: string; to: string } | null>(null);

  useEffect(() => {
    setDelivery(getEstimatedDeliveryDate());
  }, []);

  if (!delivery) return <span className="text-xs text-[var(--color-text-muted)]" aria-busy="true">--</span>;

  return (
    <span className="text-xs text-[var(--color-text-muted)]">
      <time dateTime={delivery.from}>{delivery.from}</time> - <time dateTime={delivery.to}>{delivery.to}</time>
    </span>
  );
}
