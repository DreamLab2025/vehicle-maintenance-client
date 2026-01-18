import Providers from "@/lib/providers";
import "./globals.css";
import { Toaster } from "@/components/ui/toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen">
        <Toaster position="bottom-center" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
