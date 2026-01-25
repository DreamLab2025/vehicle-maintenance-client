"use client";

import { Card } from "@/components/ui/card";
import { Bike, Car as CarIcon, Zap } from "lucide-react";
import { useTypes } from "@/hooks/useType"; // hook bạn vừa tạo
import { VehicleType } from "@/lib/api/services/fetchType";

type VehicleTypeKey = "motorcycle" | "car" | "electric";

interface StepTwoProps {
  onSelect: (type: VehicleTypeKey, payload?: { id: string; name: string }) => void;
}

const normalizeTypeKey = (name: string): VehicleTypeKey | null => {
  const n = name.trim().toLowerCase();
  // Support both English and Vietnamese names
  if (n === "motorcycle" || n === "xe máy") return "motorcycle";
  if (n === "car" || n === "xe ô tô" || n === "ô tô") return "car";
  if (n === "electric vehicle" || n === "electric" || n === "xe điện") return "electric";
  return null;
};

const typeUI: Record<VehicleTypeKey, { title: string; bg: string; Icon: React.ElementType }> = {
  motorcycle: { title: "Xe máy", bg: "/images/motorcycle.jpeg", Icon: Bike },
  car: { title: "Xe ô tô", bg: "/images/car.jpg", Icon: CarIcon },
  electric: { title: "Xe điện", bg: "/images/truck.jpeg", Icon: Zap }, // giữ UI giống (dùng truck.jpeg làm background)
};

export function StepTwoVehicleType({ onSelect }: StepTwoProps) {
  const { types, isLoading, isError, error } = useTypes({ PageNumber: 1, PageSize: 10, IsDescending: false }, true);

  // lọc những type mình support + giữ thứ tự UI mong muốn
  const orderedKeys: VehicleTypeKey[] = ["motorcycle", "car", "electric"];
  const mapped = types
    .map((t) => ({ t, key: normalizeTypeKey(t.name) }))
    .filter((x): x is { t: VehicleType; key: VehicleTypeKey } => !!x.key)
    .sort((a, b) => orderedKeys.indexOf(a.key) - orderedKeys.indexOf(b.key));

  return (
    <div className="flex flex-col gap-4">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-semibold mb-2">Chọn loại xe</h2>
        <p className="mt-1 text-xs text-foreground/45">Loại xe của bạn là gì?</p>
      </div>

      {/* Cards */}
      <div className="grid gap-4">
        {isLoading && (
          <>
            <Card className="relative h-40 overflow-hidden rounded-xl bg-muted animate-pulse" />
            <Card className="relative h-40 overflow-hidden rounded-xl bg-muted animate-pulse" />
            <Card className="relative h-40 overflow-hidden rounded-xl bg-muted animate-pulse" />
          </>
        )}

        {isError && (
          <Card className="p-4">
            <div className="text-sm font-medium text-red-600">Lỗi khi tải loại xe</div>
            <div className="text-xs text-muted-foreground mt-1">{(error as Error)?.message}</div>
          </Card>
        )}

        {!isLoading &&
          !isError &&
          mapped.map(({ t, key }) => {
            const ui = typeUI[key];
            const Icon = ui.Icon;

            return (
              <Card
                key={t.id}
                onClick={() => onSelect(key, { id: t.id, name: t.name })}
                className="relative h-40 cursor-pointer overflow-hidden rounded-xl"
              >
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${ui.bg}')` }} />
                <div className="absolute inset-0 bg-black/40" />

                <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
                  <Icon className="w-10 h-10 mb-2" />
                  <h3 className="text-lg font-semibold">{ui.title}</h3>
                </div>
              </Card>
            );
          })}

        {!isLoading && !isError && mapped.length === 0 && (
          <Card className="p-4">
            <div className="text-sm font-medium">Không có loại xe nào</div>
            <div className="text-xs text-muted-foreground mt-1">Vui lòng thử lại sau.</div>
          </Card>
        )}
      </div>
    </div>
  );
}
