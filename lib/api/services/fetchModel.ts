/** ===== Types (match API response) ===== */

import coreApiService from "../coreApiService";
import { RequestParams } from "../apiService";

export type TransmissionType = "Manual" | "Automatic" | "Sport" | "ManualCar" | "AutomaticCar" | "Electric";

/** API trả về field tên là `variants` (không phải availableColors) */
export interface VehicleModelVariant {
  id: string;
  vehicleModelId: string;
  color: string;
  hexCode: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string | null;
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

  variants: VehicleModelVariant[];

  imageUrl?: string | null;
}

export interface PaginationMetadata {
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ModelListResponse {
  isSuccess: boolean;
  message: string;
  data: VehicleModel[];
  metadata: PaginationMetadata;
}

export interface ModelQueryParams extends RequestParams {
  TypeId?: string;
  BrandId?: string;
  ModelName?: string;
  Color?: string;
  TransmissionType?: TransmissionType;
  EngineDisplacement?: number;
  ReleaseYear?: number;
  PageNumber: number;
  PageSize: number;
  IsDescending?: boolean;
}

/** ===== Service ===== */

export const ModelService = {
  getModels: async (params: ModelQueryParams) => {
    const response = await coreApiService.get<ModelListResponse>("/api/v1/models", params);
    return response.data; // full payload: { isSuccess, message, data, metadata }
  },
};

export default ModelService;
