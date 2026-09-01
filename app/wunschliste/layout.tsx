import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Wunschliste",
  description: "Speichern Sie Ihre Lieblingsprodukte auf Ihrer persönlichen Wunschliste bei HAUSAURA.",
  alternates: { canonical: `${SITE_URL}/wunschliste` },
  robots: { index: false, follow: true },
  openGraph: {
    title: "Wunschliste | HAUSAURA",
    description: "Speichern Sie Ihre Lieblingsprodukte auf Ihrer persönlichen Wunschliste bei HAUSAURA.",
    url: `${SITE_URL}/wunschliste`,
    siteName: "HAUSAURA",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wunschliste | HAUSAURA",
    description: "Speichern Sie Ihre Lieblingsprodukte auf Ihrer persönlichen Wunschliste bei HAUSAURA.",
  },
};

export default function WunschlisteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
