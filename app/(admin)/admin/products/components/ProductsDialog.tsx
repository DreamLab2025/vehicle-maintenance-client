"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { PartProduct } from "@/lib/api/services/fetchPartProducts";
import { usePartCategories } from "@/hooks/usePartCategories";
import type { PartCategory } from "@/lib/api/services/fetchPartCategories";

export type ProductFormValues = {
  partCategoryId: string;
  name: string;
  brand: string;
  description: string;
  imageUrl: string;
  referencePrice: number;
  recommendedKmInterval: number;
  recommendedMonthsInterval: number;
};

function toNumberSafe(v: string, fallback: number): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export default function ProductsDialog(props: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initialData: PartProduct | null;
  onSubmit: (data: ProductFormValues) => void;
  isSubmitting: boolean;
  isEditMode: boolean;
  defaultCategoryId: string;
  lockCategory?: boolean;
}) {
  const {
    open,
    onOpenChange,
    initialData,
    onSubmit,
    isSubmitting,
    isEditMode,
    defaultCategoryId,
    lockCategory = false,
  } = props;

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
  } = usePartCategories(catParams, open);

  const activeCategories = useMemo(() => {
    return categories
      .filter((c: PartCategory) => c.status === "Active")
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }, [categories]);

  const initial: ProductFormValues = useMemo(() => {
    if (!initialData) {
      return {
        partCategoryId: defaultCategoryId ?? "",
        name: "",
        brand: "",
        description: "",
        imageUrl: "",
        referencePrice: 0,
        recommendedKmInterval: 0,
        recommendedMonthsInterval: 0,
      };
    }
    return {
      partCategoryId: initialData.partCategoryId,
      name: initialData.name,
      brand: initialData.brand,
      description: initialData.description,
      imageUrl: initialData.imageUrl,
      referencePrice: initialData.referencePrice,
      recommendedKmInterval: initialData.recommendedKmInterval,
      recommendedMonthsInterval: initialData.recommendedMonthsInterval,
    };
  }, [initialData, defaultCategoryId]);

  const [form, setForm] = useState<ProductFormValues>(initial);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm(initial);
    setError(null);
  }, [initial]);

  // Create mode: nếu chưa có categoryId thì auto chọn cái đầu tiên
  useEffect(() => {
    if (!open) return;
    if (isEditMode) return;
    if (form.partCategoryId) return;
    if (activeCategories.length === 0) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm((s) => ({ ...s, partCategoryId: activeCategories[0]!.id }));
  }, [open, isEditMode, form.partCategoryId, activeCategories]);

  const validate = (v: ProductFormValues): string | null => {
    if (!v.partCategoryId.trim()) return "Vui lòng chọn danh mục phụ tùng.";
    if (!v.name.trim()) return "Tên sản phẩm là bắt buộc.";
    if (!v.brand.trim()) return "Hãng (brand) là bắt buộc.";
    if (!v.description.trim()) return "Mô tả là bắt buộc.";
    if (!v.imageUrl.trim()) return "ImageUrl là bắt buộc (tạm thời).";
    if (v.referencePrice < 0) return "Giá không hợp lệ.";
    if (v.recommendedKmInterval < 0) return "Km interval không hợp lệ.";
    if (v.recommendedMonthsInterval < 0) return "Months interval không hợp lệ.";
    return null;
  };

  const handleSubmit = () => {
    const msg = validate(form);
    if (msg) {
      setError(msg);
      return;
    }
    setError(null);
    onSubmit(form);
  };

  const categoryDisabled =
    isSubmitting ||
    catsLoading ||
    catsFetching ||
    (lockCategory && !!defaultCategoryId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[720px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-slate-900">
            {isEditMode ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ✅ Category select */}
          <div>
            <label className="text-xs text-slate-600">Danh mục phụ tùng</label>
            <select
              value={form.partCategoryId}
              onChange={(e) =>
                setForm((s) => ({ ...s, partCategoryId: e.target.value }))
              }
              disabled={categoryDisabled}
              className="mt-1 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-red-200 disabled:bg-slate-50 disabled:text-slate-500"
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
                className="mt-2 text-xs text-red-600 underline underline-offset-2"
              >
                Không tải được danh mục — Thử lại
              </button>
            )}
          </div>

          {/* --- giữ nguyên các field còn lại --- */}
          <div>
            <label className="text-xs text-slate-600">Tên sản phẩm</label>
            <input
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              className="mt-1 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-red-200"
              placeholder="VD: Nhông sên dĩa DID..."
            />
          </div>

          <div>
            <label className="text-xs text-slate-600">Hãng</label>
            <input
              value={form.brand}
              onChange={(e) =>
                setForm((s) => ({ ...s, brand: e.target.value }))
              }
              className="mt-1 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-red-200"
              placeholder="VD: DID, Honda Genuine..."
            />
          </div>

          <div>
            <label className="text-xs text-slate-600">
              Giá tham khảo (VND)
            </label>
            <input
              type="number"
              value={form.referencePrice}
              onChange={(e) =>
                setForm((s) => ({
                  ...s,
                  referencePrice: toNumberSafe(e.target.value, 0),
                }))
              }
              className="mt-1 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-red-200"
              min={0}
            />
          </div>

          <div>
            <label className="text-xs text-slate-600">Chu kỳ km</label>
            <input
              type="number"
              value={form.recommendedKmInterval}
              onChange={(e) =>
                setForm((s) => ({
                  ...s,
                  recommendedKmInterval: toNumberSafe(e.target.value, 0),
                }))
              }
              className="mt-1 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-red-200"
              min={0}
            />
          </div>

          <div>
            <label className="text-xs text-slate-600">Chu kỳ tháng</label>
            <input
              type="number"
              value={form.recommendedMonthsInterval}
              onChange={(e) =>
                setForm((s) => ({
                  ...s,
                  recommendedMonthsInterval: toNumberSafe(e.target.value, 0),
                }))
              }
              className="mt-1 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-red-200"
              min={0}
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs text-slate-600">Image URL</label>
            <input
              value={form.imageUrl}
              onChange={(e) =>
                setForm((s) => ({ ...s, imageUrl: e.target.value }))
              }
              className="mt-1 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-red-200"
              placeholder="https://..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs text-slate-600">Mô tả</label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((s) => ({ ...s, description: e.target.value }))
              }
              className="mt-1 min-h-[110px] w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-200"
              placeholder="Mô tả sản phẩm..."
            />
          </div>
        </div>

        {error && (
          <div className="mt-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <DialogFooter className="mt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || catsLoading || catsFetching}
            className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200"
          >
            {isSubmitting ? "Đang lưu..." : isEditMode ? "Cập nhật" : "Tạo mới"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
