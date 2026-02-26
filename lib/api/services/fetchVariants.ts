import coreApiService from "../coreApiService";

/** ===== Types (match API response) ===== */

export interface VehicleVariant {
  id: string;
  vehicleModelId: string;
  color: string;
  hexCode: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface ApiResponse<TData, TMeta = null> {
  isSuccess: boolean;
  message: string;
  data: TData;
  metadata: TMeta;
}

export type VariantListResponse = ApiResponse<VehicleVariant[], null>;
export type VariantDetailResponse = ApiResponse<VehicleVariant, null>;

/** POST / PUT payloads */
export interface CreateVariantRequest {
  vehicleModelId: string;
  color: string;
  hexCode: string; // "#1C1C1C"
  imageUrl: string;
}

export interface UpdateVariantRequest {
  color: string;
  hexCode: string;
  imageUrl: string;
}

/** Swagger của bạn trả data là object variant khi tạo/cập nhật */
export type VariantMutationResponse = ApiResponse<VehicleVariant, null>;

/** DELETE trả data: string message */
export type VariantDeleteResponse = ApiResponse<string, null>;

/** ===== Service ===== */
export const VariantService = {
  /** GET /variants/model/{vehicleModelId} */
  getVariantsByModelId: async (vehicleModelId: string) => {
    const res = await coreApiService.get<VariantListResponse>(`/api/v1/variants/model/${vehicleModelId}`);
    return res.data;
  },

  /** POST /variants (Admin) */
  createVariant: async (payload: CreateVariantRequest) => {
    const res = await coreApiService.post<VariantMutationResponse>(`/api/v1/variants`, payload);
    return res.data;
  },

  /** PUT /variants/{id} (Admin) */
  updateVariant: async (id: string, payload: UpdateVariantRequest) => {
    const res = await coreApiService.put<VariantMutationResponse>(`/api/v1/variants/${id}`, payload);
    return res.data;
  },

  /** DELETE /variants/{id} (Admin) */
  deleteVariant: async (id: string) => {
    const res = await coreApiService.delete<VariantDeleteResponse>(`/api/v1/variants/${id}`);
    return res.data;
  },
};

export default VariantService;
