"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  ChevronRight,
  CheckCircle2,
  Zap,
  Settings,
  Package,
  Car,
  X,
  Gauge,
  ArrowDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { Notification } from "@/lib/types";
import { getReminderLevelConfig } from "@/lib/config/reminderLevelConfig";
import { useNotifications, useNotificationStatus } from "@/hooks/useNotification";

function formatTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Vừa xong";
  if (diffMins < 60) return `${diffMins}p`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
}

function getNotificationConfig(notification: Notification) {
  if (notification.type === "reminder" && notification.level) {
    const config = getReminderLevelConfig(notification.level);
    return {
      Icon: config.Icon,
      iconColor: config.iconColor,
      bgLight: config.bgLight,
      hexColor: config.hexColor,
      gradient: config.bgGradient,
    };
  }

  const configs = {
    odometer_update: {
      Icon: Gauge,
      iconColor: "text-green-600",
      bgLight: "bg-green-500/10",
      hexColor: "#16a34a",
      gradient: "from-green-500 to-emerald-500",
    },
    maintenance: {
      Icon: CheckCircle2,
      iconColor: "text-emerald-600",
      bgLight: "bg-emerald-500/10",
      hexColor: "#10b981",
      gradient: "from-emerald-500 to-teal-500",
    },
    system: {
      Icon: Settings,
      iconColor: "text-slate-600",
      bgLight: "bg-slate-500/10",
      hexColor: "#64748b",
      gradient: "from-slate-500 to-slate-600",
    },
    promotion: {
      Icon: Zap,
      iconColor: "text-violet-600",
      bgLight: "bg-violet-500/10",
      hexColor: "#8b5cf6",
      gradient: "from-violet-500 to-purple-500",
    },
  };

  return configs[notification.type as keyof typeof configs] || configs.system;
}

interface NotificationItemProps {
  notification: Notification;
  onPress: (notification: Notification) => void;
  index: number;
}

function NotificationItem({ notification, onPress, index }: NotificationItemProps) {
  const config = getNotificationConfig(notification);
  const Icon = config.Icon;

  return (
    <motion.button
      type="button"
      onClick={() => onPress(notification)}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      className="group w-full text-left px-4 py-3 transition-all hover:bg-neutral-50 active:bg-neutral-100"
    >
      <div className="flex gap-3">
        {/* Icon */}
        <div className="relative flex-shrink-0 mt-0.5">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${config.bgLight}`}>
            <Icon className={`w-[18px] h-[18px] ${config.iconColor}`} />
          </div>
          {!notification.isRead && (
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2 mb-0.5">
            <p className={`text-xs font-semibold truncate ${!notification.isRead ? "text-neutral-900" : "text-neutral-600"}`}>
              {notification.title}
            </p>
            <span className="flex-shrink-0 text-xs text-neutral-400">
              {formatTimeAgo(notification.createdAt)}
            </span>
          </div>

          <p className={`text-xs leading-relaxed line-clamp-2 ${!notification.isRead ? "text-neutral-600" : "text-neutral-400"}`}>
            {notification.message}
          </p>

          {(notification.partName || notification.vehicleName) && (
            <div className="flex items-center gap-2 mt-2">
              {notification.partName && (
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${config.bgLight} ${config.iconColor}`}>
                  <Package className="w-2.5 h-2.5" />
                  {notification.partName}
                </span>
              )}
              {notification.vehicleName && (
                <span className="inline-flex items-center gap-1 text-[10px] text-neutral-400">
                  <Car className="w-2.5 h-2.5" />
                  {notification.vehicleName}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.button>
  );
}

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startY, setStartY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fetch notifications (up to 15)
  const { notifications, isLoading, isFetching, refetch } = useNotifications(
    {
      PageNumber: 1,
      PageSize: 15,
      IsDescending: true,
    },
    isOpen // Only fetch when dropdown is open
  );

  // Get unread count from status API
  const { unReadCount } = useNotificationStatus();

  const displayNotifications = useMemo(() => {
    return notifications.slice(0, 15);
  }, [notifications]);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Pull-to-refresh handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!listRef.current) return;
    const scrollTop = listRef.current.scrollTop;
    if (scrollTop === 0) {
      setStartY(e.touches[0].clientY);
      setIsDragging(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !listRef.current) return;
    const currentY = e.touches[0].clientY;
    const distance = currentY - startY;
    if (distance > 0) {
      setPullDistance(Math.min(distance, 80));
    }
  };

  const handleTouchEnd = async () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (pullDistance > 50) {
      setIsRefreshing(true);
      await refetch();
      setTimeout(() => {
        setIsRefreshing(false);
        setPullDistance(0);
      }, 500);
    } else {
      setPullDistance(0);
    }
  };

  const handleNotificationPress = (notification: Notification) => {
    // TODO: Call API to mark as read
    
    // MaintenanceReminder (reminder type) → navigate to detail page
    if (notification.type === "reminder" && notification.level) {
      router.push(`/notifications/${notification.id}`);
      setIsOpen(false);
      return;
    }

    // OdometerReminder (odometer_update type) → navigate to odometer update page
    if (notification.type === "odometer_update" && notification.userVehicleId) {
      router.push(`/odometer/${notification.userVehicleId}`);
      setIsOpen(false);
      return;
    }

    // Fallback to actionUrl if available
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
    setIsOpen(false);
  };

  const handleViewAll = () => {
    router.push("/notifications");
    setIsOpen(false);
  };

  const handleMarkAllAsRead = () => {
    // TODO: Call API to mark all as read
    refetch();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger */}
      <motion.button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        whileTap={{ scale: 0.94 }}
        className="relative w-10 h-10 rounded-xl bg-neutral-100 hover:bg-neutral-200 transition-colors flex items-center justify-center"
        aria-label="Notifications"
      >
        <Bell className={`h-[18px] w-[18px] transition-colors ${isOpen ? "text-neutral-900" : "text-neutral-600"}`} />
        <AnimatePresence>
          {unReadCount > 0 && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-red-500 rounded-full text-[10px] font-bold text-white ring-2 ring-white"
            >
              {unReadCount > 9 ? "9+" : unReadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 sm:hidden"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="fixed sm:absolute inset-x-4 sm:inset-x-auto bottom-20 sm:bottom-auto sm:right-0 sm:top-full sm:mt-2 sm:w-[380px] bg-white rounded-2xl shadow-2xl shadow-black/10 border border-neutral-200/60 overflow-hidden z-50"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
                      <Bell className="w-4 h-4 text-white" />
                    </div>
                    {unReadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center bg-neutral-900 rounded-full text-[9px] font-bold text-white">
                        {unReadCount}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900">Thông báo</h3>
                    <p className="text-xs text-neutral-500">
                      {unReadCount > 0 ? `${unReadCount} chưa đọc` : "Đã đọc tất cả"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {unReadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllAsRead}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      Đọc tất cả
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-lg hover:bg-neutral-100 flex items-center justify-center sm:hidden"
                  >
                    <X className="w-4 h-4 text-neutral-500" />
                  </button>
                </div>
              </div>

              {/* Pull-to-refresh indicator */}
              <AnimatePresence>
                {(pullDistance > 0 || isRefreshing) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: pullDistance > 0 ? pullDistance : 60 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center justify-center overflow-hidden"
                  >
                    <motion.div
                      animate={{ rotate: isRefreshing ? 360 : 0 }}
                      transition={{ duration: 0.6, repeat: isRefreshing ? Infinity : 0, ease: "linear" }}
                      className="flex items-center gap-2 text-neutral-400"
                    >
                      <ArrowDown className="w-4 h-4" />
                      <span className="text-xs font-medium">
                        {isRefreshing ? "Đang tải..." : "Kéo để làm mới"}
                      </span>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* List */}
              <div
                ref={listRef}
                className="max-h-[60vh] sm:max-h-[400px] overflow-y-auto overscroll-contain scrollbar-hide relative"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                  transform: pullDistance > 0 ? `translateY(${pullDistance}px)` : undefined,
                  transition: isRefreshing ? "transform 0.3s ease" : undefined,
                }}
              >
                {isLoading ? (
                  <div className="py-12 text-center">
                    <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-xs text-neutral-400">Đang tải thông báo...</p>
                  </div>
                ) : displayNotifications.length > 0 ? (
                  <div className="divide-y divide-neutral-100">
                    {displayNotifications.map((notification, index) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onPress={handleNotificationPress}
                        index={index}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-3">
                      <Bell className="w-7 h-7 text-neutral-300" />
                    </div>
                    <p className="text-sm font-medium text-neutral-600">Không có thông báo</p>
                    <p className="text-xs text-neutral-400 mt-1">Bạn sẽ nhận được thông báo tại đây</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-neutral-100">
                <button
                  type="button"
                  onClick={handleViewAll}
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-3.5 hover:bg-neutral-50 transition-colors group"
                >
                  <span className="text-xs font-semibold text-neutral-600 group-hover:text-neutral-900">
                    Xem tất cả
                  </span>
                  <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
