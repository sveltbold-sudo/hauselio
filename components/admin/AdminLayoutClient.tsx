"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

interface AdminLayoutClientProps {
  children: React.ReactNode;
  admin: {
    id: string;
    email: string;
    name?: string | null;
    role: string;
  } | null;
}

export default function AdminLayoutClient({
  children,
  admin,
}: AdminLayoutClientProps) {
  const pathname = usePathname();

  // Skip auth check for login page
  if (pathname.includes("/admin/login")) {
    return <>{children}</>;
  }

  // Admin is guaranteed by server-side redirect in layout.tsx
  if (!admin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <AdminSidebar admin={admin}>{children}</AdminSidebar>
    </div>
  );
}
