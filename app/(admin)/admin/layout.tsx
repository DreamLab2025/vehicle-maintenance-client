import type { Metadata } from "next";
import "../../globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebarAdmin } from "@/components/common/AppSidebarAdmin";

export const metadata: Metadata = {
  title: "Verendar  Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebarAdmin variant="inset" collapsible="icon" />
      {children}
    </SidebarProvider>
  );
}
