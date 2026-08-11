import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminFromRequest } from "@/lib/auth";
import AdminLayoutClient from "@/components/admin/AdminLayoutClient";

export const metadata: Metadata = {
  robots: "noindex, nofollow",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdminFromRequest();

  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <AdminLayoutClient admin={admin}>{children}</AdminLayoutClient>
  );
}
