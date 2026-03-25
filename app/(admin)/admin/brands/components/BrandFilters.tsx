"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface BrandFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export function BrandFilters({ searchValue, onSearchChange }: BrandFiltersProps) {
  const hasFilter = searchValue.trim() !== "";

  return (
    <div className="relative max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        placeholder="Tìm theo tên thương hiệu..."
        className="pl-9"
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      {hasFilter && (
        <p className="mt-1.5 text-xs text-muted-foreground">
          Đang lọc: <span className="font-medium text-foreground">&quot;{searchValue}&quot;</span>
        </p>
      )}
    </div>
  );
}
