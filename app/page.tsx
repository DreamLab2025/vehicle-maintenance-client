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
} from "lucide-react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { useUserVehicles, useUserVehicleParts } from "@/hooks/useUserVehice";
import BottomNav from "@/components/common/BottomNav";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { UserVehiclePart } from "@/lib/api/services/fetchUserVehicle";

export default function Page() {
  const { vehicles, isLoading } = useUserVehicles({
    PageNumber: 1,
    PageSize: 10,
  });
  const router = useRouter();

  const [currentVehicleIndex, setCurrentVehicleIndex] = useState(0);
  const [selectedPart, setSelectedPart] = useState<UserVehiclePart | null>(null);

  const totalSlots = vehicles.length + 1;
  const isAddVehicleCard = currentVehicleIndex === vehicles.length;
  const currentVehicle = isAddVehicleCard ? null : vehicles[currentVehicleIndex] || vehicles[0];

  // Fetch parts for the current user vehicle
  const { parts: vehicleParts, isLoading: isLoadingParts } = useUserVehicleParts(
    currentVehicle?.id || "",
    !!currentVehicle?.id && !isAddVehicleCard,
  );

  // Separate parts into declared and undeclared
  const undeclaredParts = vehicleParts.filter((part) => !part.isDeclared);
  const declaredParts = vehicleParts.filter((part) => part.isDeclared);

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

        {/* Declared Parts - Reminder List */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-[15px] font-semibold text-neutral-900">Nhắc nhở bảo dưỡng</h2>
              {declaredParts.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-semibold">
                  {declaredParts.length}
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
          ) : isLoadingParts ? (
            <div className="space-y-2.5">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-4 h-20 animate-pulse" />
              ))}
            </div>
          ) : declaredParts.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="h-6 w-6 text-neutral-400" />
              </div>
              <h3 className="font-semibold text-neutral-900 text-[15px] mb-1">Chưa có nhắc nhở</h3>
              <p className="text-[13px] text-neutral-500">Khai báo phụ tùng để nhận nhắc nhở bảo dưỡng</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {declaredParts.map((part, index) => (
                <motion.div
                  key={part.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.12 + index * 0.05 }}
                  onClick={() => {
                    if (currentVehicle?.id) {
                      router.push(`/vehicle/${currentVehicle.id}/parts/${part.partCategoryCode}`);
                    }
                  }}
                  className="bg-white rounded-2xl p-4 flex items-center gap-3.5 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.98]"
                >
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 shadow-lg shadow-emerald-500/25 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {part.iconUrl ? (
                      <Image
                        src={part.iconUrl}
                        alt={part.partCategoryName}
                        width={28}
                        height={28}
                        className="object-contain brightness-0 invert"
                      />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-neutral-900 text-[14px]">{part.partCategoryName}</h3>
                    <p className="text-[13px] text-neutral-500 mt-0.5 line-clamp-1">{part.description}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-neutral-300 flex-shrink-0" />
                </motion.div>
              ))}
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

      <BottomNav />
    </main>
  );
}
