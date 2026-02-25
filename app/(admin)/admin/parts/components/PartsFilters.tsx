// src/components/admin/parts/components/PartsFilters.tsx
"use client";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type Props = {
  onlyRequiresOdo: boolean;
  onOnlyRequiresOdoChange: (v: boolean) => void;

  onlyRequiresTime: boolean;
  onOnlyRequiresTimeChange: (v: boolean) => void;

  disabled?: boolean;
  isLoading?: boolean;
};

export default function PartsFilters({
  onlyRequiresOdo,
  onOnlyRequiresOdoChange,
  onlyRequiresTime,
  onOnlyRequiresTimeChange,
  disabled,
  isLoading,
}: Props) {
  const off = disabled || isLoading;

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className={cn(
            "flex items-center justify-between rounded-lg border p-3",
            "border-slate-200",
          )}
        >
          <div>
            <p className="text-sm font-medium text-slate-900">Yêu cầu ODO</p>
            <p className="text-xs text-slate-500">
              Chỉ hiển thị hạng mục cần theo dõi km
            </p>
          </div>
          <Switch
            checked={onlyRequiresOdo}
            onCheckedChange={onOnlyRequiresOdoChange}
            disabled={off}
          />
        </div>

        <div
          className={cn(
            "flex items-center justify-between rounded-lg border p-3",
            "border-slate-200",
          )}
        >
          <div>
            <p className="text-sm font-medium text-slate-900">
              Yêu cầu thời gian
            </p>
            <p className="text-xs text-slate-500">
              Chỉ hiển thị hạng mục cần theo dõi theo tháng/ngày
            </p>
          </div>
          <Switch
            checked={onlyRequiresTime}
            onCheckedChange={onOnlyRequiresTimeChange}
            disabled={off}
          />
        </div>
      </div>
    </div>
  );
}
