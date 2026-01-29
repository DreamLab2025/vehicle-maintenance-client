"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw } from "lucide-react";

export function BrandFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Lấy giá trị tìm kiếm từ URL
  const search = searchParams.get("search") || "";

  const [searchValue, setSearchValue] = useState(search);

  // Đồng bộ state với URL khi query params thay đổi
  useEffect(() => {
    setSearchValue(search);
  }, [search]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    const params = new URLSearchParams(searchParams.toString());

    if (value.trim()) {
      params.set("search", value.trim());
    } else {
      params.delete("search");
    }

    // Reset về trang 1 khi thay đổi tìm kiếm
    params.set("page", "1");

    router.push(`?${params.toString()}`);
  };

  const resetFilter = () => {
    setSearchValue("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const hasFilter = searchValue.trim() !== "";

  return (
    <div className="rounded-xl border bg-white shadow-sm">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-slate-900">Bộ lọc thương hiệu</h3>

          {hasFilter && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 lg:px-3 text-xs text-slate-500 hover:text-red-600"
              onClick={resetFilter}
            >
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
              Đặt lại
            </Button>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Tìm theo tên thương hiệu..."
            className="pl-9"
            value={searchValue}
            onChange={handleSearch}
          />
        </div>

        {/* Hiển thị thông báo khi đang lọc */}
        {hasFilter && (
          <p className="mt-2 text-xs text-slate-500 italic">
            Đang hiển thị kết quả cho: <strong>&quot;{searchValue}&quot;</strong>
          </p>
        )}
      </div>
    </div>
  );
}
