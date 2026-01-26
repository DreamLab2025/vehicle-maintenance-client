"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ModelQueryParams, TransmissionType } from "@/lib/api/services/fetchModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ModelFiltersProps {
  filters: Partial<ModelQueryParams>;
  onFilterChange: (filters: Partial<ModelQueryParams>) => void;
}

export function ModelFilters({ filters, onFilterChange }: ModelFiltersProps) {
  const transmissionOptions: { value: TransmissionType; label: string }[] = [
    { value: "Manual", label: "Xe số" },
    { value: "Automatic", label: "Tay ga" },
    { value: "Sport", label: "Xe côn" },
    { value: "ManualCar", label: "Số sàn" },
    { value: "AutomaticCar", label: "Số tự động" },
    { value: "Electric", label: "Điện" },
  ];

  const ALL = "__all__"; // sentinel để tránh SelectItem value=""

  return (
    <Card className="border-gray-100 shadow-sm pt-5 pb-5">
      <CardHeader className="border-b border-gray-100 bg-gray-50/50">
        <CardTitle className="text-lg font-semibold text-gray-900">Bộ lọc</CardTitle>
      </CardHeader>

      <CardContent className="pt-6">
        {/* 6 cols: mỗi field chiếm 2 cols => 3 field / row */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* 1) ModelName */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="modelName" className="text-sm font-medium text-gray-700">
              Tên mẫu xe
            </Label>
            <Input
              id="modelName"
              placeholder="Nhập tên mẫu xe..."
              value={filters.ModelName || ""}
              onChange={(e) => onFilterChange({ ModelName: e.target.value || undefined })}
              className="border-gray-200 focus:border-red-500 focus:ring-red-500"
            />
          </div>

          {/* 2) Color */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="color" className="text-sm font-medium text-gray-700">
              Màu sắc
            </Label>
            <Input
              id="color"
              placeholder="Nhập màu sắc..."
              value={filters.Color || ""}
              onChange={(e) => onFilterChange({ Color: e.target.value || undefined })}
              className="border-gray-200 focus:border-red-500 focus:ring-red-500"
            />
          </div>

          {/* 3) EngineDisplacement */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="engineDisplacement" className="text-sm font-medium text-gray-700">
              Dung tích xy-lanh
            </Label>
            <Input
              id="engineDisplacement"
              type="number"
              placeholder="cc..."
              value={filters.EngineDisplacement ?? ""}
              onChange={(e) =>
                onFilterChange({
                  EngineDisplacement: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="border-gray-200 focus:border-red-500 focus:ring-red-500"
            />
          </div>

          {/* HÀNG 2: 2 ô nằm giữa */}
          {/* 4) TransmissionType - start ở cột 2 (giữa) */}
          {(() => {
            const ALL = "__all__";
            return (
              <div className="space-y-2 md:col-span-2 md:col-start-2">
                <Label htmlFor="transmission" className="text-sm font-medium text-gray-700">
                  Loại hộp số
                </Label>
                <Select
                  value={filters.TransmissionType ?? ALL}
                  onValueChange={(v) =>
                    onFilterChange({
                      TransmissionType: v === ALL ? undefined : (v as TransmissionType),
                    })
                  }
                >
                  <SelectTrigger id="transmission" className="border-gray-200 focus:border-red-500 focus:ring-red-500">
                    <SelectValue placeholder="Chọn loại hộp số" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-white text-gray-900 shadow-md border border-gray-200">
                    <SelectItem value={ALL}>Tất cả</SelectItem>
                    {transmissionOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          })()}

          {/* 5) ReleaseYear - start ở cột 4 (giữa) */}
          <div className="space-y-2 md:col-span-2 md:col-start-4">
            <Label htmlFor="releaseYear" className="text-sm font-medium text-gray-700">
              Năm sản xuất
            </Label>
            <Input
              id="releaseYear"
              type="number"
              placeholder="Năm..."
              value={filters.ReleaseYear ?? ""}
              onChange={(e) =>
                onFilterChange({
                  ReleaseYear: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="border-gray-200 focus:border-red-500 focus:ring-red-500"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
