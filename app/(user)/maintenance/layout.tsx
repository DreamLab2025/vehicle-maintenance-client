import BottomNav from "@/components/common/BottomNav";

export default function MaintenanceLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BottomNav />
    </>
  );
}
