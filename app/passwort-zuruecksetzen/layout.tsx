import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Passwort zurücksetzen",
  description: "Setzen Sie Ihr HAUSAURA-Passwort sicher zurück.",
  robots: { index: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
