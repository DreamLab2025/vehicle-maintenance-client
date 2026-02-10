/**
 * Notification Service - API calls for notifications
 */

import coreApiService from "../coreApiService";
import { RequestParams } from "../apiService";
import {
  NotificationStatusResponse,
  NotificationListResponse,
  NotificationDetailResponse,
  MarkAllAsReadResponse,
} from "@/lib/types/notification.types";

export interface NotificationQueryParams extends RequestParams {
  PageNumber: number;
  PageSize: number;
  IsDescending?: boolean;
}

export const NotificationService = {
  // ==================== Notification Status ====================

  getNotificationStatus: async () => {
    const response = await coreApiService.get<NotificationStatusResponse>("/api/v1/notifications/status");
    return response.data;
  },

  // ==================== Notification List ====================

  getNotifications: async (params: NotificationQueryParams) => {
    const response = await coreApiService.get<NotificationListResponse>("/api/v1/notifications", params);
    return response.data;
  },

  // ==================== Notification Detail ====================

  getNotificationById: async (id: string) => {
    const response = await coreApiService.get<NotificationDetailResponse>(`/api/v1/notifications/${id}`);
    return response.data;
  },

  // ==================== Mark All As Read ====================

  markAllAsRead: async () => {
    const response = await coreApiService.post<MarkAllAsReadResponse>("/api/v1/notifications/read-all");
    return response.data;
  },
};

export default NotificationService;
