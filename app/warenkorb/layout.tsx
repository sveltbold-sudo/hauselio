import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Warenkorb | HAUSELIO",
  robots: "noindex, nofollow",
};

export default function WarenkorbLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
