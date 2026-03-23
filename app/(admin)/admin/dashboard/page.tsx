// import { ChartAreaInteractive } from "@/components/chartAreaInteractive";
import { SiteHeader } from "@/components/common/SiteHeader";
import { SidebarInset } from "@/components/ui/sidebar";

export default function Page() {
  return (
    <SidebarInset>
      <SiteHeader title="Dashboard" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="px-4 lg:px-6">{/* <ChartAreaInteractive /> */}</div>
        </div>
      </div>
    </SidebarInset>
  );
}
