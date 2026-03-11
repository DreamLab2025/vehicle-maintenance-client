import Providers from "@/lib/providers";
import "./globals.css";
import { Toaster } from "@/components/ui/toast";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={inter.variable} suppressHydrationWarning>
      <body className={`min-h-screen font-sans antialiased ${inter.className}`}>
        <Toaster position="bottom-center" />
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
