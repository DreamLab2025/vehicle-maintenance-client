
/** ===== Types ===== */

import apiService from "../apiService";

export interface Brand {
  id: string;
  name: string;
  logoUrl: string;
  website: string;
  supportPhone: string | null;
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

export interface BrandListResponse {
  isSuccess: boolean;
  message: string;
  data: Brand[];
  metadata: PaginationMetadata;
}

/** UI sẽ truyền đúng mấy field này */
export type BrandQueryParams = {
  PageNumber: number;
  PageSize: number;
  IsDescending: boolean;
};

/** ===== Service ===== */

export const BrandService = {
  // UI truyền params vào đây
  getBrands: async (params: BrandQueryParams) => {
    const response = await apiService.get<BrandListResponse>(
      "/api/v1/brands",
      params
    );
    return response.data; // full: isSuccess + message + data + metadata
  },
};
