"use client";

import { Gauge, Target, TrendingDown } from "lucide-react";
import { ReminderLevelConfig } from "@/lib/config/reminderLevelConfig";

interface StatRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color?: string;
}
export interface ReminderStatsProps {
  currentOdometer: number;
  targetOdometer: number;
  remainingKm: number;
  levelConfig: ReminderLevelConfig;
}

function StatRow({ icon, label, value, color }: StatRowProps) {
  return (
    <div className="flex items-center justify-between mb-3 last:mb-0">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-[12px] text-neutral-500">{label}</span>
      </div>
      <span className="text-[14px] font-semibold" style={{ color: color || "#171717" }}>
        {value}
      </span>
    </div>
  );
}

export function ReminderStats({ currentOdometer, targetOdometer, remainingKm, levelConfig }: ReminderStatsProps) {
  const formatKm = (km: number) => `${km.toLocaleString()} km`;

  // Determine label and value based on remainingKm
  const isOverdue = remainingKm < 0;
  const remainingLabel = isOverdue ? "Vượt quá" : "Còn lại";
  const remainingValue = isOverdue ? Math.abs(remainingKm) : remainingKm;

  return (
    <div>
      <StatRow
        icon={<Gauge className="w-4 h-4 text-neutral-400" />}
        label="Hiện tại"
        value={formatKm(currentOdometer)}
      />
      <StatRow
        icon={<Target className="w-4 h-4 text-neutral-400" />}
        label="Mục tiêu"
        value={formatKm(targetOdometer)}
      />
      <StatRow
        icon={<TrendingDown className="w-4 h-4" style={{ color: levelConfig.hexColor }} />}
        label={remainingLabel}
        value={formatKm(remainingValue)}
        color={levelConfig.hexColor}
      />
    </div>
  );
}
