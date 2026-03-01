"use client";

import { usePathname } from "next/navigation";
import BottomNav from "@/components/common/BottomNav";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  
  // Ẩn bottom nav ở maintenance flow (tất cả route bắt đầu với /maintenance/ trừ /maintenance)
  const normalizedPath = pathname.replace(/\/$/, "");
  const isMaintenanceFlow = normalizedPath.startsWith("/maintenance/");
  const showBottomNav = !isMaintenanceFlow;

  return (
    <>
      {children}
      {showBottomNav && <BottomNav />}
    </>
  );
}
