import { useMemo } from "react";
import type { VehicleReminder } from "@/lib/types";
import { getReminderLevelConfig } from "@/lib/config/reminderLevelConfig";

export function useReminderData(reminder: VehicleReminder | null) {
  const levelConfig = useMemo(
    () => (reminder ? getReminderLevelConfig(reminder.level) : null),
    [reminder]
  );

  const remainingKm = useMemo(
    () => (reminder ? reminder.targetOdometer - reminder.currentOdometer : 0),
    [reminder]
  );

  const remainingPercent = useMemo(
    () => (reminder ? Math.max(0, Math.min(100, reminder.percentageRemaining)) : 0),
    [reminder]
  );

  const daysRemaining = useMemo(() => {
    if (!reminder) return 0;
    const targetDate = new Date(reminder.targetDate);
    const today = new Date();
    return Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }, [reminder]);

  const identificationSigns = useMemo(
    () =>
      reminder
        ? reminder.partCategory.identificationSigns
            .split(";")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
    [reminder]
  );

  const consequences = useMemo(
    () =>
      reminder
        ? reminder.partCategory.consequencesIfNotHandled
            .split(";")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
    [reminder]
  );

  const statusText = useMemo(() => {
    if (remainingPercent >= 70) return "Tốt";
    if (remainingPercent >= 40) return "Cần chú ý";
    if (remainingPercent > 0) return "Sắp đến hạn";
    return "Cần bảo dưỡng";
  }, [remainingPercent]);

  return {
    levelConfig,
    remainingKm,
    remainingPercent,
    daysRemaining,
    identificationSigns,
    consequences,
    statusText,
  };
}
