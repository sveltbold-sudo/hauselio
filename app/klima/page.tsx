import type { Metadata } from "next";
import CategoryPage from "@/components/product/CategoryPage";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Klima",
  description: "Klimaanlagen und Luftreiniger für jedes Raumklima",
  alternates: { canonical: "/klima" },
  openGraph: {
    title: "Klima — HAUSELIO",
    description: "Klimaanlagen und Luftreiniger für jedes Raumklima",
    url: "/klima",
    siteName: "HAUSELIO",
    locale: "de_DE",
    type: "website",
  },
};

export default function KlimaPage() {
  return (
    <CategoryPage
      slug="klima"
      title="Klima"
      description="Klimaanlagen und Luftreiniger für jedes Raumklima"
    />
  );
}
