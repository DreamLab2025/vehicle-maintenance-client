"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useBrands, useDeleteBrand } from "@/hooks/useBrand";
import { Brand } from "@/lib/api/services/fetchBrand";

import { BrandToolbar } from "./components/BrandToolbar";
import { BrandFilters } from "./components/BrandFilters";
import { BrandTable } from "./components/BrandTable";
import { BrandPagination } from "./components/BrandPagination";

import { Building2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandEditDialog } from "./components/BrandEditDialog";

export default function BrandsPage() {
  const router = useRouter();

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  // ===== Fetch list =====
  const { brands, metadata, isLoading, isFetching, isError } = useBrands({
    PageNumber: pageNumber,
    PageSize: pageSize,
  });

  // ===== Delete mutation =====
  const { mutateAsync: deleteBrand, isPending } = useDeleteBrand();

  // ===== Handlers =====
  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setOpenEdit(true);
  };

  const handleDelete = async (brand: Brand) => {
    const ok = window.confirm(`Bạn có chắc chắn muốn xóa thương hiệu "${brand.name}"?`);
    if (!ok) return;

    try {
      await deleteBrand(brand.id);
    } catch {
      alert("Xóa thương hiệu thất bại");
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <Building2 className="w-6 h-6 text-red-600" />
            </div>
            <h1 className="text-3xl ">Quản lý Thương hiệu</h1>
          </div>
          <p className="text-slate-500 text-sm ml-11">Quản lý các hãng xe trong hệ thống</p>
        </div>
        <div className="ml-auto px-5">
          <BrandToolbar />
        </div>
      </div>

      <BrandFilters />

      {/* Content */}
      {isError ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-red-200">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <p className="font-semibold">Lỗi tải dữ liệu</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Thử lại
          </Button>
        </div>
      ) : (
        <>
          <BrandTable
            data={brands}
            isLoading={isLoading || isFetching || isPending}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <BrandEditDialog
            open={openEdit}
            brand={editingBrand}
            onClose={() => {
              setOpenEdit(false);
              setEditingBrand(null);
            }}
          />

          {metadata && (
            <div className="mt-6 bg-white p-4 rounded-xl border">
              <BrandPagination metadata={metadata} onPageChange={setPageNumber} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
