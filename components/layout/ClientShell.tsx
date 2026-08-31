"use client";

import dynamic from "next/dynamic";

const MobileBottomNav = dynamic(() => import("@/components/layout/MobileBottomNav"), { ssr: false });
const BackToTop = dynamic(() => import("@/components/layout/BackToTop"), { ssr: false });
const CookieConsent = dynamic(() => import("@/components/ui/CookieConsent"), { ssr: false });
const ExitIntentPopup = dynamic(() => import("@/components/ui/ExitIntentPopup"), { ssr: false });
const WhatsAppChat = dynamic(() => import("@/components/ui/WhatsAppChat"), { ssr: false });

export default function ClientShell() {
  return (
    <>
      <MobileBottomNav />
      <BackToTop />
      <CookieConsent />
      <ExitIntentPopup />
      <WhatsAppChat />
    </>
  );
}
