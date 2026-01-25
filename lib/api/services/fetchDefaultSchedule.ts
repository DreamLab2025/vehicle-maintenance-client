/** ===== Types (match API response) ===== */

import coreApiService from "../coreApiService";

export interface DefaultSchedule {
  id: string;
  partCategoryId: string;
  partCategoryCode: string;
  partCategoryName: string;
  partCategoryDescription: string;
  iconUrl: string | null;
  initialKm: number;
  kmInterval: number;
  monthsInterval: number;
  requiresOdometerTracking: boolean;
  requiresTimeTracking: boolean;
  displayOrder: number;
}

export interface DefaultScheduleListResponse {
  isSuccess: boolean;
  message: string;
  data: DefaultSchedule[];
  metadata: null;
}

/** ===== Service ===== */

export const DefaultScheduleService = {
  getDefaultSchedules: async (vehicleModelId: string) => {
    const response = await coreApiService.get<DefaultScheduleListResponse>(
      `/api/v1/vehicle-models/${vehicleModelId}/default-schedules`
    );
    return response.data; // full payload: { isSuccess, message, data, metadata }
  },
};

export default DefaultScheduleService;
