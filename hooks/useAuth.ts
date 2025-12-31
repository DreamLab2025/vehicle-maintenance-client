"use client";

import { useState } from "react";
import { fetchAuth, ApiResponse } from "@/lib/api/services/fetchAuth";
import { setCookie, getCookie, deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
/* ===================== TYPES ===================== */

export interface User {
  userId: string;
  userName: string;
  email: string;
  role: string;
}

export interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  tokenType: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
}

interface AuthResult {
  success: boolean;
  user: User | null;
  error?: string;
}

interface JwtPayload {
  sub?: string;
  userId?: string;
  userName?: string;
  unique_name?: string;
  email?: string;
  role?: string;
  exp?: number;
  iat?: number;
}

/* ===================== HOOK ===================== */

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    loading: false,
    error: null,
  });

  /* ---------- Helpers ---------- */

  const decodeJwt = (token: string): JwtPayload => {
    try {
      const payload = token.split(".")[1];
      return JSON.parse(atob(payload));
    } catch {
      return {};
    }
  };

  const buildUserFromToken = (token: string): User => {
    const payload = decodeJwt(token);
    return {
      userId: payload.userId || payload.sub || "",
      userName: payload.userName || payload.unique_name || "",
      email: payload.email || "",
      role: payload.role || "",
    };
  };

  /* ===================== LOGIN ===================== */

  const login = async (email: string, password: string): Promise<AuthResult> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response: ApiResponse<LoginResponseData> = await fetchAuth<LoginResponseData>("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (!response.data?.accessToken) {
        throw new Error("Access token not returned from server");
      }

      const token = response.data.accessToken;
      const user = buildUserFromToken(token);

      // ✅ Lưu cookie giống bản trên
      setCookie("auth-token", token, {
        path: "/",
        sameSite: "lax",
      });

      setState({
        user,
        accessToken: token,
        loading: false,
        error: null,
      });

      return { success: true, user };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Đăng nhập thất bại";

      setState((prev) => ({
        ...prev,
        loading: false,
        error: message,
      }));

      return { success: false, user: null, error: message };
    }
  };

  /* ===================== REGISTER ===================== */

  const register = async (email: string, password: string): Promise<AuthResult> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response: ApiResponse<User> = await fetchAuth<User>("/api/v1/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const user = response.data ?? null;

      setState((prev) => ({
        ...prev,
        user,
        loading: false,
        error: null,
      }));

      return { success: true, user };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Đăng ký thất bại";

      setState((prev) => ({
        ...prev,
        loading: false,
        error: message,
      }));

      return { success: false, user: null, error: message };
    }
  };

  /* ===================== LOGOUT ===================== */
  const router = useRouter();
  const logout = (callback?: () => void) => {
    try {
      // Xoá cookie
      deleteCookie("auth-token", { path: "/" });

      // Xoá localStorage nếu lưu token
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
      }

      // Reset state
      setState({
        user: null,
        accessToken: null,
        loading: false,
        error: null,
      });

      // Gọi callback nếu có (ví dụ đóng dropdown)
      if (callback) callback();

      // Redirect sang trang login
      router.push("/login"); // <-- thêm dòng này
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  /* ===================== INIT FROM COOKIE ===================== */

  const initAuthFromStorage = () => {
    const token = getCookie("auth-token") as string | undefined;
    if (!token) return;

    const payload = decodeJwt(token);
    const exp = Number(payload.exp);

    if (exp && exp * 1000 < Date.now()) {
      deleteCookie("auth-token", { path: "/" });
      return;
    }

    const user = buildUserFromToken(token);

    setState({
      user,
      accessToken: token,
      loading: false,
      error: null,
    });
  };

  /* ===================== RETURN ===================== */

  return {
    user: state.user,
    accessToken: state.accessToken,
    loading: state.loading,
    error: state.error,

    login,
    register,
    logout,
    initAuthFromStorage,

    clearError: () => setState((prev) => ({ ...prev, error: null })),
  };
}
