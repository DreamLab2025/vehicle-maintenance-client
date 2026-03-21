"use client";

import { AuthProvider } from "./providers/AuthProvider";
import { useIsMobile } from "@/hooks/useMobile";
import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();

  return (
    <AuthProvider>
      {isMobile ? (
        // Mobile: keep current layout (forms have their own mobile UI)
        children
      ) : (
        // Desktop: split screen - left image, right form
        <div className="flex min-h-screen">
          {/* Left side - Image */}
          <div className="hidden lg:flex lg:w-1/2 relative">
            <Image
              src="/images/login.jpg"
              alt="Auth background"
              fill
              className="object-cover"
              priority
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-transparent" />
            {/* Branding */}
            <div className="absolute bottom-12 left-12">
              <h1 className="text-4xl font-bold text-white mb-2">Varendar</h1>
              <p className="text-white/80 text-lg">Vehicle Maintenance Made Easy</p>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="flex-1 flex items-center justify-center p-8 bg-white">
            {children}
          </div>
        </div>
      )}
    </AuthProvider>
  );
}
