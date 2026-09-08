import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Warenkorb",
  description: "Ihr Warenkorb bei HAUSAURA. Überprüfen Sie Ihre Auswahl und gehen Sie zur Kasse.",
  robots: { index: false },
  alternates: { canonical: `${SITE_URL}/warenkorb` },
  openGraph: {
    title: `Warenkorb | ${SITE_NAME}`,
    description: "Ihr Warenkorb bei HAUSAURA. Überprüfen Sie Ihre Auswahl und gehen Sie zur Kasse.",
    url: `${SITE_URL}/warenkorb`,
    siteName: SITE_NAME,
    locale: "de_DE",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
