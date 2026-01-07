/** ===== Types ===== */

import coreApiService from "../coreApiService";
import { RequestParams } from "../apiService";

export type TransmissionType = "Manual" | "Automatic" | "Sport" | "ManualCar" | "AutomaticCar" | "Electric";

export interface VehicleModel {
  id: string;
  name: string;

  brandId: string;
  brandName: string;

  typeId: string;
  typeName: string;

  releaseYear: number;
  fuelType: string;
  fuelTypeName: string;

  transmissionType: TransmissionType;
  transmissionTypeName: string;

  imageUrl: string | null;

  engineDisplacementDisplay: string;
  engineCapacity: number;
  oilCapacity: number;

  tireSizeFront: string | null;
  tireSizeRear: string | null;

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
  TransmissionType?: TransmissionType;
  EngineDisplacement?: number;
  ReleaseYear?: number;
  PageNumber?: number;
  PageSize?: number;
  IsDescending?: boolean;
}

/** ===== Service ===== */

export const ModelService = {
  getModels: async (params: ModelQueryParams) => {
    const response = await coreApiService.get<ModelListResponse>("/api/v1/models", params);
    return response.data; // full response
  },
};

export default ModelService;
