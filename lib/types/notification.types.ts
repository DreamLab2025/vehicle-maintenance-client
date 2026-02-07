/**
 * Notification related types
 */

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

export interface NotificationListResponse {
  isSuccess: boolean;
  message: string;
  data: Notification[];
  metadata: {
    unreadCount: number;
    totalCount: number;
  };
}
