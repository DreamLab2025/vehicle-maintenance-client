// src/components/admin/variants/components/VariantsFilters.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  Image as ImageIcon,
  Search,
} from "lucide-react";

type Props = {
  searchTerm: string;
  onSearchChange: (v: string) => void;

  onlyHasImage: boolean;
  onOnlyHasImageChange: (v: boolean) => void;

  sortDescending: boolean;
  onSortChange: (v: boolean) => void;

  disabled?: boolean;
  isLoading?: boolean;
};

export default function VariantsFilters({
  searchTerm,
  onSearchChange,
  onlyHasImage,
  onOnlyHasImageChange,
  sortDescending,
  onSortChange,
  disabled,
  isLoading,
}: Props) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        <div className="relative flex-1">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm theo màu / hex / imageUrl..."
            disabled={disabled}
            className="pl-9 border-slate-200"
          />
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant={onlyHasImage ? "default" : "outline"}
            onClick={() => onOnlyHasImageChange(!onlyHasImage)}
            disabled={disabled}
            className={
              onlyHasImage
                ? "bg-red-600 hover:bg-red-700 text-white shadow-red-200"
                : "border-slate-200 text-slate-700"
            }
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            Có ảnh
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => onSortChange(!sortDescending)}
            disabled={disabled}
            className="border-slate-200 text-slate-700"
          >
            {sortDescending ? (
              <>
                <ArrowDownWideNarrow className="mr-2 h-4 w-4" />
                Mới → cũ
              </>
            ) : (
              <>
                <ArrowUpWideNarrow className="mr-2 h-4 w-4" />
                Cũ → mới
              </>
            )}
          </Button>

          {isLoading ? (
            <div className="text-xs text-slate-500 flex items-center px-2">
              Đang tải…
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
