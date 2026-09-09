"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";
const AW_ID = process.env.NEXT_PUBLIC_AW_CONVERSION_ID || "";

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

function gtag(...args: unknown[]) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(args);
}

export default function GoogleTagScript() {
  const pathname = usePathname();
  const activeId = GA_ID || AW_ID;

  useEffect(() => {
    if (!activeId) return;
    window.dataLayer = window.dataLayer || [];
    gtag("js", new Date());
    gtag("config", activeId, { send_page_view: false });
  }, [activeId]);

  useEffect(() => {
    if (!activeId) return;
    gtag("event", "page_view", { page_path: pathname, send_to: activeId });
  }, [pathname, activeId]);

  if (!activeId) return null;

  return (
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${activeId}`}
      strategy="afterInteractive"
    />
  );
}
