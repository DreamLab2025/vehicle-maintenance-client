// src/components/admin/variants/components/VariantsPagination.tsx
"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (p: number) => void;
};

export default function VariantsPagination({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
}: Props) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-3 w-full">
      <div className="text-sm text-slate-600">
        Hiển thị <span className="font-medium text-slate-900">{start}</span>–
        <span className="font-medium text-slate-900">{end}</span> /{" "}
        <span className="font-medium text-slate-900">{totalItems}</span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="border-slate-200"
          onClick={() => onPageChange(1)}
          disabled={!canPrev}
        >
          Đầu
        </Button>

        <Button
          variant="outline"
          className="border-slate-200"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canPrev}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Trước
        </Button>

        <div className="text-sm text-slate-700 px-2">
          Trang <span className="font-medium">{currentPage}</span> /{" "}
          <span className="font-medium">{totalPages}</span>
        </div>

        <Button
          variant="outline"
          className="border-slate-200"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canNext}
        >
          Sau
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>

        <Button
          variant="outline"
          className="border-slate-200"
          onClick={() => onPageChange(totalPages)}
          disabled={!canNext}
        >
          Cuối
        </Button>
      </div>
    </div>
  );
}
