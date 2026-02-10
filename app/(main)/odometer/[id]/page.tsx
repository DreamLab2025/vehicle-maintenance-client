"use client";

import type React from "react";
import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, useMotionValue, animate } from "framer-motion";
import { ChevronLeft, Gauge, Check } from "lucide-react";
import Image from "next/image";
import { useUpdateOdometer, useUserVehicles } from "@/hooks/useUserVehice";
import { toast } from "sonner";

// ─── OdometerRoller ──────────────────────────────────────────────
function OdometerRoller({
  digits = 6,
  value,
  onChange,
  minValue = 0,
  mode = "create",
}: {
  digits?: number;
  value: number;
  onChange: (next: number) => void;
  minValue?: number;
  mode?: "create" | "update";
}) {
  const max = Number("9".repeat(digits));
  // In create mode, no minValue constraint. In update mode, allow values below minValue to show validation error
  const clamp = (n: number) => Math.max(0, Math.min(n, max));
  const normalized = clamp(Number.isFinite(value) ? value : 0);

  const valueStr = String(normalized).padStart(digits, "0");
  const [digitsArr, setDigitsArr] = useState<number[]>(valueStr.split("").map((c) => Number(c)));

  useEffect(() => {
    const clampedValue = clamp(value);
    const s = String(clampedValue).padStart(digits, "0");
    const newDigits = s.split("").map((c) => Number(c));
    setDigitsArr(newDigits);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, digits, minValue, mode]);

  const commit = (nextDigits: number[]) => {
    setDigitsArr(nextDigits);
    const num = Number(nextDigits.join(""));
    const clamped = clamp(num);
    onChange(clamped);
  };

  return (
    <div className="flex items-center shrink-0">
      <div className="flex items-center gap-1 sm:gap-2.5">
        {Array.from({ length: digits }).map((_, idx) => (
          <DigitWheel
            key={idx}
            value={digitsArr[idx] ?? 0}
            onValue={(d) => {
              const next = [...digitsArr];
              next[idx] = d;
              commit(next);
            }}
          />
        ))}
      </div>
    </div>
  );
}

function DigitWheel({ value, onValue }: { value: number; onValue: (d: number) => void }) {
  const digitH = 56;
  const itemH = 40;

  const items = useMemo(() => {
    const base = Array.from({ length: 10 }, (_, i) => i);
    return [...base, ...base, ...base];
  }, []);

  const midStart = 10;
  const maxIndex = items.length - 1;

  const y = useMotionValue(-(midStart + value) * itemH);
  const [localDigit, setLocalDigit] = useState<number>(value);
  const draggingRef = useRef(false);

  const digitFromY = (curY: number) => {
    const idx = Math.round(Math.abs(curY) / itemH);
    const safe = Math.max(0, Math.min(maxIndex, idx));
    return items[safe] ?? 0;
  };

  const recenterIfNeeded = (curY: number) => {
    const idx = Math.round(Math.abs(curY) / itemH);
    if (idx < 6 || idx > 23) {
      const digit = items[Math.max(0, Math.min(maxIndex, idx))] ?? 0;
      const midIdx = midStart + digit;
      const nextY = -midIdx * itemH;
      y.set(nextY);
      return nextY;
    }
    return curY;
  };

  const snapToDigit = (digit: number) => {
    const midIdx = midStart + digit;
    const targetY = -midIdx * itemH;
    animate(y, targetY, { type: "spring", stiffness: 420, damping: 36 });
  };

  useEffect(() => {
    if (draggingRef.current) return;
    setLocalDigit(value);
    y.stop();
    y.set(-(midStart + value) * itemH);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const dir = e.deltaY > 0 ? 1 : -1;
    const next = (localDigit + dir + 10) % 10;
    setLocalDigit(next);
    onValue(next);
    snapToDigit(next);
  };

  return (
    <div className="select-none w-[42px] sm:w-[56px]">
      <motion.div className="relative mx-auto overflow-hidden rounded-2xl" style={{ height: digitH }} onWheel={onWheel}>
        <div className="absolute inset-0 rounded-2xl border border-gray-200 bg-white shadow-sm" />

        <div
          className="pointer-events-none absolute left-2 right-2 top-1/2 -translate-y-1/2 rounded-xl border border-black/10 bg-black/[0.03]"
          style={{ height: itemH }}
        />

        <motion.div
          drag="y"
          dragElastic={0.12}
          dragMomentum={true}
          style={{
            y,
            paddingTop: (digitH - itemH) / 2,
            paddingBottom: (digitH - itemH) / 2,
          }}
          onDragStart={() => {
            draggingRef.current = true;
          }}
          onDrag={() => {
            const cur = recenterIfNeeded(y.get());
            const d = digitFromY(cur);
            setLocalDigit((prev) => (prev === d ? prev : d));
          }}
          onDragEnd={() => {
            draggingRef.current = false;
            const cur = recenterIfNeeded(y.get());
            const d = digitFromY(cur);
            setLocalDigit(d);
            onValue(d);
            snapToDigit(d);
          }}
        >
          {items.map((n, i) => (
            <div key={`${n}-${i}`} className="flex items-center justify-center" style={{ height: itemH }}>
              <span
                className={`font-extrabold tracking-tight ${n === localDigit ? "text-gray-900" : "text-gray-400"}`}
                style={{
                  fontSize: n === localDigit ? 26 : 22,
                  lineHeight: 1,
                }}
              >
                {n}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────

export default function OdometerUpdatePage() {
  const params = useParams();
  const router = useRouter();
  const userVehicleId = params.id as string;

  // Fetch vehicle to get current odometer
  const { vehicles, isLoading: isLoadingVehicle, isFetching: isFetchingVehicle } = useUserVehicles(
    { PageNumber: 1, PageSize: 100 },
    !!userVehicleId
  );
  const vehicle = vehicles.find((v) => v.id === userVehicleId);
  const currentOdometer = vehicle?.currentOdometer ?? 0;
  const isVehicleLoading = isLoadingVehicle || isFetchingVehicle;

  // Initialize odometer state - will be updated when vehicle data loads
  const [odometer, setOdometer] = useState(0);
  const { updateOdometer, isUpdating } = useUpdateOdometer();

  // Set odometer to current value when vehicle data loads (only on initial load)
  useEffect(() => {
    if (currentOdometer > 0 && odometer === 0) {
      setOdometer(currentOdometer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentOdometer]);

  // Format display
  const formatDisplay = (value: number): string => {
    if (value === 0) return "0";
    return value.toLocaleString("vi-VN");
  };

  // Validation: odometer must be >= currentOdometer and > 0
  const isValid = currentOdometer > 0 && odometer >= currentOdometer && odometer > 0;
  const isDecreased = currentOdometer > 0 && odometer < currentOdometer;

  const handleSubmit = useCallback(() => {
    if (isUpdating) return;

    // Validate: odometer must be >= currentOdometer
    if (odometer < currentOdometer) {
      toast.error(`Số km phải lớn hơn hoặc bằng ${formatDisplay(currentOdometer)} km hiện tại`);
      return;
    }

    if (odometer <= 0) {
      toast.error("Vui lòng nhập số km hợp lệ");
      return;
    }

    updateOdometer(
      {
        userVehicleId,
        payload: { currentOdometer: odometer },
      },
      {
        onSuccess: () => {
          router.back();
        },
      },
    );
  }, [isUpdating, odometer, currentOdometer, updateOdometer, userVehicleId, router]);

  return (
    <div className="min-h-screen bg-[#f5f5f7] pb-28 scrollbar-hide">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-[#f5f5f7]/80 backdrop-blur-xl border-b border-neutral-200/50">
        <div className="flex items-center justify-between px-5 h-14">
          <motion.button
            type="button"
            onClick={() => router.back()}
            whileTap={{ scale: 0.9 }}
            className="w-9 h-9 rounded-full bg-white/80 shadow-sm flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-neutral-700" />
          </motion.button>

          <h1 className="text-base font-bold text-neutral-900">ODOMETER</h1>

          <div className="w-9" />
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        className="px-5 pt-5"
      >
        {/* ── Icon + Description ── */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-24 h-24 rounded-2xl flex items-center justify-center mb-3">
            <Image src="/images/gauge.png" alt="Odometer" width={96} height={96} />
          </div>
          <p className="text-xs font-medium text-neutral-500 leading-relaxed max-w-[300px]">
            Cập nhật số km hiện tại để hệ thống theo dõi bảo dưỡng chính xác hơn
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm shadow-neutral-200/40 p-5">
          {/* Current Odometer Display Card */}
          {!isVehicleLoading && currentOdometer > 0 && (
            <div className="mb-4 pb-4 border-b border-neutral-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-500">Số km hiện tại</span>
                <span className="text-base font-bold text-neutral-900">{formatDisplay(currentOdometer)} km</span>
              </div>
            </div>
          )}

          {isVehicleLoading && (
            <div className="mb-4 pb-4 border-b border-neutral-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-500">Số km hiện tại</span>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin" />
                  <span className="text-sm font-semibold text-neutral-400">Đang tải...</span>
                </div>
              </div>
            </div>
          )}

          <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4 block">
            Kéo để chỉnh số km
          </label>

          {/* Odometer Roller */}
          <div className="flex flex-nowrap items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-neutral-50/50 px-3 py-3">
            <div className="flex min-w-0">
              <OdometerRoller
                digits={6}
                value={odometer}
                onChange={setOdometer}
                minValue={currentOdometer}
                mode="update"
              />
            </div>
            <div className="flex gap-2 text-neutral-500 shrink-0">
              <Gauge className="h-5 w-5" />
              <span className="text-sm font-medium">km</span>
            </div>
          </div>

          <p className="text-xs text-neutral-400 mt-3 text-center">
            Kéo trực tiếp trên từng ô số hoặc cuộn chuột
          </p>

          {/* Realtime Validation Error - hiển thị khi giá trị nhập < giá trị ban đầu */}
          {isDecreased && currentOdometer > 0 && odometer > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4 pt-4 border-t border-red-100"
            >
              <div className="flex items-center gap-1.5 text-xs text-red-600">
                <span>⚠️</span>
                <span>
                  Số km phải lớn hơn hoặc bằng <span className="font-bold">{formatDisplay(currentOdometer)} km</span> để cập nhật
                </span>
              </div>
            </motion.div>
          )}

          {/* Preview when valid */}
          {!isDecreased && odometer > 0 && odometer >= currentOdometer && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4 pt-4 border-t border-neutral-100"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-neutral-400">Sẽ cập nhật thành</span>
                <span className="text-sm font-bold text-green-600">{formatDisplay(odometer)} km</span>
              </div>
              {odometer > currentOdometer && (
                <div className="flex items-center gap-1.5 text-xs text-green-600">
                  <span>✓</span>
                  <span>Tăng {formatDisplay(odometer - currentOdometer)} km</span>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Submit Button */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          disabled={!isValid || isUpdating || isVehicleLoading}
          className="w-full flex items-center justify-center gap-2 mt-5 py-3.5 rounded-2xl text-sm font-semibold text-white transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(135deg, #dc2626, #ef4444)",
          }}
        >
          {isUpdating ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Check className="w-4 h-4" />
              Xác nhận cập nhật
            </>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
}
