/** ===== Types (match API response) ===== */
import coreApiService from "../coreApiService";
import type { RequestParams } from "../apiService";

export type PartProductStatus = "Active" | "Inactive";

export interface PartProduct {
  id: string;
  partCategoryId: string;
  partCategoryName: string;
  name: string;
  brand: string;
  description: string;
  imageUrl: string;
  referencePrice: number;
  recommendedKmInterval: number;
  recommendedMonthsInterval: number;
  status: PartProductStatus;
  createdAt: string;
  updatedAt: string | null;
}

export interface ApiListResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T[];
  metadata: null | string;
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
}

export interface CreatePartProductRequest {
  partCategoryId: string;
  name: string;
  brand: string;
  description: string;
  imageUrl: string;
  referencePrice: number;
  recommendedKmInterval: number;
  recommendedMonthsInterval: number;
}

export interface UpdatePartProductRequest {
  partCategoryId: string;
  name: string;
  brand: string;
  description: string;
  imageUrl: string;
  referencePrice: number;
  recommendedKmInterval: number;
  recommendedMonthsInterval: number;
}

/** ===== Service ===== */
export const PartProductService = {
  /** GET /api/v1/parts/products/category/{categoryId} */
  getProductsByCategory: async (categoryId: string) => {
    const res = await coreApiService.get<ApiListResponse<PartProduct>>(
      `/api/v1/parts/products/category/${categoryId}`,
    );
    return res.data;
  },

  /** GET /api/v1/parts/products/{id} */
  getProductById: async (id: string) => {
    const res = await coreApiService.get<ApiItemResponse<PartProduct>>(
      `/api/v1/parts/products/${id}`,
    );
    return res.data;
  },

  /** POST /api/v1/parts/products */
  createProduct: async (payload: CreatePartProductRequest) => {
    const res = await coreApiService.post<ApiMutationResponse<PartProduct>>(
      "/api/v1/parts/products",
      payload,
    );
    return res.data;
  },

  /** PUT /api/v1/parts/products/{id} */
  updateProduct: async (id: string, payload: UpdatePartProductRequest) => {
    const res = await coreApiService.put<ApiMutationResponse<PartProduct>>(
      `/api/v1/parts/products/${id}`,
      payload,
    );
    return res.data;
  },

  /** DELETE /api/v1/parts/products/{id} */
  deleteProduct: async (id: string) => {
    const res = await coreApiService.delete<ApiMutationResponse<null>>(
      `/api/v1/parts/products/${id}`,
    );
    return res.data;
  },
};

export default PartProductService;
