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

export interface VehicleModel {
  id: string;
  name: string;
  brandId: string;
  brandName: string;
  typeId: string;
  typeName: string;
  releaseYear: number;
  fuelType: number;
  fuelTypeName: string;
  transmissionType: number;
  transmissionTypeName: string;
  engineDisplacementDisplay: string | null;
  engineCapacity: number | null;
  oilCapacity: number | null;
  tireSizeFront: string | null;
  tireSizeRear: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface UserVehicleVariant {
  id: string;
  vehicleModelId: string;
  color: string;
  hexCode: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string | null;
  model: VehicleModel;
}

export interface UserVehicle {
  id: string;
  userId: string;
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
  userVehicleVariant: UserVehicleVariant;
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

export interface DeleteUserVehicleResponse {
  isSuccess: boolean;
  message: string;
  data: string;
  metadata: string;
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

  deleteUserVehicle: async (id: string) => {
    const response = await coreApiService.delete<DeleteUserVehicleResponse>(`/api/v1/user-vehicles/${id}`);
    return response.data;
  },
};

export default UserVehicleService;
