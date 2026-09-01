"use client";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import GoogleAnalytics from "./GoogleAnalytics";
import { getCookieConsent } from "@/components/ui/CookieConsent";
import { useState, useEffect, Suspense } from "react";

export default function AnalyticsGate() {
  const [consent, setConsent] = useState<boolean | null>(null);

  useEffect(() => {
    setConsent(getCookieConsent());

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "HAUSAURA_cookie_consent") {
        setConsent(e.newValue === "true");
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  if (consent !== true) return null;

  return (
    <>
      <Analytics />
      <SpeedInsights />
      <Suspense fallback={null}>
        <GoogleAnalytics />
      </Suspense>
    </>
  );
}
