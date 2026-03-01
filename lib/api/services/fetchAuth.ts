// lib/api/services/fetchAuth.ts
import api8080Service from "@/lib/api/api8080Service";
import authApiService from "../authApiService";

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
    api8080Service.post<ApiSuccessResponse<LoginResponseData>>("/api/v1/auth/login", { email, password }),

  register: (email: string, password: string) =>
    api8080Service.post<ApiSuccessResponse<RegisterResponseData>>("/api/v1/auth/register", { email, password }),

  verifyOtp: (email: string, otpCode: string) =>
    api8080Service.post<ApiSuccessResponse<boolean>>("/api/v1/auth/verify-otp", { email, otpCode }),

  me: () => api8080Service.get<ApiSuccessResponse<UserMeData>>("/api/v1/users/me"),
  forgotPassword: (email: string) =>
    api8080Service.post<ApiSuccessResponse<boolean>>("/api/v1/auth/forgot-password", { email }),

  resetPassword: (payload: {
    email: string;
    otpCode: string;
    newPassword: string;
    confirmNewPassword: string;
  }) => api8080Service.post<ApiSuccessResponse<boolean>>("/api/v1/auth/reset-password", payload),


};

export default fetchAuth;
