"use client";

import Header from "@/components/common/Header";
import React, { useState } from "react";
import {
  ChevronRight,
  Plus,
  Gauge,
  Sparkles,
  MotorbikeIcon,
  ShieldCheckIcon,
  X,
  AlertTriangle,
  CheckCircle2,
  Car,
  ArrowLeft,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { useUserVehicles, useUserVehicleParts, useUserVehicleReminders } from "@/hooks/useUserVehice";
import BottomNav from "@/components/common/BottomNav";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { UserVehiclePart, VehicleReminder } from "@/lib/api/services/fetchUserVehicle";
import { getReminderLevelConfig } from "@/lib/config/reminderLevelConfig";

export default function Page() {
  const { vehicles, isLoading } = useUserVehicles({
    PageNumber: 1,
    PageSize: 10,
  });
  const router = useRouter();

  const [currentVehicleIndex, setCurrentVehicleIndex] = useState(0);
  const [selectedPart, setSelectedPart] = useState<UserVehiclePart | null>(null);
  const [selectedReminder, setSelectedReminder] = useState<VehicleReminder | null>(null);

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
        <div className="px-5 pt-6 pb-32 space-y-6">
          <div className="h-[200px] rounded-[20px] bg-white animate-pulse" />
          <div className="space-y-4">
            <div className="h-6 w-32 bg-white rounded animate-pulse" />
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square rounded-2xl bg-white animate-pulse" />
              ))}
            </div>
          </div>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 rounded-2xl bg-white animate-pulse" />
            ))}
          </div>
        </div>
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
                    <h2 className="text-base font-semibold text-neutral-900 mb-1">Thêm xe mới</h2>
                    <p className="text-[13px] text-neutral-500 text-center">Theo dõi bảo dưỡng xe của bạn</p>
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
                      <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 text-[13px] font-medium">
                        <ShieldCheckIcon className="h-5 w-5 text-green-500" />
                        <span className="text-[13px] font-medium">{currentVehicle?.licensePlate || "59A-12345"}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-2 pt-5 relative ">
                      <div className="flex-1 bg-white/5 rounded-xl p-3">
                        <div className="flex items-center gap-1.5 text-white/40 text-[11px] mb-1">
                          <Gauge className="h-3 w-3" />
                          Odometer
                        </div>
                        <p className="text-[17px] font-bold">
                          {currentVehicle ? `${(currentVehicle.currentOdometer / 1000).toFixed(1)}k` : "15.2k"} km
                        </p>
                      </div>
                      <div className="flex-1 bg-white/5 rounded-xl p-3">
                        <div className="flex items-center gap-1.5 text-white/40 text-[11px] mb-1">
                          <MotorbikeIcon className="h-3 w-3" />/ ngày
                        </div>
                        <p className="text-[17px] font-bold">{currentVehicle?.averageKmPerDay || 45} km</p>
                      </div>
                      <button
                        onClick={() => router.push(`/vehicle/${currentVehicle?.id}`)}
                        className="h-full px-4 py-3 bg-gradient-to-r from-[#a73f3f] to-[#fa230b] hover:opacity-90 rounded-xl flex items-center gap-1 transition-all"
                      >
                        <span className="text-[13px] font-medium text-white">Chi tiết</span>
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
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-[15px] font-semibold text-neutral-900">Chưa khai báo</h2>
              {undeclaredParts.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[11px] font-semibold">
                  {undeclaredParts.length}
                </span>
              )}
            </div>
          </div>

          {!currentVehicle ? (
            <div className="bg-gradient-to-br from-neutral-50 to-slate-50 rounded-2xl p-6 text-center border border-neutral-200">
              <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-3">
                <Car className="h-6 w-6 text-neutral-400" />
              </div>
              <h3 className="font-semibold text-neutral-700 text-[14px] mb-1">Chưa có xe</h3>
              <p className="text-[12px] text-neutral-500">Vui lòng thêm xe để quản lý phụ tùng</p>
            </div>
          ) : isLoadingParts ? (
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square rounded-2xl bg-white animate-pulse" />
              ))}
            </div>
          ) : undeclaredParts.length === 0 ? (
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 text-center border border-emerald-100">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
              </div>
              <h3 className="font-semibold text-emerald-800 text-[14px] mb-1">Hoàn tất!</h3>
              <p className="text-[12px] text-emerald-600">Tất cả phụ tùng đã được khai báo</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="grid grid-cols-4 gap-3">
                {undeclaredParts.map((part, index) => (
                  <motion.button
                    key={part.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.08 + index * 0.03 }}
                    onClick={() => handlePartClick(part)}
                    className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-neutral-50 transition-colors active:scale-95"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 flex items-center justify-center overflow-hidden">
                      {part.iconUrl ? (
                        <Image
                          src={part.iconUrl}
                          alt={part.partCategoryName}
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
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
        </motion.section>

        {/* Reminders - From API */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-[15px] font-semibold text-neutral-900">Nhắc nhở bảo dưỡng</h2>
              {reminders.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-semibold">
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
              <h3 className="font-semibold text-neutral-700 text-[14px] mb-1">Chưa có xe</h3>
              <p className="text-[12px] text-neutral-500">Vui lòng thêm xe để nhận nhắc nhở bảo dưỡng</p>
            </div>
          ) : isLoadingReminders ? (
            <div className="space-y-2.5">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-4 h-20 animate-pulse" />
              ))}
            </div>
          ) : reminders.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="h-6 w-6 text-neutral-400" />
              </div>
              <h3 className="font-semibold text-neutral-900 text-[15px] mb-1">Chưa có nhắc nhở</h3>
              <p className="text-[13px] text-neutral-500">Khai báo phụ tùng để nhận nhắc nhở bảo dưỡng</p>
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
                    {/* Icon with colored border instead of gradient background */}
                    <div
                      className={`w-11 h-11 rounded-xl border-2 ${levelConfig.borderColor} ${levelConfig.bgLight} flex items-center justify-center flex-shrink-0 overflow-hidden`}
                    >
                      {reminder.partCategory.iconUrl ? (
                        <Image
                          src={reminder.partCategory.iconUrl}
                          alt={reminder.partCategory.name}
                          width={28}
                          height={28}
                          className="object-contain"
                        />
                      ) : (
                        <LevelIcon className={`h-5 w-5 ${levelConfig.iconColor}`} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-neutral-900 text-[14px]">{reminder.partCategory.name}</h3>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${levelConfig.badgeBg} ${levelConfig.badgeText}`}
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
                  Chưa khai báo
                </span>

                {/* Description */}
                <p className="text-[14px] text-neutral-600 leading-relaxed mb-6">{selectedPart.description}</p>

                {/* Action Button */}
                <button
                  onClick={handleDeclare}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-red-500/25 active:scale-[0.98] transition-all"
                >
                  <Plus className="h-5 w-5" />
                  <span className="text-[15px]">Khai báo phụ tùng</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Reminder Detail Popup - Full Screen Redesigned */}
      <AnimatePresence>
        {selectedReminder && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-[70] bg-white overflow-y-auto"
          >
            {(() => {
              const levelConfig = getReminderLevelConfig(selectedReminder.level);
              const LevelIcon = levelConfig.Icon;

              // Calculate days remaining
              const targetDate = new Date(selectedReminder.targetDate);
              const today = new Date();
              const daysRemaining = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

              // percentageRemaining từ API = % còn lại đến mục tiêu
              // 100% = mới bảo dưỡng xong, 0% = đã đến lúc cần bảo dưỡng
              const remainingPercent = Math.max(0, Math.min(100, selectedReminder.percentageRemaining));

              // Parse identification signs into array
              const identificationSigns = selectedReminder.partCategory.identificationSigns
                .split(";")
                .map((s) => s.trim())
                .filter(Boolean);

              // Parse consequences into array
              const consequences = selectedReminder.partCategory.consequencesIfNotHandled
                .split(";")
                .map((s) => s.trim())
                .filter(Boolean);

              // Gradient colors based on level
              const gradientColors = {
                Normal: { start: "#10b981", end: "#34d399" },
                Low: { start: "#3b82f6", end: "#60a5fa" },
                Medium: { start: "#f59e0b", end: "#fbbf24" },
                High: { start: "#f97316", end: "#fb923c" },
                Critical: { start: "#ef4444", end: "#f87171" },
              };
              const colors = gradientColors[selectedReminder.level] || gradientColors.Normal;

              return (
                <div className="min-h-full bg-gradient-to-b from-neutral-50 to-white">
                  {/* Header - Clean & Minimal */}
                  <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-2xl">
                    <div className="px-5 py-4 flex items-center gap-4">
                      <button
                        onClick={() => setSelectedReminder(null)}
                        className="w-10 h-10 rounded-full bg-neutral-100/80 flex items-center justify-center hover:bg-neutral-200 transition-all active:scale-95"
                      >
                        <ArrowLeft className="h-5 w-5 text-neutral-600" />
                      </button>
                      <div className="flex-1 min-w-0">
                        <h1 className="text-[18px] font-bold text-neutral-900 truncate">
                          {selectedReminder.partCategory.name}
                        </h1>
                      </div>
                      <span
                        className={`px-3 py-1.5 rounded-full text-[11px] font-bold border ${levelConfig.badgeBg} ${levelConfig.badgeText} ${levelConfig.badgeBorder}`}
                      >
                        {levelConfig.labelVi}
                      </span>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="px-5 py-6">
                    {/* Hero Section - Progress Circle Left + Info Right */}
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-5 mb-8"
                    >
                      {/* Left - Circular Progress (Outside Card) */}
                      <div className="flex-shrink-0">
                        <div className={`relative w-[120px] h-[120px] bg-gradient-to-br ${levelConfig.bgGradient} rounded-[28px] p-3 shadow-xl ${levelConfig.shadowColor}`}>
                          {/* Decorative */}
                          <div className="absolute -top-3 -right-3 w-10 h-10 bg-white/20 rounded-full blur-sm" />

                          <div className="relative w-full h-full">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                              <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
                              <motion.circle
                                cx="50"
                                cy="50"
                                r="40"
                                fill="none"
                                stroke="white"
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={2 * Math.PI * 40}
                                initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                                animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - remainingPercent / 100) }}
                                transition={{ delay: 0.2, duration: 1.2, ease: "easeOut" }}
                              />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-[28px] font-bold text-white leading-none">{remainingPercent}</span>
                              <span className="text-[11px] text-white/70 font-semibold">%</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right - Info Card */}
                      <div className="flex-1 flex flex-col justify-between py-1">
                        {/* Status */}
                        <div>
                          <p className="text-neutral-400 text-[11px] uppercase tracking-widest font-semibold mb-1">Tình trạng</p>
                          <p className={`text-[20px] font-bold leading-tight ${levelConfig.textColor}`}>
                            {remainingPercent >= 70 ? "Tốt" : remainingPercent >= 40 ? "Cần chú ý" : remainingPercent > 0 ? "Sắp đến hạn" : "Cần bảo dưỡng ngay"}
                          </p>
                        </div>

                        {/* Time Badge */}
                        <div className="flex items-center gap-2 mt-3">
                          <div className={`flex items-center gap-1.5 ${levelConfig.bgLight} rounded-full px-3 py-1.5 border ${levelConfig.borderColor}`}>
                            <Clock className={`w-3.5 h-3.5 ${levelConfig.iconColor}`} />
                            <span className={`text-[12px] font-semibold ${levelConfig.textColor}`}>
                              {daysRemaining > 0 ? `Còn ${daysRemaining} ngày` : "Quá hạn"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Stats Cards Row */}
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="grid grid-cols-3 gap-3 mb-8"
                    >
                      <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100/80">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center">
                            <Gauge className="w-3.5 h-3.5 text-blue-500" />
                          </div>
                          <p className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wide">Hiện tại</p>
                        </div>
                        <p className="text-[17px] font-bold text-neutral-900">{selectedReminder.currentOdometer.toLocaleString()}</p>
                        <p className="text-[11px] text-neutral-400 mt-0.5">km</p>
                      </div>

                      <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100/80">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          </div>
                          <p className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wide">Mục tiêu</p>
                        </div>
                        <p className="text-[17px] font-bold text-neutral-900">{selectedReminder.targetOdometer.toLocaleString()}</p>
                        <p className="text-[11px] text-neutral-400 mt-0.5">km</p>
                      </div>

                      <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100/80">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-6 h-6 rounded-lg ${levelConfig.bgLight} flex items-center justify-center`}>
                            <ChevronRight className={`w-3.5 h-3.5 ${levelConfig.iconColor}`} />
                          </div>
                          <p className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wide">Còn lại</p>
                        </div>
                        <p className={`text-[17px] font-bold ${levelConfig.textColor}`}>
                          {Math.max(0, selectedReminder.targetOdometer - selectedReminder.currentOdometer).toLocaleString()}
                        </p>
                        <p className="text-[11px] text-neutral-400 mt-0.5">km</p>
                      </div>
                    </motion.div>

                    {/* Info Cards Section */}
                    <div className="space-y-4">
                      {/* Description Card */}
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100/80"
                      >
                        <h3 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Mô tả</h3>
                        <p className="text-[15px] text-neutral-600 leading-relaxed">
                          {selectedReminder.partCategory.description}
                        </p>
                      </motion.div>

                      {/* Identification Signs Card */}
                      {identificationSigns.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-2xl p-5 border border-amber-100/50"
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/25">
                              <AlertTriangle className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h3 className="text-[15px] font-bold text-amber-900">Dấu hiệu nhận biết</h3>
                              <p className="text-[11px] text-amber-600">{identificationSigns.length} dấu hiệu</p>
                            </div>
                          </div>
                          <div className="space-y-2.5 pl-1">
                            {identificationSigns.map((sign, index) => (
                              <div key={index} className="flex items-start gap-3">
                                <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <span className="text-[10px] font-bold text-amber-600">{index + 1}</span>
                                </div>
                                <p className="text-[14px] text-amber-900/80 leading-relaxed">{sign}</p>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Consequences Card */}
                      {consequences.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.25 }}
                          className="bg-gradient-to-br from-red-50 to-rose-50/50 rounded-2xl p-5 border border-red-100/50"
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center shadow-lg shadow-red-500/25">
                              <AlertTriangle className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h3 className="text-[15px] font-bold text-red-900">Hậu quả nếu không xử lý</h3>
                              <p className="text-[11px] text-red-600">{consequences.length} hậu quả</p>
                            </div>
                          </div>
                          <div className="space-y-2.5 pl-1">
                            {consequences.map((consequence, index) => (
                              <div key={index} className="flex items-start gap-3">
                                <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <span className="text-[10px] font-bold text-red-600">{index + 1}</span>
                                </div>
                                <p className="text-[14px] text-red-900/80 leading-relaxed">{consequence}</p>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Bottom Spacing */}
                    <div className="h-8" />
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </main>
  );
}
