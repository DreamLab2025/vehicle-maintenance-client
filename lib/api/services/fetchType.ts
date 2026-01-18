
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

export const TypeService = {
  getTypes: async (params: TypeQueryParams) => {
    const response = await coreApiService.get<TypeListResponse>("/api/v1/types", params);
    return response.data; 
  },
};

export default TypeService;
