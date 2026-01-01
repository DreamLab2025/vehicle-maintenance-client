"use client";

import { Toaster } from "sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="top-center"
        richColors={false}
        toastOptions={{
          style: {
            background: "white",
            color: "#000000",
            border: "1px solid #e5e7eb",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          },
          className: "font-medium",
        }}
      />
    </>
  );
}
