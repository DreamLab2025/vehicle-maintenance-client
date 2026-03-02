"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PaginationMetadata } from "@/lib/api/services/fetchModel";

interface ModelPaginationProps {
  metadata: PaginationMetadata;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function ModelPagination({ metadata, onPageChange, onPageSizeChange }: ModelPaginationProps) {
  const { pageNumber, pageSize, totalPages, totalItems, hasNextPage, hasPreviousPage } = metadata;

  const generatePageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (pageNumber > 3) pages.push("ellipsis");

      const start = Math.max(2, pageNumber - 1);
      const end = Math.min(totalPages - 1, pageNumber + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (pageNumber < totalPages - 2) pages.push("ellipsis");

      pages.push(totalPages);
    }

    return pages;
  };

  const from = totalItems === 0 ? 0 : (pageNumber - 1) * pageSize + 1;
  const to = Math.min(pageNumber * pageSize, totalItems);

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <p className="text-sm text-gray-500">
          Hiển thị <span className="font-medium text-gray-900">{from}</span> -{" "}
          <span className="font-medium text-gray-900">{to}</span> của{" "}
          <span className="font-medium text-gray-900">{totalItems}</span> kết quả
        </p>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Hiển thị:</span>
          <Select value={String(pageSize)} onValueChange={(value) => onPageSizeChange(Number(value))}>
            <SelectTrigger className="w-24 border-gray-200 bg-white text-gray-900 focus:ring-red-500 focus:border-red-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-[60] bg-white text-gray-900 border border-gray-200 shadow-lg">
              <SelectItem value="5" className="focus:bg-red-50">
                5
              </SelectItem>
              <SelectItem value="10" className="focus:bg-red-50">
                10
              </SelectItem>
              <SelectItem value="20" className="focus:bg-red-50">
                20
              </SelectItem>
              <SelectItem value="50" className="focus:bg-red-50">
                50
              </SelectItem>
              <SelectItem value="100" className="focus:bg-red-50">
                100
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Pagination>
        <PaginationContent className="gap-1">
          <PaginationItem>
            <PaginationPrevious
              onClick={() => hasPreviousPage && onPageChange(pageNumber - 1)}
              className={
                !hasPreviousPage
                  ? "pointer-events-none opacity-50 border-gray-200 bg-white"
                  : "cursor-pointer border border-gray-200 bg-white text-gray-900 hover:bg-red-50 hover:text-red-700"
              }
            />
          </PaginationItem>

          {generatePageNumbers().map((page, index) =>
            page === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis className="text-gray-400" />
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => onPageChange(page)}
                  isActive={page === pageNumber}
                  className={
                    page === pageNumber
                      ? "cursor-pointer border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                      : "cursor-pointer border border-gray-200 bg-white text-gray-900 hover:bg-red-50 hover:text-red-700"
                  }
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ),
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() => hasNextPage && onPageChange(pageNumber + 1)}
              className={
                !hasNextPage
                  ? "pointer-events-none opacity-50 border-gray-200 bg-white"
                  : "cursor-pointer border border-gray-200 bg-white text-gray-900 hover:bg-red-50 hover:text-red-700"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
