"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AuthProvider } from "@/app/(auth)/providers/AuthProvider";
import { NotificationHubProvider } from "@/app/(auth)/providers/NotificationHubProvider";
import { I18nProvider } from "@/components/providers/I18nProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <AuthProvider>
          <NotificationHubProvider>{children}</NotificationHubProvider>
        </AuthProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}
