"use client";

import type React from "react";
import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarDays, IdCard, Tag, Hash, Gauge } from "lucide-react";
import { motion, useMotionValue, animate } from "framer-motion";
import { DatePicker } from "@/components/ui/date-picker";

type VehicleInfo = {
  licensePlate: string;
  nickname: string;
  vinNumber: string;
  purchaseDate: string; // yyyy-mm-dd
  currentOdometer: number;
};

interface StepFiveProps {
  value: VehicleInfo;
  onChange: (next: VehicleInfo, isValid: boolean) => void;
  odometerDigits?: number;
}

/* --------------------------
   Odometer Roller (0-9) - infinite loop like real odo
-------------------------- */
function OdometerRoller({
  digits = 6,
  value,
  onChange,
}: {
  digits?: number;
  value: number;
  onChange: (next: number) => void;
}) {
  const max = Number("9".repeat(digits));
  const clamp = (n: number) => Math.max(0, Math.min(n, max));
  const normalized = clamp(Number.isFinite(value) ? value : 0);

  const valueStr = String(normalized).padStart(digits, "0");
  const [digitsArr, setDigitsArr] = useState<number[]>(valueStr.split("").map((c) => Number(c)));

  useEffect(() => {
    const s = String(clamp(value)).padStart(digits, "0");
    setDigitsArr(s.split("").map((c) => Number(c)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, digits]);

  const commit = (nextDigits: number[]) => {
    setDigitsArr(nextDigits);
    const num = Number(nextDigits.join(""));
    onChange(num);
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

/* --------------------------
   Step UI (✅ FIX: text inputs controlled, no local)
-------------------------- */
export function StepFiveVehicleInfo({ value, onChange, odometerDigits = 6 }: StepFiveProps) {
  const isValidOf = useCallback((v: VehicleInfo) => {
    const plateOk = v.licensePlate.trim().length > 0;
    const dateOk = v.purchaseDate.trim().length > 0;
    const odoOk = Number.isFinite(v.currentOdometer) && v.currentOdometer >= 0;
    return plateOk && dateOk && odoOk;
  }, []);

  const isValid = useMemo(() => isValidOf(value), [value, isValidOf]);

  // ✅ update “như input bình thường”: gõ tới đâu bắn lên tới đó
  const update = (patch: Partial<VehicleInfo>) => {
    const next = { ...value, ...patch };
    onChange(next, isValidOf(next));
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Thông tin xe</h1>
        <p className="text-sm text-gray-500 leading-relaxed">Nhập đầy đủ thông tin về xe của bạn để hoàn tất.</p>
      </div>

      <Card className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* License plate */}
            <div className="space-y-2">
              <Label htmlFor="licensePlate" className="text-gray-800">
                Biển số xe <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <IdCard className="h-5 w-5" />
                </div>
                <Input
                  id="licensePlate"
                  value={value.licensePlate}
                  onChange={(e) => update({ licensePlate: e.target.value })}
                  placeholder="Ví dụ: 30K1-12345"
                  className="pl-10 h-12 rounded-xl border-gray-200 bg-white shadow-sm focus:border-black focus:ring-2 focus:ring-black/10"
                  required
                />
              </div>
            </div>

            {/* Nickname */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="nickname" className="text-gray-800">
                  Tên gọi (Nickname)
                </Label>
                <span className="text-xs text-gray-400 font-medium">Không bắt buộc</span>
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Tag className="h-5 w-5" />
                </div>
                <Input
                  id="nickname"
                  value={value.nickname}
                  onChange={(e) => update({ nickname: e.target.value })}
                  placeholder="Ví dụ: Xe đi làm, Winner X..."
                  className="pl-10 h-12 rounded-xl border-gray-200 bg-white shadow-sm focus:border-black focus:ring-2 focus:ring-black/10"
                />
              </div>
            </div>

            {/* VIN */}
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="vinNumber" className="text-gray-800">
                  Số VIN / Số khung
                </Label>
                <span className="text-xs text-gray-400 font-medium">Không bắt buộc</span>
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Hash className="h-5 w-5" />
                </div>
                <Input
                  id="vinNumber"
                  value={value.vinNumber}
                  onChange={(e) => update({ vinNumber: e.target.value })}
                  placeholder="Nhập VIN (nếu có)"
                  className="pl-10 h-12 rounded-xl border-gray-200 bg-white shadow-sm focus:border-black focus:ring-2 focus:ring-black/10"
                />
              </div>
            </div>

            {/* Purchase date */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="purchaseDate" className="text-gray-800">
                  Ngày mua / Nhận xe <span className="text-red-500">*</span>
                </Label>
                <span className="text-xs text-gray-500">Bắt buộc</span>
              </div>

              <DatePicker
                value={value.purchaseDate}
                onChange={(date) => update({ purchaseDate: date })}
                placeholder="Chọn ngày mua / nhận xe"
                max={new Date()}
                className="w-full h-12 rounded-xl border z-20 border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-gray-300 focus:border-black focus:ring-2 focus:ring-black/10 transition-all"
              />

              <p className="text-xs text-gray-500 leading-relaxed">
                Chọn ngày theo lịch hệ thống (tối ưu cho thiết bị của bạn).
              </p>
            </div>

            {/* Odometer roller (giữ y như bạn muốn) */}
            <div className="space-y-2">
              <Label className="text-gray-800">
                Odometer hiện tại <span className="text-red-500">*</span>
              </Label>

              <div className="flex flex-nowrap items-center gap-3 rounded-2xl border border-gray-200 bg-white shadow-sm px-3 py-2">
                <div className="flex min-w-0">
                  <OdometerRoller
                    digits={odometerDigits}
                    value={value.currentOdometer}
                    onChange={(n) => update({ currentOdometer: n })}
                  />
                </div>
                <div className="flex gap-2 text-gray-500 shrink-0">
                  <Gauge className="h-5 w-5" />
                  <span className="text-sm font-medium">km</span>
                </div>
              </div>

              <p className="text-xs text-gray-500">Kéo trực tiếp trên từng ô số để nhập giống đồng hồ odo.</p>
            </div>
          </div>

          {!isValid && (
            <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
              <p className="text-sm text-gray-700 font-medium">
                Vui lòng nhập đủ: <span className="text-gray-900">Biển số</span>,{" "}
                <span className="text-gray-900">Ngày mua</span>, <span className="text-gray-900">Odometer</span>.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
