// src/lib/api/services/fetchUserVehicle.ts
/** ===== Types ===== */
import coreApiService from "../coreApiService";
import { RequestParams } from "../apiService";

export interface CreateUserVehicleRequest {
  vehicleVariantId: string; 
  licensePlate: string;
  nickname: string;
  vinNumber: string;
  purchaseDate: string;
  currentOdometer: number;
}

export interface UserVehicle {
  id: string;
  userId: string;
  vehicleModelId: string;
  vehicleModelName: string;
  brandName: string;
  typeName: string;
  licensePlate: string;
  nickname: string;
  vinNumber: string;
  purchaseDate: string;
  currentOdometer: number;
  lastOdometerUpdateAt: string;
  averageKmPerDay: number;
  lastCalculatedDate: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface PaginationMetadata {
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface CreateUserVehicleResponse {
  isSuccess: boolean;
  message: string;
  data: UserVehicle;
  metadata: unknown;
}

export interface UserVehicleListResponse {
  isSuccess: boolean;
  message: string;
  data: UserVehicle[];
  metadata: PaginationMetadata;
}

export interface UserVehicleQueryParams extends RequestParams {
  PageNumber?: number;
  PageSize?: number;
  IsDescending?: boolean;
}

/** ===== Service ===== */
export const UserVehicleService = {
  createUserVehicle: async (payload: CreateUserVehicleRequest) => {
    const response = await coreApiService.post<CreateUserVehicleResponse>("/api/v1/user-vehicles", payload);
    return response.data;
  },

  getUserVehicles: async (params: UserVehicleQueryParams) => {
    const response = await coreApiService.get<UserVehicleListResponse>("/api/v1/user-vehicles", params);
    return response.data;
  },
};

export default UserVehicleService;
