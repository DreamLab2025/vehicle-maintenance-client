import Header from "@/components/common/Header";
import "./globals.css";
import BottomNav from "@/components/common/BottomNav";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen">
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
