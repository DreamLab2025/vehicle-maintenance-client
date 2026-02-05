/**
 * Vehicle related types
 */

import { PaginationMetadata, BaseQueryParams } from "./common.types";

// ==================== Vehicle Model ====================

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

// ==================== Vehicle Variant ====================

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

// ==================== User Vehicle ====================

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

// ==================== User Vehicle Parts ====================

export interface UserVehiclePart {
  id: string;
  partCategoryId: string;
  partCategoryName: string;
  partCategoryCode: string;
  iconUrl: string;
  isDeclared: boolean;
  description: string;
}

// ==================== Request/Response Types ====================

export interface CreateUserVehicleRequest {
  vehicleVariantId: string;
  licensePlate: string;
  nickname: string;
  vinNumber: string;
  purchaseDate: string;
  currentOdometer: number;
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

export interface UserVehicleQueryParams extends BaseQueryParams {
  [key: string]: string | number | boolean | null | undefined | string[];
}

export interface DeleteUserVehicleResponse {
  isSuccess: boolean;
  message: string;
  data: string;
  metadata: string;
}

export interface UserVehiclePartsResponse {
  isSuccess: boolean;
  message: string;
  data: UserVehiclePart[];
  metadata: unknown;
}
