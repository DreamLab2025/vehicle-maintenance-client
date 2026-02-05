"use client";

import { Calendar } from "lucide-react";
import { ReminderHeaderProps } from "./types";

export function ReminderHeader({ name, status, levelConfig, daysRemaining }: ReminderHeaderProps) {
  const timeText = daysRemaining > 0 ? `Còn ${daysRemaining} ngày` : "Đã quá hạn";

  return (
    <div className="flex-1 pt-1">
      {/* Part name */}
      <h2 className="text-[16px] font-semibold text-neutral-900 mb-0.5">{name}</h2>

      {/* Status */}
      <p className="text-lg font-bold mb-1" style={{ color: levelConfig.hexColor }}>
        {status}
      </p>

      {/* Badge + Time */}
      <div className="flex items-center gap-2">
        <span
          className="text-[10px] font-medium px-1.5 py-0.5 rounded"
          style={{
            background: levelConfig.hexColorLight,
            color: levelConfig.hexColor,
          }}
        >
          {levelConfig.labelVi}
        </span>
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3 text-neutral-400" />
          <span className="text-[11px] text-neutral-500">{timeText}</span>
        </div>
      </div>
    </div>
  );
}
