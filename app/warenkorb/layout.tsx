import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Warenkorb",
  description: "Ihr Warenkorb bei HAUSAURA. Überprüfen Sie Ihre Auswahl und gehen Sie zur Kasse.",
  robots: { index: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
