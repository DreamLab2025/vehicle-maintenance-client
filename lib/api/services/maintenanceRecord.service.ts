// src/lib/api/services/maintenanceRecord.service.ts
import coreApiService from "../coreApiService";

// ==================== Types ====================

export interface MaintenanceRecordItem {
  partCategoryCode: string;
  partProductId: string;
  instanceIdentifier?: string;
  price?: number;
  itemNotes?: string;
  updatesTracking: boolean;
  customKmInterval?: number;
  customMonthsInterval?: number;
  predictedNextOdometer?: number;
  predictedNextDate?: string; // ISO date string
}

export interface CreateMaintenanceRecordRequest {
  serviceDate: string; // ISO date string (YYYY-MM-DD)
  odometerAtService: number;
  garageName?: string;
  totalCost?: number;
  notes?: string;
  invoiceImageUrl?: string;
  items: MaintenanceRecordItem[];
}

export interface MaintenanceRecordTrackingReminder {
  id: string;
  level: string;
  currentOdometer: number;
  targetOdometer: number;
  targetDate: string;
  percentageRemaining: number;
  isNotified: boolean;
  notifiedDate?: string;
  isDismissed: boolean;
  dismissedDate?: string;
}

export interface MaintenanceRecordTracking {
  id: string;
  partCategoryId: string;
  partCategoryName: string;
  partCategoryCode: string;
  instanceIdentifier?: string;
  currentPartProductId: string;
  currentPartProductName: string;
  lastReplacementOdometer: number;
  lastReplacementDate: string;
  customKmInterval?: number;
  customMonthsInterval?: number;
  predictedNextOdometer?: number;
  predictedNextDate?: string;
  isDeclared: boolean;
  reminders: MaintenanceRecordTrackingReminder[];
}

export interface MaintenanceRecordItemResponse {
  maintenanceRecordItemId: string;
  partCategoryCode: string;
  tracking: MaintenanceRecordTracking;
}

export interface MaintenanceRecordResponse {
  maintenanceRecordId: string;
  items: MaintenanceRecordItemResponse[];
}

export interface ApiResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T;
  metadata: string | null;
}

// ==================== Service ====================

export const MaintenanceRecordService = {
  /**
   * POST /api/v1/maintenance-records/vehicles/{userVehicleId}
   * Tạo phiếu bảo dưỡng
   */
  createMaintenanceRecord: async (
    userVehicleId: string,
    payload: CreateMaintenanceRecordRequest
  ) => {
    const response = await coreApiService.post<ApiResponse<MaintenanceRecordResponse>>(
      `/api/v1/maintenance-records/vehicles/${userVehicleId}`,
      payload
    );
    return response.data;
  },
};

export default MaintenanceRecordService;
