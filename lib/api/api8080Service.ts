import { ApiService } from "./apiService";

const api8080Service = new ApiService(process.env.NEXT_PUBLIC_API_URL_8080 || "http://localhost:8080", 600000);

export default api8080Service;
