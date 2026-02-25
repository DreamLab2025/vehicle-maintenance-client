// src/components/admin/variants/Variantspage.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  LayoutGrid,
  AlertCircle,
  RefreshCcw,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { useModels } from "@/hooks/useModel";
import type { ModelQueryParams } from "@/lib/api/services/fetchModel";

import {
  useVariantsByModelId,
  useCreateVariant,
  useUpdateVariant,
  useDeleteVariant,
} from "@/hooks/useVariants";
import type { VehicleVariant } from "@/lib/api/services/fetchVariants";

import VariantsDialog, { VariantFormValues } from "./components/VariantsDialog";
import VariantsToolbar from "./components/VariantsToolbar";
import VariantsTable from "./components/VariantsTable";
import VariantsPagination from "./components/VariantsPagination";
import VariantsFilters from "./components/VariantsFilters";

type ApiErrorShape = {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
};

function getErrorMessage(err: unknown, fallback: string) {
  const e = err as ApiErrorShape;
  return e?.response?.data?.message || e?.message || fallback;
}

export default function Variantspage() {
  /** ====== Model selector (context) ====== */
  const [selectedModelId, setSelectedModelId] = useState<string>("");

  /** ====== Filters ====== */
  const [searchTerm, setSearchTerm] = useState("");
  const [onlyHasImage, setOnlyHasImage] = useState(false);
  const [sortDescending, setSortDescending] = useState(true);

  /** ====== Paging (client-side) ====== */
  const [page, setPage] = useState(1);
  const pageSize = 8;

  /** ====== Dialog state ====== */
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<VehicleVariant | null>(
    null,
  );

  /** ====== Delete state (for UI disable + confirm) ====== */
  const [deletingId, setDeletingId] = useState<string | null>(null);
  /** ====== Load models for dropdown ====== */
  const modelQueryParams: ModelQueryParams = {
    PageNumber: 1,
    PageSize: 100,
    IsDescending: true,
  };

  const {
    models,
    isLoading: isModelsLoading,
    isFetching: isModelsFetching,
    isError: isModelsError,
  } = useModels(modelQueryParams, true);

  const { variants, isLoading, isFetching, isError, refetch } =
    useVariantsByModelId(selectedModelId, !!selectedModelId);

  const createMutation = useCreateVariant();
  const updateMutation = useUpdateVariant(selectedModelId);
  const deleteMutation = useDeleteVariant(selectedModelId);

  const isSubmitting =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const handleOpenCreate = () => {
    if (!selectedModelId) {
      toast.warning("Vui lòng chọn mẫu xe trước");
      return;
    }
    setSelectedVariant(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (v: VehicleVariant) => {
    setSelectedVariant(v);
    setDialogOpen(true);
  };

  /** ===== Delete: 2-step confirm via toast (no ToastAction) ===== */
  const handleDelete = (v: VehicleVariant) => {
    toast.custom(
      (id) => (
        <div className="w-[360px] rounded-xl border border-slate-200 bg-white shadow-xl p-4">
          <div className="font-semibold text-slate-900">Xác nhận xoá</div>
          <div className="text-sm text-slate-600 mt-1">
            Bạn sắp xoá <span className="font-medium">{v.color}</span> (
            {v.hexCode}). Hành động này không thể hoàn tác.
          </div>

          <div className="mt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              className="h-9 px-3 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              onClick={() => toast.dismiss(id)}
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
                      description: res.data || "Xóa variant thành công",
                    });
                  },
                  onError: (err: unknown) => {
                    toast.error("Xóa thất bại", {
                      description: getErrorMessage(err, "Vui lòng thử lại."),
                    });
                  },
                  onSettled: () => {
                    setDeletingId(null);
                    toast.dismiss(id);
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

  /** ===== Create / Update with toast ===== */
  const handleSubmit = (values: VariantFormValues) => {
    if (!selectedModelId) {
      toast.warning("Vui lòng chọn mẫu xe trước");
      return;
    }

    if (!selectedVariant) {
      createMutation.mutate(
        {
          vehicleModelId: selectedModelId,
          color: values.color.trim(),
          hexCode: values.hexCode.trim(),
          imageUrl: values.imageUrl.trim(),
        },
        {
          onSuccess: (res) => {
            toast.success("Tạo thành công", {
              description: res.message || "Đã tạo variant mới.",
            });
            setDialogOpen(false);
          },
          onError: (err: unknown) => {
            toast.error("Tạo thất bại", {
              description: getErrorMessage(err, "Vui lòng thử lại."),
            });
          },
        },
      );
      return;
    }

    updateMutation.mutate(
      {
        id: selectedVariant.id,
        payload: {
          color: values.color.trim(),
          hexCode: values.hexCode.trim(),
          imageUrl: values.imageUrl.trim(),
        },
      },
      {
        onSuccess: (res) => {
          toast.success("Cập nhật thành công", {
            description: res.message || "Đã cập nhật variant.",
          });
          setDialogOpen(false);
          setSelectedVariant(null);
        },
        onError: (err: unknown) => {
          toast.error("Cập nhật thất bại", {
            description: getErrorMessage(err, "Vui lòng thử lại."),
          });
        },
      },
    );
  };

  /** ===== Derived data: filtering + sorting + paging ===== */
  const filteredSorted = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    let list = [...(variants ?? [])];

    if (term) {
      list = list.filter((x) => {
        const c = (x.color ?? "").toLowerCase();
        const h = (x.hexCode ?? "").toLowerCase();
        const u = (x.imageUrl ?? "").toLowerCase();
        return c.includes(term) || h.includes(term) || u.includes(term);
      });
    }

    if (onlyHasImage) {
      list = list.filter((x) => !!x.imageUrl && x.imageUrl.startsWith("http"));
    }

    list.sort((a, b) => {
      const t1 = new Date(a.createdAt).getTime();
      const t2 = new Date(b.createdAt).getTime();
      return sortDescending ? t2 - t1 : t1 - t2;
    });

    return list;
  }, [variants, searchTerm, onlyHasImage, sortDescending]);

  const totalItems = filteredSorted.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const paged = useMemo(() => {
    const safePage = Math.min(Math.max(page, 1), totalPages);
    const start = (safePage - 1) * pageSize;
    return filteredSorted.slice(start, start + pageSize);
  }, [filteredSorted, page, totalPages]);

  // reset page when filters change / model change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage((prev) => (prev === 1 ? prev : 1));
  }, [selectedModelId, searchTerm, onlyHasImage, sortDescending]);

  const selectedModelName = useMemo(() => {
    const m = models?.find((x) => x.id === selectedModelId);
    return m?.name ?? "";
  }, [models, selectedModelId]);

  return (
    <div className="container mx-auto py-8 space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-5">
        <div>
          <h1 className="text-3xl tracking-tight text-slate-900">
            Quản lý Màu & Hình Ảnh
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Chọn mẫu xe → quản lý danh sách màu, mã hex, và ảnh đại diện theo
            mẫu.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={!selectedModelId || isSubmitting}
            className="border-slate-200"
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Tải lại
          </Button>

          <Button
            onClick={handleOpenCreate}
            disabled={!selectedModelId || isSubmitting}
            className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200 transition-all active:scale-95"
          >
            <Plus className="mr-2 h-5 w-5" />
            Thêm màu/ảnh
          </Button>
        </div>
      </div>

      {/* Tooling */}
      <div className="space-y-4">
        <VariantsToolbar
          models={models ?? []}
          isModelsLoading={isModelsLoading || isModelsFetching}
          isModelsError={isModelsError}
          selectedModelId={selectedModelId}
          onSelectedModelIdChange={setSelectedModelId}
          selectedModelName={selectedModelName}
          disabled={isSubmitting}
        />

        <VariantsFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onlyHasImage={onlyHasImage}
          onOnlyHasImageChange={setOnlyHasImage}
          sortDescending={sortDescending}
          onSortChange={setSortDescending}
          disabled={!selectedModelId || isSubmitting}
          isLoading={isLoading || isFetching}
        />
      </div>

      {/* Main */}
      <div className="min-h-[420px]">
        {!selectedModelId ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="p-4 bg-slate-50 rounded-full mb-4">
              <ImageIcon className="h-10 w-10 text-slate-300" />
            </div>
            <p className="text-slate-700 font-medium">
              Chọn một mẫu xe để xem Variants
            </p>
            <p className="text-slate-500 text-sm mt-1">
              Bạn có thể chọn từ dropdown phía trên.
            </p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-red-200">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900">
              Không thể tải dữ liệu Variants
            </h3>
            <p className="text-slate-500 mb-6 text-sm">
              Vui lòng kiểm tra kết nối và thử lại.
            </p>
            <Button variant="outline" onClick={() => refetch()}>
              Tải lại
            </Button>
          </div>
        ) : isLoading || isFetching ? (
          <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
            <div className="h-12 bg-slate-50 border-b border-slate-100 animate-pulse" />
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex gap-4 p-4 border-b border-slate-50 items-center"
              >
                <div className="h-10 w-10 bg-slate-100 rounded-lg animate-pulse" />
                <div className="h-4 w-1/4 bg-slate-100 rounded animate-pulse" />
                <div className="h-4 w-1/5 bg-slate-50 rounded animate-pulse" />
                <div className="h-4 w-2/5 bg-slate-100 rounded animate-pulse ml-auto" />
              </div>
            ))}
          </div>
        ) : totalItems === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="p-4 bg-slate-50 rounded-full mb-4">
              <LayoutGrid className="h-10 w-10 text-slate-300" />
            </div>
            <p className="text-slate-700 font-medium">
              Chưa có Variant nào cho mẫu xe này
            </p>
            <Button
              variant="link"
              className="text-red-600 mt-1"
              onClick={handleOpenCreate}
            >
              Nhấp để thêm màu/ảnh đầu tiên
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <VariantsTable
              data={paged}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
              isDeletingId={deletingId}
              disabled={isSubmitting}
            />

            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex justify-center">
              <VariantsPagination
                currentPage={page}
                pageSize={pageSize}
                totalItems={totalItems}
                onPageChange={setPage}
              />
            </div>
          </div>
        )}
      </div>

      <VariantsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={selectedVariant}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        isEditMode={!!selectedVariant}
        modelName={selectedModelName}
      />
    </div>
  );
}
