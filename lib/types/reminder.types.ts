/**
 * Reminder related types
 */

import { LucideIcon } from "lucide-react";

// ==================== Reminder Level ====================

export type ReminderLevel = "Critical" | "High" | "Medium" | "Low" | "Normal";

export interface ReminderLevelConfig {
  // Display
  label: string;
  labelVi: string;
  description: string;

  // Colors - Tailwind classes
  bgGradient: string;
  bgSolid: string;
  bgLight: string;
  textColor: string;
  borderColor: string;
  shadowColor: string;

  // Hex colors for SVG/Canvas
  hexColor: string;
  hexColorLight: string;

  // Badge
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;

  // Icon
  Icon: LucideIcon;
  iconBg: string;
  iconColor: string;

  // Importance
  importance: string;
  importanceColor: string;
  priority: number;
}

// ==================== Part Category ====================

export interface ReminderPartCategory {
  id: string;
  name: string;
  code: string;
  description: string;
  iconUrl: string;
  identificationSigns: string;
  consequencesIfNotHandled: string;
}

// ==================== Vehicle Reminder ====================

export interface VehicleReminder {
  id: string;
  vehiclePartTrackingId: string;
  level: ReminderLevel;
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

// ==================== Part Tracking ====================

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

// ==================== Request/Response Types ====================

export interface ApplyTrackingRequest {
  partCategoryCode: string;
  lastReplacementOdometer: number;
  lastReplacementDate: string;
  predictedNextOdometer: number;
  predictedNextDate: string;
  aiReasoning: string;
  confidenceScore: number;
}

export interface ApplyTrackingResponse {
  isSuccess: boolean;
  message: string;
  data: ApplyTrackingData;
  metadata: string;
}

export interface VehicleRemindersResponse {
  isSuccess: boolean;
  message: string;
  data: VehicleReminder[];
  metadata: unknown;
}

// ==================== Component Props ====================

export interface ReminderDetailSheetProps {
  reminder: VehicleReminder | null;
  onClose: () => void;
}

export interface CircularProgressProps {
  percent: number;
  color: string;
  colorLight: string;
  size?: number;
  strokeWidth?: number;
}

export interface ReminderHeaderProps {
  name: string;
  status: string;
  levelConfig: ReminderLevelConfig;
  daysRemaining: number;
}

export interface ReminderStatsProps {
  currentOdometer: number;
  targetOdometer: number;
  remainingKm: number;
  levelConfig: ReminderLevelConfig;
}

export interface ProgressBarProps {
  percent: number;
  color: string;
}

export interface TimelineListProps {
  title: string;
  items: string[];
  icon: React.ReactNode;
  colorScheme: "amber" | "red";
  count: number;
}

export interface ChipListProps {
  title: string;
  items: string[];
  icon: React.ReactNode;
  colorScheme: "amber" | "red";
  count: number;
}
