"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  Bell,
  CheckCheck,
  ChevronLeft,
  ExternalLink,
  X,
  Car,
  Package,
  Wrench,
  Megaphone,
  Info,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { Notification } from "@/lib/types";
import {
  MOCK_NOTIFICATIONS,
  getUnreadCount,
} from "@/lib/mock/notifications.mock";
import { getReminderLevelConfig } from "@/lib/config/reminderLevelConfig";

// ─── Helpers ────────────────────────────────────────────────

function timeAgo(dateString: string): string {
  const now = Date.now();
  const diff = now - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Vừa xong";
  if (mins < 60) return `${mins} phút`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} giờ`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} ngày`;
  return new Date(dateString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
  });
}

function formatFullDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getNotifIcon(notification: Notification) {
  if (notification.type === "reminder" && notification.level) {
    const config = getReminderLevelConfig(notification.level);
    return { Icon: config.Icon, bg: config.hexColorLight, color: config.hexColor };
  }
  if (notification.type === "maintenance")
    return { Icon: Wrench, bg: "#eff6ff", color: "#3b82f6" };
  if (notification.type === "promotion")
    return { Icon: Megaphone, bg: "#fdf4ff", color: "#a855f7" };
  return { Icon: Info, bg: "#f1f5f9", color: "#64748b" };
}

function groupByDay(
  notifications: Notification[]
): { label: string; items: Notification[] }[] {
  const map = new Map<string, Notification[]>();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);

  const sorted = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  for (const n of sorted) {
    const d = new Date(n.createdAt);
    const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());

    let label: string;
    if (day.getTime() === today.getTime()) label = "Hôm nay";
    else if (day.getTime() === yesterday.getTime()) label = "Hôm qua";
    else
      label = d.toLocaleDateString("vi-VN", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
      });

    if (!map.has(label)) map.set(label, []);
    map.get(label)!.push(n);
  }

  return Array.from(map.entries()).map(([label, items]) => ({ label, items }));
}

// ─── Notification Row ───────────────────────────────────────

function NotificationRow({
  notification,
  onSelect,
  index,
}: {
  notification: Notification;
  onSelect: (n: Notification) => void;
  index: number;
}) {
  const { Icon, bg, color } = getNotifIcon(notification);
  const hasLevel = notification.type === "reminder" && notification.level;
  const levelConfig = hasLevel
    ? getReminderLevelConfig(notification.level!)
    : null;

  return (
    <motion.button
      layoutId={`notif-${notification.id}`}
      type="button"
      onClick={() => onSelect(notification)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
      className={`w-full flex items-start gap-3.5 px-4 py-4 text-left active:scale-[0.98] transition-transform ${
        !notification.isRead ? "bg-white" : "bg-white/60"
      }`}
    >
      {/* Icon + level column */}
      <div className="flex flex-col items-center flex-shrink-0 mt-0.5 w-12">
        <div className="relative">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center"
            style={{ backgroundColor: bg }}
          >
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
          {!notification.isRead && (
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-blue-500 border-2 border-white" />
          )}
        </div>
        {hasLevel && levelConfig && (
          <span
            className="mt-1.5 text-[9px] font-bold text-center leading-tight"
            style={{ color: levelConfig.hexColor }}
          >
            {levelConfig.labelVi}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Title + time */}
        <div className="flex items-start justify-between gap-3">
          <p
            className={`text-[15px] leading-snug ${
              !notification.isRead
                ? "font-semibold text-neutral-900"
                : "font-medium text-neutral-500"
            }`}
          >
            {notification.title}
          </p>
          <span className="flex-shrink-0 text-[12px] text-neutral-400 mt-0.5">
            {timeAgo(notification.createdAt)}
          </span>
        </div>

        {/* Message — 2 lines max, truncate */}
        <p
          className={`text-[13px] leading-relaxed mt-1 line-clamp-2 ${
            !notification.isRead ? "text-neutral-600" : "text-neutral-400"
          }`}
        >
          {notification.message}
        </p>

        {/* Level pill (only for reminders) */}
        
      </div>
    </motion.button>
  );
}

// ─── Detail Popup ───────────────────────────────────────────

function DetailPopup({
  notification,
  onClose,
  onNavigate,
}: {
  notification: Notification;
  onClose: () => void;
  onNavigate: (url: string) => void;
}) {
  const { Icon, bg, color } = getNotifIcon(notification);
  const hasLevel = notification.type === "reminder" && notification.level;
  const levelConfig = hasLevel
    ? getReminderLevelConfig(notification.level!)
    : null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
      />

      {/* Popup */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-5 pointer-events-none">
        <motion.div
          layoutId={`notif-${notification.id}`}
          className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden pointer-events-auto"
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
        >
          {/* Top accent */}
          <div
            className="h-1 w-full"
            style={{
              background: levelConfig
                ? `linear-gradient(90deg, ${levelConfig.hexColor}, ${levelConfig.hexColorLight})`
                : `linear-gradient(90deg, ${color}, ${bg})`,
            }}
          />

          <div className="p-5">
            {/* Header row */}
            <div className="flex items-start gap-3.5">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: bg }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[17px] font-bold text-neutral-900 leading-tight">
                  {notification.title}
                </p>
                <p className="text-[12px] text-neutral-400 mt-1">
                  {formatFullDate(notification.createdAt)}
                </p>
              </div>

              <motion.button
                type="button"
                onClick={onClose}
                whileTap={{ scale: 0.85 }}
                className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0"
              >
                <X className="w-4 h-4 text-neutral-500" />
              </motion.button>
            </div>

            {/* Level badge */}
            {hasLevel && levelConfig && (
              <div className="mt-4">
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border"
                  style={{
                    backgroundColor: levelConfig.hexColorLight,
                    color: levelConfig.hexColor,
                    borderColor: `${levelConfig.hexColor}30`,
                  }}
                >
                  <levelConfig.Icon className="w-3 h-3" />
                  Mức độ: {levelConfig.labelVi}
                </span>
              </div>
            )}

            {/* Full message */}
            <p className="text-[14px] text-neutral-600 leading-relaxed mt-4">
              {notification.message}
            </p>

            {/* Meta tags */}
            {(notification.vehicleName || notification.partName) && (
              <div className="flex flex-wrap gap-2 mt-4">
                {notification.vehicleName && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-neutral-50 text-[12px] text-neutral-500 font-medium">
                    <Car className="w-3.5 h-3.5" />
                    {notification.vehicleName}
                  </span>
                )}
                {notification.partName && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-neutral-50 text-[12px] text-neutral-500 font-medium">
                    <Package className="w-3.5 h-3.5" />
                    {notification.partName}
                  </span>
                )}
              </div>
            )}

            {/* Action button */}
            {notification.actionUrl && (
              <motion.button
                type="button"
                onClick={() => onNavigate(notification.actionUrl!)}
                whileTap={{ scale: 0.97 }}
                className="w-full flex items-center justify-center gap-2 mt-5 py-3.5 rounded-2xl text-[14px] font-semibold text-white"
                style={{
                  background: levelConfig
                    ? `linear-gradient(135deg, ${levelConfig.hexColor}, ${levelConfig.hexColor}cc)`
                    : `linear-gradient(135deg, ${color}, ${color}cc)`,
                }}
              >
                <ExternalLink className="w-4 h-4" />
                Xem chi tiết
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
}

// ─── Main Page ──────────────────────────────────────────────

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] =
    useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [selected, setSelected] = useState<Notification | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = useMemo(
    () => getUnreadCount(notifications),
    [notifications]
  );

  const filtered = useMemo(
    () =>
      filter === "unread"
        ? notifications.filter((n) => !n.isRead)
        : notifications,
    [notifications, filter]
  );

  const grouped = useMemo(() => groupByDay(filtered), [filtered]);

  const handleSelect = useCallback(
    (n: Notification) => {
      // Mark as read
      setNotifications((prev) =>
        prev.map((item) => (item.id === n.id ? { ...item, isRead: true } : item))
      );

      // Reminder notifications → navigate to detail page
      if (n.type === "reminder" && n.level) {
        router.push(`/notifications/${n.id}`);
        return;
      }

      // Other types → popup
      setSelected(n);
    },
    [router]
  );

  const handleClose = useCallback(() => setSelected(null), []);

  const handleNavigate = useCallback(
    (url: string) => {
      setSelected(null);
      router.push(url);
    },
    [router]
  );

  const handleMarkAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  return (
    <LayoutGroup>
      <div className="min-h-screen bg-[#f5f5f7] pb-28">
        {/* ── Header ── */}
        <header className="sticky top-0 z-40 bg-[#f5f5f7]/80 backdrop-blur-xl border-b border-neutral-200/50">
          <div className="flex items-center justify-between px-5 h-14">
            <motion.button
              type="button"
              onClick={() => router.back()}
              whileTap={{ scale: 0.9 }}
              className="w-9 h-9 rounded-full bg-white/80 shadow-sm flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5 text-neutral-700" />
            </motion.button>

            <div className="flex items-center gap-4">
              <h1 className="text-[17px] font-bold text-neutral-900">
                Thông báo
              </h1>
            </div>

            {unreadCount > 0 ? (
              <motion.button
                type="button"
                onClick={handleMarkAllAsRead}
                whileTap={{ scale: 0.9 }}
                className="w-9 h-9 rounded-full bg-white/80 shadow-sm flex items-center justify-center"
              >
                <CheckCheck className="w-[18px] h-[18px] text-blue-500" />
              </motion.button>
            ) : (
              <div className="w-9" />
            )}
          </div>
        </header>

        {/* ── Filter Tabs ── */}
        <div className="flex items-center gap-6 px-6 pt-3 pb-1">
          {([
            { key: "all" as const, label: "Tất cả", count: notifications.length },
            { key: "unread" as const, label: "Chưa đọc", count: unreadCount },
          ]).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key)}
              className="relative pb-2"
            >
              <span className={`flex items-center gap-1.5 text-[14px] transition-colors ${
                filter === tab.key
                  ? "font-semibold text-neutral-900"
                  : "font-medium text-neutral-400"
              }`}>
                {tab.label}
                {tab.count > 0 && (
                  <span className={`min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full text-[10px] font-bold ${
                    filter === tab.key
                      ? "bg-blue-500 text-white"
                      : "bg-neutral-200 text-neutral-500"
                  }`}>
                    {tab.count}
                  </span>
                )}
              </span>
              {filter === tab.key && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500 rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* ── List ── */}
        <div className="pt-2">
          {grouped.length > 0 ? (
            grouped.map((group) => (
              <div key={group.label} className="mb-4">
                {/* Day label */}
                <p className="text-[13px] font-semibold text-neutral-400 uppercase tracking-wider px-6 pb-2">
                  {group.label}
                </p>

                {/* Card group */}
                <div className="bg-white mx-4 rounded-2xl overflow-hidden shadow-sm shadow-neutral-200/40">
                  {group.items.map((notification, i) => (
                    <div key={notification.id}>
                      {i > 0 && <div className="h-px bg-neutral-100 ml-[76px] mr-4" />}
                      <NotificationRow
                        notification={notification}
                        onSelect={handleSelect}
                        index={i}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-28"
            >
              <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4">
                <Bell className="w-7 h-7 text-neutral-300" />
              </div>
              <p className="text-[15px] font-medium text-neutral-400">
                Không có thông báo
              </p>
            </motion.div>
          )}
        </div>

        {/* ── Detail Popup ── */}
        <AnimatePresence>
          {selected && (
            <DetailPopup
              key={selected.id}
              notification={selected}
              onClose={handleClose}
              onNavigate={handleNavigate}
            />
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
}
