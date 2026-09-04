import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Warenkorb",
  description: "Überprüfen Sie Ihre Bestellung im HAUSAURA Warenkorb.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Warenkorb",
    description: "Überprüfen Sie Ihre Bestellung im HAUSAURA Warenkorb.",
    url: `${SITE_URL}/warenkorb`,
    siteName: "HAUSAURA",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Warenkorb",
    description: "Überprüfen Sie Ihre Bestellung im HAUSAURA Warenkorb.",
  },
  alternates: { canonical: `${SITE_URL}/warenkorb` },
};

export default function WarenkorbLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
