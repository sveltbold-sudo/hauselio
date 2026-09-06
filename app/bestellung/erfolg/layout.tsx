import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bestellung erfolgreich",
  description: "Vielen Dank für Ihre Bestellung bei HAUSAURA. Alle Details zu Ihrer Bestellung.",
  robots: { index: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
