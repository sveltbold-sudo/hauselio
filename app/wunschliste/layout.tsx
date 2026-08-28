import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Wunschliste",
  description: "Speichern Sie Ihre Lieblingsprodukte auf Ihrer persönlichen Wunschliste bei HAUSELIO.",
  alternates: { canonical: "/wunschliste" },
  openGraph: {
    title: "Meine Wunschliste — HAUSELIO",
    description: "Speichern Sie Ihre Lieblingsprodukte auf Ihrer persönlichen Wunschliste.",
    url: `${SITE_URL}/wunschliste`,
    siteName: "HAUSELIO",
    locale: "de_DE",
    type: "website",
  },
};

export default function WunschlisteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
