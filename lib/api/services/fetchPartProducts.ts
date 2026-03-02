/** ===== Types (match API response) ===== */
import api8080Service from "../api8080Service";
import type { RequestParams } from "../apiService";

export type PartProductStatus = "Active" | "Inactive";

export interface PartProduct {
  id: string;
  partCategoryId: string;
  partCategoryName: string;
  name: string;
  brand: string;
  description: string;
  imageUrl: string | null;
  referencePrice: number;
  recommendedKmInterval: number;
  recommendedMonthsInterval: number;
  status: PartProductStatus;
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

export interface ApiListResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T[];
  metadata: PaginationMetadata | null | string;
}

export interface ApiItemResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T;
  metadata: null | string;
}

export interface ApiMutationResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T | string | null;
  metadata: null | string;
}

/** Nếu backend CHƯA có paging/sort cho list by category thì cứ để optional */
export interface PartProductListByCategoryParams extends RequestParams {
  CategoryId: string; // uuid
  PageNumber?: number;
  PageSize?: number;
  IsDescending?: boolean;
}

export interface CreatePartProductRequest {
  partCategoryId: string;
  name: string;
  brand: string;
  description: string;
  imageUrl: string | null;
  referencePrice: number;
  recommendedKmInterval: number;
  recommendedMonthsInterval: number;
}

export interface UpdatePartProductRequest {
  partCategoryId: string;
  name: string;
  brand: string;
  description: string;
  imageUrl: string | null;
  referencePrice: number;
  recommendedKmInterval: number;
  recommendedMonthsInterval: number;
}

/** ===== Service ===== */
export const PartProductService = {
  /** GET /api/v1/parts/products/category/{categoryId} */
  getProductsByCategory: async (categoryId: string, params?: { PageNumber?: number; PageSize?: number; IsDescending?: boolean }) => {
    const queryParams: Record<string, string> = {};
    if (params?.PageNumber !== undefined) {
      queryParams.PageNumber = params.PageNumber.toString();
    }
    if (params?.PageSize !== undefined) {
      queryParams.PageSize = params.PageSize.toString();
    }
    if (params?.IsDescending !== undefined) {
      queryParams.IsDescending = params.IsDescending.toString();
    }
    
    const queryString = new URLSearchParams(queryParams).toString();
    const url = `/api/v1/parts/products/category/${categoryId}${queryString ? `?${queryString}` : ''}`;
    
    const res = await api8080Service.get<ApiListResponse<PartProduct>>(url);
    return res.data;
  },

  /** GET /api/v1/parts/products/{id} */
  getProductById: async (id: string) => {
    const res = await api8080Service.get<ApiItemResponse<PartProduct>>(
      `/api/v1/parts/products/${id}`,
    );
    return res.data;
  },

  /** POST /api/v1/parts/products */
  createProduct: async (payload: CreatePartProductRequest) => {
    const res = await api8080Service.post<ApiMutationResponse<PartProduct>>(
      "/api/v1/parts/products",
      payload,
    );
    return res.data;
  },

  /** PUT /api/v1/parts/products/{id} */
  updateProduct: async (id: string, payload: UpdatePartProductRequest) => {
    const res = await api8080Service.put<ApiMutationResponse<PartProduct>>(
      `/api/v1/parts/products/${id}`,
      payload,
    );
    return res.data;
  },

  /** DELETE /api/v1/parts/products/{id} */
  deleteProduct: async (id: string) => {
    const res = await api8080Service.delete<ApiMutationResponse<null>>(
      `/api/v1/parts/products/${id}`,
    );
    return res.data;
  },
};

export default PartProductService;
