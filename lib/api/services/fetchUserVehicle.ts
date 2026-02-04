// src/lib/api/services/fetchUserVehicle.ts
/** ===== Types ===== */
import coreApiService from "../coreApiService";
import aiApiService from "../aiApiService";
import { RequestParams } from "../apiService";

export interface CreateUserVehicleRequest {
  vehicleVariantId: string; 
  licensePlate: string;
  nickname: string;
  vinNumber: string;
  purchaseDate: string;
  currentOdometer: number;
}

export interface VehicleModel {
  id: string;
  name: string;
  brandId: string;
  brandName: string;
  typeId: string;
  typeName: string;
  releaseYear: number;
  fuelType: number;
  fuelTypeName: string;
  transmissionType: number;
  transmissionTypeName: string;
  engineDisplacementDisplay: string | null;
  engineCapacity: number | null;
  oilCapacity: number | null;
  tireSizeFront: string | null;
  tireSizeRear: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface UserVehicleVariant {
  id: string;
  vehicleModelId: string;
  color: string;
  hexCode: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string | null;
  model: VehicleModel;
}

export interface UserVehicle {
  id: string;
  userId: string;
  licensePlate: string;
  nickname: string;
  vinNumber: string;
  purchaseDate: string;
  currentOdometer: number;
  lastOdometerUpdateAt: string;
  averageKmPerDay: number;
  lastCalculatedDate: string | null;
  createdAt: string;
  updatedAt: string | null;
  userVehicleVariant: UserVehicleVariant;
}

export interface PaginationMetadata {
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface CreateUserVehicleResponse {
  isSuccess: boolean;
  message: string;
  data: UserVehicle;
  metadata: unknown;
}

export interface UserVehicleListResponse {
  isSuccess: boolean;
  message: string;
  data: UserVehicle[];
  metadata: PaginationMetadata;
}

export interface UserVehicleQueryParams extends RequestParams {
  PageNumber?: number;
  PageSize?: number;
  IsDescending?: boolean;
}

export interface DeleteUserVehicleResponse {
  isSuccess: boolean;
  message: string;
  data: string;
  metadata: string;
}

/** ===== User Vehicle Parts Types ===== */
export interface UserVehiclePart {
  id: string;
  partCategoryId: string;
  partCategoryName: string;
  partCategoryCode: string;
  iconUrl: string;
  isDeclared: boolean;
  description: string;
}

export interface UserVehiclePartsResponse {
  isSuccess: boolean;
  message: string;
  data: UserVehiclePart[];
  metadata: unknown;
}

/** ===== AI Analyze Questionnaire Types ===== */
export interface QuestionAnswer {
  question: string;
  value: string;
}

export interface AnalyzeQuestionnaireRequest {
  userVehicleId: string;
  vehicleModelId: string;
  partCategoryCode: string;
  answers: QuestionAnswer[];
}

export interface AIRecommendation {
  partCategoryCode: string;
  lastReplacementOdometer: number;
  lastReplacementDate: string;
  predictedNextOdometer: number;
  predictedNextDate: string;
  confidenceScore: number;
  reasoning: string;
  needsImmediateAttention: boolean;
}

export interface AIMetadata {
  model: string;
  totalTokens: number;
  totalCost: number;
  responseTimeMs: number;
}

export interface AnalyzeQuestionnaireData {
  recommendations: AIRecommendation[];
  warnings: string[];
  metadata: AIMetadata;
}

export interface AnalyzeQuestionnaireResponse {
  isSuccess: boolean;
  message: string;
  data: AnalyzeQuestionnaireData;
  metadata: string;
}

/** ===== Apply Tracking Types ===== */
export interface ApplyTrackingRequest {
  partCategoryCode: string;
  lastReplacementOdometer: number;
  lastReplacementDate: string;
  predictedNextOdometer: number;
  predictedNextDate: string;
  aiReasoning: string;
  confidenceScore: number;
}

export interface PartTrackingReminder {
  id: string;
  level: string;
  currentOdometer: number;
  targetOdometer: number;
  targetDate: string;
  percentageRemaining: number;
  isNotified: boolean;
  notifiedDate: string;
  isDismissed: boolean;
  dismissedDate: string;
}

export interface ApplyTrackingData {
  id: string;
  partCategoryId: string;
  partCategoryName: string;
  partCategoryCode: string;
  instanceIdentifier: string;
  currentPartProductId: string;
  currentPartProductName: string;
  lastReplacementOdometer: number;
  lastReplacementDate: string;
  customKmInterval: number;
  customMonthsInterval: number;
  predictedNextOdometer: number;
  predictedNextDate: string;
  isDeclared: boolean;
  reminders: PartTrackingReminder[];
}

export interface ApplyTrackingResponse {
  isSuccess: boolean;
  message: string;
  data: ApplyTrackingData;
  metadata: string;
}

/** ===== Reminder Types ===== */
export interface ReminderPartCategory {
  id: string;
  name: string;
  code: string;
  description: string;
  iconUrl: string;
  identificationSigns: string;
  consequencesIfNotHandled: string;
}

export interface VehicleReminder {
  id: string;
  vehiclePartTrackingId: string;
  level: "Critical" | "High" | "Medium" | "Low" | "Normal";
  currentOdometer: number;
  targetOdometer: number;
  targetDate: string;
  percentageRemaining: number;
  isNotified: boolean;
  notifiedDate: string | null;
  isDismissed: boolean;
  dismissedDate: string | null;
  partCategory: ReminderPartCategory;
}

export interface VehicleRemindersResponse {
  isSuccess: boolean;
  message: string;
  data: VehicleReminder[];
  metadata: unknown;
}

/** ===== Service ===== */
export const UserVehicleService = {
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

  getUserVehicleParts: async (userVehicleId: string) => {
    const response = await coreApiService.get<UserVehiclePartsResponse>(`/api/v1/user-vehicles/${userVehicleId}/parts`);
    return response.data;
  },

  analyzeQuestionnaire: async (payload: AnalyzeQuestionnaireRequest) => {
    const response = await aiApiService.post<AnalyzeQuestionnaireResponse>(
      "/api/v1/ai/vehicle-questionnaire/analyze",
      payload
    );
    return response.data;
  },

  applyTracking: async (userVehicleId: string, payload: ApplyTrackingRequest) => {
    const response = await coreApiService.post<ApplyTrackingResponse>(
      `/api/v1/user-vehicles/${userVehicleId}/apply-tracking`,
      payload
    );
    return response.data;
  },

  getReminders: async (userVehicleId: string) => {
    const response = await coreApiService.get<VehicleRemindersResponse>(
      `/api/v1/user-vehicles/${userVehicleId}/reminders`
    );
    return response.data;
  },
};

export default UserVehicleService;
