// src/components/admin/parts/components/PartsDialog.tsx
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Image as ImageIcon, Hash, ListOrdered, Tag } from "lucide-react";
import type { PartCategory } from "@/lib/api/services/fetchPartCategories";

export type PartFormValues = {
  name: string;
  code: string;
  description: string;
  iconUrl: string;
  displayOrder: number;
  requiresOdometerTracking: boolean;
  requiresTimeTracking: boolean;
  allowsMultipleInstances: boolean;
  identificationSigns: string;
  consequencesIfNotHandled: string;
};

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;

  initialData: PartCategory | null;
  onSubmit: (values: PartFormValues) => void;

  isSubmitting: boolean;
  isEditMode: boolean;
};

function isValidUrl(url: string) {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function normalizeCode(code: string) {
  return code.trim().toUpperCase().replace(/\s+/g, "-");
}

function PartFormInner({
  initialData,
  onSubmit,
  isSubmitting,
  isEditMode,
  onClose,
}: {
  initialData: PartCategory | null;
  onSubmit: (values: PartFormValues) => void;
  isSubmitting: boolean;
  isEditMode: boolean;
  onClose: () => void;
}) {
  const initial = useMemo(
    () => ({
      name: initialData?.name ?? "",
      code: initialData?.code ?? "",
      description: initialData?.description ?? "",
      iconUrl: initialData?.iconUrl ?? "",
      displayOrder: initialData?.displayOrder ?? 1,
      requiresOdometerTracking: initialData?.requiresOdometerTracking ?? true,
      requiresTimeTracking: initialData?.requiresTimeTracking ?? true,
      allowsMultipleInstances: initialData?.allowsMultipleInstances ?? false,
      identificationSigns: initialData?.identificationSigns ?? "",
      consequencesIfNotHandled: initialData?.consequencesIfNotHandled ?? "",
    }),
    [initialData],
  );

  const [name, setName] = useState(() => initial.name);
  const [code, setCode] = useState(() => initial.code);
  const [description, setDescription] = useState(() => initial.description);
  const [iconUrl, setIconUrl] = useState(() => initial.iconUrl);
  const [displayOrder, setDisplayOrder] = useState(() => initial.displayOrder);
  const [requiresOdo, setRequiresOdo] = useState(
    () => initial.requiresOdometerTracking,
  );
  const [requiresTime, setRequiresTime] = useState(
    () => initial.requiresTimeTracking,
  );
  const [allowsMulti, setAllowsMulti] = useState(
    () => initial.allowsMultipleInstances,
  );
  const [identificationSigns, setIdentificationSigns] = useState(
    () => initial.identificationSigns,
  );
  const [consequences, setConsequences] = useState(
    () => initial.consequencesIfNotHandled,
  );

  const normalizedCode = useMemo(() => normalizeCode(code), [code]);
  const okIcon = useMemo(
    () => (iconUrl ? isValidUrl(iconUrl.trim()) : false),
    [iconUrl],
  );

  const canSubmit =
    !!name.trim() &&
    !!normalizedCode.trim() &&
    !!description.trim() &&
    !!iconUrl.trim() &&
    okIcon &&
    Number.isFinite(displayOrder) &&
    displayOrder >= 0 &&
    !!identificationSigns.trim() &&
    !!consequences.trim() &&
    !isSubmitting;

  const handleSubmit = () => {
    onSubmit({
      name: name.trim(),
      code: normalizedCode.trim(),
      description: description.trim(),
      iconUrl: iconUrl.trim(),
      displayOrder: Number(displayOrder),
      requiresOdometerTracking: requiresOdo,
      requiresTimeTracking: requiresTime,
      allowsMultipleInstances: allowsMulti,
      identificationSigns: identificationSigns.trim(),
      consequencesIfNotHandled: consequences.trim(),
    });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-slate-900">
          {isEditMode
            ? "Cập nhật Danh mục Phụ tùng"
            : "Tạo Danh mục Phụ tùng mới"}
        </DialogTitle>
        <DialogDescription className="text-slate-500">
          Quản lý các category của phụ tùng (dầu nhớt, lọc gió, bugi...).
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Tên danh mục
          </label>
          <div className="relative">
            <Tag className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-9 border-slate-200"
              placeholder="VD: Dầu nhớt động cơ"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* code */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Code</label>
          <div className="relative">
            <Hash className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="pl-9 border-slate-200 font-mono"
              placeholder="ENGINE-OIL"
              disabled={isSubmitting}
            />
          </div>
          <p className="text-xs text-slate-500">
            Tự chuẩn hóa: {normalizedCode || "-"}
          </p>
        </div>

        {/* description */}
        <div className="space-y-2 lg:col-span-2">
          <label className="text-sm font-medium text-slate-700">Mô tả</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border-slate-200 min-h-[88px]"
            placeholder="Mô tả ngắn về công dụng và chu kỳ thay..."
            disabled={isSubmitting}
          />
        </div>

        {/* iconUrl */}
        <div className="space-y-2 lg:col-span-2">
          <label className="text-sm font-medium text-slate-700">Icon URL</label>
          <div className="relative">
            <ImageIcon className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={iconUrl}
              onChange={(e) => setIconUrl(e.target.value)}
              className="pl-9 border-slate-200"
              placeholder="https://..."
              disabled={isSubmitting}
            />
          </div>
          {iconUrl && !okIcon ? (
            <p className="text-xs text-red-600">
              URL không hợp lệ (http/https).
            </p>
          ) : null}
        </div>

        {/* displayOrder */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Display Order
          </label>
          <div className="relative">
            <ListOrdered className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
              className="pl-9 border-slate-200"
              min={0}
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* switches */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Tracking</label>
          <div className="rounded-lg border border-slate-200 p-3 space-y-3 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700">Theo dõi ODO</span>
              <Switch
                checked={requiresOdo}
                onCheckedChange={(checked) => setRequiresOdo(checked)}
                disabled={isSubmitting}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700">Theo dõi thời gian</span>
              <Switch
                checked={requiresTime}
                onCheckedChange={(checked) => setRequiresTime(checked)}
                disabled={isSubmitting}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700">
                Cho phép nhiều instance
              </span>
              <Switch
                checked={allowsMulti}
                onCheckedChange={(checked) => setAllowsMulti(checked)}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        {/* identificationSigns */}
        <div className="space-y-2 lg:col-span-2">
          <label className="text-sm font-medium text-slate-700">
            Dấu hiệu nhận biết
          </label>
          <Textarea
            value={identificationSigns}
            onChange={(e) => setIdentificationSigns(e.target.value)}
            className="border-slate-200 min-h-[92px]"
            placeholder="VD: Dầu đen, đèn báo dầu sáng, tiếng kêu kim loại..."
            disabled={isSubmitting}
          />
        </div>

        {/* consequencesIfNotHandled */}
        <div className="space-y-2 lg:col-span-2">
          <label className="text-sm font-medium text-slate-700">
            Hậu quả nếu không xử lý
          </label>
          <Textarea
            value={consequences}
            onChange={(e) => setConsequences(e.target.value)}
            className="border-slate-200 min-h-[92px]"
            placeholder="VD: Mài mòn nhanh, kẹt piston, hỏng động cơ..."
            disabled={isSubmitting}
          />
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

export default function PartsDialog(props: Props) {
  const { open, onOpenChange, initialData, isSubmitting } = props;

  const formKey = useMemo(() => {
    if (!open) return "closed";
    return initialData?.id ? `edit-${initialData.id}` : "create";
  }, [open, initialData?.id]);

  return (
    <Dialog open={open} onOpenChange={(v) => !isSubmitting && onOpenChange(v)}>
      <DialogContent
        className="
          sm:max-w-[900px]
          bg-white text-slate-900 border border-slate-200 shadow-xl
          max-h-[90vh] overflow-y-auto
        "
      >
        <PartFormInner
          key={formKey}
          initialData={initialData}
          onSubmit={props.onSubmit}
          isSubmitting={props.isSubmitting}
          isEditMode={props.isEditMode}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
