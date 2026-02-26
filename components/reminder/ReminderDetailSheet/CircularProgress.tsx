"use client";

import { motion } from "framer-motion";
import { CircularProgressProps } from "./types";

const RADIUS = 40;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Hàm parse percent - làm tròn xuống số nguyên
const parsePercent = (percent: number): number => {
  return Math.floor(percent);
};

export function CircularProgress({
  percent,
  color,
  colorLight,
  size = 72,
  strokeWidth = 8,
}: CircularProgressProps) {
  const displayPercent = parsePercent(percent);
  
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          stroke={colorLight}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          initial={{ strokeDashoffset: CIRCUMFERENCE }}
          animate={{ strokeDashoffset: CIRCUMFERENCE * (1 - percent / 100) }}
          transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-base font-bold" style={{ color }}>
          {displayPercent}
        </span>
        <span className="text-sm font-semibold" style={{ color }}>
          %
        </span>
      </div>
    </div>
  );
}