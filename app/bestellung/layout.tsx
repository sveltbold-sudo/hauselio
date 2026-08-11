import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bestellung | HAUSELIO",
  robots: "noindex, nofollow",
};

export default function BestellungLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
