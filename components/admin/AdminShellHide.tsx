"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";

export default function AdminShellHide({ children, footer }: { children: ReactNode; footer: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <div className="flex-1 pb-24 lg:pb-0">
        {children}
      </div>
      {footer}
    </>
  );
}
