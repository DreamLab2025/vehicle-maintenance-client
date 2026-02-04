import {
  AlertTriangle,
  AlertCircle,
  Clock,
  CheckCircle2,
  Zap,
  type LucideIcon,
} from "lucide-react";

/**
 * Reminder Level Types
 * - Critical: Khẩn cấp - Cần xử lý ngay lập tức
 * - High: Cao - Cần xử lý sớm
 * - Medium: Trung bình - Nên xử lý trong thời gian tới
 * - Low: Thấp - Có thể theo dõi
 * - Normal: Bình thường - Định kỳ theo dõi
 */
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
  priority: number; // Lower = more urgent
}

export const REMINDER_LEVEL_CONFIG: Record<ReminderLevel, ReminderLevelConfig> = {
  Critical: {
    // Display
    label: "Critical",
    labelVi: "Khẩn cấp",
    description: "Cần xử lý ngay lập tức để tránh hư hỏng nghiêm trọng",

    // Colors
    bgGradient: "from-red-500 to-rose-600",
    bgSolid: "bg-red-500",
    bgLight: "bg-red-50",
    textColor: "text-red-600",
    borderColor: "border-red-200",
    shadowColor: "shadow-red-500/25",

    // Badge
    badgeBg: "bg-red-100",
    badgeText: "text-red-700",
    badgeBorder: "border-red-200",

    // Icon
    Icon: AlertTriangle,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",

    // Importance
    importance: "Rất quan trọng - Không nên trì hoãn",
    importanceColor: "text-red-600",
    priority: 1,
  },

  High: {
    // Display
    label: "High",
    labelVi: "Cao",
    description: "Cần xử lý sớm để đảm bảo an toàn",

    // Colors
    bgGradient: "from-orange-500 to-amber-500",
    bgSolid: "bg-orange-500",
    bgLight: "bg-orange-50",
    textColor: "text-orange-600",
    borderColor: "border-orange-200",
    shadowColor: "shadow-orange-500/25",

    // Badge
    badgeBg: "bg-orange-100",
    badgeText: "text-orange-700",
    badgeBorder: "border-orange-200",

    // Icon
    Icon: AlertCircle,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",

    // Importance
    importance: "Quan trọng - Nên xử lý sớm",
    importanceColor: "text-orange-600",
    priority: 2,
  },

  Medium: {
    // Display
    label: "Medium",
    labelVi: "Trung bình",
    description: "Nên xử lý trong thời gian tới",

    // Colors
    bgGradient: "from-amber-400 to-yellow-500",
    bgSolid: "bg-amber-500",
    bgLight: "bg-amber-50",
    textColor: "text-amber-600",
    borderColor: "border-amber-200",
    shadowColor: "shadow-amber-500/25",

    // Badge
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-700",
    badgeBorder: "border-amber-200",

    // Icon
    Icon: Clock,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",

    // Importance
    importance: "Trung bình - Lên kế hoạch xử lý",
    importanceColor: "text-amber-600",
    priority: 3,
  },

  Low: {
    // Display
    label: "Low",
    labelVi: "Thấp",
    description: "Có thể theo dõi và xử lý khi thuận tiện",

    // Colors
    bgGradient: "from-blue-400 to-cyan-500",
    bgSolid: "bg-blue-500",
    bgLight: "bg-blue-50",
    textColor: "text-blue-600",
    borderColor: "border-blue-200",
    shadowColor: "shadow-blue-500/25",

    // Badge
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-700",
    badgeBorder: "border-blue-200",

    // Icon
    Icon: Zap,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",

    // Importance
    importance: "Thấp - Theo dõi định kỳ",
    importanceColor: "text-blue-600",
    priority: 4,
  },

  Normal: {
    // Display
    label: "Normal",
    labelVi: "Bình thường",
    description: "Hoạt động bình thường, theo dõi định kỳ",

    // Colors
    bgGradient: "from-emerald-500 to-green-500",
    bgSolid: "bg-emerald-500",
    bgLight: "bg-emerald-50",
    textColor: "text-emerald-600",
    borderColor: "border-emerald-200",
    shadowColor: "shadow-emerald-500/25",

    // Badge
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-700",
    badgeBorder: "border-emerald-200",

    // Icon
    Icon: CheckCircle2,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",

    // Importance
    importance: "Bình thường - Theo dõi định kỳ",
    importanceColor: "text-emerald-600",
    priority: 5,
  },
};

/**
 * Get config by level string
 * Falls back to Normal if level is not recognized
 */
export function getReminderLevelConfig(level: string): ReminderLevelConfig {
  return REMINDER_LEVEL_CONFIG[level as ReminderLevel] || REMINDER_LEVEL_CONFIG.Normal;
}

/**
 * Get all levels sorted by priority (most urgent first)
 */
export function getReminderLevelsByPriority(): ReminderLevel[] {
  return (Object.keys(REMINDER_LEVEL_CONFIG) as ReminderLevel[]).sort(
    (a, b) => REMINDER_LEVEL_CONFIG[a].priority - REMINDER_LEVEL_CONFIG[b].priority
  );
}

/**
 * Check if level is urgent (Critical or High)
 */
export function isUrgentLevel(level: string): boolean {
  return level === "Critical" || level === "High";
}

/**
 * Get badge color classes for a level
 */
export function getLevelBadgeClasses(level: string): string {
  const config = getReminderLevelConfig(level);
  return `${config.badgeBg} ${config.badgeText} ${config.badgeBorder}`;
}

/**
 * Get icon component for a level
 */
export function getLevelIcon(level: string): LucideIcon {
  return getReminderLevelConfig(level).Icon;
}

export default REMINDER_LEVEL_CONFIG;
