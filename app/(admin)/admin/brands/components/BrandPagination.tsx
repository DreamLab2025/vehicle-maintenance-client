"use client";

import { Button } from "@/components/ui/button";
import { PaginationMetadata } from "@/lib/api/apiService";

interface Props {
  metadata: PaginationMetadata;
  onPageChange: (page: number) => void;
}

export function BrandPagination({ metadata, onPageChange }: Props) {
  const { pageNumber, totalPages, hasNextPage, hasPreviousPage } = metadata;

  return (
    <div className="flex items-center justify-end gap-2">
      <Button variant="outline" size="sm" disabled={!hasPreviousPage} onClick={() => onPageChange(pageNumber - 1)}>
        Trước
      </Button>

      <span className="text-sm">
        Trang {pageNumber} / {totalPages}
      </span>

      <Button variant="outline" size="sm" disabled={!hasNextPage} onClick={() => onPageChange(pageNumber + 1)}>
        Sau
      </Button>
    </div>
  );
}
