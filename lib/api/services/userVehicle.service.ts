/**
 * User Vehicle Service - API calls for user vehicles
 */

import coreApiService from "../coreApiService";
import aiApiService from "../aiApiService";
import {
  CreateUserVehicleRequest,
  CreateUserVehicleResponse,
  UserVehicleListResponse,
  UserVehicleQueryParams,
  DeleteUserVehicleResponse,
  UserVehiclePartsResponse,
  UpdateOdometerRequest,
  UpdateOdometerResponse,
  OdometerHistoryQueryParams,
  OdometerHistoryResponse,
} from "@/lib/types/vehicle.types";
import { ApplyTrackingRequest, ApplyTrackingResponse, VehicleRemindersResponse } from "@/lib/types/reminder.types";
import { AnalyzeQuestionnaireRequest, AnalyzeQuestionnaireResponse, ScanOdometerResponse } from "@/lib/types/ai.types";

export const UserVehicleService = {
  // ==================== Vehicle CRUD ====================

  createUserVehicle: async (payload: CreateUserVehicleRequest) => {
    const response = await coreApiService.post<CreateUserVehicleResponse>("/api/v1/user-vehicles", payload);
    return response.data;
  },

  getUserVehicles: async (params: UserVehicleQueryParams) => {
    const response = await coreApiService.get<UserVehicleListResponse>("/api/v1/user-vehicles", params);
    return response.data;
  },

  deleteUserVehicle: async (id: string) => {
    const response = await coreApiService.delete<DeleteUserVehicleResponse>(`/api/v1/user-vehicles/${id}`);
    return response.data;
  },

  // ==================== Vehicle Parts ====================

  getUserVehicleParts: async (userVehicleId: string) => {
    const response = await coreApiService.get<UserVehiclePartsResponse>(`/api/v1/user-vehicles/${userVehicleId}/parts`);
    return response.data;
  },

  // ==================== AI Analysis ====================

  analyzeQuestionnaire: async (payload: AnalyzeQuestionnaireRequest) => {
    const response = await aiApiService.post<AnalyzeQuestionnaireResponse>(
      "/api/v1/ai/vehicle-questionnaire/analyze",
      payload,
    );
    return response.data;
  },

  // ==================== Tracking & Reminders ====================

  applyTracking: async (userVehicleId: string, payload: ApplyTrackingRequest) => {
    const response = await coreApiService.post<ApplyTrackingResponse>(
      `/api/v1/user-vehicles/${userVehicleId}/apply-tracking`,
      payload,
    );
    return response.data;
  },

  getReminders: async (userVehicleId: string) => {
    const response = await coreApiService.get<VehicleRemindersResponse>(
      `/api/v1/user-vehicles/${userVehicleId}/reminders`,
    );
    return response.data;
  },

  // ==================== Odometer ====================

  updateOdometer: async (userVehicleId: string, payload: UpdateOdometerRequest) => {
    const response = await coreApiService.patch<UpdateOdometerResponse>(
      `/api/v1/user-vehicles/${userVehicleId}/odometer`,
      payload,
    );
    return response.data;
  },

  scanOdometer: async (image: File, onProgress?: (percent: number) => void) => {
    const response = await aiApiService.upload<ScanOdometerResponse>(
      "/api/v1/ai/odometer/scan",
      image,
      "image",
      undefined,
      onProgress,
    );
    return response.data;
  },

  // ==================== Odometer History ====================

  getOdometerHistory: async (userVehicleId: string, params: OdometerHistoryQueryParams) => {
    const response = await coreApiService.get<OdometerHistoryResponse>(
      `/api/v1/user-vehicles/${userVehicleId}/odometer-history`,
      params,
    );
    return response.data;
  },
};

export default UserVehicleService;
