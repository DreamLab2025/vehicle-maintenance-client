"use client";

import Image from "next/image";
import { useCallback, type Dispatch, type SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Gauge, MotorbikeIcon, Plus } from "lucide-react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import type { UserVehicle } from "@/lib/api/services/fetchUserVehicle";

type HomeVehicleCarouselProps = {
  currentVehicleIndex: number;
  onSelectIndex: Dispatch<SetStateAction<number>>;
  totalSlots: number;
  isAddVehicleCard: boolean;
  currentVehicle: UserVehicle | null | undefined;
};

export function HomeVehicleCarousel({
  currentVehicleIndex,
  onSelectIndex,
  totalSlots,
  isAddVehicleCard,
  currentVehicle,
}: HomeVehicleCarouselProps) {
  const router = useRouter();

  const handleDragEnd = useCallback(
    (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const swipeThreshold = 50;
      onSelectIndex((idx) => {
        if (info.offset.x > swipeThreshold && idx > 0) return idx - 1;
        if (info.offset.x < -swipeThreshold && idx < totalSlots - 1) return idx + 1;
        return idx;
      });
    },
    [onSelectIndex, totalSlots],
  );

  return (
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
              <div
                onClick={() => router.push("/vehicle/add")}
                className="bg-white rounded-[20px] p-6 flex flex-col items-center justify-center h-[200px] border-2 border-dashed border-neutral-200 cursor-pointer hover:border-red-300 hover:bg-red-50/30 transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mb-3 shadow-lg shadow-red-500/20">
                  <Plus className="h-7 w-7 text-white" />
                </div>
                <h2 className="text-base font-semibold text-neutral-900 mb-1">{"Thêm xe mới"}</h2>
                <p className="text-[13px] text-neutral-500 text-center">{"Theo dõi bảo dưỡng xe của bạn"}</p>
              </div>
            ) : (
              <div
                className="rounded-[20px] p-5 text-white overflow-hidden relative h-[200px] flex flex-col"
                style={{
                  backgroundImage: `url('/images/Card_bg.png')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-500/20 rounded-full blur-3xl" />

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
                        {currentVehicle?.variant?.model?.brandName}
                      </h1>
                      <p className="text-white/50 text-[13px] font-normal">
                        {currentVehicle?.variant?.model?.name || "City"}
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

                <div className="flex items-center gap-2 pt-5 relative ">
                  <div className="flex-1 bg-white/5 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-white/40 text-[11px] mb-1">
                      <Gauge className="h-3 w-3" />
                      {"Số km"}
                    </div>
                    <p className="text-[17px] font-bold">
                      {currentVehicle ? `${currentVehicle.currentOdometer.toLocaleString("vi-VN")}` : "0"}
                    </p>
                  </div>
                  <div className="flex-1 bg-white/5 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-white/40 text-[11px] mb-1">
                      <MotorbikeIcon className="h-3 w-3" /> TB/ngày
                    </div>
                    <p className="text-[17px] font-bold">{currentVehicle?.averageKmPerDay || 45} km</p>
                  </div>
                  <button
                    onClick={() => router.push(`/vehicle/${currentVehicle?.id}`)}
                    className="h-full px-4 py-3 bg-gradient-to-r from-[#a73f3f] to-[#fa230b] hover:opacity-90 rounded-xl flex items-center gap-1 transition-all"
                  >
                    <span className="text-[13px] font-medium text-white">{"Chi tiết"}</span>
                    <ChevronRight className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {totalSlots > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {Array.from({ length: totalSlots }).map((_, index) => (
            <button
              key={index}
              onClick={() => onSelectIndex(index)}
              className={`rounded-full transition-all duration-300 ${
                index === currentVehicleIndex ? "w-5 h-1.5 bg-red-500" : "w-1.5 h-1.5 bg-neutral-300"
              }`}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
