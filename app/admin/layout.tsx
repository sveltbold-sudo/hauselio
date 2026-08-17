import type { Metadata } from "next";
import { getAdminFromRequest } from "@/lib/auth";
import AdminLayoutClient from "@/components/admin/AdminLayoutClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: "noindex, nofollow",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let admin = null;
  try {
    admin = await getAdminFromRequest();
  } catch {
    // Admin not authenticated — middleware should have caught this,
    // but render gracefully anyway (login page or error boundary handles it)
  }

  return (
    <AdminLayoutClient admin={admin}>{children}</AdminLayoutClient>
  );
}
