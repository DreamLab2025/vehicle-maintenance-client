"use client";

import type React from "react";
import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, useMotionValue, animate, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Gauge,
  Check,
  Camera,
  SlidersHorizontal,
  Upload,
  X,
  Sparkles,
  RotateCcw,
  ImageIcon,
} from "lucide-react";
import Image from "next/image";
import { useUpdateOdometer, useScanOdometer } from "@/hooks/useUserVehice";

// ─── Tab type ──────────────────────────────────────────────
type OdoMode = "manual" | "scan";

// ─── OdometerRoller (reused from vehicle creation form) ────
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

// ─── Main Page ──────────────────────────────────────────────

export default function OdometerUpdatePage() {
  const params = useParams();
  const router = useRouter();
  const userVehicleId = params.id as string;

  const [mode, setMode] = useState<OdoMode>("manual");
  const [odometer, setOdometer] = useState(0);
  const { updateOdometer, isUpdating } = useUpdateOdometer();
  const { scan, isScanning, scanResult, reset: resetScan } = useScanOdometer();

  // Scan state
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [scanAccepted, setScanAccepted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValid = odometer > 0;

  const handleSubmit = useCallback(() => {
    if (!isValid || isUpdating) return;

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
  }, [isValid, isUpdating, updateOdometer, userVehicleId, odometer, router]);

  // ── Scan handlers ──
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setScanAccepted(false);
    resetScan();

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleScan = useCallback(() => {
    if (!selectedFile || isScanning) return;
    scan(selectedFile);
  }, [selectedFile, isScanning, scan]);

  const handleAcceptScan = useCallback(() => {
    if (!scanResult) return;
    setScanAccepted(true);
    setOdometer(scanResult.odometerValue);
    setMode("manual"); // switch to manual to confirm
  }, [scanResult]);

  const handleClearScan = useCallback(() => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setScanAccepted(false);
    resetScan();
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [previewUrl, resetScan]);

  const formatDisplay = (value: number): string => {
    if (value === 0) return "0";
    return value.toLocaleString("vi-VN");
  };

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

        {/* ── Mode Toggle ── */}
        <div className="bg-white rounded-2xl p-1 flex gap-1 mb-5 shadow-sm shadow-neutral-200/40">
          {[
            { key: "manual" as OdoMode, label: "Thủ công", icon: SlidersHorizontal },
            { key: "scan" as OdoMode, label: "Quét ODO", icon: Camera },
          ].map((tab) => {
            const active = mode === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setMode(tab.key)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  active ? "bg-neutral-900 text-white shadow-md" : "text-neutral-500 hover:text-neutral-700"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── Manual Mode ── */}
        <AnimatePresence mode="wait">
          {mode === "manual" && (
            <motion.div
              key="manual"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="bg-white rounded-2xl shadow-sm shadow-neutral-200/40 p-5">
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4 block">
                  Kéo để chỉnh số km
                </label>

                {/* Odometer Roller */}
                <div className="flex flex-nowrap items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-neutral-50/50 px-3 py-3">
                  <div className="flex min-w-0">
                    <OdometerRoller digits={6} value={odometer} onChange={setOdometer} />
                  </div>
                  <div className="flex gap-2 text-neutral-500 shrink-0">
                    <Gauge className="h-5 w-5" />
                    <span className="text-sm font-medium">km</span>
                  </div>
                </div>

                <p className="text-xs text-neutral-400 mt-3 text-center">
                  Kéo trực tiếp trên từng ô số hoặc cuộn chuột
                </p>

                {/* Preview */}
                {odometer > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-4 pt-4 border-t border-neutral-100"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-400">Sẽ cập nhật thành</span>
                      <span className="text-sm font-bold text-green-600">{formatDisplay(odometer)} km</span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                disabled={!isValid || isUpdating}
                className="w-full flex items-center justify-center gap-2 mt-5 py-3.5 rounded-2xl text-sm font-semibold text-white transition-opacity disabled:opacity-40"
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
          )}

          {/* ── Scan Mode ── */}
          {mode === "scan" && (
            <motion.div
              key="scan"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="bg-white rounded-2xl shadow-sm shadow-neutral-200/40 p-5">
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4 block">
                  Chụp ảnh đồng hồ ODO
                </label>

                {/* File upload / Preview area */}
                {!previewUrl ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full aspect-[4/3] rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50/50 flex flex-col items-center justify-center gap-3 hover:border-neutral-300 transition-colors"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center">
                      <Camera className="w-7 h-7 text-neutral-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-neutral-600">Chụp hoặc chọn ảnh</p>
                      <p className="text-xs text-neutral-400 mt-1">Hỗ trợ JPG, PNG - Tối đa 10MB</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold">
                      <Upload className="w-3.5 h-3.5" />
                      Tải ảnh lên
                    </div>
                  </button>
                ) : (
                  <div className="relative rounded-2xl overflow-hidden border border-neutral-200">
                    {/* Image preview */}
                    <div className="relative aspect-[4/3] bg-neutral-100">
                      <Image
                        src={previewUrl}
                        alt="Ảnh ODO"
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>

                    {/* Clear button */}
                    <button
                      type="button"
                      onClick={handleClearScan}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {/* Scan button */}
                {previewUrl && !scanResult && (
                  <motion.button
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    type="button"
                    onClick={handleScan}
                    disabled={isScanning}
                    className="w-full flex items-center justify-center gap-2 mt-4 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
                    style={{
                      background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                    }}
                  >
                    {isScanning ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Đang nhận diện...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Nhận diện bằng AI
                      </>
                    )}
                  </motion.button>
                )}

                {/* AI Result Preview */}
                <AnimatePresence>
                  {scanResult && !scanAccepted && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                      className="mt-4 rounded-2xl border border-purple-100 bg-purple-50/50 p-4"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
                          Kết quả AI
                        </span>
                      </div>

                      {/* Detected value */}
                      <div className="flex items-center justify-center py-4">
                        <div className="text-center">
                          <p className="text-4xl font-extrabold text-neutral-900 tracking-tight">
                            {formatDisplay(scanResult.odometerValue)}
                          </p>
                          <p className="text-sm text-neutral-500 mt-1">km</p>
                        </div>
                      </div>

                      {/* Confidence */}
                      <div className="flex items-center justify-between px-1 mb-4">
                        <span className="text-xs text-neutral-500">Độ tin cậy</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 rounded-full bg-neutral-200 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${Math.round(scanResult.confidence * 100)}%`,
                                background:
                                  scanResult.confidence >= 0.8
                                    ? "#16a34a"
                                    : scanResult.confidence >= 0.5
                                      ? "#eab308"
                                      : "#ef4444",
                              }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-neutral-700">
                            {Math.round(scanResult.confidence * 100)}%
                          </span>
                        </div>
                      </div>

                      {/* Raw text */}
                      {scanResult.rawText && (
                        <div className="px-3 py-2 rounded-xl bg-white/80 border border-purple-100 mb-4">
                          <p className="text-xs text-neutral-400 mb-1">Văn bản nhận diện</p>
                          <p className="text-sm text-neutral-700 font-mono">{scanResult.rawText}</p>
                        </div>
                      )}

                      {/* Accept / Retry */}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleClearScan}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-neutral-600 bg-white border border-neutral-200 hover:bg-neutral-50 transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Thử lại
                        </button>
                        <button
                          type="button"
                          onClick={handleAcceptScan}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white"
                          style={{
                            background: "linear-gradient(135deg, #16a34a, #16a34acc)",
                          }}
                        >
                          <Check className="w-3.5 h-3.5" />
                          Sử dụng
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Scan accepted message */}
                {scanAccepted && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-green-50 border border-green-100"
                  >
                    <Check className="w-4 h-4 text-green-600 shrink-0" />
                    <p className="text-sm text-green-700">
                      Đã áp dụng <span className="font-bold">{formatDisplay(odometer)} km</span> — chuyển sang thủ
                      công để xác nhận
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Info note */}
              <div className="flex items-start gap-3 mt-4 px-1">
                <ImageIcon className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Chụp rõ mặt đồng hồ ODO, tránh bị mờ hoặc phản chiếu. AI sẽ tự động nhận diện số km và hiển thị kết
                  quả để bạn xác nhận.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
