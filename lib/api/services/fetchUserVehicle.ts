/**
 * @deprecated This file is kept for backward compatibility.
 * Please import from '@/lib/types' for types and '@/lib/api/services/userVehicle.service' for service.
 */

// Re-export types for backward compatibility
export type {
  // Vehicle types
  VehicleModel,
  UserVehicleVariant,
  UserVehicle,
  UserVehiclePart,
  CreateUserVehicleRequest,
  CreateUserVehicleResponse,
  UserVehicleListResponse,
  UserVehicleQueryParams,
  DeleteUserVehicleResponse,
  UserVehiclePartsResponse,
} from "@/lib/types/vehicle.types";

export type {
  // Reminder types
  ReminderPartCategory,
  VehicleReminder,
  PartTrackingReminder,
  ApplyTrackingData,
  ApplyTrackingRequest,
  ApplyTrackingResponse,
  VehicleRemindersResponse,
} from "@/lib/types/reminder.types";

export type {
  // AI types
  QuestionAnswer,
  AnalyzeQuestionnaireRequest,
  AIRecommendation,
  AIMetadata,
  AnalyzeQuestionnaireData,
  AnalyzeQuestionnaireResponse,
} from "@/lib/types/ai.types";

export type {
  // Common types
  PaginationMetadata,
} from "@/lib/types/common.types";

// Re-export service
export { UserVehicleService } from "./userVehicle.service";
export { default } from "./userVehicle.service";
