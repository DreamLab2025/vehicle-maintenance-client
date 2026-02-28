"use client";

import { createContext, useContext, useEffect } from "react";
import { getCookie } from "cookies-next";
import api8080Service from "@/lib/api/api8080Service";
import { useAuth } from "@/hooks/useAuth";
import { useNotificationListener } from "@/hooks/useNotification";

const AuthContext = createContext<ReturnType<typeof useAuth> | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  useEffect(() => {
    auth.initAuthFromStorage();
    const token = getCookie("auth-token") as string | undefined;
    if (token) {
      // Set token cho API service
      api8080Service.setAuthToken(token);
      auth.initAuthFromStorage();
    }
  }, []);

  // Set up SignalR notification listener
  useNotificationListener();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used inside AuthProvider");
  return ctx;
};
