"use client";

import { useRef } from "react";
import { motion, AnimatePresence, useDragControls, PanInfo } from "framer-motion";
import { AlertTriangle, Flame, ChevronRight } from "lucide-react";

import { ReminderDetailSheetProps } from "./types";
import { useReminderData } from "./hooks";
import { CircularProgress } from "./CircularProgress";
import { ReminderHeader } from "./ReminderHeader";
import { ReminderStats } from "./ReminderStats";
import { ProgressBar } from "./ProgressBar";
import { TimelineList } from "./TimelineList";
import { ChipList } from "./ChipList";

// Animation config
const SHEET_ANIMATION = {
  type: "spring" as const,
  damping: 30,
  stiffness: 300,
  mass: 0.8,
};

const DRAG_THRESHOLD = {
  offset: 80,
  velocity: 300,
};

export function ReminderDetailSheet({ reminder, onClose }: ReminderDetailSheetProps) {
  const dragControls = useDragControls();
  const sheetRef = useRef<HTMLDivElement>(null);

  const {
    levelConfig,
    remainingKm,
    remainingPercent,
    daysRemaining,
    identificationSigns,
    consequences,
    statusText,
  } = useReminderData(reminder);

  // Handle drag end - close if dragged down enough
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > DRAG_THRESHOLD.offset || info.velocity.y > DRAG_THRESHOLD.velocity) {
      onClose();
    }
  };

  const isOpen = reminder !== null && levelConfig !== null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            ref={sheetRef}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={SHEET_ANIMATION}
            drag="y"
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={handleDragEnd}
            className="fixed inset-x-0 bottom-0 z-[70] bg-white rounded-t-[24px] max-h-[90vh] overflow-hidden"
            style={{ touchAction: "none" }}
          >
            {/* Handle - Drag area */}
            <div
              className="pt-3 pb-2 cursor-grab active:cursor-grabbing"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <div className="w-10 h-1 bg-neutral-300 rounded-full mx-auto" />
            </div>

            {/* Scrollable Content */}
            <div className="max-h-[calc(90vh-70px)] overflow-y-auto px-4 pb-6">
              {/* Main Card */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-neutral-50 rounded-2xl p-4 mb-4"
              >
                {/* Top: Circle + Title + Status */}
                <div className="flex items-start gap-4 mb-4">
                  <CircularProgress
                    percent={remainingPercent}
                    color={levelConfig.hexColor}
                    colorLight={levelConfig.hexColorLight}
                  />
                  <ReminderHeader
                    name={reminder.partCategory.name}
                    status={statusText}
                    levelConfig={levelConfig}
                    daysRemaining={daysRemaining}
                  />
                </div>

                {/* Divider */}
                <div className="h-px bg-neutral-200 mb-4" />

                {/* Stats */}
                <ReminderStats
                  currentOdometer={reminder.currentOdometer}
                  targetOdometer={reminder.targetOdometer}
                  remainingKm={remainingKm}
                  levelConfig={levelConfig}
                />

                {/* Progress Bar */}
                <div className="mt-4">
                  <ProgressBar percent={remainingPercent} color={levelConfig.hexColor} />
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-4"
              >
                <p className="text-[13px] text-neutral-600 leading-relaxed">
                  {reminder.partCategory.description}
                </p>
              </motion.div>

              {/* Identification Signs - Timeline style */}
              <TimelineList
                title="Dấu hiệu nhận biết"
                items={identificationSigns}
                icon={<AlertTriangle className="w-6 h-6 text-amber-600" />}
                colorScheme="amber"
                count={identificationSigns.length}
              />

              {/* Consequences - Chip style */}
              <ChipList
                title="Hậu quả nếu không xử lý"
                items={consequences}
                icon={<Flame className="w-6 h-6 text-red-600" />}
                colorScheme="red"
                count={consequences.length}
              />

              {/* Action Button */}
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-neutral-900 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-1.5"
              >
                <span className="text-[14px]">Đặt lịch bảo dưỡng</span>
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ReminderDetailSheet;
