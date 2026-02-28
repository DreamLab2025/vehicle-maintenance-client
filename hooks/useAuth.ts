// hooks/useAuth.ts

"use client";

import { useState } from "react";
import { fetchAuth } from "@/lib/api/services/fetchAuth";
import { setCookie, getCookie, deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import authApiService from "@/lib/api/authApiService";
import coreApiService from "@/lib/api/coreApiService";
import notificationHubService from "@/hubs/notificationHub";
import apiService from "@/lib/api/apiService";
import aiApiService from "@/lib/api/aiApiService";
import api8080Service from "@/lib/api/api8080Service";

/* ===================== TYPES ===================== */

export interface User {
  avatarUrl: string;
  userId: string;
  userName: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
}

interface AuthResult {
  success: boolean;
  user?: User | null;
  error?: string;
}

interface JwtPayload {
  userId?: string;
  sub?: string;
  unique_name?: string;
  userName?: string;
  email?: string;
  role?: string | string[];
  exp?: number;
}

/* ===================== HOOK ===================== */

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    loading: false,
    error: null,
  });

  const router = useRouter();

  /* ---------- JWT HELPERS ---------- */

  
  const decodeJwt = (token: string): JwtPayload => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return {};
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return {};
  }
  };

  const buildUserFromToken = (token: string): User => {
    const payload = decodeJwt(token);

    return {
      userId: payload.userId || payload.sub || "",
      userName: payload.userName || payload.unique_name || payload.email?.split("@")[0] || "",
      email: payload.email || "",
      role: Array.isArray(payload.role) ? payload.role[0] : payload.role || "User",
      avatarUrl: `https://ui-avatars.com/api/?name=${payload.userName}&background=0D8ABC&color=fff`,
    };
  };

  /* ===================== LOGIN ===================== */

  const login = async (email: string, password: string): Promise<AuthResult> => {
    setState((s) => ({ ...s, loading: true, error: null }));

    try {
      const response = await fetchAuth.login(email, password);

      const token = response.data.data.accessToken;
      const user = buildUserFromToken(token);

      // ✅ LƯU COOKIE
      setCookie("auth-token", token, {
        path: "/",
        sameSite: "lax",
      });

      // ✅ SET TOKEN CHO APISERVICE
      authApiService.setAuthToken(token);
      coreApiService.setAuthToken(token);
      apiService.setAuthToken(token);
      aiApiService.setAuthToken(token);
      api8080Service.setAuthToken(token);
      setState({
        user,
        accessToken: token,
        loading: false,
        error: null,
      });

      // ✅ CONNECT TO NOTIFICATION HUB
      console.log("🔌 Attempting to connect to notification hub after login...");
      notificationHubService.startConnection(token).then((connected) => {
        if (connected) {
          console.log("✅ Notification hub connected successfully after login!");
        } else {
          console.warn("⚠️ Failed to connect to notification hub after login");
        }
      });

      return { success: true, user };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Đăng nhập thất bại";
      setState((s) => ({ ...s, loading: false, error: message }));
      return { success: false, error: message };
    }
  };

  /* ===================== REGISTER ===================== */

  const register = async (email: string, password: string): Promise<AuthResult> => {
    setState((s) => ({ ...s, loading: true, error: null }));

    try {
      const response = await fetchAuth.register(email, password);
      const userData = response.data.data;

      const user: User = {
        userId: userData.id,
        userName: userData.userName,
        email: userData.email,
        role: userData.roles[0] || "User",
        avatarUrl: `https://ui-avatars.com/api/?name=${userData.userName}&background=0D8ABC&color=fff`,
      };

      setState({
        user,
        accessToken: null,
        loading: false,
        error: null,
      });

      return { success: true, user };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Đăng ký thất bại";
      setState((s) => ({ ...s, loading: false, error: message }));
      return { success: false, error: message };
    }
  };

  /* ===================== VERIFY OTP ===================== */

  const verifyOtp = async (email: string, otpCode: string): Promise<AuthResult> => {
    setState((s) => ({ ...s, loading: true, error: null }));

    try {
      await fetchAuth.verifyOtp(email, otpCode);

      setState((s) => ({ ...s, loading: false }));
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Mã OTP không đúng hoặc đã hết hạn";

      setState((s) => ({ ...s, loading: false, error: message }));
      return { success: false, error: message };
    }
  };

  /* ===================== LOGOUT ===================== */

  const logout = () => {
    deleteCookie("auth-token", { path: "/" });

    authApiService.setAuthToken(null);
    coreApiService.setAuthToken(null);
    api8080Service.setAuthToken(null);

    // ✅ DISCONNECT FROM NOTIFICATION HUB
    console.log("🔌 Disconnecting from notification hub on logout...");
    notificationHubService.stopConnection().then(() => {
      console.log("✅ Notification hub disconnected");
    });

    setState({
      user: null,
      accessToken: null,
      loading: false,
      error: null,
    });

    router.push("/login");
  };

  /* ===================== INIT AUTH ===================== */

  const initAuthFromStorage = async () => {
    setState((s) => ({ ...s, loading: true }));

    const token = getCookie("auth-token") as string | undefined;
    if (!token) {
      setState((s) => ({ ...s, loading: false }));
      return;
    }

    const payload = decodeJwt(token);
    const exp = payload.exp ? payload.exp * 1000 : 0;

    const now = new Date().getTime(); // ✅ Tách ra biến
    if (exp && exp < now) {
      logout();
      return;
    }

    authApiService.setAuthToken(token);
    coreApiService.setAuthToken(token);
    apiService.setAuthToken(token);
    aiApiService.setAuthToken(token);
    api8080Service.setAuthToken(token);
    setState((s) => ({ ...s, accessToken: token }));

    await fetchCurrentUser();

    // ✅ CONNECT TO NOTIFICATION HUB (if user is authenticated)
    const currentState = getCookie("auth-token") as string | undefined;
    if (currentState) {
      console.log("🔌 Attempting to connect to notification hub on init...");
      notificationHubService.startConnection(currentState).then((connected) => {
        if (connected) {
          console.log("✅ Notification hub connected successfully on init!");
        } else {
          console.warn("⚠️ Failed to connect to notification hub on init");
        }
      });
    }

    setState((s) => ({ ...s, loading: false }));
  };

  /* ===================== FETCH CURRENT USER ===================== */
  const fetchCurrentUser = async (): Promise<User | null> => {
    try {
      const response = await fetchAuth.me();
      const userData = response.data.data;
      const user: User = {
        userId: userData.id,
        userName: userData.userName,
        email: userData.email,
        role: userData.roles[0] || "User",
        avatarUrl: `https://ui-avatars.com/api/?name=${userData.userName}&background=0D8ABC&color=fff`,
      };

      setState((s) => ({
        ...s,
        user,
        accessToken: s.accessToken, // token đã có từ Provider
      }));

      return user;
    } catch (err) {
      console.error("Lấy thông tin user thất bại:", err);
      logout(); // 401 / token hết hạn
      return null;
    }
  };

  return {
    user: state.user,
    accessToken: state.accessToken,
    loading: state.loading,
    error: state.error,

    login,
    register,
    verifyOtp,
    logout,
    initAuthFromStorage,
    fetchCurrentUser,
    clearError: () => setState((s) => ({ ...s, error: null })),
  };
}
