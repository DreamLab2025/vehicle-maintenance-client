import { Button } from "@/components/ui/button";
import { PaginationMetadata } from "@/lib/api/apiService";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  metadata: PaginationMetadata;
  currentPage: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export default function VehicleTypePagination({ metadata, currentPage, onPageChange, disabled = false }: Props) {
  const { pageNumber, totalPages, hasPreviousPage, hasNextPage } = metadata;

  return (
    <div className="flex items-center justify-between border-t pt-6 mt-8">
      <div className="text-sm text-muted-foreground">
        Hiển thị trang {pageNumber} / {totalPages} • Tổng {metadata.totalItems} loại xe
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!hasPreviousPage || disabled}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Trước
        </Button>

        <Button
          variant="outline"
          size="sm"
          disabled={!hasNextPage || disabled}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Sau
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
