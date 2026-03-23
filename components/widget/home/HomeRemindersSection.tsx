"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useUserVehicleReminders } from "@/hooks/useTrackingReminder";
import { BellDotIcon, Car, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import type { UserVehicle } from "@/lib/api/services/fetchUserVehicle";
import type { VehicleReminder } from "@/lib/api/services/fetchTrackingReminder";
import { getReminderLevelConfig } from "@/lib/config/reminderLevelConfig";
import { ReminderListSkeleton } from "@/components/ui/skeletons";
import { ReminderDetailSheet } from "@/components/widget/reminder/ReminderDetailSheet";

type HomeRemindersSectionProps = {
  currentVehicle: UserVehicle | null | undefined;
};

export function HomeRemindersSection({ currentVehicle }: HomeRemindersSectionProps) {
  const remindersEnabled = !!currentVehicle?.id;
  const { reminders, isLoading: isLoadingReminders } = useUserVehicleReminders(
    currentVehicle?.id || "",
    remindersEnabled,
  );
  const [selectedReminder, setSelectedReminder] = useState<VehicleReminder | null>(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setSelectedReminder(null);
  }, [currentVehicle?.id]);

  return (
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-[15px] font-semibold text-neutral-900">{"Nhắc nhở bảo dưỡng"}</h2>
          {reminders.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[11px] font-semibold">
              {reminders.length}
            </span>
          )}
        </div>
      </div>

      {!currentVehicle ? (
        <div className="bg-gradient-to-br from-neutral-50 to-slate-50 rounded-2xl p-6 text-center border border-neutral-200">
          <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-3">
            <Car className="h-6 w-6 text-neutral-400" />
          </div>
          <h3 className="font-semibold text-neutral-700 text-[14px] mb-1">{"Chưa có xe"}</h3>
          <p className="text-[12px] text-neutral-500">{"Vui lòng thêm xe để nhận nhắc nhở bảo dưỡng"}</p>
        </div>
      ) : isLoadingReminders ? (
        <ReminderListSkeleton count={2} />
      ) : reminders.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-3">
            <BellDotIcon className="h-6 w-6 text-neutral-400" />
          </div>
          <h3 className="font-semibold text-neutral-900 text-[15px] mb-1">{"Chưa có nhắc nhở"}</h3>
          <p className="text-[13px] text-neutral-500">{"Khai báo phụ tùng để nhận nhắc nhở bảo dưỡng"}</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {reminders.map((reminder, index) => {
            const levelConfig = getReminderLevelConfig(reminder.level);
            const LevelIcon = levelConfig.Icon;

            return (
              <motion.div
                key={reminder.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 + index * 0.05 }}
                onClick={() => setSelectedReminder(reminder)}
                className="bg-white rounded-2xl p-4 flex items-center gap-3.5 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.98]"
              >
                <div className="w-11 h-11 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {reminder.partCategory.iconUrl ? (
                    <Image
                      src={reminder.partCategory.iconUrl}
                      alt={reminder.partCategory.name}
                      width={28}
                      height={28}
                      className="object-contain"
                      unoptimized
                      key={`${reminder.id}-${reminder.partCategory.iconUrl}`}
                    />
                  ) : (
                    <LevelIcon className="h-5 w-5 text-neutral-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-neutral-900 text-[14px]">{reminder.partCategory.name}</h3>
                    <span
                      className="px-1.5 py-0.5 rounded text-[10px] font-semibold border"
                      style={{
                        backgroundColor: levelConfig.hexColorLight,
                        color: levelConfig.hexColor,
                        borderColor: levelConfig.hexBorderColor,
                      }}
                    >
                      {levelConfig.labelVi}
                    </span>
                  </div>
                  <p className="text-[13px] text-neutral-500 mt-0.5 line-clamp-1">
                    {reminder.partCategory.description}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-neutral-300 flex-shrink-0" />
              </motion.div>
            );
          })}
        </div>
      )}

      <ReminderDetailSheet reminder={selectedReminder} onClose={() => setSelectedReminder(null)} />
    </motion.section>
  );
}
