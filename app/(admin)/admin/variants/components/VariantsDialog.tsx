// src/components/admin/variants/components/VariantsDialog.tsx
"use client";

import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image as ImageIcon, Palette } from "lucide-react";

import type { VehicleVariant } from "@/lib/api/services/fetchVariants";

export type VariantFormValues = {
  color: string;
  hexCode: string;
  imageUrl: string;
};

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;

  initialData: VehicleVariant | null;
  onSubmit: (values: VariantFormValues) => void;

  isSubmitting: boolean;
  isEditMode: boolean;

  modelName?: string;
};

function normalizeHex(hex: string) {
  const h = (hex || "").trim();
  if (!h) return "";
  const withHash = h.startsWith("#") ? h : `#${h}`;
  return withHash.toUpperCase();
}

function isValidHex(hex: string) {
  return /^#([0-9A-F]{3}|[0-9A-F]{6})$/.test((hex || "").trim().toUpperCase());
}

function isValidUrl(url: string) {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

/** Tách form thành component con để remount bằng key */
function VariantForm({
  initialData,
  onSubmit,
  isSubmitting,
  isEditMode,
  modelName,
  onClose,
}: {
  initialData: VehicleVariant | null;
  onSubmit: (values: VariantFormValues) => void;
  isSubmitting: boolean;
  isEditMode: boolean;
  modelName?: string;
  onClose: () => void;
}) {
  const initial = useMemo(
    () => ({
      color: initialData?.color ?? "",
      hexCode: initialData?.hexCode ?? "",
      imageUrl: initialData?.imageUrl ?? "",
    }),
    [initialData],
  );

  const [color, setColor] = useState(() => initial.color);
  const [hexCode, setHexCode] = useState(() => initial.hexCode);
  const [imageUrl, setImageUrl] = useState(() => initial.imageUrl);

  const normalizedHex = useMemo(() => normalizeHex(hexCode), [hexCode]);
  const okHex = useMemo(
    () => (normalizedHex ? isValidHex(normalizedHex) : false),
    [normalizedHex],
  );
  const okUrl = useMemo(
    () => (imageUrl ? isValidUrl(imageUrl.trim()) : false),
    [imageUrl],
  );

  const canSubmit =
    !!color.trim() &&
    !!normalizedHex.trim() &&
    okHex &&
    !!imageUrl.trim() &&
    okUrl &&
    !isSubmitting;

  const handleSubmit = () => {
    onSubmit({
      color: color.trim(),
      hexCode: normalizedHex.trim(),
      imageUrl: imageUrl.trim(),
    });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-slate-900">
          {isEditMode ? "Cập nhật Variant" : "Tạo Variant mới"}
        </DialogTitle>
        <DialogDescription className="text-slate-500">
          {modelName ? (
            <>
              Mẫu xe:{" "}
              <span className="text-slate-900 font-medium">{modelName}</span>
            </>
          ) : (
            "Nhập thông tin màu, mã hex và URL hình ảnh."
          )}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        {/* Color */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Tên màu</label>
          <div className="relative">
            <Palette className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="VD: Đen nhám / Đỏ GP..."
              className="pl-9 border-slate-200"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Hex */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Hex Code</label>
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-lg border border-slate-200 shadow-sm"
              style={{ backgroundColor: okHex ? normalizedHex : "#ffffff" }}
              title={okHex ? normalizedHex : "Hex không hợp lệ"}
            />
            <Input
              value={hexCode}
              onChange={(e) => setHexCode(e.target.value)}
              placeholder="VD: #1C1C1C"
              className="border-slate-200 font-mono"
              disabled={isSubmitting}
            />
          </div>
          {normalizedHex && !okHex ? (
            <p className="text-xs text-red-600">
              Hex không hợp lệ. Chấp nhận #RGB hoặc #RRGGBB.
            </p>
          ) : (
            <p className="text-xs text-slate-500">
              Tip: Bạn có thể nhập “1C1C1C”, hệ thống sẽ tự thêm “#”.
            </p>
          )}
        </div>

        {/* Image URL */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Image URL
          </label>
          <div className="relative">
            <ImageIcon className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="pl-9 border-slate-200"
              disabled={isSubmitting}
            />
          </div>

          {imageUrl && !okUrl ? (
            <p className="text-xs text-red-600">
              URL không hợp lệ (phải là http/https).
            </p>
          ) : null}

          {okUrl ? (
            <div className="mt-2">
              <p className="text-xs text-slate-500 mb-2">Preview:</p>
              <img
                src={imageUrl}
                alt="preview"
                className="w-full max-h-[220px] object-cover rounded-lg border border-slate-200 bg-slate-50"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          ) : null}
        </div>
      </div>

      <DialogFooter className="gap-2 sm:gap-0">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
          className="border-slate-200"
        >
          Hủy
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200 transition-all active:scale-95"
        >
          {isSubmitting ? "Đang lưu..." : isEditMode ? "Cập nhật" : "Tạo mới"}
        </Button>
      </DialogFooter>
    </>
  );
}

export default function VariantsDialog(props: Props) {
  const { open, onOpenChange, initialData, isSubmitting } = props;

  /**
   * Key này đảm bảo mỗi lần:
   * - mở dialog
   * - đổi initialData (edit variant khác)
   * thì form remount => state init lại mà không cần useEffect
   */
  const formKey = useMemo(() => {
    if (!open) return "closed";
    return initialData?.id ? `edit-${initialData.id}` : "create";
  }, [open, initialData?.id]);

  return (
    <Dialog open={open} onOpenChange={(v) => !isSubmitting && onOpenChange(v)}>
      <DialogContent className="sm:max-w-[640px] bg-white text-slate-900 border border-slate-200 shadow-xl">
        <VariantForm
          key={formKey}
          initialData={initialData}
          onSubmit={props.onSubmit}
          isSubmitting={props.isSubmitting}
          isEditMode={props.isEditMode}
          modelName={props.modelName}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
