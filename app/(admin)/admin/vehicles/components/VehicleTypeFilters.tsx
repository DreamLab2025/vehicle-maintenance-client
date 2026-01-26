// src/components/admin/vehicle-types/VehicleTypeFilters.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, X, Filter } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar copy";

type VehicleTypeFiltersProps = object;

export default function VehicleTypeFilters({}: VehicleTypeFiltersProps) {
  const [hasDescription, setHasDescription] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const activeFiltersCount = [hasDescription, dateRange].filter(Boolean).length;

  const resetFilters = () => {
    setHasDescription(undefined);
    setDateRange(undefined);
    // onFilterChange?.({});
  };

  const renderDateRange = () => {
    if (!dateRange?.from) return null;
    if (!dateRange.to) {
      return `Từ ${format(dateRange.from, "dd/MM/yyyy", { locale: vi })}`;
    }
    return `${format(dateRange.from, "dd/MM/yyyy", { locale: vi })} → ${format(dateRange.to, "dd/MM/yyyy", {
      locale: vi,
    })}`;
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Nút mở bộ lọc */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Bộ lọc
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-1 px-1.5">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-80 p-4 space-y-6">
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Có mô tả</h4>
            <Select value={hasDescription} onValueChange={setHasDescription}>
              <SelectTrigger>
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="yes">Có mô tả</SelectItem>
                <SelectItem value="no">Không có mô tả</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-sm">Thời gian tạo</h4>
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              initialFocus
              locale={vi}
              className="rounded-md border"
            />
          </div>

          <div className="flex justify-between pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="mr-1.5 h-4 w-4" />
              Xóa bộ lọc
            </Button>
            <Button size="sm">Áp dụng</Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Hiển thị các filter đang active dưới dạng badge */}
      {hasDescription && hasDescription !== "all" && (
        <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1">
          {hasDescription === "yes" ? "Có mô tả" : "Không có mô tả"}
          <button onClick={() => setHasDescription(undefined)} className="ml-1 rounded-full hover:bg-muted p-0.5">
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {dateRange?.from && (
        <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1">
          <CalendarIcon className="h-3.5 w-3.5" />
          {renderDateRange()}
          <button onClick={() => setDateRange(undefined)} className="ml-1 rounded-full hover:bg-muted p-0.5">
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {activeFiltersCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          className="h-8 px-2 text-muted-foreground hover:text-foreground"
        >
          Xóa tất cả
        </Button>
      )}
    </div>
  );
}
