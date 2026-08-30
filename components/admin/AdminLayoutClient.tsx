"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
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
  const router = useRouter();

  // Skip auth check for login page
  if (pathname.includes("/admin/login")) {
    return <>{children}</>;
  }

  useEffect(() => {
    if (!admin) {
      router.replace("/admin/login");
    }
  }, [admin, router]);

  if (!admin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <a
        href="#admin-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-[var(--color-primary)] focus:text-white focus:font-semibold focus:shadow-lg"
      >
        Direkt zum Inhalt
      </a>
      <AdminSidebar admin={admin}>{children}</AdminSidebar>
    </div>
  );
}
