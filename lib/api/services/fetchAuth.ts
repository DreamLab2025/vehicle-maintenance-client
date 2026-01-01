// lib/api/services/fetchAuth.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:8001";

export interface ApiResponse<T = unknown> {
  isSuccess: boolean;
  message: string;
  data?: T;
  metadata?: unknown | null;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  tokenType: string;
}

export async function fetchAuth<T = unknown>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !data.isSuccess) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}
