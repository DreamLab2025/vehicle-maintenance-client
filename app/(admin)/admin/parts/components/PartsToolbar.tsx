// src/components/admin/parts/components/PartsToolbar.tsx
"use client";

import { Input } from "@/components/ui/input";
import { ArrowDownZA, ArrowUpZA, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  searchTerm: string;
  onSearchChange: (v: string) => void;

  sortDescending: boolean;
  onSortChange: (v: boolean) => void;

  isLoading?: boolean;
  disabled?: boolean;
};

export default function PartsToolbar({
  searchTerm,
  onSearchChange,
  sortDescending,
  onSortChange,
  isLoading,
  disabled,
}: Props) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm theo tên / code / mô tả..."
            className="pl-9 border-slate-200"
            disabled={disabled || isLoading}
          />
        </div>

        <Button
          type="button"
          variant="outline"
          className="border-slate-200"
          onClick={() => onSortChange(!sortDescending)}
          disabled={disabled || isLoading}
        >
          {sortDescending ? (
            <>
              <ArrowDownZA className="mr-2 h-4 w-4" /> Mới nhất
            </>
          ) : (
            <>
              <ArrowUpZA className="mr-2 h-4 w-4" /> Cũ nhất
            </>
          )}
        </Button>
      </div>

      <p className="text-xs text-slate-500 mt-2">
        Lưu ý: Search đang lọc trên dữ liệu trang hiện tại (API chưa có tham số
        search).
      </p>
    </div>
  );
}
