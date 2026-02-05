/**
 * Common types used across the application
 */

// ==================== API Response Types ====================

export interface ApiResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T;
  metadata: unknown;
}

export interface PaginationMetadata {
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T[];
  metadata: PaginationMetadata;
}

// ==================== Request Params ====================

export interface BaseQueryParams {
  PageNumber?: number;
  PageSize?: number;
  IsDescending?: boolean;
}
