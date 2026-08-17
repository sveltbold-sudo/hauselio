"use client";

import dynamic from "next/dynamic";

const AnalyticsGate = dynamic(() => import("@/components/analytics/AnalyticsGate"), { ssr: false });
const NewsletterToast = dynamic(() => import("@/components/ui/NewsletterToast"), { ssr: false });

export default function ClientProviders() {
  return (
    <>
      <AnalyticsGate />
      <NewsletterToast />
    </>
  );
}
