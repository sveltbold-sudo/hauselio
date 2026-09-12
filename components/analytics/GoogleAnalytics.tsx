"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { getCookiePreferences } from "@/components/ui/CookieConsent";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

function gtag(...args: unknown[]) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(args);
}

export default function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const awId = process.env.NEXT_PUBLIC_AW_CONVERSION_ID;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [consentReady, setConsentReady] = useState(false);

  useEffect(() => {
    const prefs = getCookiePreferences();
    const hasAnalytics = prefs?.analytics ?? false;
    const hasFunctional = prefs?.functional ?? false;

    gtag("consent", "default", {
      ad_storage: hasFunctional ? "granted" : "denied",
      ad_user_data: hasFunctional ? "granted" : "denied",
      ad_personalization: hasFunctional ? "granted" : "denied",
      analytics_storage: hasAnalytics ? "granted" : "denied",
      functionality_storage: hasFunctional ? "granted" : "denied",
      personalization_storage: hasFunctional ? "granted" : "denied",
      security_storage: "granted",
      wait_for_update: 500,
    });

    gtag("set", "ads_data_redaction", !hasFunctional);
    gtag("set", "url_passthrough", true);

    setConsentReady(true);
  }, []);

  useEffect(() => {
    if (!consentReady) return;

    const handleConsentChange = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      const prefs = getCookiePreferences();
      const hasAnalytics = detail?.consent ?? prefs?.analytics ?? false;
      const hasFunctional = prefs?.functional ?? false;

      gtag("consent", "update", {
        ad_storage: hasFunctional ? "granted" : "denied",
        ad_user_data: hasFunctional ? "granted" : "denied",
        ad_personalization: hasFunctional ? "granted" : "denied",
        analytics_storage: hasAnalytics ? "granted" : "denied",
        functionality_storage: hasFunctional ? "granted" : "denied",
        personalization_storage: hasFunctional ? "granted" : "denied",
      });

      gtag("set", "ads_data_redaction", !hasFunctional);
    };

    window.addEventListener("HAUSAURA:cookie-saved", handleConsentChange);
    window.addEventListener("HAUSAURA:cookie-saved", handleConsentChange as EventListener);
    return () => {
      window.removeEventListener("HAUSAURA:cookie-saved", handleConsentChange);
    };
  }, [consentReady]);

  useEffect(() => {
    if (!consentReady) return;

    const prefs = getCookiePreferences();
    const hasConsentAnalytics = prefs?.analytics ?? false;

    window.dataLayer = window.dataLayer || [];
    window.gtag = gtag;

    if (gaId && hasConsentAnalytics) {
      gtag("config", gaId, {
        send_page_view: false,
        cookie_flags: "SameSite=None;Secure",
      });
    }

    if (awId) {
      gtag("config", awId, {
        send_page_view: false,
      });
    }
  }, [consentReady, gaId, awId]);

  useEffect(() => {
    if (!consentReady || !gaId) return;

    const prefs = getCookiePreferences();
    const hasConsent = prefs?.analytics ?? false;
    if (!hasConsent) return;

    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
    gtag("event", "page_view", {
      page_path: url,
      page_title: document.title,
      send_to: gaId,
    });
  }, [consentReady, gaId, pathname, searchParams]);

  useEffect(() => {
    if (!consentReady || !gtmId) return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      "gtm.start": new Date().getTime(),
      event: "gtm.js",
    });
  }, [consentReady, gtmId]);

  if (!gaId && !awId && !gtmId) return null;

  return (
    <>
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
