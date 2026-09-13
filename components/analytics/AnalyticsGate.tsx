"use client";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import GoogleAnalytics from "./GoogleAnalytics";
import CWVReporter from "./CWVReporter";
import { getCookieConsent } from "@/components/ui/CookieConsent";
import { useState, useEffect, Suspense } from "react";

export default function AnalyticsGate() {
  const [consent, setConsent] = useState<boolean | null>(null);

  useEffect(() => {
    setConsent(getCookieConsent());

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "HAUSAURA_cookie_consent") {
        if (e.newValue === "true") {
          setConsent(true);
          return;
        }
        try {
          const parsed = e.newValue ? JSON.parse(e.newValue) : null;
          setConsent(!!(parsed?.functional || parsed?.analytics));
        } catch {
          setConsent(false);
        }
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
      <CWVReporter />
      <Suspense fallback={null}>
        <GoogleAnalytics />
      </Suspense>
    </>
  );
}
