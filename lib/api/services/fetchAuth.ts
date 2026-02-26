// lib/api/services/fetchAuth.ts
import authApiService from "@/lib/api/authApiService";

/* ===================== RESPONSE TYPES ===================== */

export interface ApiSuccessResponse<T> {
  isSuccess: true;
  message: string;
  data: T;
  metadata?: unknown | null;
}

/* ===================== DATA TYPES ===================== */

export interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  tokenType: string;
}

export interface RegisterResponseData {
  id: string;
  userName: string;
  email: string;
  phoneNumber: string;
  isEmailConfirmed: boolean;
  isPhoneNumberConfirmed: boolean;
  status: string;
  roles: string[];
  createdAt: string;
}

export interface UserMeData {
  id: string;
  userName: string;
  email: string;
  phoneNumber: string;
  isEmailConfirmed: boolean;
  isPhoneNumberConfirmed: boolean;
  status: string;
  roles: string[];
  createdAt: string;
}

/* ===================== AUTH APIs ===================== */

export const fetchAuth = {
  login: (email: string, password: string) =>
    authApiService.post<ApiSuccessResponse<LoginResponseData>>("/api/v1/auth/login", { email, password }),

  register: (email: string, password: string) =>
    authApiService.post<ApiSuccessResponse<RegisterResponseData>>("/api/v1/auth/register", { email, password }),

  verifyOtp: (email: string, otpCode: string) =>
    authApiService.post<ApiSuccessResponse<boolean>>("/api/v1/auth/verify-otp", { email, otpCode }),

  forgotPassword: (email: string) =>
    authApiService.post<ApiSuccessResponse<boolean>>("/api/v1/auth/forgot-password", { email }),

  resetPassword: (payload: {
    email: string;
    otpCode: string;
    newPassword: string;
    confirmNewPassword: string;
  }) => authApiService.post<ApiSuccessResponse<boolean>>("/api/v1/auth/reset-password", payload),

  me: () => authApiService.get<ApiSuccessResponse<UserMeData>>("/api/v1/users/me"),
};

export default fetchAuth;
