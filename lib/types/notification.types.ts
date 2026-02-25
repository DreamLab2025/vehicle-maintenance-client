/**
 * Notification related types
 */

import { PaginationMetadata } from "./common.types";
import type { ReminderLevel } from "./reminder.types";

// ==================== Notification Types ====================

export type NotificationType = "reminder" | "maintenance" | "system" | "promotion" | "odometer_update";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  level?: ReminderLevel;
  partName?: string;
  vehicleName?: string;
  vehicleId?: string;
  userVehicleId?: string;
  reminderId?: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

// ==================== Component Props ====================

export interface NotificationItemProps {
  notification: Notification;
  onPress?: (notification: Notification) => void;
  onMarkAsRead?: (id: string) => void;
}

export interface NotificationListProps {
  notifications: Notification[];
  onNotificationPress?: (notification: Notification) => void;
  onMarkAllAsRead?: () => void;
}

export interface NotificationBadgeProps {
  count: number;
  maxCount?: number;
}

export interface NotificationDropdownProps {
  notifications: Notification[];
  onNotificationPress?: (notification: Notification) => void;
  onViewAll?: () => void;
  onMarkAllAsRead?: () => void;
}

// ==================== API Response Types ====================

export interface ApiNotification {
  id: string;
  title: string;
  message: string;
  notificationType: string;
  priority: "Critical" | "High" | "Medium" | "Low" | "Normal";
  status: string;
  entityType: "MaintenanceReminder" | "OdometerReminder" | "System" | "Promotion";
  entityId: string;
  actionUrl: string | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

export interface OdometerReminderMetadata {
  type: "OdometerReminder";
  entityId: string;
  entityType: "OdometerReminder";
  staleOdometerDays: number;
  vehicles: Array<{
    licensePlate: string;
    userVehicleId: string;
    currentOdometer: number;
    daysSinceUpdate: number;
    vehicleDisplayName: string;
    lastOdometerUpdateFormatted: string;
  }>;
}

export interface MaintenanceReminderMetadata {
  type: "MaintenanceReminder";
  entityId: string;
  entityType: "MaintenanceReminder";
  level: number;
  levelName: "Critical" | "High" | "Medium" | "Low" | "Normal";
  items: Array<{
    reminderId: string;
    userVehicleId: string;
    targetOdometer: number;
    currentOdometer: number;
    initialOdometer: number;
    partCategoryName: string;
    vehicleDisplayName: string;
    percentageRemaining: number;
    estimatedNextReplacementDate?: string;
  }>;
}

export type NotificationMetadata = OdometerReminderMetadata | MaintenanceReminderMetadata | Record<string, unknown>;

export interface ApiNotificationDetail {
  id: string;
  title: string;
  message: string;
  notificationType: string;
  priority: "Critical" | "High" | "Medium" | "Low" | "Normal";
  status: string;
  entityType: "MaintenanceReminder" | "OdometerReminder" | "System" | "Promotion";
  entityId: string;
  actionUrl: string | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  metadata: NotificationMetadata;
}

export interface NotificationDetailResponse {
  isSuccess: boolean;
  message: string;
  data: ApiNotificationDetail;
  metadata: null;
}

export interface NotificationListResponse {
  isSuccess: boolean;
  message: string;
  data: ApiNotification[];
  metadata: PaginationMetadata;
}

export interface NotificationStatus {
  unReadCount: number;
  hasUnread: boolean;
}

export interface NotificationStatusResponse {
  isSuccess: boolean;
  message: string;
  data: NotificationStatus;
  metadata: null;
}

export interface MarkAllAsReadResponse {
  isSuccess: boolean;
  message: string;
  data: number; // Number of notifications marked as read
  metadata: string | null;
}

// ==================== SignalR Notification Payload ====================

export interface InAppNotificationPayload {
  title: string;
  message: string;
  metadata: Record<string, unknown>;
}

// ==================== Mapper Functions ====================

/**
 * Maps API notification response to Notification type
 */
export function mapApiNotificationToNotification(apiNotif: ApiNotification): Notification {
  // Map entityType to type
  let type: NotificationType = "system";
  if (apiNotif.entityType === "MaintenanceReminder") {
    type = "reminder";
  } else if (apiNotif.entityType === "OdometerReminder") {
    type = "odometer_update";
  }

  // Map priority to level (only for reminders)
  const level = type === "reminder" ? (apiNotif.priority as ReminderLevel) : undefined;

  // Map entityId to reminderId or userVehicleId based on type
  const reminderId = type === "reminder" ? apiNotif.entityId : undefined;
  // For OdometerReminder, entityId is the userVehicleId (according to user's instruction)
  const userVehicleId = type === "odometer_update" ? apiNotif.entityId : undefined;
  const vehicleId = type === "odometer_update" ? apiNotif.entityId : undefined;

  return {
    id: apiNotif.id,
    type,
    title: apiNotif.title,
    message: apiNotif.message,
    level,
    reminderId,
    vehicleId,
    userVehicleId,
    isRead: apiNotif.isRead,
    createdAt: apiNotif.createdAt,
    actionUrl: apiNotif.actionUrl || undefined,
  };
}