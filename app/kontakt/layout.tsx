import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Kontaktieren Sie HAUSELIO — wir helfen Ihnen bei Fragen zu unseren Haushaltsgeräten, Bestellungen und mehr.",
  alternates: {
    canonical: "/kontakt",
  },
};

export default function KontaktLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
