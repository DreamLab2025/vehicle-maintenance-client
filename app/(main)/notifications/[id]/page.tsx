"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Gauge,
  Calendar,
  MapPin,
} from "lucide-react";

import { getReminderLevelConfig } from "@/lib/config/reminderLevelConfig";
import { useNotificationById } from "@/hooks/useNotification";
import { useUserVehicles } from "@/hooks/useUserVehice";


// ─── Helpers ────────────────────────────────────────────────

function formatNumber(n: number): string {
  return n.toLocaleString("vi-VN");
}

function formatDate(dateString: string): string {
  if (!dateString || dateString.trim() === "") {
    return "Chưa có dữ liệu";
  }
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Chưa có dữ liệu";
    }
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "Chưa có dữ liệu";
  }
}

// ─── KM Progress Line ───────────────────────────────────────

function KmProgressLine({
  current,
  target,
  percent,
  color,
}: {
  current: number;
  target: number;
  percent: number;
  color: string;
}) {
  const used = 100 - percent;

  return (
    <div className="w-full">
      {/* Labels */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-neutral-400 font-medium">0 km</span>
        <span className="text-xs font-semibold" style={{ color }}>
          {formatNumber(current)} km
        </span>
        <span className="text-xs text-neutral-400 font-medium">
          {formatNumber(target)} km
        </span>
      </div>

      {/* Track */}
      <div className="relative h-3">
        {/* Background */}
        <div className="absolute inset-0 bg-neutral-100 rounded-full" />
        {/* Fill */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${used}%` }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}40, ${color})` }}
        />
        {/* Dot */}
        <motion.div
          initial={{ left: "0%" }}
          animate={{ left: `${used}%` }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-[2.5px] border-white shadow-md z-10"
          style={{ backgroundColor: color }}
        />
      </div>

      {/* Sub label */}
      <div className="flex items-center justify-between mt-1.5">
        <span className="text-xs text-neutral-400">Đã đi</span>
        <span className="text-xs font-semibold" style={{ color }}>
          Còn {formatNumber(target - current)} km
        </span>
      </div>
    </div>
  );
}


// ─── Main Page ──────────────────────────────────────────────

export default function NotificationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // Fetch notification detail from API
  const { notification, detail, metadata, isLoading } = useNotificationById(id);

  const levelConfig = useMemo(
    () =>
      notification?.level
        ? getReminderLevelConfig(notification.level)
        : null,
    [notification]
  );

  // Extract vehicle info from metadata (for OdometerReminder)
  const vehicleInfoFromMetadata = useMemo(() => {
    if (metadata && "vehicles" in metadata && Array.isArray(metadata.vehicles) && metadata.vehicles.length > 0) {
      const vehicle = metadata.vehicles[0];
      return {
        licensePlate: vehicle.licensePlate,
        vehicleDisplayName: vehicle.vehicleDisplayName,
        currentOdometer: vehicle.currentOdometer,
        daysSinceUpdate: vehicle.daysSinceUpdate,
        lastOdometerUpdateFormatted: vehicle.lastOdometerUpdateFormatted,
        userVehicleId: vehicle.userVehicleId,
      };
    }
    return null;
  }, [metadata]);

  // Extract MaintenanceReminder info from metadata
  const maintenanceReminderInfo = useMemo(() => {
    if (metadata && "items" in metadata && Array.isArray(metadata.items) && metadata.items.length > 0) {
      const item = metadata.items[0];
      return {
        reminderId: item.reminderId,
        userVehicleId: item.userVehicleId,
        targetOdometer: item.targetOdometer,
        currentOdometer: item.currentOdometer,
        initialOdometer: item.initialOdometer,
        partCategoryName: item.partCategoryName,
        vehicleDisplayName: item.vehicleDisplayName,
        percentageRemaining: item.percentageRemaining,
        estimatedNextReplacementDate: item.estimatedNextReplacementDate,
      };
    }
    return null;
  }, [metadata]);

  // Determine reminder types
  const isMaintenanceReminder = detail?.entityType === "MaintenanceReminder";
  const isOdometerReminder = detail?.entityType === "OdometerReminder";
  const userVehicleId = maintenanceReminderInfo?.userVehicleId || vehicleInfoFromMetadata?.userVehicleId || notification?.userVehicleId;
  
  // Fetch vehicle detail to get brand/model name and current odometer
  const { vehicles } = useUserVehicles(
    { PageNumber: 1, PageSize: 100 },
    (isMaintenanceReminder || isOdometerReminder) && !!userVehicleId
  );

  // Find vehicle from API if metadata doesn't have it
  const vehicleFromApi = useMemo(() => {
    const odometerUserVehicleId = vehicleInfoFromMetadata?.userVehicleId || notification?.userVehicleId;
    if (odometerUserVehicleId && vehicles.length > 0) {
      return vehicles.find((v) => v.id === odometerUserVehicleId) || null;
    }
    return null;
  }, [vehicleInfoFromMetadata?.userVehicleId, notification?.userVehicleId, vehicles]);

  // Combine vehicle info: prefer metadata, fallback to API
  const vehicleInfo = useMemo(() => {
    if (vehicleInfoFromMetadata) {
      return vehicleInfoFromMetadata;
    }
    // Fallback to API data
    if (vehicleFromApi) {
      return {
        licensePlate: vehicleFromApi.licensePlate,
        vehicleDisplayName: `${vehicleFromApi.userVehicleVariant?.model?.brandName || ""} ${vehicleFromApi.userVehicleVariant?.model?.name || ""}`.trim() || vehicleFromApi.nickname,
        currentOdometer: vehicleFromApi.currentOdometer,
        daysSinceUpdate: 0, // Not available from API
        lastOdometerUpdateFormatted: vehicleFromApi.lastOdometerUpdateAt ? new Date(vehicleFromApi.lastOdometerUpdateAt).toLocaleDateString("vi-VN") : "",
        userVehicleId: vehicleFromApi.id,
      };
    }
    return null;
  }, [vehicleInfoFromMetadata, vehicleFromApi]);

  // Find vehicle by userVehicleId
  const vehicle = useMemo(() => {
    if (userVehicleId && vehicles.length > 0) {
      return vehicles.find((v) => v.id === userVehicleId) || null;
    }
    return null;
  }, [userVehicleId, vehicles]);

  // Prepare vehicle detail data for UI - Map from API response
  const vehicleDetail = useMemo(() => {
    if (!notification) return null;

    // For MaintenanceReminder: use metadata.items directly
    if (isMaintenanceReminder && maintenanceReminderInfo) {
      // Use vehicle detail if available, otherwise use vehicleDisplayName
      const licensePlate = vehicle?.licensePlate || maintenanceReminderInfo.vehicleDisplayName || "";
      const brandName = vehicle?.userVehicleVariant?.model?.brandName || "Xe";
      const modelName = vehicle?.userVehicleVariant?.model?.name || "";
      
      return {
        brandLogo: "🏍️",
        brandName,
        modelName,
        licensePlate,
        currentOdometer: maintenanceReminderInfo.currentOdometer,
        targetOdometer: maintenanceReminderInfo.targetOdometer,
        targetDate: maintenanceReminderInfo.estimatedNextReplacementDate || "",
        percentageRemaining: maintenanceReminderInfo.percentageRemaining,
        partDescription: "", // Not in metadata
        partName: maintenanceReminderInfo.partCategoryName || notification.partName || "",
      };
    }
    
    return null;
  }, [notification, isMaintenanceReminder, maintenanceReminderInfo, vehicle]);

  const LevelIcon = levelConfig?.Icon;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex flex-col items-center justify-center px-6">
        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-base font-medium text-neutral-500">Đang tải...</p>
      </div>
    );
  }

  // Not found
  if (!notification || !detail) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex flex-col items-center justify-center px-6">
        <p className="text-base font-medium text-neutral-500 mb-4">
          Không tìm thấy thông báo
        </p>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 rounded-xl bg-neutral-900 text-white text-sm font-medium"
        >
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] pb-28">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-[#f5f5f7]/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-5 h-14">
          <motion.button
            type="button"
            onClick={() => router.back()}
            whileTap={{ scale: 0.9 }}
            className="w-9 h-9 rounded-full bg-white/80 shadow-sm flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-neutral-700" />
          </motion.button>
          <h1 className="text-base font-bold text-neutral-900">
            Chi tiết thông báo
          </h1>
          <div className="w-9" />
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        className="px-6 pt-4"
      >
        {/* Vehicle row */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-sm">
            {vehicleDetail?.brandLogo || "🏍️"}
          </div>
          <div className="flex-1">
            <p className="text-lg font-bold text-neutral-900">
              {vehicleDetail
                ? `${vehicleDetail.brandName} ${vehicleDetail.modelName}`
                : vehicleInfo?.vehicleDisplayName || notification.vehicleName || "Xe của bạn"}
            </p>
            <p className="text-xs text-neutral-400 font-medium">
              {vehicleDetail?.licensePlate || vehicleInfo?.licensePlate || ""}
            </p>
          </div>
          {levelConfig && LevelIcon && (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold"
              style={{
                backgroundColor: levelConfig.hexColorLight,
                color: levelConfig.hexColor,
              }}
            >
              <LevelIcon className="w-3 h-3" />
              {levelConfig.labelVi}
            </span>
          )}
        </div>

        {/* Notification message - Always show */}
        <div className="mt-5">
          <p className="text-sm font-semibold text-neutral-800 mb-2">
            {notification.title}
          </p>
          <p className="text-xs text-neutral-400 leading-relaxed">
            {notification.message}
          </p>
        </div>

        {/* Part name + description (for MaintenanceReminder) */}
        {vehicleDetail && (
          <>
            <p className="text-sm font-semibold text-neutral-800 mt-5">
              {vehicleDetail.partName}
            </p>
            {vehicleDetail.partDescription && (
              <p className="text-xs text-neutral-400 leading-relaxed mt-1">
                {vehicleDetail.partDescription}
              </p>
            )}

            {/* KM Progress */}
            {levelConfig && (
              <div className="mt-6">
                <KmProgressLine
                  current={vehicleDetail.currentOdometer}
                  target={vehicleDetail.targetOdometer}
                  percent={vehicleDetail.percentageRemaining}
                  color={levelConfig.hexColor}
                />
              </div>
            )}

            {/* Stats inline */}
            <div className="flex items-center justify-between mt-6 gap-2">
              <div className="flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-neutral-400" />
                <span className="text-xs text-neutral-500">
                  <span className="font-semibold text-neutral-800">{formatNumber(vehicleDetail.currentOdometer)}</span> km
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                <span className="text-xs text-neutral-500">
                  <span className="font-semibold text-neutral-800">{formatNumber(vehicleDetail.targetOdometer)}</span> km
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                <span className="text-xs font-semibold text-neutral-800">
                  {formatDate(vehicleDetail.targetDate)}
                </span>
              </div>
            </div>

            {/* Action Button - MaintenanceReminder stays on detail page */}
            {levelConfig && (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  // MaintenanceReminder: already on detail page, can add more actions if needed
                  // For now, just show button (can navigate to reminder detail later)
                }}
                className="w-full flex items-center justify-center gap-2 mt-8 py-3.5 rounded-2xl text-sm font-semibold text-white"
                style={{
                  background: `linear-gradient(135deg, ${levelConfig.hexColor}, ${levelConfig.hexColor}cc)`,
                }}
              >
                Đặt lịch bảo dưỡng
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            )}
          </>
        )}

        {/* Odometer Reminder specific info */}
        {isOdometerReminder && vehicleInfo && !vehicleDetail && (
          <>
            {/* Current Odometer Display - Prominent */}
            <div className="mt-6 px-4 py-3 rounded-xl bg-blue-50 border border-blue-100">
              <div className="flex items-center justify-between">
                <span className="text-xs text-blue-600 font-medium">Số km hiện tại</span>
                <span className="text-sm font-bold text-blue-700">
                  {formatNumber(vehicleInfo.currentOdometer)} km
                </span>
              </div>
            </div>

            {/* Additional info */}
            <div className="mt-4 bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-500">Chưa cập nhật</span>
                <span className="text-sm font-semibold text-orange-600">
                  {vehicleInfo.daysSinceUpdate} ngày
                </span>
              </div>
              {vehicleInfo.lastOdometerUpdateFormatted && (
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
                  <span className="text-xs text-neutral-500">Lần cập nhật cuối</span>
                  <span className="text-xs font-medium text-neutral-600">
                    {vehicleInfo.lastOdometerUpdateFormatted}
                  </span>
                </div>
              )}
            </div>

            {/* Action Button for Odometer Update */}
            {vehicleInfo?.userVehicleId && (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push(`/odometer/${vehicleInfo.userVehicleId}`)}
                className="w-full flex items-center justify-center gap-2 mt-6 py-3.5 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600"
              >
                Cập nhật số km
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            )}
          </>
        )}

        {/* Fallback: Show basic info if no specific detail available */}
        {!vehicleDetail && !isOdometerReminder && (
          <>
            {notification.partName && (
              <p className="text-sm font-semibold text-neutral-800 mt-5">
                {notification.partName}
              </p>
            )}

            {/* Action Button - Fallback */}
            {levelConfig && (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  // Already on detail page, can add more actions if needed
                }}
                className="w-full flex items-center justify-center gap-2 mt-8 py-3.5 rounded-2xl text-sm font-semibold text-white"
                style={{
                  background: `linear-gradient(135deg, ${levelConfig.hexColor}, ${levelConfig.hexColor}cc)`,
                }}
              >
                Xem chi tiết
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}
