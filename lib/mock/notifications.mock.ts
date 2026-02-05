/**
 * Mock notification data
 */

import type { Notification } from "@/lib/types";

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "notif-1",
    type: "reminder",
    title: "Cần thay dầu nhớt",
    message: "Xe Honda SH 150i đã đến hạn thay dầu nhớt động cơ. Còn 50km nữa đến mốc bảo dưỡng.",
    level: "Critical",
    partName: "Dầu nhớt động cơ",
    vehicleName: "Honda SH 150i",
    vehicleId: "vehicle-1",
    reminderId: "reminder-1",
    isRead: false,
    createdAt: new Date().toISOString(),
    actionUrl: "/reminder/reminder-1",
  },
  {
    id: "notif-2",
    type: "reminder",
    title: "Kiểm tra lốp xe",
    message: "Lốp trước xe Yamaha Exciter 155 cần được kiểm tra. Đã sử dụng được 8,500km.",
    level: "High",
    partName: "Lốp trước",
    vehicleName: "Yamaha Exciter 155",
    vehicleId: "vehicle-2",
    reminderId: "reminder-2",
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    actionUrl: "/reminder/reminder-2",
  },
  {
    id: "notif-3",
    type: "maintenance",
    title: "Hoàn thành bảo dưỡng",
    message: "Bảo dưỡng định kỳ cho Honda SH 150i đã hoàn thành. Số km tiếp theo: 35,000km.",
    vehicleName: "Honda SH 150i",
    vehicleId: "vehicle-1",
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: "notif-4",
    type: "reminder",
    title: "Kiểm tra bugi",
    message: "Bugi xe Honda SH 150i nên được kiểm tra trong lần bảo dưỡng tiếp theo.",
    level: "Medium",
    partName: "Bugi",
    vehicleName: "Honda SH 150i",
    vehicleId: "vehicle-1",
    reminderId: "reminder-3",
    isRead: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    actionUrl: "/reminder/reminder-3",
  },
  {
    id: "notif-5",
    type: "system",
    title: "Cập nhật ứng dụng",
    message: "Phiên bản mới 2.0.0 đã sẵn sàng với nhiều tính năng mới.",
    isRead: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
  },
];

export const getUnreadCount = (notifications: Notification[]): number => {
  return notifications.filter((n) => !n.isRead).length;
};

export const getRecentNotifications = (notifications: Notification[], limit: number = 5): Notification[] => {
  return notifications
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
};
