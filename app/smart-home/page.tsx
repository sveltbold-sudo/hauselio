import type { Metadata } from "next";
import CategoryPage from "@/components/product/CategoryPage";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Smart Home",
  description: "Intelligente Geräte für ein vernetztes Zuhause",
  alternates: { canonical: "/smart-home" },
  openGraph: {
    title: "Smart Home — HAUSELIO",
    description: "Intelligente Geräte für ein vernetztes Zuhause",
    url: "/smart-home",
    siteName: "HAUSELIO",
    locale: "de_DE",
    type: "website",
  },
};

export default function SmartHomePage() {
  return (
    <CategoryPage
      slug="smart-home"
      title="Smart Home"
      description="Intelligente Geräte für ein vernetztes Zuhause"
    />
  );
}
