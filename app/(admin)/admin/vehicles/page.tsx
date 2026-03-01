// src/components/admin/vehicle-types/VehicleTypesPage.tsx
"use client";

import { useState } from "react";
import type { VehicleType } from "@/lib/api/services/fetchType";

import { Button } from "@/components/ui/button";
import { Plus, LayoutGrid, AlertCircle } from "lucide-react";
import VehicleTypeToolbar from "./components/VehicleTypeToolbar";
import VehicleTypePagination from "./components/VehicleTypePagination";
import VehicleTypeDialog, { FormValues } from "./components/VehicleTypeDialog";
import VehicleTypeTable from "./components/VehicleTypeTable";
import {
  useCreateType,
  useDeleteType,
  useTypes,
  useUpdateType,
} from "@/hooks/useType";

export default function VehicleTypesPage() {
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDescending, setSortDescending] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<VehicleType | null>(null);

  const queryParams = {
    PageNumber: page,
    PageSize: pageSize,
    IsDescending: sortDescending,
  };

  const { types, metadata, isLoading, isFetching, isError } =
    useTypes(queryParams);
  const createMutation = useCreateType();
  const updateMutation = useUpdateType();
  const deleteMutation = useDeleteType();

  const handleOpenCreate = () => {
    setSelectedType(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (type: VehicleType) => {
    setSelectedType(type);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa loại xe này?")) return;
    deleteMutation.mutate(id);
  };

  const handleSubmit = (data: FormValues) => {
    if (!selectedType) {
      createMutation.mutate(
        { name: data.name, description: data.description ?? "" },
        { onSuccess: () => setDialogOpen(false) },
      );
      return;
    }
    updateMutation.mutate(
      {
        id: selectedType.id,
        payload: { name: data.name, description: data.description ?? "" },
      },
      {
        onSuccess: () => {
          setDialogOpen(false);
          setSelectedType(null);
        },
      },
    );
  };

  const isSubmitting =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  return (
    <div className="container mx-auto py-8 space-y-8 max-w-7xl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-5">
        <div>
          <h1 className="text-3xl tracking-tight text-slate-900">
            Quản lý Loại Xe
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Danh sách các phân loại phương tiện trong hệ thống vận tải.
          </p>
        </div>
        <Button
          onClick={handleOpenCreate}
          disabled={isSubmitting}
          className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200 transition-all active:scale-95"
        >
          <Plus className="mr-2 h-5 w-5" />
          Thêm loại xe mới
        </Button>
      </div>

      <div className="space-y-4">
        <VehicleTypeToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortDescending={sortDescending}
          onSortChange={setSortDescending}
          isLoading={isLoading || isFetching}
        />
        {/* <VehicleTypeFilters /> */} {/* Giữ lại nếu bạn có filter khác */}
      </div>

      {/* Main Content Area */}
      <div className="min-h-[400px]">
        {isError ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-red-200">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900">
              Không thể tải dữ liệu
            </h3>
            <p className="text-slate-500 mb-6 text-sm">
              Vui lòng kiểm tra kết nối mạng và thử lại.
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Tải lại trang
            </Button>
          </div>
        ) : isLoading || isFetching ? (
          /* Table Skeleton Loading */
          <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
            <div className="h-12 bg-slate-50 border-b border-slate-100 animate-pulse" />
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex gap-4 p-4 border-b border-slate-50 items-center"
              >
                <div className="h-4 w-1/4 bg-slate-100 rounded animate-pulse" />
                <div className="h-4 w-2/4 bg-slate-50 rounded animate-pulse" />
                <div className="h-4 w-1/4 bg-slate-100 rounded animate-pulse ml-auto" />
              </div>
            ))}
          </div>
        ) : types.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="p-4 bg-slate-50 rounded-full mb-4">
              <LayoutGrid className="h-10 w-10 text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium">
              Danh sách hiện đang trống
            </p>
            <Button
              variant="link"
              className="text-red-600 mt-1"
              onClick={handleOpenCreate}
            >
              Nhấp vào đây để thêm loại xe đầu tiên
            </Button>
          </div>
        ) : (
          /* TRÌNH BÀY BẢNG: Đã bỏ Grid wrapper để bảng hiển thị full-width */
          <div className="space-y-6">
            <VehicleTypeTable
              data={types || []}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
              isDeletingId={
                deleteMutation.isPending
                  ? (deleteMutation.variables as string)
                  : null
              }
            />

            {/* Pagination bám sát phía dưới bảng */}
            {metadata && (
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex justify-center">
                <VehicleTypePagination
                  metadata={metadata}
                  currentPage={page}
                  onPageChange={setPage}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <VehicleTypeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={selectedType}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        isEditMode={!!selectedType}
      />
    </div>
  );
}
