import { HomeDesktopView } from "@/components/widget/home/desktop/HomeDesktopView";
import { HomePageView } from "@/components/widget/home/HomePageView";

/** Mobile (&lt;768px): UI home. Desktop (≥768px): dashboard VERENDAR. Cần đăng nhập để vào `/` (middleware). */
export default function Page() {
  return (
    <>
      <div className="w-full min-h-dvh md:hidden">
        <HomePageView />
      </div>
      <div className="hidden h-dvh max-h-dvh w-full overflow-hidden md:block">
        <HomeDesktopView />
      </div>
    </>
  );
}
