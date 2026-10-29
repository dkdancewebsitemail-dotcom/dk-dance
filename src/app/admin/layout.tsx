"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row overflow-x-hidden w-full">
      <AdminSidebar />
      <div className="flex-1 min-w-0 bg-neutral-950/50 flex flex-col min-h-screen overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
