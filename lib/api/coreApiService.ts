import { ApiService } from "./apiService";

const coreApiService = new ApiService(process.env.NEXT_PUBLIC_API_URL_API_GATEWAY!, 600000);

export default coreApiService;
