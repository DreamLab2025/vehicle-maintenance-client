import type { Metadata } from "next";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AppSidebarAdmin } from "@/components/common/AppSidebarAdmin";

export const metadata: Metadata = {
  title: "Verendar Dashboard",
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {

  return (
    <SidebarProvider>
      <AppSidebarAdmin variant="inset" collapsible="icon" />
      <SidebarInset>
        {/* Shared Header — lives here so every admin page inherits it */}
        <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b bg-background px-4 transition-[width,height] ease-linear lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        </header>

        {/* Page content */}
        <div className="flex flex-1 flex-col">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
