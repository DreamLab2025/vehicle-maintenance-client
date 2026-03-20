"use client";

import { motion } from "framer-motion";
import { ProgressBarProps } from "./types";

export function ProgressBar({ percent, color }: ProgressBarProps) {
  return (
    <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="h-full rounded-full"
        style={{ background: color }}
      />
    </div>
  );
}
