import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Mein Konto",
  description: "Verwalten Sie Ihr HAUSAURA-Konto. Bestellungen ansehen, Profil bearbeiten und Einstellungen vornehmen.",
  robots: { index: false },
  alternates: { canonical: `${SITE_URL}/konto` },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
