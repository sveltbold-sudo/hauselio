import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Warenkorb | HAUSELIO",
  description: "Überprüfen Sie Ihre Bestellung im HAUSELIO Warenkorb.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Warenkorb | HAUSELIO",
    description: "Überprüfen Sie Ihre Bestellung im HAUSELIO Warenkorb.",
    url: `${SITE_URL}/warenkorb`,
    siteName: "HAUSELIO",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Warenkorb | HAUSELIO",
    description: "Überprüfen Sie Ihre Bestellung im HAUSELIO Warenkorb.",
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
