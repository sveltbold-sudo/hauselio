"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getCookiePreferences } from "@/components/ui/CookieConsent";

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

export default function GoogleAdsRemarketing() {
  const pathname = usePathname();

  useEffect(() => {
    const prefs = getCookiePreferences();
    if (!prefs?.functional) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
  }, []);

  useEffect(() => {
    const prefs = getCookiePreferences();
    if (!prefs?.functional) return;

    if (typeof window.gtag !== "function") return;

    window.gtag("event", "page_view", {
      page_path: pathname,
      send_to: process.env.NEXT_PUBLIC_AW_CONVERSION_ID || "",
    });
  }, [pathname]);

  return null;
}

export function sendDynamicRemarketing(items: { id: string; name: string; price: number; category?: string; brand?: string }[]) {
  const prefs = getCookiePreferences();
  if (!prefs?.functional) return;
  if (typeof window.gtag !== "function") return;
  if (!process.env.NEXT_PUBLIC_AW_CONVERSION_ID) return;

  window.gtag("event", "view_item", {
    send_to: process.env.NEXT_PUBLIC_AW_CONVERSION_ID,
    value: items[0]?.price || 0,
    items: items.map((item) => ({
      id: item.id,
      google_business_vertical: "retail",
    })),
  });
}
