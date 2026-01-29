import coreApiService from "../coreApiService";
import { RequestParams } from "../apiService";

export interface VehicleType {
  id: string;
  name: string;
  description: string | null;
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

export interface TypeListResponse {
  isSuccess: boolean;
  message: string;
  data: VehicleType[];
  metadata: PaginationMetadata;
}

export interface TypeQueryParams extends RequestParams {
  PageNumber?: number;
  PageSize?: number;
  IsDescending?: boolean;
}

export interface PaginationMetadata {
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface TypeListResponse {
  isSuccess: boolean;
  message: string;
  data: VehicleType[];
  metadata: PaginationMetadata;
}

export interface TypeCreatePayload {
  name: string;
  description: string;
}

export interface TypeUpdatePayload {
  name: string;
  description: string;
}

export interface TypeSingleResponse {
  isSuccess: boolean;
  message: string;
  data: VehicleType;
  metadata: null;
}
// fetchType.ts (hoặc types chung)

export interface TypeDeleteResponse {
  isSuccess: boolean;
  message: string;
  data: string; // id đã bị xóa, hoặc message backend
}
export const TypeService = {
  getTypes: async (params: TypeQueryParams) => {
    const response = await coreApiService.get<TypeListResponse>("/api/v1/types", params);
    return response.data;
  },
  createType: async (payload: TypeCreatePayload) => {
    const response = await coreApiService.post<TypeSingleResponse>("/api/v1/types", payload);
    return response.data;
  },

  updateType: async (id: string, payload: TypeUpdatePayload) => {
    const response = await coreApiService.put<TypeSingleResponse>(`/api/v1/types/${id}`, payload);
    return response.data;
  },

  deleteType: async (id: string) => {
    const response = await coreApiService.delete<TypeDeleteResponse>(`/api/v1/types/${id}`);
    return response.data;
  },
};

export default TypeService;
