// lib/api/authApiService.ts
import { ApiService } from "./apiService";

const authApiService = new ApiService(process.env.NEXT_PUBLIC_API_URL_AUTH || "", 600000);

export default authApiService;
