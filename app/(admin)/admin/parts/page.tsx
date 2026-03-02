// src/components/admin/parts/Partspage.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  LayoutGrid,
  AlertCircle,
  RefreshCcw,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import {
  usePartCategories,
  useCreatePartCategory,
  useUpdatePartCategory,
  useDeletePartCategory,
} from "@/hooks/usePartCategories";
import type {
  PartCategory,
  PartCategoryQueryParams,
} from "@/lib/api/services/fetchPartCategories";

import PartsDialog, { PartFormValues } from "./components/PartsDialog";
import PartsToolbar from "./components/PartsToolbar";
import PartsTable from "./components/PartsTable";
import PartsPagination from "./components/PartsPagination";
import PartsFilters from "./components/PartsFilters";
import { TableSkeleton } from "@/components/ui/skeletons";

type ApiErrorShape = {
  response?: { data?: { message?: string } };
  message?: string;
};

function getErrorMessage(err: unknown, fallback: string) {
  const e = err as ApiErrorShape;
  return e?.response?.data?.message || e?.message || fallback;
}

export default function Partspage() {
  /** ===== paging ===== */
  const [page, setPage] = useState(1);
  const pageSize = 8;

  /** ===== toolbar ===== */
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDescending, setSortDescending] = useState(true);

  /** ===== filters ===== */
  const [onlyRequiresOdo, setOnlyRequiresOdo] = useState(false);
  const [onlyRequiresTime, setOnlyRequiresTime] = useState(false);

  /** ===== dialog ===== */
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState<PartCategory | null>(null);

  /** ===== delete state ===== */
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const queryParams: PartCategoryQueryParams = {
    PageNumber: page,
    PageSize: pageSize,
    IsDescending: sortDescending,
  };

  const { categories, metadata, isLoading, isFetching, isError, refetch } =
    usePartCategories(queryParams, true);

  const createMutation = useCreatePartCategory();
  const updateMutation = useUpdatePartCategory();
  const deleteMutation = useDeletePartCategory();

  const isSubmittingForm = createMutation.isPending || updateMutation.isPending;
  const isDeleting = deleteMutation.isPending; // nếu cần

  const handleOpenCreate = () => {
    setSelected(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (v: PartCategory) => {
    setSelected(v);
    setDialogOpen(true);
  };

  /** ===== delete confirm toast with buttons ===== */
  const handleDelete = (v: PartCategory) => {
    toast.custom(
      (t) => (
        <div className="w-[360px] rounded-xl border border-slate-200 bg-white shadow-xl p-4">
          <div className="font-semibold text-slate-900">Xác nhận xoá</div>
          <div className="text-sm text-slate-600 mt-1">
            Bạn sắp xoá{" "}
            <span className="font-medium text-slate-900">{v.name}</span> (
            <span className="font-mono">{v.code}</span>). Hành động này không
            thể hoàn tác.
          </div>

          <div className="mt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              className="h-9 px-3 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50"
              onClick={() => toast.dismiss(t)}
              disabled={deletingId === v.id}
            >
              Hủy
            </button>

            <button
              type="button"
              className="h-9 px-3 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
              disabled={deletingId === v.id}
              onClick={() => {
                setDeletingId(v.id);
                deleteMutation.mutate(v.id, {
                  onSuccess: (res) => {
                    toast.success("Đã xoá", {
                      description:
                        typeof res.data === "string"
                          ? res.data
                          : "Xóa danh mục thành công",
                    });
                  },
                  onError: (err: unknown) => {
                    toast.error("Xóa thất bại", {
                      description: getErrorMessage(err, "Vui lòng thử lại."),
                    });
                  },
                  onSettled: () => {
                    setDeletingId(null);
                    toast.dismiss(t);
                  },
                });
              }}
            >
              {deletingId === v.id ? "Đang xóa..." : "Xóa"}
            </button>
          </div>
        </div>
      ),
      { duration: 10_000 },
    );
  };

  /** ===== create/update ===== */
  const handleSubmit = (values: PartFormValues) => {
    if (!selected) {
      createMutation.mutate(values, {
        onSuccess: (res) => {
          toast.success("Tạo thành công", {
            description: res.message || "Đã tạo category.",
          });
          setDialogOpen(false);
        },
        onError: (err: unknown) => {
          toast.error("Tạo thất bại", {
            description: getErrorMessage(err, "Vui lòng thử lại."),
          });
        },
      });
      return;
    }

    updateMutation.mutate(
      { id: selected.id, payload: values },
      {
        onSuccess: (res) => {
          toast.success("Cập nhật thành công", {
            description: res.message || "Đã cập nhật category.",
          });
          setDialogOpen(false);
          setSelected(null);
        },
        onError: (err: unknown) => {
          toast.error("Cập nhật thất bại", {
            description: getErrorMessage(err, "Vui lòng thử lại."),
          });
        },
      },
    );
  };

  /** ===== client-side filter on current page ===== */
  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    let list = [...(categories ?? [])];

    if (term) {
      list = list.filter((x) => {
        const n = (x.name ?? "").toLowerCase();
        const c = (x.code ?? "").toLowerCase();
        const d = (x.description ?? "").toLowerCase();
        return n.includes(term) || c.includes(term) || d.includes(term);
      });
    }

    if (onlyRequiresOdo) list = list.filter((x) => x.requiresOdometerTracking);
    if (onlyRequiresTime) list = list.filter((x) => x.requiresTimeTracking);

    return list;
  }, [categories, searchTerm, onlyRequiresOdo, onlyRequiresTime]);

  /** reset page on filter change (optional) */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage((prev) => (prev === 1 ? prev : 1));
  }, [searchTerm, onlyRequiresOdo, onlyRequiresTime, sortDescending]);

  return (
    <div className="container mx-auto py-8 space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-5">
        <div>
          <h1 className="text-3xl tracking-tight text-slate-900">
            Quản lý Danh mục Phụ tùng
          </h1>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isSubmittingForm}
            className="border-slate-200"
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Tải lại
          </Button>

          <Button
            onClick={handleOpenCreate}
            disabled={isSubmittingForm}
            className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200 transition-all active:scale-95"
          >
            <Plus className="mr-2 h-5 w-5" />
            Thêm danh mục
          </Button>
        </div>
      </div>

      {/* Tooling */}
      <div className="space-y-4">
        <PartsToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortDescending={sortDescending}
          onSortChange={setSortDescending}
          isLoading={isLoading || isFetching}
          disabled={isSubmittingForm}
        />

        <PartsFilters
          onlyRequiresOdo={onlyRequiresOdo}
          onOnlyRequiresOdoChange={setOnlyRequiresOdo}
          onlyRequiresTime={onlyRequiresTime}
          onOnlyRequiresTimeChange={setOnlyRequiresTime}
          disabled={isSubmittingForm}
          isLoading={isLoading || isFetching}
        />
      </div>

      {/* Main */}
      <div className="min-h-[420px]">
        {isError ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-red-200">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900">
              Không thể tải dữ liệu
            </h3>
            <p className="text-slate-500 mb-6 text-sm">
              Vui lòng kiểm tra kết nối và thử lại.
            </p>
            <Button
              variant="outline"
              onClick={() => refetch()}
              className="border-slate-200"
            >
              Tải lại
            </Button>
          </div>
        ) : isLoading || isFetching ? (
          <TableSkeleton rows={6} />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="p-4 bg-slate-50 rounded-full mb-4">
              <Wrench className="h-10 w-10 text-slate-300" />
            </div>
            <p className="text-slate-700 font-medium">Danh sách đang trống</p>
            <Button
              variant="link"
              className="text-red-600 mt-1"
              onClick={handleOpenCreate}
            >
              Nhấp để thêm danh mục đầu tiên
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <PartsTable
              data={filtered}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
              isDeletingId={deletingId}
              disabled={isSubmittingForm}
            />

            {metadata && (
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex justify-center">
                <PartsPagination
                  metadata={metadata}
                  currentPage={page}
                  onPageChange={setPage}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <PartsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={selected}
        onSubmit={handleSubmit}
        isSubmitting={isSubmittingForm}
        isEditMode={!!selected}
      />
    </div>
  );
}
