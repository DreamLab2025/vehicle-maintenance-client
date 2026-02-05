"use client";

import { motion } from "framer-motion";
import { TimelineListProps } from "./types";

const colorSchemes = {
  amber: {
    border: "border-amber-200",
    dot: "bg-amber-400",
    badge: "text-red-800 bg-amber-50",
  },
  red: {
    border: "border-red-200",
    dot: "bg-red-400",
    badge: "text-red-600 bg-red-50",
  },
};

export function TimelineList({ title, items, icon, colorScheme, count }: TimelineListProps) {
  const colors = colorSchemes[colorScheme];

  if (items.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="mb-4"
    >
      {/* Header */}
      <div className="flex place-items-center gap-2 mb-2">
        <div className="w-6 h-6 flex items-center">{icon}</div>
        <h4 className="text-[13px] font-semibold text-neutral-900">{title}</h4>
        <span className={`text-[10px] px-1.5 py-0.5 rounded ${colors.badge}`}>{count}</span>
      </div>

      {/* Timeline items */}
      <div className={`ml-3 border-l-2 ${colors.border} pl-4 space-y-2`}>
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.05 }}
            className="relative"
          >
            {/* Dot */}
            <div className={`absolute -left-[21px] top-1.5 w-2 h-2 rounded-full ${colors.dot}`} />
            <p className="text-[12px] text-neutral-600">{item}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
