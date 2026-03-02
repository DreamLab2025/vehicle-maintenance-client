"use client";

import { useMemo, useState } from "react";
import { Plus, LayoutGrid, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import type { PartProduct } from "@/lib/api/services/fetchPartProducts";
import type { PartCategory } from "@/lib/api/services/fetchPartCategories";

import {
  useCreateProduct,
  useDeleteProduct,
  useProductsByCategory,
  useUpdateProduct,
} from "@/hooks/usePartProducts";
import { usePartCategories } from "@/hooks/usePartCategories";

import ProductsFilters, {
  ProductStatusFilter,
} from "./components/ProductsFilters";
import ProductsDialog, { ProductFormValues } from "./components/ProductsDialog";
import ProductsToolbar from "./components/ProductsToolbar";
import ProductsTable from "./components/ProductsTable";
import { TableSkeleton } from "@/components/ui/skeletons";

type SortKey = "name" | "brand" | "price" | "createdAt";
type SortDir = "asc" | "desc";

type ApiErrorShape = {
  response?: { data?: { message?: string } };
  message?: string;
};

function getErrorMessage(err: unknown, fallback: string): string {
  const e = err as ApiErrorShape;
  return e?.response?.data?.message || e?.message || fallback;
}

export default function ProductsPage() {
  /** ===== Categories ===== */
  const catParams = useMemo(
    () => ({ PageNumber: 1, PageSize: 200, IsDescending: false }),
    [],
  );

  const {
    categories,
    isLoading: catsLoading,
    isFetching: catsFetching,
    isError: catsError,
    refetch: refetchCats,
  } = usePartCategories(catParams, true);

  const activeCategories = useMemo(() => {
    return (categories ?? [])
      .filter((c: PartCategory) => c.status === "Active")
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }, [categories]);

  const [userSelectedCategoryId, setUserSelectedCategoryId] =
    useState<string>("");

  const selectedCategoryId = useMemo(() => {
    if (userSelectedCategoryId) return userSelectedCategoryId;
    return activeCategories[0]?.id ?? "";
  }, [userSelectedCategoryId, activeCategories]);

  /** ===== Local filters ===== */
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProductStatusFilter>("All");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  /** ===== Dialog state ===== */
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState<PartProduct | null>(null);

  /** ===== Products query ===== */
  const productsEnabled = !!selectedCategoryId;
  const { products, isLoading, isFetching, isError, refetch } =
    useProductsByCategory(selectedCategoryId, productsEnabled);

  /** ===== Mutations ===== */
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const isSubmitting =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  /** ===== Derived list ===== */
  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    const base = (products ?? []).filter((p) => {
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.partCategoryName.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "All" ? true : p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    const dir = sortDir === "asc" ? 1 : -1;

    const getVal = (x: PartProduct): string | number => {
      switch (sortKey) {
        case "name":
          return x.name;
        case "brand":
          return x.brand;
        case "price":
          return x.referencePrice;
        case "createdAt":
          return x.createdAt;
      }
    };

    return [...base].sort((a, b) => {
      const av = getVal(a);
      const bv = getVal(b);

      if (typeof av === "number" && typeof bv === "number")
        return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
  }, [products, searchTerm, statusFilter, sortKey, sortDir]);

  /** ===== Actions ===== */
  const handleOpenCreate = () => {
    setSelected(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (p: PartProduct) => {
    setSelected(p);
    setDialogOpen(true);
  };

  const handleDelete = (p: PartProduct) => {
    // ✅ Confirm toast: Xóa / Hủy
    toast(`Xóa sản phẩm "${p.name}"?`, {
      description: "Hành động này không thể hoàn tác.",
      action: {
        label: "Xóa",
        onClick: () => {
          const tId = toast.loading("Đang xóa sản phẩm...");

          deleteMutation.mutate(
            { id: p.id, categoryId: p.partCategoryId },
            {
              onSuccess: (res) => {
                toast.dismiss(tId);
                toast.success("Đã xóa sản phẩm", {
                  description: res?.message ?? "Xóa thành công.",
                });
              },
              onError: (err) => {
                toast.dismiss(tId);
                toast.error("Xóa thất bại", {
                  description: getErrorMessage(err, "Vui lòng thử lại."),
                });
              },
            },
          );
        },
      },
      cancel: {
        label: "Hủy",
        onClick: () => {
          toast.message("Đã hủy xóa");
        },
      },
    });
  };

  const handleSubmit = (data: ProductFormValues) => {
    if (!selected) {
      const tId = toast.loading("Đang tạo sản phẩm...");

      createMutation.mutate(
        {
          partCategoryId: data.partCategoryId,
          name: data.name,
          brand: data.brand,
          description: data.description,
          imageUrl: data.imageUrl,
          referencePrice: data.referencePrice,
          recommendedKmInterval: data.recommendedKmInterval,
          recommendedMonthsInterval: data.recommendedMonthsInterval,
        },
        {
          onSuccess: (res) => {
            toast.dismiss(tId);
            toast.success("Tạo sản phẩm thành công", {
              description: res?.message ?? `Đã tạo: ${data.name}`,
            });
            setDialogOpen(false);
          },
          onError: (err) => {
            toast.dismiss(tId);
            toast.error("Tạo sản phẩm thất bại", {
              description: getErrorMessage(err, "Vui lòng thử lại."),
            });
          },
        },
      );

      return;
    }

    const tId = toast.loading("Đang cập nhật sản phẩm...");

    updateMutation.mutate(
      {
        id: selected.id,
        payload: {
          partCategoryId: data.partCategoryId,
          name: data.name,
          brand: data.brand,
          description: data.description,
          imageUrl: data.imageUrl,
          referencePrice: data.referencePrice,
          recommendedKmInterval: data.recommendedKmInterval,
          recommendedMonthsInterval: data.recommendedMonthsInterval,
        },
      },
      {
        onSuccess: (res) => {
          toast.dismiss(tId);
          toast.success("Cập nhật thành công", {
            description: res?.message ?? `Đã cập nhật: ${data.name}`,
          });
          setDialogOpen(false);
          setSelected(null);
        },
        onError: (err) => {
          toast.dismiss(tId);
          toast.error("Cập nhật thất bại", {
            description: getErrorMessage(err, "Vui lòng thử lại."),
          });
        },
      },
    );
  };

  const deletingId: string | null = deleteMutation.isPending
    ? (deleteMutation.variables?.id ?? null)
    : null;

  const showEmptyCategories =
    !catsLoading && !catsFetching && activeCategories.length === 0;

  return (
    <div className="container mx-auto py-8 space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-5">
        <div>
          <h1 className="text-3xl tracking-tight text-slate-900">
            Quản lý Sản phẩm Phụ tùng
          </h1>
        </div>

        <div className="flex gap-3 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-600">Danh mục phụ tùng</label>
            <select
              value={selectedCategoryId}
              onChange={(e) => setUserSelectedCategoryId(e.target.value)}
              disabled={catsLoading || catsFetching}
              className="h-10 w-[380px] rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-red-200 disabled:bg-slate-50 disabled:text-slate-500"
            >
              <option value="" disabled>
                {catsLoading || catsFetching
                  ? "Đang tải danh mục..."
                  : "Chọn danh mục"}
              </option>

              {activeCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>

            {catsError && (
              <button
                type="button"
                onClick={() => refetchCats()}
                className="text-xs text-red-600 underline underline-offset-2 w-fit"
              >
                Không tải được danh mục — Thử lại
              </button>
            )}

            {showEmptyCategories && (
              <div className="text-xs text-slate-500">
                Chưa có danh mục Active để chọn.
              </div>
            )}
          </div>

          <Button
            onClick={handleOpenCreate}
            disabled={isSubmitting || !selectedCategoryId}
            className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200 transition-all active:scale-95"
          >
            <Plus className="mr-2 h-5 w-5" />
            Thêm sản phẩm
          </Button>
        </div>
      </div>

      {/* Toolbar + Filters */}
      <div className="space-y-4 px-5">
        <ProductsToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortKey={sortKey}
          sortDir={sortDir}
          onSortKeyChange={setSortKey}
          onSortDirChange={setSortDir}
          isLoading={isLoading || isFetching}
          onRefresh={() => refetch()}
        />
        <ProductsFilters
          status={statusFilter}
          onStatusChange={setStatusFilter}
        />
      </div>

      {/* Content */}
      <div className="min-h-[420px] px-5">
        {!selectedCategoryId ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="p-4 bg-slate-50 rounded-full mb-4">
              <LayoutGrid className="h-10 w-10 text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium">
              Vui lòng chọn danh mục để xem sản phẩm
            </p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-red-200">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900">
              Không thể tải dữ liệu
            </h3>
            <p className="text-slate-500 mb-6 text-sm">
              Vui lòng kiểm tra API và thử lại.
            </p>
            <Button variant="outline" onClick={() => refetch()}>
              Tải lại
            </Button>
          </div>
        ) : isLoading || isFetching ? (
          <TableSkeleton rows={6} />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="p-4 bg-slate-50 rounded-full mb-4">
              <LayoutGrid className="h-10 w-10 text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium">
              Không có sản phẩm nào phù hợp
            </p>
            <Button
              variant="link"
              className="text-red-600 mt-1"
              onClick={handleOpenCreate}
              disabled={!selectedCategoryId}
            >
              Thêm sản phẩm đầu tiên
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <ProductsTable
              data={filtered}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
              isDeletingId={deletingId}
            />
          </div>
        )}
      </div>

      <ProductsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={selected}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        isEditMode={!!selected}
        defaultCategoryId={selectedCategoryId}
        lockCategory
      />
    </div>
  );
}
