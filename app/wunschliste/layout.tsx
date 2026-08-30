import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Wunschliste | HAUSELIO",
  description: "Speichern Sie Ihre Lieblingsprodukte auf Ihrer persönlichen Wunschliste bei HAUSELIO.",
  alternates: { canonical: `${SITE_URL}/wunschliste` },
  robots: { index: false, follow: true },
  openGraph: {
    title: "Wunschliste | HAUSELIO",
    description: "Speichern Sie Ihre Lieblingsprodukte auf Ihrer persönlichen Wunschliste bei HAUSELIO.",
    url: `${SITE_URL}/wunschliste`,
    siteName: "HAUSELIO",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wunschliste | HAUSELIO",
    description: "Speichern Sie Ihre Lieblingsprodukte auf Ihrer persönlichen Wunschliste bei HAUSELIO.",
  },
};

export default function WunschlisteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
