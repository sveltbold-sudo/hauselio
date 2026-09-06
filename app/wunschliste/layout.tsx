import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meine Wunschliste",
  description: "Ihre gespeicherten Produkte bei HAUSAURA. Merken Sie sich Ihre Lieblingsartikel für später.",
  robots: { index: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
