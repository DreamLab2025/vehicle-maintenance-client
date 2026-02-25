// src/components/admin/variants/components/VariantsToolbar.tsx
"use client";

import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils"; // nếu bạn có util cn; không có thì xóa & bỏ cn
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { VehicleModel } from "@/lib/api/services/fetchModel";

type Props = {
  models: VehicleModel[];
  isModelsLoading: boolean;
  isModelsError: boolean;

  selectedModelId: string;
  onSelectedModelIdChange: (id: string) => void;

  selectedModelName?: string;
  disabled?: boolean;
};

export default function VariantsToolbar({
  models,
  isModelsLoading,
  isModelsError,
  selectedModelId,
  onSelectedModelIdChange,
  disabled,
}: Props) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-700 mb-2">Chọn mẫu xe</p>

          {isModelsError ? (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertTriangle className="h-4 w-4" />
              Không tải được danh sách mẫu xe
            </div>
          ) : (
            <Select
              value={selectedModelId}
              onValueChange={onSelectedModelIdChange}
              disabled={disabled || isModelsLoading}
            >
              <SelectTrigger className={cn("w-full", "border-slate-200")}>
                <SelectValue
                  placeholder={
                    isModelsLoading
                      ? "Đang tải mẫu xe..."
                      : "Chọn mẫu xe để quản lý "
                  }
                />
              </SelectTrigger>
              <SelectContent className="z-[60] bg-white border border-slate-200 shadow-xl rounded-xl">
                {models.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name} — {m.brandName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
    </div>
  );
}
