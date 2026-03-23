"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Car, Gauge, MotorbikeIcon, Check } from "lucide-react";
import type { UserVehicle } from "@/lib/api/services/fetchUserVehicle";

interface VehicleSelectionProps {
  vehicles: UserVehicle[];
  selectedVehicleId: string | null;
  isLoading: boolean;
  onSelect: (vehicleId: string) => void;
}

export function VehicleSelection({
  vehicles,
  selectedVehicleId,
  isLoading,
  onSelect,
}: VehicleSelectionProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-40 rounded-xl bg-neutral-100 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="p-6 rounded-xl bg-neutral-50 border border-neutral-200 text-center">
        <p className="text-sm text-neutral-600">Chưa có xe nào. Vui lòng thêm xe trước.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3">
      {vehicles.map((vehicle) => {
        const isSelected = selectedVehicleId === vehicle.id;
        return (
          <motion.button
            key={vehicle.id}
            type="button"
            onClick={() => onSelect(vehicle.id)}
            whileTap={{ scale: 0.98 }}
            className={`relative rounded-xl overflow-hidden text-left transition-all ${
              isSelected ? "ring-2 ring-red-500 ring-offset-2" : "hover:shadow-md"
            }`}
            style={{
              backgroundImage: `url('/images/Card_bg.png')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            {/* Subtle glow effect */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-500/20 rounded-full blur-3xl" />

            <div className="p-5 text-white relative">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
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
                    <h3 className="text-lg font-semibold leading-tight">
                      {vehicle.userVehicleVariant?.model?.brandName || "Xe"}
                    </h3>
                    <p className="text-white/50 text-[13px] font-normal">
                      {vehicle.userVehicleVariant?.model?.name || ""}
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
                      {vehicle.licensePlate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white/5 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-white/40 text-[11px] mb-1">
                    <Gauge className="h-3 w-3" />
                    Số km hiện tại
                  </div>
                  <p className="text-[17px] font-bold">
                    {vehicle.currentOdometer.toLocaleString("vi-VN")}
                  </p>
                </div>
                {vehicle.averageKmPerDay > 0 && (
                  <div className="flex-1 bg-white/5 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-white/40 text-[11px] mb-1">
                      <MotorbikeIcon className="h-3 w-3" />
                      Trung bình
                    </div>
                    <p className="text-[17px] font-bold">{vehicle.averageKmPerDay} km/ngày</p>
                  </div>
                )}
              </div>

              {/* Selected indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-white" />
                </motion.div>
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
