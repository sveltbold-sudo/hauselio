"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { getCookieConsent } from "@/components/ui/CookieConsent";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export default function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    setHasConsent(getCookieConsent() === true);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "HAUSAURA_cookie_consent") {
        setHasConsent(e.newValue === "true");
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    if (!hasConsent || !gaId) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments);
    };

    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
    window.gtag("event", "page_view", {
      page_path: url,
      page_title: document.title,
    });
  }, [hasConsent, gaId, pathname, searchParams]);

  useEffect(() => {
    if (!hasConsent) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments);
    };

    if (gaId) {
      window.gtag("js", new Date());
      window.gtag("config", gaId, {
        send_page_view: false,
        cookie_flags: "SameSite=None;Secure",
      });
    }

    if (gtmId) {
      window.dataLayer.push({
        "gtm.start": new Date().getTime(),
        event: "gtm.js",
      });
    }
  }, [hasConsent, gaId, gtmId]);

  if (!gaId && !gtmId) return null;

  return (
    <>
      {gaId && (
        <Script
          id="ga4"
          src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          strategy="afterInteractive"
        />
      )}
      {gtmId && (
        <Script
          id="gtm"
          src={`https://www.googletagmanager.com/gtm.js?id=${gtmId}`}
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
