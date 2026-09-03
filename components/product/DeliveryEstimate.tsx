"use client";

import { useState, useEffect } from "react";
import { getEstimatedDeliveryDate } from "@/lib/delivery";

export default function DeliveryEstimate() {
  const [delivery, setDelivery] = useState<{ from: string; to: string } | null>(null);

  useEffect(() => {
    setDelivery(getEstimatedDeliveryDate());
  }, []);

  return (
    <span className="text-xs text-[var(--color-text-muted)]" aria-busy={!delivery}>
      {delivery ? (
        <>
          <time dateTime={delivery.from}>{delivery.from}</time> - <time dateTime={delivery.to}>{delivery.to}</time>
        </>
      ) : (
        <span className="inline-block w-24 h-3 bg-[var(--color-bg-secondary)] rounded animate-pulse" />
      )}
    </span>
  );
}
