import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mein Konto",
  description: "Verwalten Sie Ihr HAUSAURA-Konto. Bestellungen ansehen, Profil bearbeiten und Einstellungen vornehmen.",
  robots: { index: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
