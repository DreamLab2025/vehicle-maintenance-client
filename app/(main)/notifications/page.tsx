"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Check,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Package,
  Settings,
  Zap,
  CheckCircle2,
  Trash2,
  Car,
  Clock,
  Sparkles,
  Filter,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { Notification } from "@/lib/types";
import { MOCK_NOTIFICATIONS, getUnreadCount } from "@/lib/mock/notifications.mock";
import { getReminderLevelConfig } from "@/lib/config/reminderLevelConfig";

// Time formatting helper
function formatTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Vừa xong";
  if (diffMins < 60) return `${diffMins} phút`;
  if (diffHours < 24) return `${diffHours} giờ`;
  if (diffDays < 7) return `${diffDays} ngày`;
  return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
}

// Get notification config
function getNotificationConfig(notification: Notification) {
  if (notification.type === "reminder" && notification.level) {
    const config = getReminderLevelConfig(notification.level);
    return {
      Icon: config.Icon,
      iconColor: config.iconColor,
      bgLight: config.bgLight,
      borderColor: config.borderColor,
      hexColor: config.hexColor,
      gradient: config.bgGradient,
    };
  }

  const configs = {
    maintenance: {
      Icon: CheckCircle2,
      iconColor: "text-emerald-500",
      bgLight: "bg-emerald-50",
      borderColor: "border-emerald-200",
      hexColor: "#10b981",
      gradient: "from-emerald-500 to-green-500",
    },
    system: {
      Icon: Settings,
      iconColor: "text-slate-500",
      bgLight: "bg-slate-100",
      borderColor: "border-slate-200",
      hexColor: "#64748b",
      gradient: "from-slate-500 to-slate-600",
    },
    promotion: {
      Icon: Zap,
      iconColor: "text-purple-500",
      bgLight: "bg-purple-50",
      borderColor: "border-purple-200",
      hexColor: "#a855f7",
      gradient: "from-purple-500 to-pink-500",
    },
  };

  return configs[notification.type as keyof typeof configs] || configs.system;
}

interface NotificationCardProps {
  notification: Notification;
  onPress: (notification: Notification) => void;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  index: number;
}

function NotificationCard({ notification, onPress, onMarkAsRead, onDelete, index }: NotificationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = getNotificationConfig(notification);
  const Icon = config.Icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
      className="group relative"
    >
      {/* Main Card */}
      <div
        className={`relative overflow-hidden rounded-2xl transition-all duration-300 ${
          !notification.isRead
            ? "bg-white shadow-lg shadow-neutral-200/60 ring-1 ring-neutral-100"
            : "bg-neutral-50/80"
        }`}
      >
        {/* Gradient accent line */}
        {!notification.isRead && (
          <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${config.gradient}`} />
        )}

        {/* Content */}
        <button
          type="button"
          onClick={() => onPress(notification)}
          className="w-full text-left p-4 pl-5"
        >
          <div className="flex items-start gap-3.5">
            {/* Icon with glow effect */}
            <div className="relative flex-shrink-0">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center ${config.bgLight} transition-transform group-hover:scale-105`}
                style={{
                  boxShadow: !notification.isRead ? `0 4px 14px ${config.hexColor}20` : "none",
                }}
              >
                <Icon className={`w-5 h-5 ${config.iconColor}`} />
              </div>
              {!notification.isRead && (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 border-2 border-white" />
              )}
            </div>

            {/* Text Content */}
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-start justify-between gap-3">
                <h3
                  className={`text-[14px] font-semibold leading-tight ${
                    !notification.isRead ? "text-neutral-900" : "text-neutral-500"
                  }`}
                >
                  {notification.title}
                </h3>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <Clock className="w-3 h-3 text-neutral-400" />
                  <span className="text-[11px] text-neutral-400 font-medium">
                    {formatTimeAgo(notification.createdAt)}
                  </span>
                </div>
              </div>

              <p
                className={`text-[13px] mt-1.5 leading-relaxed ${
                  !notification.isRead ? "text-neutral-600" : "text-neutral-400"
                } ${isExpanded ? "" : "line-clamp-2"}`}
              >
                {notification.message}
              </p>

              {/* Meta Tags */}
              <div className="flex items-center flex-wrap gap-2 mt-3">
                {notification.partName && (
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${config.bgLight} ${config.iconColor}`}
                  >
                    <Package className="w-3 h-3" />
                    {notification.partName}
                  </span>
                )}
                {notification.vehicleName && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-100 text-[11px] font-medium text-neutral-500">
                    <Car className="w-3 h-3" />
                    {notification.vehicleName}
                  </span>
                )}
              </div>
            </div>

            {/* Arrow */}
            <ChevronRight
              className={`w-5 h-5 flex-shrink-0 mt-0.5 transition-all ${
                !notification.isRead ? "text-neutral-300" : "text-neutral-200"
              } group-hover:text-neutral-400 group-hover:translate-x-0.5`}
            />
          </div>
        </button>

        {/* Action Bar */}
        <div className="flex items-center justify-between px-5 py-2.5 border-t border-neutral-100/80 bg-neutral-50/50">
          <div className="flex items-center gap-1">
            {!notification.isRead && (
              <motion.button
                type="button"
                onClick={() => onMarkAsRead(notification.id)}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                Đã đọc
              </motion.button>
            )}
          </div>
          <motion.button
            type="button"
            onClick={() => onDelete(notification.id)}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Xóa
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

type FilterType = "all" | "unread" | "reminder" | "system";

const filters: { key: FilterType; label: string; icon: typeof Bell }[] = [
  { key: "all", label: "Tất cả", icon: Sparkles },
  { key: "unread", label: "Chưa đọc", icon: Bell },
  { key: "reminder", label: "Nhắc nhở", icon: Clock },
  { key: "system", label: "Hệ thống", icon: Settings },
];

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<FilterType>("all");

  const unreadCount = useMemo(() => getUnreadCount(notifications), [notifications]);

  const filteredNotifications = useMemo(() => {
    let result = [...notifications];

    switch (filter) {
      case "unread":
        result = result.filter((n) => !n.isRead);
        break;
      case "reminder":
        result = result.filter((n) => n.type === "reminder");
        break;
      case "system":
        result = result.filter((n) => n.type === "system" || n.type === "maintenance");
        break;
    }

    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [notifications, filter]);

  const handleNotificationPress = (notification: Notification) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
    );

    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 pb-28">
      {/* Decorative Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-red-100/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-blue-100/20 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-neutral-100/80">
        <div className="flex items-center justify-between px-5 h-16">
          <motion.button
            type="button"
            onClick={() => router.back()}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-xl bg-neutral-100 hover:bg-neutral-200 transition-colors flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-neutral-600" />
          </motion.button>

          <div className="flex items-center gap-2">
            <h1 className="text-[17px] font-bold text-neutral-900">Thông báo</h1>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-2 py-0.5 rounded-full bg-gradient-to-r from-red-500 to-rose-500 text-[11px] font-bold text-white shadow-sm"
              >
                {unreadCount}
              </motion.span>
            )}
          </div>

          {unreadCount > 0 ? (
            <motion.button
              type="button"
              onClick={handleMarkAllAsRead}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors flex items-center justify-center"
            >
              <CheckCheck className="w-5 h-5 text-blue-600" />
            </motion.button>
          ) : (
            <div className="w-10 h-10" />
          )}
        </div>
      </header>

      {/* Filter Pills */}
      <div className="sticky top-16 z-30 bg-white/70 backdrop-blur-xl border-b border-neutral-100/80 px-5 py-3">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1">
          {filters.map((f) => {
            const isActive = filter === f.key;
            const FilterIcon = f.icon;
            return (
              <motion.button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                whileTap={{ scale: 0.95 }}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all flex-shrink-0 ${
                  isActive
                    ? "bg-neutral-900 text-white shadow-lg shadow-neutral-900/20"
                    : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
                }`}
              >
                <FilterIcon className={`w-4 h-4 ${isActive ? "text-white" : "text-neutral-400"}`} />
                {f.label}
                {f.key === "unread" && unreadCount > 0 && (
                  <span
                    className={`ml-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                      isActive ? "bg-white/20 text-white" : "bg-red-100 text-red-600"
                    }`}
                  >
                    {unreadCount}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Notifications List */}
      <div className="px-5 py-5 space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification, index) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onPress={handleNotificationPress}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
                index={index}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-20 text-center"
            >
              <div className="relative w-20 h-20 mx-auto mb-5">
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-2xl rotate-6" />
                <div className="absolute inset-0 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                  <Bell className="w-9 h-9 text-neutral-300" />
                </div>
              </div>
              <h3 className="text-[16px] font-semibold text-neutral-700">
                {filter === "unread" ? "Tuyệt vời!" : "Không có thông báo"}
              </h3>
              <p className="text-[13px] text-neutral-400 mt-1.5 max-w-[200px] mx-auto">
                {filter === "unread"
                  ? "Bạn đã đọc tất cả thông báo rồi"
                  : "Thông báo mới sẽ xuất hiện tại đây"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
