"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import type { PaginationMetadata } from "@/lib/api/services/fetchUserVehicle";

type Props = {
  metadata?: PaginationMetadata;

  pageNumber: number;
  pageSize: number;

  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;

  isFetching?: boolean;
};

export default function UserVehiclePagination({
  metadata,
  pageNumber,
  pageSize,
  onPageChange,
  onPageSizeChange,
  isFetching,
}: Props) {
  const totalItems = metadata?.totalItems ?? 0;
  const totalPages = metadata?.totalPages ?? 1;
  const hasPrev = metadata?.hasPreviousPage ?? pageNumber > 1;
  const hasNext = metadata?.hasNextPage ?? pageNumber < totalPages;

  const from = totalItems === 0 ? 0 : (pageNumber - 1) * pageSize + 1;
  const to = totalItems === 0 ? 0 : Math.min(pageNumber * pageSize, totalItems);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm opacity-80">
        {isFetching ? "Đang cập nhật..." : null}
        <span className={isFetching ? "ml-2" : ""}>
          Hiển thị {from}-{to} / {totalItems}
        </span>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm opacity-80">Page size</span>
          <Select value={String(pageSize)} onValueChange={(v) => onPageSizeChange(Number(v))}>
            <SelectTrigger className="w-[110px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => onPageChange(pageNumber - 1)} disabled={!hasPrev}>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="min-w-[90px] text-center text-sm">
            {pageNumber} / {totalPages}
          </div>

          <Button variant="outline" size="icon" onClick={() => onPageChange(pageNumber + 1)} disabled={!hasNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
