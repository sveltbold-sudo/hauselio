import type { Metadata } from "next";
import CategoryPage from "@/components/product/CategoryPage";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Große Haushaltsgeräte",
  description:
    "Waschmaschinen, Trockner, Kühlschränke, Spülmaschinen und mehr. Die besten Marken.",
  alternates: { canonical: "/haushaltsgeraete" },
  openGraph: {
    title: "Große Haushaltsgeräte — HAUSELIO",
    description: "Waschmaschinen, Trockner, Kühlschränke, Spülmaschinen und mehr.",
    url: "/haushaltsgeraete",
    siteName: "HAUSELIO",
    locale: "de_DE",
    type: "website",
  },
};

export default function HaushaltsgeraetePage() {
  return (
    <CategoryPage
      slug="haushaltsgeraete"
      title="Große Haushaltsgeräte"
      description="Waschmaschinen, Trockner, Kühlschränke, Gefrierschränke, Spülmaschinen und Einbauküchen der besten Marken."
    />
  );
}
