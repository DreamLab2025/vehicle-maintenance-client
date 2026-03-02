/**
 * User Vehicle Service - API calls for user vehicles
 */

import api8080Service from "../api8080Service";
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
    const response = await api8080Service.post<CreateUserVehicleResponse>("/api/v1/user-vehicles", payload);
    return response.data;
  },

  getUserVehicles: async (params: UserVehicleQueryParams) => {
    const response = await api8080Service.get<UserVehicleListResponse>("/api/v1/user-vehicles", params);
    return response.data;
  },

  deleteUserVehicle: async (id: string) => {
    const response = await api8080Service.delete<DeleteUserVehicleResponse>(`/api/v1/user-vehicles/${id}`);
    return response.data;
  },

  // ==================== Vehicle Parts ====================

  getUserVehicleParts: async (userVehicleId: string) => {
    const response = await api8080Service.get<UserVehiclePartsResponse>(`/api/v1/user-vehicles/${userVehicleId}/parts`);
    return response.data;
  },

  // ==================== AI Analysis ====================

  analyzeQuestionnaire: async (payload: AnalyzeQuestionnaireRequest) => {
    const response = await api8080Service.post<AnalyzeQuestionnaireResponse>(
      "/api/v1/ai/vehicle-questionnaire/analyze",
      payload,
    );
    return response.data;
  },

  // ==================== Tracking & Reminders ====================

  applyTracking: async (userVehicleId: string, payload: ApplyTrackingRequest) => {
    const response = await api8080Service.post<ApplyTrackingResponse>(
      `/api/v1/user-vehicles/${userVehicleId}/apply-tracking`,
      payload,
    );
    return response.data;
  },

  getReminders: async (userVehicleId: string) => {
    const response = await api8080Service.get<VehicleRemindersResponse>(
      `/api/v1/user-vehicles/${userVehicleId}/reminders`,
    );
    return response.data;
  },

  // ==================== Odometer ====================

  updateOdometer: async (userVehicleId: string, payload: UpdateOdometerRequest) => {
    const response = await api8080Service.patch<UpdateOdometerResponse>(
      `/api/v1/user-vehicles/${userVehicleId}/odometer`,
      payload,
    );
    return response.data;
  },

  scanOdometer: async (image: File, onProgress?: (percent: number) => void) => {
    const response = await api8080Service.upload<ScanOdometerResponse>(
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
    const response = await api8080Service.get<OdometerHistoryResponse>(
      `/api/v1/user-vehicles/${userVehicleId}/odometer-history`,
      params,
    );
    return response.data;
  },
};

export default UserVehicleService;
