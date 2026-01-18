"use client";

import { createContext, useContext, useEffect } from "react";
import { getCookie } from "cookies-next";
import apiService from "@/lib/api/apiService";
import coreApiService from "@/lib/api/coreApiService";
import { useAuth } from "@/hooks/useAuth";

const AuthContext = createContext<ReturnType<typeof useAuth> | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  useEffect(() => {
    const token = getCookie("auth-token") as string | undefined;
    if (token) {
      // Set token cho cả 2 API services
      apiService.setAuthToken(token);
      coreApiService.setAuthToken(token);
      auth.initAuthFromStorage();
    }
  }, []);

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used inside AuthProvider");
  return ctx;
};
