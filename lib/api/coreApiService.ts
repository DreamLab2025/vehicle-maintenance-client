import { ApiService } from "./apiService";

const coreApiService = new ApiService(
  process.env.NEXT_PUBLIC_API_URL_CORE!, // https://localhost:8002
  600000
);

export default coreApiService;
