// src/lib/api/services/fetchPartCategories.ts
import coreApiService from "../coreApiService";
import { RequestParams } from "../apiService";

export type PartCategoryStatus = "Active" | "Inactive";

export interface PartCategory {
  id: string;
  name: string;
  code: string;
  description: string;
  iconUrl: string | null;
  displayOrder: number;
  status: PartCategoryStatus;
  requiresOdometerTracking: boolean;
  requiresTimeTracking: boolean;
  allowsMultipleInstances: boolean;
  identificationSigns: string;
  consequencesIfNotHandled: string;
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

export interface PartCategoryListResponse {
  isSuccess: boolean;
  message: string;
  data: PartCategory[];
  metadata: PaginationMetadata;
}

export interface PartCategoryDetailResponse {
  isSuccess: boolean;
  message: string;
  data: PartCategory;
  metadata: null;
}

export interface PartCategoryMutationResponse {
  isSuccess: boolean;
  message: string;
  data: PartCategory | string | null; // create/update trả PartCategory, delete trả "Deleted"
  metadata: null;
}

export interface PartCategoryQueryParams extends RequestParams {
  PageNumber: number;
  PageSize: number;
  IsDescending?: boolean;
}

export interface CreatePartCategoryRequest {
  name: string;
  code: string;
  description: string;
  iconUrl: string;
  displayOrder: number;
  requiresOdometerTracking: boolean;
  requiresTimeTracking: boolean;
  allowsMultipleInstances: boolean;
  identificationSigns: string;
  consequencesIfNotHandled: string;
}

export type UpdatePartCategoryRequest = CreatePartCategoryRequest;

export const PartCategoryService = {
  getCategories: async (params: PartCategoryQueryParams) => {
    const res = await coreApiService.get<PartCategoryListResponse>(
      "/api/v1/parts/categories",
      params,
    );
    return res.data;
  },

  getCategoryById: async (id: string) => {
    const res = await coreApiService.get<PartCategoryDetailResponse>(
      `/api/v1/parts/categories/${id}`,
    );
    return res.data;
  },

  createCategory: async (payload: CreatePartCategoryRequest) => {
    const res = await coreApiService.post<PartCategoryMutationResponse>(
      "/api/v1/parts/categories",
      payload,
    );
    return res.data;
  },

  updateCategory: async (id: string, payload: UpdatePartCategoryRequest) => {
    const res = await coreApiService.put<PartCategoryMutationResponse>(
      `/api/v1/parts/categories/${id}`,
      payload,
    );
    return res.data;
  },

  deleteCategory: async (id: string) => {
    const res = await coreApiService.delete<PartCategoryMutationResponse>(
      `/api/v1/parts/categories/${id}`,
    );
    return res.data;
  },
};

export default PartCategoryService;
