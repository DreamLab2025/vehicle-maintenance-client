// src/components/admin/parts/components/PartsPagination.tsx
"use client";

import { Button } from "@/components/ui/button";
import type { PaginationMetadata } from "@/lib/api/apiService";

type Props = {
  metadata: PaginationMetadata;
  currentPage: number;
  onPageChange: (page: number) => void;
};

export default function PartsPagination({ metadata, currentPage, onPageChange }: Props) {
  const canPrev = metadata?.hasPreviousPage;
  const canNext = metadata?.hasNextPage;

  return (
    <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div className="text-sm text-slate-600">
        Trang <span className="font-medium text-slate-900">{metadata.pageNumber}</span> /{" "}
        <span className="font-medium text-slate-900">{metadata.totalPages}</span> — Tổng{" "}
        <span className="font-medium text-slate-900">{metadata.totalItems}</span> mục
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="border-slate-200"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={!canPrev}
        >
          Trước
        </Button>

        <Button
          className="bg-red-600 hover:bg-red-700 text-white"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canNext}
        >
          Sau
        </Button>
      </div>
    </div>
  );
}
