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

import { MOCK_NOTIFICATIONS } from "@/lib/mock/notifications.mock";
import { getReminderLevelConfig } from "@/lib/config/reminderLevelConfig";
import type { Notification } from "@/lib/types";

// ─── Mock vehicle + reminder detail data ────────────────────
// In real app this comes from API based on reminderId/vehicleId

interface VehicleDetail {
  brandLogo: string;
  brandName: string;
  modelName: string;
  licensePlate: string;
  currentOdometer: number;
  targetOdometer: number;
  targetDate: string;
  percentageRemaining: number;
  partDescription: string;
}

const MOCK_VEHICLE_DETAILS: Record<string, VehicleDetail> = {
  "notif-1": {
    brandLogo: "🏍️",
    brandName: "Honda",
    modelName: "SH 150i",
    licensePlate: "59-P1 23456",
    currentOdometer: 14950,
    targetOdometer: 15000,
    targetDate: "2026-02-10",
    percentageRemaining: 8,
    partDescription:
      "Dầu nhớt động cơ giúp bôi trơn, giảm ma sát và tản nhiệt cho các bộ phận bên trong động cơ. Cần thay định kỳ để đảm bảo hiệu suất vận hành.",
  },
  "notif-2": {
    brandLogo: "🏍️",
    brandName: "Yamaha",
    modelName: "Exciter 155",
    licensePlate: "59-S2 78901",
    currentOdometer: 8500,
    targetOdometer: 10000,
    targetDate: "2026-03-15",
    percentageRemaining: 35,
    partDescription:
      "Lốp trước chịu trách nhiệm chính trong việc điều hướng và phanh. Lốp mòn giảm khả năng bám đường đặc biệt khi trời mưa.",
  },
  "notif-4": {
    brandLogo: "🏍️",
    brandName: "Honda",
    modelName: "SH 150i",
    licensePlate: "59-P1 23456",
    currentOdometer: 12000,
    targetOdometer: 15000,
    targetDate: "2026-04-20",
    percentageRemaining: 60,
    partDescription:
      "Bugi tạo tia lửa điện để đốt cháy hỗn hợp nhiên liệu trong xi-lanh. Bugi hỏng gây khó khởi động và tốn xăng.",
  },
};

// ─── Helpers ────────────────────────────────────────────────

function formatNumber(n: number): string {
  return n.toLocaleString("vi-VN");
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
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

  const notification = useMemo(
    () => MOCK_NOTIFICATIONS.find((n) => n.id === id) ?? null,
    [id]
  );

  const vehicleDetail = useMemo(
    () => MOCK_VEHICLE_DETAILS[id] ?? null,
    [id]
  );

  const levelConfig = useMemo(
    () =>
      notification?.level
        ? getReminderLevelConfig(notification.level)
        : null,
    [notification]
  );

  // Not found
  if (!notification || !vehicleDetail || !levelConfig) {
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

  const LevelIcon = levelConfig.Icon;

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
            {vehicleDetail.brandLogo}
          </div>
          <div className="flex-1">
            <p className="text-lg font-bold text-neutral-900">
              {vehicleDetail.brandName} {vehicleDetail.modelName}
            </p>
            <p className="text-xs text-neutral-400 font-medium">
              {vehicleDetail.licensePlate}
            </p>
          </div>
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
        </div>

        {/* Part name + description */}
        <p className="text-sm font-semibold text-neutral-800 mt-5">
          {notification.partName}
        </p>
        <p className="text-xs text-neutral-400 leading-relaxed mt-1">
          {vehicleDetail.partDescription}
        </p>

        {/* KM Progress */}
        <div className="mt-6">
          <KmProgressLine
            current={vehicleDetail.currentOdometer}
            target={vehicleDetail.targetOdometer}
            percent={vehicleDetail.percentageRemaining}
            color={levelConfig.hexColor}
          />
        </div>

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

        {/* Action Button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            if (notification.actionUrl) router.push(notification.actionUrl);
          }}
          className="w-full flex items-center justify-center gap-2 mt-8 py-3.5 rounded-2xl text-sm font-semibold text-white"
          style={{
            background: `linear-gradient(135deg, ${levelConfig.hexColor}, ${levelConfig.hexColor}cc)`,
          }}
        >
          Đặt lịch bảo dưỡng
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </motion.div>
    </div>
  );
}
