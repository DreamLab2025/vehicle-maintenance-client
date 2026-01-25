"use client";

import Header from "@/components/common/Header";
import React, { useState } from "react";
import {
  Bell,
  Wrench,
  Calendar,
  AlertTriangle,
  ChevronRight,
  Clock,
  MapPin,
  Droplets,
  Settings,
  Plus,
  Car,
  Gauge,
  Fuel,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { useUserVehicles } from "@/hooks/useUserVehice";
import BottomNav from "@/components/common/BottomNav";
import { useRouter } from "next/navigation";

// Mock data for vehicle maintenance
const MOCK_VEHICLE_ID = "019badfe-bbe9-7f52-88f7-90ecc92be494";

const vehicleDataMap = {
  [MOCK_VEHICLE_ID]: {
    reminders: [
      {
        id: 1,
        type: "urgent",
        title: "Thay dầu động cơ",
        description: "Đã quá hạn 200km",
        dueKm: "15,240 km",
        icon: Droplets,
      },
      {
        id: 2,
        type: "warning",
        title: "Kiểm tra lốp xe",
        description: "Còn 500km nữa",
        dueKm: "15,800 km",
        icon: Settings,
      },
      {
        id: 3,
        type: "scheduled",
        title: "Bảo dưỡng định kỳ",
        description: "Đặt lịch 20/01",
        dueKm: "20,000 km",
        icon: Calendar,
      },
    ],
    schedule: [
      {
        id: 1,
        date: "20",
        month: "Th1",
        time: "09:00",
        title: "Thay dầu động cơ",
        location: "Garage ABC - Quận 1",
        status: "confirmed",
      },
      {
        id: 2,
        date: "27",
        month: "Th1",
        time: "14:30",
        title: "Kiểm tra tổng quát",
        location: "Service Center XYZ",
        status: "pending",
      },
    ],
  },
};

export default function Page() {
  const { vehicles, isLoading } = useUserVehicles({
    PageNumber: 1,
    PageSize: 10,
  });
  const router = useRouter();

  const [currentVehicleIndex, setCurrentVehicleIndex] = useState(0);

  const totalSlots = vehicles.length + 1;
  const isAddVehicleCard = currentVehicleIndex === vehicles.length;
  const currentVehicle = isAddVehicleCard ? null : vehicles[currentVehicleIndex] || vehicles[0];

  const currentVehicleData = currentVehicle ? vehicleDataMap[currentVehicle.id as keyof typeof vehicleDataMap] : null;

  const maintenanceReminders = currentVehicleData?.reminders || [];
  const upcomingSchedule = currentVehicleData?.schedule || [];

  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold && currentVehicleIndex > 0) {
      setCurrentVehicleIndex(currentVehicleIndex - 1);
    } else if (info.offset.x < -swipeThreshold && currentVehicleIndex < totalSlots - 1) {
      setCurrentVehicleIndex(currentVehicleIndex + 1);
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <main className="min-h-dvh bg-neutral-50">
        <Header />
        <div className="px-5 pt-6 pb-32 space-y-6">
          <div className="h-[180px] rounded-[20px] bg-white animate-pulse" />
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 rounded-2xl bg-white animate-pulse" />
            ))}
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
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
                    className="bg-white rounded-[20px] p-6 flex flex-col items-center justify-center min-h-[180px] border-2 border-dashed border-neutral-200 cursor-pointer hover:border-red-300 hover:bg-red-50/30 transition-all"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mb-3 shadow-lg shadow-red-500/20">
                      <Plus className="h-7 w-7 text-white" />
                    </div>
                    <h2 className="text-base font-semibold text-neutral-900 mb-1">Thêm xe mới</h2>
                    <p className="text-[13px] text-neutral-500 text-center">Theo dõi bảo dưỡng xe của bạn</p>
                  </div>
                ) : (
                  // Vehicle Info Card
                  <div className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 rounded-[20px] p-5 text-white overflow-hidden relative">
                    {/* Subtle glow effect */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-500/20 rounded-full blur-3xl" />

                    {/* Header */}
                    <div className="flex items-start justify-between mb-4 relative">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                          <Car className="h-6 w-6 text-white/90" />
                        </div>
                        <div>
                          <h1 className="text-lg font-semibold leading-tight">
                            {currentVehicle?.userVehicleVariant.model.brandName || "Honda"}
                          </h1>
                          <p className="text-white/50 text-[13px]">
                            {currentVehicle?.userVehicleVariant.model.name || "City"}
                          </p>
                        </div>
                      </div>
                      <div className="px-3 py-1.5 rounded-lg bg-white/10 text-[13px] font-medium">
                        {currentVehicle?.licensePlate || "59A-12345"}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-2 relative">
                      <div className="flex-1 bg-white/5 rounded-xl p-3">
                        <div className="flex items-center gap-1.5 text-white/40 text-[11px] mb-1">
                          <Gauge className="h-3 w-3" />
                          Odometer
                        </div>
                        <p className="text-[17px] font-semibold">
                          {currentVehicle ? `${(currentVehicle.currentOdometer / 1000).toFixed(1)}k` : "15.2k"} km
                        </p>
                      </div>
                      <div className="flex-1 bg-white/5 rounded-xl p-3">
                        <div className="flex items-center gap-1.5 text-white/40 text-[11px] mb-1">
                          <Fuel className="h-3 w-3" />
                          TB/ngày
                        </div>
                        <p className="text-[17px] font-semibold">{currentVehicle?.averageKmPerDay || 45} km</p>
                      </div>
                      <button
                        onClick={() => router.push(`/vehicle/${currentVehicle?.id}`)}
                        className="h-full px-4 py-3 bg-red-500 hover:bg-red-600 rounded-xl flex items-center gap-1 transition-colors"
                      >
                        <span className="text-[13px] font-medium">Chi tiết</span>
                        <ChevronRight className="h-4 w-4" />
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

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-4 gap-3"
        >
          {[
            { icon: Calendar, label: "Đặt lịch", color: "from-red-500 to-red-600", shadow: "shadow-red-500/20" },
            {
              icon: Wrench,
              label: "Lịch sử",
              color: "from-neutral-700 to-neutral-800",
              shadow: "shadow-neutral-500/20",
            },
            {
              icon: MapPin,
              label: "Garage",
              color: "from-neutral-700 to-neutral-800",
              shadow: "shadow-neutral-500/20",
            },
            {
              icon: Bell,
              label: "Thông báo",
              color: "from-neutral-700 to-neutral-800",
              shadow: "shadow-neutral-500/20",
            },
          ].map((item, index) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + index * 0.03 }}
              className="bg-white rounded-2xl p-3 flex flex-col items-center gap-2 shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg ${item.shadow}`}
              >
                <item.icon className="h-5 w-5 text-white" />
              </div>
              <span className="text-[11px] font-medium text-neutral-600">{item.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Maintenance Reminders */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[15px] font-semibold text-neutral-900">Nhắc nhở bảo dưỡng</h2>
            <button className="text-red-500 text-[13px] font-medium">Xem tất cả</button>
          </div>

          {maintenanceReminders.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="h-6 w-6 text-neutral-400" />
              </div>
              <h3 className="font-semibold text-neutral-900 text-[15px] mb-1">Tuyệt vời!</h3>
              <p className="text-[13px] text-neutral-500">Xe của bạn đang trong tình trạng tốt</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {maintenanceReminders.map((reminder, index) => {
                const Icon = reminder.icon;
                const isUrgent = reminder.type === "urgent";
                const isWarning = reminder.type === "warning";

                return (
                  <motion.div
                    key={reminder.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.12 + index * 0.05 }}
                    className={`bg-white rounded-2xl p-4 flex items-center gap-3.5 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.98] ${
                      isUrgent ? "ring-1 ring-red-100" : ""
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isUrgent
                          ? "bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/25"
                          : isWarning
                            ? "bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/25"
                            : "bg-neutral-100"
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${isUrgent || isWarning ? "text-white" : "text-neutral-500"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-neutral-900 text-[14px]">{reminder.title}</h3>
                        {isUrgent && (
                          <span className="px-1.5 py-0.5 rounded bg-red-500 text-white text-[10px] font-bold uppercase">
                            Khẩn
                          </span>
                        )}
                      </div>
                      <p className="text-[13px] text-neutral-500 mt-0.5">{reminder.description}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-neutral-300 flex-shrink-0" />
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.section>

        {/* Upcoming Schedule */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[15px] font-semibold text-neutral-900">Lịch sắp tới</h2>
            <button className="text-red-500 text-[13px] font-medium">Xem tất cả</button>
          </div>

          {upcomingSchedule.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-3">
                <Calendar className="h-6 w-6 text-neutral-400" />
              </div>
              <h3 className="font-semibold text-neutral-900 text-[15px] mb-1">Chưa có lịch hẹn</h3>
              <p className="text-[13px] text-neutral-500">Đặt lịch bảo dưỡng cho xe của bạn</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              {upcomingSchedule.map((schedule, index) => (
                <motion.div
                  key={schedule.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.18 + index * 0.05 }}
                  className={`p-4 flex items-center gap-3.5 hover:bg-neutral-50 transition-colors cursor-pointer ${
                    index !== upcomingSchedule.length - 1 ? "border-b border-neutral-100" : ""
                  }`}
                >
                  {/* Date Badge */}
                  <div className="w-12 h-12 rounded-xl bg-red-50 flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-medium text-red-400 uppercase leading-none">
                      {schedule.month}
                    </span>
                    <span className="text-lg font-bold text-red-500 leading-tight">{schedule.date}</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-semibold text-neutral-900 text-[14px]">{schedule.title}</h3>
                      {schedule.status === "confirmed" ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-2.5 text-[12px] text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {schedule.time}
                      </span>
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        {schedule.location}
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="h-5 w-5 text-neutral-300 flex-shrink-0" />
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>

        {/* CTA Button */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-red-500/25 active:scale-[0.98] transition-all">
            <Plus className="h-5 w-5" />
            <span className="text-[15px]">Đặt lịch bảo dưỡng</span>
          </button>
        </motion.div>
      </div>

      <BottomNav />
    </main>
  );
}
