import type { Metadata } from "next";
import CategoryPage from "@/components/product/CategoryPage";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Kaffee",
  description: "Premium Kaffeemaschinen für den perfekten Genuss",
  alternates: { canonical: "/kaffee" },
  openGraph: {
    title: "Kaffee — HAUSELIO",
    description: "Premium Kaffeemaschinen für den perfekten Genuss",
    url: "/kaffee",
    siteName: "HAUSELIO",
    locale: "de_DE",
    type: "website",
  },
};

export default function KaffeePage() {
  return (
    <CategoryPage
      slug="kaffee"
      title="Kaffee"
      description="Premium Kaffeemaschinen für den perfekten Genuss"
    />
  );
}
