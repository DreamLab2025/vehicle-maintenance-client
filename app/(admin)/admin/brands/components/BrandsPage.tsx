"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TableSkeleton } from "@/components/ui/skeletons";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useBrands, useDeleteBrand } from "@/hooks/useBrand";
import { Brand } from "@/lib/api/services/fetchBrand";
import { BrandFilters } from "./BrandFilters";
import { BrandToolbar } from "./BrandToolbar";
import { BrandTable } from "./BrandTable";
import { BrandDialog } from "./BrandDialog";
import { BrandEditDialog } from "./BrandEditDialog";

export default function BrandsPage() {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  const { brands, metadata, isLoading, isFetching, isError, refetch } = useBrands({
    PageNumber: pageNumber,
    PageSize: pageSize,
  });

  const { mutateAsync: deleteBrand, isPending: isDeleting } = useDeleteBrand();

  const filteredBrands = useMemo(() => {
    if (!searchValue.trim()) return brands;
    const q = searchValue.toLowerCase();
    return brands.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.website?.toLowerCase().includes(q) ||
        b.supportPhone?.includes(q),
    );
  }, [brands, searchValue]);

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setOpenEdit(true);
  };

  const handleDelete = async (brand: Brand) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa thương hiệu "${brand.name}"?`)) return;
    try {
      await deleteBrand(brand.id);
    } catch {
      alert("Xóa thương hiệu thất bại");
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản lý Thương hiệu</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Quản lý các hãng xe trong hệ thống
          </p>
        </div>
        <Button
          onClick={() => setOpenCreate(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0"
        >
          <Plus className="mr-2 h-4 w-4" />
          Thêm thương hiệu
        </Button>
      </div>

      {/* Filters row */}
      <div className="flex items-center gap-3 flex-wrap">
        <BrandFilters searchValue={searchValue} onSearchChange={setSearchValue} />
        <BrandToolbar onRefresh={() => void refetch()} isRefreshing={isFetching} />
      </div>

      {/* Content */}
      <Card>
        <CardContent className="p-0">
          {isError ? (
            <div className="p-6">
              <Alert variant="destructive">
                <AlertDescription>
                  Không thể tải dữ liệu.{" "}
                  <button
                    onClick={() => void refetch()}
                    className="underline underline-offset-2 font-medium"
                  >
                    Thử lại
                  </button>
                </AlertDescription>
              </Alert>
            </div>
          ) : isLoading || isFetching ? (
            <div className="p-6">
              <TableSkeleton rows={8} />
            </div>
          ) : (
            <BrandTable
              data={filteredBrands}
              isLoading={isDeleting}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {metadata && metadata.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                  className={!metadata.hasPreviousPage ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {Array.from({ length: metadata.totalPages }).map((_, i) => {
                const page = i + 1;
                if (
                  page === 1 ||
                  page === metadata.totalPages ||
                  (page >= pageNumber - 1 && page <= pageNumber + 1)
                ) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={page === pageNumber}
                        onClick={() => setPageNumber(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                if (page === pageNumber - 2 || page === pageNumber + 2) {
                  return <PaginationEllipsis key={page} />;
                }
                return null;
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setPageNumber((p) => Math.min(metadata.totalPages, p + 1))}
                  className={!metadata.hasNextPage ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Dialogs */}
      <BrandDialog open={openCreate} onOpenChange={setOpenCreate} />
      <BrandEditDialog
        open={openEdit}
        brand={editingBrand}
        onClose={() => {
          setOpenEdit(false);
          setEditingBrand(null);
        }}
      />
    </div>
  );
}
