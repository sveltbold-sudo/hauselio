import type { Metadata } from "next";
import CategoryPage from "@/components/product/CategoryPage";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Reinigung",
  description: "Effiziente Reinigungsgeräte für Ihr Zuhause",
  alternates: { canonical: "/reinigung" },
  openGraph: {
    title: "Reinigung — HAUSELIO",
    description: "Effiziente Reinigungsgeräte für Ihr Zuhause",
    url: "/reinigung",
    siteName: "HAUSELIO",
    locale: "de_DE",
    type: "website",
  },
};

export default function ReinigungPage() {
  return (
    <CategoryPage
      slug="reinigung"
      title="Reinigung"
      description="Effiziente Reinigungsgeräte für Ihr Zuhause"
    />
  );
}
