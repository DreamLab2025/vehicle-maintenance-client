"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  PanInfo,
} from "framer-motion";
import {
  Calendar,
  Gauge,
  ArrowUpRight,
  Plus,
  Car as CarIcon,
  Loader2,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useUserVehicles, useDeleteUserVehicle } from "@/hooks/useUserVehice";
import { UserVehicle } from "@/lib/api/services/fetchUserVehicle";

type Car = {
  id: string;
  brand: string;
  model: string;
  nickname: string;
  licensePlate: string;
  type: string;
  currentOdometer: number;
  purchaseDate: string;
  averageKmPerDay: number;
  imageUrl?: string;
  color?: string;
  hexCode?: string;
};

type Slot = { kind: "car"; car: Car } | { kind: "empty"; slotIndex: number } | { kind: "loading" };

const mod = (n: number, m: number) => ((n % m) + m) % m;

// Map API data to Car type
const mapVehicleToCar = (vehicle: UserVehicle): Car => ({
  id: vehicle.id,
  brand: vehicle.userVehicleVariant.model.brandName,
  model: vehicle.userVehicleVariant.model.name,
  nickname: vehicle.nickname,
  licensePlate: vehicle.licensePlate,
  type: vehicle.userVehicleVariant.model.typeName,
  currentOdometer: vehicle.currentOdometer,
  purchaseDate: vehicle.purchaseDate,
  averageKmPerDay: vehicle.averageKmPerDay,
  imageUrl: vehicle.userVehicleVariant.imageUrl,
  color: vehicle.userVehicleVariant.color,
  hexCode: vehicle.userVehicleVariant.hexCode,
});

export default function RotaryCardCarousel() {
  const x = useMotionValue(0);
  const rightProg = useTransform(x, [-150, 0], [1, 0], { clamp: true }); // kéo trái -> right nổi
  const leftProg = useTransform(x, [0, 150], [0, 1], { clamp: true }); // kéo phải -> left nổi

  // Base style cho 2 card sau
  const baseY = 26;
  const baseScale = 0.92;
  const baseOpacity = 0.33;

  // Left back -> trồi lên khi kéo phải
  const leftX = useTransform(leftProg, [0, 1], [-64, -18]);
  const leftY = useTransform(leftProg, [0, 1], [baseY, 10]);
  const leftScale = useTransform(leftProg, [0, 1], [baseScale, 0.985]);
  const leftOpacity = useTransform(leftProg, [0, 1], [baseOpacity, 0.78]);
  const leftRot = useTransform(leftProg, [0, 1], [-2.4, -0.8]);

  // Right back -> trồi lên khi kéo trái
  const rightX = useTransform(rightProg, [0, 1], [64, 18]);
  const rightY = useTransform(rightProg, [0, 1], [baseY, 10]);
  const rightScale = useTransform(rightProg, [0, 1], [baseScale, 0.985]);
  const rightOpacity = useTransform(rightProg, [0, 1], [baseOpacity, 0.78]);
  const rightRot = useTransform(rightProg, [0, 1], [2.4, 0.8]);

  // Top card tilt nhẹ theo kéo
  const topRotate = useTransform(x, [-160, 0, 160], [-5, 0, 5]);
  const topScale = useTransform(x, [-160, 0, 160], [0.985, 1, 0.985]);
  const { vehicles, isLoading } = useUserVehicles({ PageNumber: 1, PageSize: 10 });

  const slots: Slot[] = React.useMemo(() => {
    if (isLoading) return [{ kind: "loading" }];

    if (vehicles.length === 0) {
      return [{ kind: "empty", slotIndex: 0 }];
    }

    const mappedCars = vehicles.map((v) => ({
      kind: "car" as const,
      car: mapVehicleToCar(v),
    }));

    // Always add an empty slot at the end for adding new vehicle
    return [...mappedCars, { kind: "empty", slotIndex: mappedCars.length }];
  }, [vehicles, isLoading]);

  const [centerIndex, setCenterIndex] = React.useState(0);
  const [locked, setLocked] = React.useState(false);

  const idxCenter = mod(centerIndex, slots.length);
  const idxLeft = mod(centerIndex - 1, slots.length);
  const idxRight = mod(centerIndex + 1, slots.length);

  const center = slots[idxCenter];
  const left = slots[idxLeft];
  const right = slots[idxRight];

  // Show loading state
  if (slots.length === 1 && slots[0].kind === "loading") {
    return (
      <div className="grid min-h-[70vh] place-items-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-red-500" />
          <p className="text-sm text-black/50">Đang tải xe của bạn...</p>
        </div>
      </div>
    );
  }

  const commitRotate = (dir: -1 | 1, target: number) => {
    setLocked(true);

    // fling ra nhanh (tween) => mượt, không lắc
    animate(x, target, { type: "tween", duration: 0.18, ease: "easeOut" }).then(
      () => {
        setCenterIndex((v) => v + dir);
        x.set(0); // reset ngay lập tức tránh “giật”
        setLocked(false);
      }
    );
  };

  const onDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (locked) return;

    const threshold = 90;
    const offset = info.offset.x;

    // không đủ ngưỡng => snap về giữa bằng spring nhanh
    if (Math.abs(offset) < threshold) {
      animate(x, 0, { type: "spring", stiffness: 650, damping: 42 });
      return;
    }

    // kéo phải => qua card trái (dir -1), kéo trái => qua card phải (dir +1)
    if (offset > 0) commitRotate(-1, 260);
    else commitRotate(1, -260);
  };

  return (
    <div className="grid min-h-[70vh] place-items-center">
      <div className="relative h-[560px] w-[340px] select-none">
        {/* LEFT back card */}
        <motion.div
          className="absolute inset-0"
          style={{
            x: leftX,
            y: leftY,
            scale: leftScale,
            opacity: leftOpacity,
            rotateZ: leftRot,
            zIndex: 10,
            pointerEvents: "none",
            filter: "blur(0.2px)",
          }}
        >
          <SlotCard slot={left} muted />
        </motion.div>

        {/* RIGHT back card */}
        <motion.div
          className="absolute inset-0"
          style={{
            x: rightX,
            y: rightY,
            scale: rightScale,
            opacity: rightOpacity,
            rotateZ: rightRot,
            zIndex: 10,
            pointerEvents: "none",
            filter: "blur(0.2px)",
          }}
        >
          <SlotCard slot={right} muted />
        </motion.div>

        {/* TOP draggable card */}
        <motion.div
          className="absolute inset-0 z-30 cursor-grab active:cursor-grabbing"
          style={{ x, rotateZ: topRotate, scale: topScale }}
          drag={locked ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragEnd={onDragEnd}
        >
          <SlotCard slot={center} />
        </motion.div>
      </div>
    </div>
  );
}

function SlotCard({ slot, muted }: { slot: Slot; muted?: boolean }) {
  if (slot.kind === "loading") return null;
  if (slot.kind === "empty") return <AddCarCard muted={muted} />;

  return <CarCard car={slot.car} muted={muted} />;
}

function AddCarCard({ muted }: { muted?: boolean }) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push("/vehicle/add")}
      type="button"
      aria-label="Add vehicle"
      className={[
        "h-full w-full rounded-[28px]",
        "bg-white",
        "shadow-[0_22px_70px_rgba(0,0,0,0.45)]",
        "transition",
        muted ? "saturate-50" : "hover:scale-[0.995]",
      ].join(" ")}
    >
      {/* INNER FRAME */}
      <div className="h-full w-full p-4">
        <div
          className="
            h-full w-full
            rounded-[22px]
            border border-dashed border-black/25
            grid place-items-center
          "
        >
          <div className="grid place-items-center gap-3">
            {/* plus */}
            <div
              className="
                grid h-16 w-16 place-items-center
                rounded-full
                bg-red-500 text-white
                shadow-[0_16px_35px_rgba(239,68,68,0.35)]
              "
            >
              <Plus className="h-7 w-7" />
            </div>

            {/* label */}
            <p className="text-[13px] font-medium tracking-wide text-black/55">
              Add vehicle
            </p>
          </div>
        </div>
      </div>
    </button>
  );
}

function CarCard({ car, muted }: { car: Car; muted?: boolean }) {
  const { deleteVehicle, isDeleting } = useDeleteUserVehicle();
  const [showConfirm, setShowConfirm] = React.useState(false);

  // Get car image from API or fallback
  const getCarImage = () => {
    if (car.imageUrl) return car.imageUrl;
    const brandLower = car.brand.toLowerCase();
    if (brandLower.includes("honda")) return "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1400&auto=format&fit=crop&q=80";
    if (brandLower.includes("toyota")) return "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=1400&auto=format&fit=crop&q=80";
    if (brandLower.includes("mazda")) return "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1400&auto=format&fit=crop&q=80";
    return "https://images.unsplash.com/photo-1542362567-b07e54358753?w=1400&auto=format&fit=crop&q=80";
  };

  const handleDelete = () => {
    deleteVehicle(car.id, {
      onSuccess: () => {
        setShowConfirm(false);
      },
    });
  };

  return (
    <div
      className={[
        "h-full w-full rounded-[32px] overflow-hidden",
        "bg-white",
        "shadow-[0_20px_60px_rgba(0,0,0,0.3)]",
        muted ? "saturate-50 opacity-60" : "",
      ].join(" ")}
    >
      {/* Header - License Plate */}
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-white/10 p-2 backdrop-blur-sm">
              <CarIcon className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold tracking-[0.2em] text-white">
              {car.licensePlate}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="rounded-full bg-red-500 px-3 py-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-white">
                {car.type}
              </span>
            </div>

            {!muted && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowConfirm(true);
                }}
                className="rounded-lg bg-white/10 p-2 backdrop-blur-sm transition-colors hover:bg-red-500/20"
                aria-label="Xóa xe"
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 text-white" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Car Name */}
        <div className="mb-6">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
            {car.nickname || "Xe của tôi"}
          </p>
          <h3 className="mt-1 text-2xl font-bold text-gray-900">
            {car.brand}
          </h3>
          <p className="text-base font-medium text-gray-500">
            {car.model}
          </p>
        </div>

        {/* Car Image */}
        <div className="relative -mx-2 mb-6 flex h-[180px] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100">
          <img
            src={getCarImage()}
            alt={`${car.brand} ${car.model}`}
            className={[
              "h-full w-full object-contain",
              "transition-transform hover:scale-105",
              muted ? "opacity-70" : "",
            ].join(" ")}
            draggable={false}
            loading="eager"
            decoding="async"
          />
        </div>

        {/* Single Odometer Info */}
        <div className="mb-5 flex items-center justify-between rounded-2xl bg-gray-50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-50 p-2">
              <Gauge className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Số km hiện tại</p>
              <p className="text-xl font-bold text-gray-900">
                {(car.currentOdometer / 1000).toFixed(1)}k
              </p>
            </div>
          </div>

          {car.averageKmPerDay > 0 && (
            <div className="text-right">
              <p className="text-xs text-gray-400">Trung bình</p>
              <p className="text-sm font-semibold text-gray-600">
                {car.averageKmPerDay} km/ngày
              </p>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <button
          type="button"
          className="
            flex w-full items-center justify-center gap-2
            rounded-2xl bg-gray-900
            py-4 text-white
            shadow-lg shadow-gray-900/20
            transition-all hover:bg-gray-800 active:scale-[0.98]
          "
          aria-label="Xem chi tiết"
        >
          <span className="font-semibold">Xem chi tiết</span>
          <ArrowUpRight className="h-5 w-5" />
        </button>
      </div>

      {/* Delete Confirmation Dialog */}
      {showConfirm && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-[32px]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mx-6 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-red-50 p-3">
                <Trash2 className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Xóa xe?</h3>
            </div>

            <p className="mb-6 text-sm text-gray-600">
              Bạn có chắc muốn xóa xe <strong>{car.licensePlate}</strong> không? Hành động này không thể hoàn tác.
            </p>

            <div className="flex gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowConfirm(false);
                }}
                disabled={isDeleting}
                className="flex-1 rounded-xl bg-gray-100 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                disabled={isDeleting}
                className="flex-1 rounded-xl bg-red-500 py-3 font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-50"
              >
                {isDeleting ? "Đang xóa..." : "Xóa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
