"use client";

import { usePathname } from "next/navigation";
import BottomNav from "@/components/common/BottomNav";

export default function MaintenanceLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  
  // Ẩn bottom nav khi đang ở flow tạo bảo dưỡng
  // Chỉ hiện bottom nav ở trang chính /maintenance (không có sub-route)
  const normalizedPath = pathname.replace(/\/$/, ""); // Remove trailing slash
  const showBottomNav = normalizedPath === "/maintenance";

  return (
    <>
      {children}
      {showBottomNav && <BottomNav />}
    </>
  );
}
