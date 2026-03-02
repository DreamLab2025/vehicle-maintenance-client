import { ApiService } from "./apiService";
import { getCookie } from "cookies-next";

class AIApiService extends ApiService {
  constructor(baseURL: string, timeout: number) {
    super(baseURL, timeout);
  }

  // Override để tự động lấy token từ cookie trước mỗi request
  private ensureToken() {
    const token = getCookie("auth-token") as string | undefined;
    if (token) {
      this.setAuthToken(token);
    }
  }

  // Override các method HTTP để ensure token trước khi gọi
  get<T>(url: string, params?: Parameters<ApiService["get"]>[1]) {
    this.ensureToken();
    return super.get<T>(url, params);
  }

  post<T, D = unknown>(url: string, data?: D) {
    this.ensureToken();
    return super.post<T, D>(url, data);
  }

  put<T, D = unknown>(url: string, data?: D) {
    this.ensureToken();
    return super.put<T, D>(url, data);
  }

  patch<T, D = unknown>(url: string, data?: D) {
    this.ensureToken();
    return super.patch<T, D>(url, data);
  }

  delete<T>(url: string, data?: unknown) {
    this.ensureToken();
    return super.delete<T>(url, data);
  }
}

const aiApiService = new AIApiService(process.env.NEXT_PUBLIC_API_URL_API_GATEWAY!, 600000);

export default aiApiService;
