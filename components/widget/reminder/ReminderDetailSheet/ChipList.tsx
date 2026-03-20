"use client";

import { motion } from "framer-motion";
import { ChipListProps } from "./types";

const colorSchemes = {
  amber: {
    chip: "bg-amber-50 border-amber-100 text-amber-700",
    number: "bg-amber-100 text-amber-600",
    badge: "text-amber-600 bg-amber-50",
  },
  red: {
    chip: "bg-red-50 border-red-100 text-red-700",
    number: "bg-red-100 text-red-600",
    badge: "text-red-600 bg-red-50",
  },
};

export function ChipList({ title, items, icon, colorScheme, count }: ChipListProps) {
  const colors = colorSchemes[colorScheme];

  if (items.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-4"
    >
      {/* Header */}
      <div className="flex place-items-center gap-2 mb-2">
        <div className="w-6 h-6 flex items-center justify-center">{icon}</div>
        <h4 className="text-[13px] font-semibold text-neutral-900">{title}</h4>
        <span className={`text-[10px] px-1.5 py-0.5 rounded ${colors.badge}`}>{count}</span>
      </div>

      {/* Chips */}
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 + index * 0.05 }}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 border rounded-lg text-[11px] ${colors.chip}`}
          >
            <span
              className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${colors.number}`}
            >
              {index + 1}
            </span>
            {item}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}
