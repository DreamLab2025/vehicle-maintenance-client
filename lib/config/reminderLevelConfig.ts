/**
 * Reminder Level Configuration
 */

import { AlertTriangle, AlertCircle, Clock, CheckCircle2, Zap, type LucideIcon } from "lucide-react";
import type { ReminderLevel, ReminderLevelConfig } from "@/lib/types/reminder.types";

export const REMINDER_LEVEL_CONFIG: Record<ReminderLevel, ReminderLevelConfig> = {
  Critical: {
    label: "Critical",
    labelVi: "Khẩn cấp",
    description: "Cần xử lý ngay lập tức để tránh hư hỏng nghiêm trọng",
    bgGradient: "from-red-500 to-rose-600",
    bgSolid: "bg-red-500",
    bgLight: "bg-red-50",
    textColor: "text-red-600",
    borderColor: "border-red-200",
    shadowColor: "shadow-red-500/25",
    hexColor: "#dc2626",
    hexColorLight: "#fef2f2",
    badgeBg: "bg-red-100",
    badgeText: "text-red-700",
    badgeBorder: "border-red-200",
    Icon: AlertTriangle,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    importance: "Rất quan trọng - Không nên trì hoãn",
    importanceColor: "text-red-600",
    priority: 1,
  },

  High: {
    label: "High",
    labelVi: "Cao",
    description: "Cần xử lý sớm để đảm bảo an toàn",
    bgGradient: "from-orange-500 to-amber-500",
    bgSolid: "bg-orange-500",
    bgLight: "bg-orange-50",
    textColor: "text-orange-600",
    borderColor: "border-orange-200",
    shadowColor: "shadow-orange-500/25",
    hexColor: "#ea580c",
    hexColorLight: "#fff7ed",
    badgeBg: "bg-orange-100",
    badgeText: "text-orange-700",
    badgeBorder: "border-orange-200",
    Icon: AlertCircle,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    importance: "Quan trọng - Nên xử lý sớm",
    importanceColor: "text-orange-600",
    priority: 2,
  },

  Medium: {
    label: "Medium",
    labelVi: "Trung bình",
    description: "Nên xử lý trong thời gian tới",
    bgGradient: "from-amber-400 to-yellow-500",
    bgSolid: "bg-amber-500",
    bgLight: "bg-amber-50",
    textColor: "text-amber-600",
    borderColor: "border-amber-200",
    shadowColor: "shadow-amber-500/25",
    hexColor: "#d97706",
    hexColorLight: "#fffbeb",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-700",
    badgeBorder: "border-amber-200",
    Icon: Clock,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    importance: "Trung bình - Lên kế hoạch xử lý",
    importanceColor: "text-amber-600",
    priority: 3,
  },

  Low: {
    label: "Low",
    labelVi: "Thấp",
    description: "Có thể theo dõi và xử lý khi thuận tiện",
    bgGradient: "from-blue-400 to-cyan-500",
    bgSolid: "bg-blue-500",
    bgLight: "bg-blue-50",
    textColor: "text-blue-600",
    borderColor: "border-blue-200",
    shadowColor: "shadow-blue-500/25",
    hexColor: "#2563eb",
    hexColorLight: "#eff6ff",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-700",
    badgeBorder: "border-blue-200",
    Icon: Zap,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    importance: "Thấp - Theo dõi định kỳ",
    importanceColor: "text-blue-600",
    priority: 4,
  },

  Normal: {
    label: "Normal",
    labelVi: "Bình thường",
    description: "Hoạt động bình thường, theo dõi định kỳ",
    bgGradient: "from-emerald-500 to-green-500",
    bgSolid: "bg-emerald-500",
    bgLight: "bg-emerald-50",
    textColor: "text-emerald-600",
    borderColor: "border-emerald-200",
    shadowColor: "shadow-emerald-500/25",
    hexColor: "#059669",
    hexColorLight: "#ecfdf5",
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-700",
    badgeBorder: "border-emerald-200",
    Icon: CheckCircle2,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    importance: "Bình thường - Theo dõi định kỳ",
    importanceColor: "text-emerald-600",
    priority: 5,
  },
};

// ==================== Helper Functions ====================

export function getReminderLevelConfig(level: string): ReminderLevelConfig {
  return REMINDER_LEVEL_CONFIG[level as ReminderLevel] || REMINDER_LEVEL_CONFIG.Normal;
}

export function getReminderLevelsByPriority(): ReminderLevel[] {
  return (Object.keys(REMINDER_LEVEL_CONFIG) as ReminderLevel[]).sort(
    (a, b) => REMINDER_LEVEL_CONFIG[a].priority - REMINDER_LEVEL_CONFIG[b].priority
  );
}

export function isUrgentLevel(level: string): boolean {
  return level === "Critical" || level === "High";
}

export function getLevelBadgeClasses(level: string): string {
  const config = getReminderLevelConfig(level);
  return `${config.badgeBg} ${config.badgeText} ${config.badgeBorder}`;
}

export function getLevelIcon(level: string): LucideIcon {
  return getReminderLevelConfig(level).Icon;
}

export default REMINDER_LEVEL_CONFIG;

// Re-export types for convenience
export type { ReminderLevel, ReminderLevelConfig } from "@/lib/types/reminder.types";
