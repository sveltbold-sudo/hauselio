"use client";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { getCookieConsent } from "@/components/ui/CookieConsent";
import { useState } from "react";

function readConsent(): boolean | null {
  if (typeof window === "undefined") return null;
  return getCookieConsent();
}

export default function AnalyticsGate() {
  const [consent] = useState<boolean | null>(readConsent);

  if (consent !== true) return null;

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
