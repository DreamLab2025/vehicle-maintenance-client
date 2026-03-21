"use client";

import Header from "@/components/layout/Header";
import React, { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Plus,
  Gauge,
  MotorbikeIcon,
  X,
  AlertTriangle,
  CheckCircle2,
  Car,
  BellDotIcon,
} from "lucide-react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { useUserVehicles, useUserVehicleParts, useUserVehicleReminders } from "@/hooks/useUserVehice";
import BottomNav from "@/components/layout/BottomNav";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { UserVehiclePart, VehicleReminder } from "@/lib/api/services/fetchUserVehicle";
import { getReminderLevelConfig } from "@/lib/config/reminderLevelConfig";
import { ReminderDetailSheet } from "@/components/widget/reminder/ReminderDetailSheet";
import { useTranslation } from "react-i18next";
import { HomePageSkeleton, PartsGridSkeleton, ReminderListSkeleton } from "@/components/ui/skeletons";

export default function Page() {
  const { t } = useTranslation("home");
  const { vehicles, isLoading } = useUserVehicles({
    PageNumber: 1,
    PageSize: 10,
  });
  const router = useRouter();

  const [currentVehicleIndex, setCurrentVehicleIndex] = useState(0);
  const [selectedPart, setSelectedPart] = useState<UserVehiclePart | null>(null);
  const [selectedReminder, setSelectedReminder] = useState<VehicleReminder | null>(null);
  const [isUndeclaredPartsOpen, setIsUndeclaredPartsOpen] = useState(true);

  const totalSlots = vehicles.length + 1;
  const isAddVehicleCard = currentVehicleIndex === vehicles.length;
  const currentVehicle = isAddVehicleCard ? null : vehicles[currentVehicleIndex] || vehicles[0];

  // Fetch parts for the current user vehicle
  const { parts: vehicleParts, isLoading: isLoadingParts } = useUserVehicleParts(
    currentVehicle?.id || "",
    !!currentVehicle?.id && !isAddVehicleCard,
  );

  // Fetch reminders for the current user vehicle
  const { reminders, isLoading: isLoadingReminders } = useUserVehicleReminders(
    currentVehicle?.id || "",
    !!currentVehicle?.id && !isAddVehicleCard,
  );

  // Separate parts into declared and undeclared
  const undeclaredParts = vehicleParts.filter((part) => !part.isDeclared);

  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold && currentVehicleIndex > 0) {
      setCurrentVehicleIndex(currentVehicleIndex - 1);
    } else if (info.offset.x < -swipeThreshold && currentVehicleIndex < totalSlots - 1) {
      setCurrentVehicleIndex(currentVehicleIndex + 1);
    }
  };

  const handlePartClick = (part: UserVehiclePart) => {
    setSelectedPart(part);
  };

  const handleDeclare = () => {
    if (selectedPart && currentVehicle?.id) {
      router.push(`/vehicle/${currentVehicle.id}/parts/${selectedPart.partCategoryCode}`);
      setSelectedPart(null);
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <main className="min-h-dvh bg-neutral-50">
        <Header />
        <HomePageSkeleton />
        <BottomNav />
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-neutral-50">
      <Header />

      <div className="px-5 pt-6 pb-32 space-y-6">
        {/* Vehicle Card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative">
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragEnd={handleDragEnd}
            className="cursor-grab active:cursor-grabbing"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentVehicleIndex}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
              >
                {isAddVehicleCard ? (
                  // Add Vehicle Card
                  <div
                    onClick={() => router.push("/vehicle/add")}
                    className="bg-white rounded-[20px] p-6 flex flex-col items-center justify-center h-[200px] border-2 border-dashed border-neutral-200 cursor-pointer hover:border-red-300 hover:bg-red-50/30 transition-all"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mb-3 shadow-lg shadow-red-500/20">
                      <Plus className="h-7 w-7 text-white" />
                    </div>
                    <h2 className="text-base font-semibold text-neutral-900 mb-1">{t("addVehicle")}</h2>
                    <p className="text-[13px] text-neutral-500 text-center">{t("addVehicleDesc")}</p>
                  </div>
                ) : (
                  // Vehicle Info Card
                  <div
                    className="rounded-[20px] p-5 text-white overflow-hidden relative h-[200px] flex flex-col"
                    style={{
                      backgroundImage: `url('/images/Card_bg.png')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    {/* Subtle glow effect */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-500/20 rounded-full blur-3xl" />

                    {/* Header */}
                    <div className="flex items-start justify-between mb-4 relative">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-xl bg-white flex items-center justify-center overflow-hidden"
                          style={{
                            backgroundImage: `url('/images/logo_only.png')`,
                            backgroundSize: "70%",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                          }}
                        />
                        <div>
                          <h1 className="text-lg font-semibold leading-tight">
                            {currentVehicle?.userVehicleVariant.model.brandName}
                          </h1>
                          <p className="text-white/50 text-[13px] font-normal">
                            {currentVehicle?.userVehicleVariant.model.name || "City"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center rounded-lg bg-black backdrop-blur-xl border border-black overflow-hidden h-10">
                        <div className="flex-shrink-0 bg-black h-full flex items-center">
                          <Image
                            src="/images/VIE_rm_bg.png"
                            alt="VIE Badge"
                            width={50}
                            height={48}
                            className="object-contain h-full w-auto"
                            unoptimized
                          />
                        </div>
                        <div className="px-3 py-2 flex items-center bg-white h-full border border-white rounded-l-lg">
                          <span className="text-[20px] font-bold text-black leading-none">
                            {currentVehicle?.licensePlate || "59A-12345"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-2 pt-5 relative ">
                      <div className="flex-1 bg-white/5 rounded-xl p-3">
                        <div className="flex items-center gap-1.5 text-white/40 text-[11px] mb-1">
                          <Gauge className="h-3 w-3" />
                          {t("odometer")}
                        </div>
                        <p className="text-[17px] font-bold">
                          {currentVehicle ? `${(currentVehicle.currentOdometer.toLocaleString("vi-VN"))}` : "0"}
                        </p>
                      </div>
                      <div className="flex-1 bg-white/5 rounded-xl p-3">
                        <div className="flex items-center gap-1.5 text-white/40 text-[11px] mb-1">
                          <MotorbikeIcon className="h-3 w-3" /> {t("avgPerDay")}
                        </div>
                        <p className="text-[17px] font-bold">{currentVehicle?.averageKmPerDay || 45} km</p>
                      </div>
                      <button
                        onClick={() => router.push(`/vehicle/${currentVehicle?.id}`)}
                        className="h-full px-4 py-3 bg-gradient-to-r from-[#a73f3f] to-[#fa230b] hover:opacity-90 rounded-xl flex items-center gap-1 transition-all"
                      >
                        <span className="text-[13px] font-medium text-white">{t("detailButton")}</span>
                        <ChevronRight className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Pagination Dots */}
          {totalSlots > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-4">
              {Array.from({ length: totalSlots }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentVehicleIndex(index)}
                  className={`rounded-full transition-all duration-300 ${
                    index === currentVehicleIndex ? "w-5 h-1.5 bg-red-500" : "w-1.5 h-1.5 bg-neutral-300"
                  }`}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Undeclared Parts - Icon Grid */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <button
            onClick={() => setIsUndeclaredPartsOpen(!isUndeclaredPartsOpen)}
            className="flex items-center justify-between w-full mb-3 hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center gap-2">
              <h2 className="text-[15px] font-semibold text-neutral-900">{t("undeclaredParts")}</h2>
              {undeclaredParts.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[11px] font-semibold">
                  {undeclaredParts.length}
                </span>
              )}
            </div>
            {currentVehicle && undeclaredParts.length > 0 && (
              <motion.div
                animate={{ rotate: isUndeclaredPartsOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-4 w-4 text-neutral-500" />
              </motion.div>
            )}
          </button>

          <AnimatePresence>
            {isUndeclaredPartsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                {!currentVehicle ? (
            <div className="bg-gradient-to-br from-neutral-50 to-slate-50 rounded-2xl p-6 text-center border border-neutral-200">
              <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-3">
                <Car className="h-6 w-6 text-neutral-400" />
              </div>
              <h3 className="font-semibold text-neutral-700 text-[14px] mb-1">{t("noVehicle")}</h3>
              <p className="text-[12px] text-neutral-500">{t("noVehicleDesc")}</p>
            </div>
          ) : isLoadingParts ? (
            <PartsGridSkeleton count={4} />
          ) : undeclaredParts.length === 0 ? (
            <div className="bg-gradient-to-br from-white-50 to-green-50 rounded-2xl p-6 text-center border border-emerald-100">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="font-semibold text-green-800 text-[14px] mb-1">{t("allDeclared")}</h3>
              <p className="text-[12px] text-green-600">{t("allDeclaredDesc")}</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-3 shadow-sm">
              <div className="grid grid-cols-4 gap-2">
                {undeclaredParts.map((part, index) => (
                  <motion.button
                    key={part.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.08 + index * 0.03 }}
                    onClick={() => handlePartClick(part)}
                    className="flex flex-col items-center gap-1.5 p-1.5 rounded-xl hover:bg-neutral-50 transition-colors active:scale-95"
                  >
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-white-50 to-orange-50 border border-black/10 flex items-center justify-center overflow-hidden">
                      {part.iconUrl ? (
                        <Image
                          src={part.iconUrl}
                          alt={part.partCategoryName}
                          width={28}
                          height={28}
                          className="object-contain"
                          unoptimized
                          key={`${part.id}-${part.iconUrl}`}
                        />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                      )}
                    </div>
                    <span className="text-[10px] font-medium text-neutral-600 text-center leading-tight line-clamp-2">
                      {part.partCategoryName}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Reminders - From API */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-[15px] font-semibold text-neutral-900">{t("maintenanceReminders")}</h2>
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
              <h3 className="font-semibold text-neutral-700 text-[14px] mb-1">{t("noVehicleForReminders")}</h3>
              <p className="text-[12px] text-neutral-500">{t("noVehicleForRemindersDesc")}</p>
            </div>
          ) : isLoadingReminders ? (
            <ReminderListSkeleton count={2} />
          ) : reminders.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-3">
                <BellDotIcon className="h-6 w-6 text-neutral-400" />
              </div>
              <h3 className="font-semibold text-neutral-900 text-[15px] mb-1">{t("noRemindersTitle")}</h3>
              <p className="text-[13px] text-neutral-500">{t("noRemindersDesc2")}</p>
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
                    {/* Icon with neutral gray background - consistent across all levels */}
                    <div
                      className="w-11 h-11 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center flex-shrink-0 overflow-hidden"
                    >
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
                        <LevelIcon
                          className="h-5 w-5 text-neutral-600"
                        />
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
        </motion.section>
      </div>

      {/* Part Detail Popup */}
      <AnimatePresence>
        {selectedPart && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPart(null)}
              className="fixed inset-0 bg-black/50 z-[55]"
            />

            {/* Popup */}
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[60] bg-white rounded-t-3xl p-6 pb-10"
            >
              {/* Handle */}
              <div className="w-10 h-1 bg-neutral-200 rounded-full mx-auto mb-6" />

              {/* Close button */}
              <button
                onClick={() => setSelectedPart(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center"
              >
                <X className="h-4 w-4 text-neutral-500" />
              </button>

              {/* Content */}
              <div className="flex flex-col items-center text-center">
                {/* Icon */}
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-100 flex items-center justify-center mb-4 overflow-hidden">
                  {selectedPart.iconUrl ? (
                    <Image
                      src={selectedPart.iconUrl}
                      alt={selectedPart.partCategoryName}
                      width={48}
                      height={48}
                      className="object-contain"
                      unoptimized
                      key={`${selectedPart.id}-${selectedPart.iconUrl}`}
                    />
                  ) : (
                    <AlertTriangle className="h-10 w-10 text-amber-500" />
                  )}
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-neutral-900 mb-2">{selectedPart.partCategoryName}</h2>

                {/* Badge */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[12px] font-semibold mb-4">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {t("notDeclared")}
                </span>

                {/* Description */}
                <p className="text-[14px] text-neutral-600 leading-relaxed mb-6">{selectedPart.description}</p>

                {/* Action Button */}
                <button
                  onClick={handleDeclare}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-red-500/25 active:scale-[0.98] transition-all"
                >
                  <Plus className="h-5 w-5" />
                  <span className="text-[15px]">{t("declarePart")}</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Reminder Detail Sheet - shadcn style */}
      <ReminderDetailSheet
        reminder={selectedReminder}
        onClose={() => setSelectedReminder(null)}
      />

      <BottomNav />
    </main>
  );
}
