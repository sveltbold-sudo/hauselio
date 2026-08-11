import type { Metadata } from "next";
import CategoryPage from "@/components/product/CategoryPage";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Küche & Kochen",
  description: "Hochwertige Küchengeräte für anspruchsvolle Köche",
  alternates: { canonical: "/kueche" },
  openGraph: {
    title: "Küche & Kochen — HAUSELIO",
    description: "Hochwertige Küchengeräte für anspruchsvolle Köche",
    url: "/kueche",
    siteName: "HAUSELIO",
    locale: "de_DE",
    type: "website",
  },
};

export default function KuechePage() {
  return (
    <CategoryPage
      slug="kueche"
      title="Küche & Kochen"
      description="Hochwertige Küchengeräte für anspruchsvolle Köche"
    />
  );
}
