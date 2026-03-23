"use client";

import Image from "next/image";
import { AlertTriangle, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { UserVehiclePart } from "@/lib/api/services/fetchUserVehicle";

type UndeclaredPartBottomSheetProps = {
  part: UserVehiclePart | null;
  onClose: () => void;
  onDeclare: () => void;
};

export function UndeclaredPartBottomSheet({ part, onClose, onDeclare }: UndeclaredPartBottomSheetProps) {
  return (
    <AnimatePresence>
      {part && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[55]"
          />

          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[60] bg-white rounded-t-3xl p-6 pb-10"
          >
            <div className="w-10 h-1 bg-neutral-200 rounded-full mx-auto mb-6" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center"
            >
              <X className="h-4 w-4 text-neutral-500" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-100 flex items-center justify-center mb-4 overflow-hidden">
                {part.iconUrl ? (
                  <Image
                    src={part.iconUrl}
                    alt={part.partCategoryName}
                    width={48}
                    height={48}
                    className="object-contain"
                    unoptimized
                    key={`${part.id}-${part.iconUrl}`}
                  />
                ) : (
                  <AlertTriangle className="h-10 w-10 text-amber-500" />
                )}
              </div>

              <h2 className="text-xl font-bold text-neutral-900 mb-2">{part.partCategoryName}</h2>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[12px] font-semibold mb-4">
                <AlertTriangle className="w-3.5 h-3.5" />
                {"Chưa khai báo"}
              </span>

              <p className="text-[14px] text-neutral-600 leading-relaxed mb-6">{part.description}</p>

              <button
                onClick={onDeclare}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-red-500/25 active:scale-[0.98] transition-all"
              >
                <Plus className="h-5 w-5" />
                <span className="text-[15px]">{"Khai báo phụ tùng"}</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
