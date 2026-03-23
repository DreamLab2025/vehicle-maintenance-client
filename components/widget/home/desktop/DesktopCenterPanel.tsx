"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import type { UserVehicle, UserVehiclePart } from "@/lib/api/services/fetchUserVehicle";
import type { VehicleReminder } from "@/lib/api/services/fetchTrackingReminder";
import { Tabs, type TabItem } from "@/components/ui/tabs";
import { MOCK_WEEKLY_ACTIVITY_KM } from "./desktopMock";
import { getReminderLevelConfig } from "@/lib/config/reminderLevelConfig";
import { cn } from "@/lib/utils";

const BRAND = "#E22028";

/** Khối nội dung — cùng padding/bo góc để cả cột nhịp một */
const panel = "rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800";
const heading = "text-[13px] font-semibold tracking-tight text-neutral-900 dark:text-neutral-100";
const labelMuted = "text-[12px] text-neutral-500 dark:text-neutral-400";

function maskVin(vin: string) {
  if (!vin || vin.length < 8) return "••••••••";
  return `${vin.slice(0, 3)}${"•".repeat(Math.min(vin.length - 6, 12))}${vin.slice(-3)}`;
}

function RingGauge({ label, value, stroke }: { label: string; value: number; stroke: string }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, value));
  const offset = c - (pct / 100) * c;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <svg width={84} height={84} className="-rotate-90" aria-hidden>
        <circle
          cx={42}
          cy={42}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={7}
          className="text-neutral-200 dark:text-neutral-800"
        />
        <circle
          cx={42}
          cy={42}
          r={r}
          fill="none"
          stroke={stroke}
          strokeWidth={7}
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-[stroke-dashoffset] duration-500"
        />
      </svg>
      <span className="max-w-[88px] text-center text-[10px] font-medium text-neutral-600 dark:text-neutral-400">
        {label}
      </span>
      <span className="text-[13px] font-bold text-neutral-900 dark:text-neutral-100">{Math.round(pct)}%</span>
    </div>
  );
}

type DesktopCenterPanelProps = {
  vehicle: UserVehicle | null;
  isAddSlot: boolean;
  parts: UserVehiclePart[];
  isLoadingParts: boolean;
  reminders: VehicleReminder[];
  isLoadingReminders: boolean;
  declarationPercent: number;
};

export function DesktopCenterPanel({
  vehicle,
  isAddSlot,
  parts,
  isLoadingParts,
  reminders,
  isLoadingReminders,
  declarationPercent,
}: DesktopCenterPanelProps) {
  const model = vehicle?.userVehicleVariant.model;
  const maxBarKm = useMemo(() => Math.max(...MOCK_WEEKLY_ACTIVITY_KM.map((d) => d.km), 1), []);

  const topReminders = useMemo(() => {
    return [...reminders].sort((a, b) => (b.percentageRemaining ?? 0) - (a.percentageRemaining ?? 0)).slice(0, 3);
  }, [reminders]);

  const desktopTabs = useMemo((): TabItem[] => {
    if (!vehicle) return [];
    return [
      {
        title: "Tổng quan",
        value: "overview",
        content: (
          <>
            <div className={`${panel} flex flex-col gap-3`}>
              <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
                Hoạt động (mock — chưa có API)
              </p>
              <div className="flex h-32 items-end justify-between gap-1.5 border-b border-neutral-100 pb-1.5 dark:border-neutral-800 sm:h-36 sm:gap-2">
                {MOCK_WEEKLY_ACTIVITY_KM.map((d) => (
                  <div key={d.label} className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className="w-full max-w-[28px] rounded-t-md transition-all"
                      style={{
                        height: `${(d.km / maxBarKm) * 100}%`,
                        minHeight: "8%",
                        backgroundColor: BRAND,
                      }}
                      title={`${d.km} km`}
                    />
                    <span className="text-[10px] text-neutral-500">{d.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`${panel} flex flex-col gap-3`}>
              <h3 className={heading}>Thông tin xe cá nhân</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-[13px] sm:gap-x-5">
                <div className="flex flex-col gap-0.5">
                  <span className={labelMuted}>Hãng xe</span>
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">{model?.brandName ?? "—"}</p>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className={labelMuted}>Model</span>
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">{model?.name ?? "—"}</p>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className={labelMuted}>Nhiên liệu</span>
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">{model?.fuelTypeName ?? "—"}</p>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className={labelMuted}>Năm mua</span>
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">
                    {vehicle.purchaseDate ? new Date(vehicle.purchaseDate).getFullYear() : "—"}
                  </p>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className={labelMuted}>Hộp số</span>
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">
                    {model?.transmissionTypeName ?? "—"}
                  </p>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className={labelMuted}>Năm sản xuất</span>
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">{model?.releaseYear ?? "—"}</p>
                </div>
                <div className="col-span-2 flex flex-col gap-0.5">
                  <span className={labelMuted}>Dung tích xi-lanh</span>
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">
                    {model?.engineDisplacementDisplay ||
                      (model?.engineCapacity != null ? `${model.engineCapacity} cc` : "—")}
                  </p>
                </div>
                <div className="col-span-2 flex flex-col gap-0.5">
                  <span className={labelMuted}>Số khung / số máy</span>
                  <p className="font-mono text-[12px] font-medium text-neutral-800 dark:text-neutral-200">
                    {maskVin(vehicle.vinNumber)}
                  </p>
                </div>
              </div>
            </div>

            <div className={`${panel} flex flex-col gap-3`}>
              <div className="flex items-center justify-between gap-3">
                <h3 className={heading}>Tiến trình khai báo</h3>
                <span className="text-[13px] font-bold tabular-nums text-neutral-700 dark:text-neutral-300">
                  {Math.round(declarationPercent)}%
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${declarationPercent}%`, backgroundColor: BRAND }}
                />
              </div>
              <Link
                href={`/vehicle/${vehicle.id}`}
                className="inline-flex w-fit rounded-lg px-3 py-2 text-[12px] font-semibold text-white"
                style={{ backgroundColor: BRAND }}
              >
                Khai báo
              </Link>
            </div>

            <div className={`${panel} flex flex-col gap-3`}>
              <h3 className={heading}>Nhắc nhớ nổi bật</h3>
              {isLoadingReminders ? (
                <p className={labelMuted}>Đang tải…</p>
              ) : topReminders.length === 0 ? (
                <p className={`${labelMuted} leading-relaxed`}>
                  Chưa có nhắc nhở — khai báo phụ tùng để nhận nhắc nhở.
                </p>
              ) : (
                <div className="flex flex-wrap justify-center gap-4 sm:gap-5">
                  {topReminders.map((r) => {
                    const cfg = getReminderLevelConfig(r.level);
                    return (
                      <RingGauge
                        key={r.id}
                        label={r.partCategory.name}
                        value={r.percentageRemaining}
                        stroke={cfg.hexColor}
                      />
                    );
                  })}
                </div>
              )}
              <div className="flex flex-wrap gap-x-3 gap-y-1.5 border-t border-neutral-100 pt-3 text-[10px] text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                {[
                  ["#22c55e", "Tốt"],
                  ["#3b82f6", "Khá"],
                  ["#eab308", "TB"],
                  ["#f97316", "Yếu"],
                  [BRAND, "Khẩn cấp"],
                ].map(([c, t]) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: c }} />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </>
        ),
      },
      {
        title: "Phụ tùng",
        value: "parts",
        content: (
          <div className={`${panel} flex flex-col gap-3`}>
            {isLoadingParts ? (
              <p className={labelMuted}>Đang tải phụ tùng…</p>
            ) : parts.length === 0 ? (
              <p className={labelMuted}>Chưa có dữ liệu phụ tùng.</p>
            ) : (
              <ul className="grid grid-cols-2 gap-2.5 lg:grid-cols-3">
                {parts.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center gap-2.5 rounded-xl border border-neutral-100 bg-neutral-50/80 p-2.5 dark:border-neutral-800 dark:bg-neutral-900/40"
                  >
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-white dark:bg-neutral-950">
                      {p.iconUrl ? (
                        <Image src={p.iconUrl} alt="" width={28} height={28} className="object-contain" unoptimized />
                      ) : (
                        <span className="text-[10px] text-neutral-400">—</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] font-semibold text-neutral-900 dark:text-neutral-100">
                        {p.partCategoryName}
                      </p>
                      <span
                        className={cn(
                          "mt-0.5 inline-block rounded px-1.5 py-0.5 text-[10px] font-medium",
                          p.isDeclared ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800",
                        )}
                      >
                        {p.isDeclared ? "Đã khai báo" : "Chưa khai báo"}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ),
      },
      {
        title: "Nhắc Nhở",
        value: "reminders",
        content: (
          <div className={`${panel} flex flex-col gap-2`}>
            {isLoadingReminders ? (
              <p className={labelMuted}>Đang tải…</p>
            ) : reminders.length === 0 ? (
              <p className={labelMuted}>Không có nhắc nhở.</p>
            ) : (
              reminders.map((r) => {
                const cfg = getReminderLevelConfig(r.level);
                return (
                  <div
                    key={r.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-neutral-100 bg-neutral-50/50 px-3 py-2 dark:border-neutral-800 dark:bg-neutral-900/30"
                  >
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-neutral-900 dark:text-neutral-100">
                        {r.partCategory.name}
                      </p>
                      <p className="text-[11px] text-neutral-500">
                        Còn ~{r.remainingKm?.toLocaleString("vi-VN") ?? "—"} km · {cfg.labelVi}
                      </p>
                    </div>
                    <span className="shrink-0 text-[13px] font-bold text-neutral-700 dark:text-neutral-300">
                      {Math.round(r.percentageRemaining)}%
                    </span>
                  </div>
                );
              })
            )}
          </div>
        ),
      },
    ];
  }, [
    vehicle,
    model,
    maxBarKm,
    declarationPercent,
    topReminders,
    isLoadingReminders,
    parts,
    isLoadingParts,
    reminders,
  ]);

  if (isAddSlot || !vehicle) {
    return (
      <section className="flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center gap-3 overflow-hidden bg-white px-5 py-6 dark:bg-neutral-950 sm:px-6">
        <p className="max-w-sm text-center text-[14px] leading-relaxed text-neutral-500 dark:text-neutral-400">
          Chọn một xe trong danh sách hoặc thêm xe mới để xem tổng quan.
        </p>
        <Link
          href="/vehicle/add"
          className="rounded-xl px-4 py-2.5 text-[13px] font-semibold text-white"
          style={{ backgroundColor: BRAND }}
        >
          Thêm xe
        </Link>
      </section>
    );
  }

  const odoStr = vehicle.currentOdometer.toLocaleString("vi-VN").padStart(6, "0");
  const avg = vehicle.averageKmPerDay ?? 0;

  return (
    <section className="min-h-0 rounded-md w-[60%] overflow-y-auto overflow-x-hidden overscroll-contain bg-[#F9F8F6]  py-4 dark:bg-neutral-950 sm:px-5 sm:py-5">
      <div className="flex flex-col gap-4 pb-3">
        <div className="flex flex-wrap items-end justify-center gap-x-2 gap-y-1">
          <p
            className={cn(
              "font-odo-seven-segment text-center text-[2.75rem] font-normal leading-none tabular-nums tracking-[0.1em] text-neutral-900 dark:text-neutral-100",
              "sm:text-[3.25rem] md:text-[3.75rem] lg:text-[4.25rem] xl:text-[4.75rem]",
            )}
          >
            {odoStr}
          </p>
          <span className="inline-block shrink-0 pb-1 font-sans text-lg font-semibold tracking-normal text-neutral-500 sm:text-xl md:pb-1.5 md:text-2xl">
            Km
          </span>
        </div>
        <p className={`text-center ${labelMuted}`}>
          TRUNG BÌNH: <span className="font-semibold text-neutral-700 dark:text-neutral-300">{avg} km/ngày</span>
        </p>

        <Tabs
          key={vehicle.id}
          tabs={desktopTabs}
          defaultValue="overview"
          contentStacked={false}
          motionLayoutId={`home-center-${vehicle.id}`}
          containerClassName="justify-center sm:justify-start"
          activeTabClassName="bg-white shadow-sm dark:bg-neutral-900 dark:shadow-none"
        />
      </div>
    </section>
  );
}
