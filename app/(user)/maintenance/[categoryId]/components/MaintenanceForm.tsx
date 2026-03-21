"use client";

import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import type { PartCategory } from "@/lib/api/services/fetchPartCategories";
import type { SelectedItem } from "./shared";
import { DatePicker } from "@/components/ui/date-picker";

interface SelectedItemCardProps {
  item: SelectedItem;
  category: PartCategory;
  onRemove: () => void;
  onEdit: () => void;
}

export function SelectedItemCard({ item, onRemove, onEdit }: SelectedItemCardProps) {
  const productName = item.isCustom ? item.customPartName : item.productName;

  return (
    <div className="p-4 rounded-2xl border-2 border-neutral-200 bg-white">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-sm text-neutral-900">{productName}</h4>
            {item.isCustom && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500 text-white font-medium">
                Tùy chỉnh
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">{item.categoryName}</p>
          {item.isCustom && (
            <div className="flex items-center gap-3 mt-1">
              {item.customKmInterval && (
                <p className="text-xs text-neutral-600">{item.customKmInterval.toLocaleString("vi-VN")} km</p>
              )}
              {item.customMonthsInterval && (
                <p className="text-xs text-neutral-600">{item.customMonthsInterval} tháng</p>
              )}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-xs text-red-500 font-medium hover:text-red-600 transition-colors"
        >
          Xóa
        </button>
      </div>
      <div className="flex items-center justify-between">
        {item.price && (
          <p className="text-sm font-semibold text-red-500">{Number(item.price).toLocaleString("vi-VN")} đ</p>
        )}
        <button
          type="button"
          onClick={onEdit}
          className="text-xs text-red-500 font-medium hover:text-red-600 transition-colors"
        >
          Chỉnh sửa
        </button>
      </div>
      {item.instanceIdentifier && <p className="text-xs text-neutral-500 mt-1">Vị trí: {item.instanceIdentifier}</p>}
      {item.itemNotes && <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{item.itemNotes}</p>}
    </div>
  );
}

interface MaintenanceFormProps {
  selectedItems: SelectedItem[];
  categories: PartCategory[];
  serviceDate: string;
  odometerAtService: string;
  garageName: string;
  totalCost: string;
  notes: string;
  invoiceImageUrl: string;
  isSubmitting: boolean;
  onServiceDateChange: (date: string) => void;
  onOdometerChange: (odometer: string) => void;
  onGarageNameChange: (name: string) => void;
  onTotalCostChange: (cost: string) => void;
  onNotesChange: (notes: string) => void;
  onInvoiceImageUrlChange: (url: string) => void;
  onRemoveItem: (index: number) => void;
  onEditItem: (index: number) => void;
  onSubmit: () => void;
}

export function MaintenanceForm({
  selectedItems,
  categories,
  serviceDate,
  odometerAtService,
  garageName,
  totalCost,
  notes,
  invoiceImageUrl,
  isSubmitting,
  onServiceDateChange,
  onOdometerChange,
  onGarageNameChange,
  onTotalCostChange,
  onNotesChange,
  onInvoiceImageUrlChange,
  onRemoveItem,
  onEditItem,
  onSubmit,
}: MaintenanceFormProps) {
  const canSubmit = serviceDate !== "" && odometerAtService !== "";

  return (
    <>
      {/* Selected Items Summary */}
      <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
        <h3 className="font-semibold text-sm text-neutral-900 mb-3">
          Phụ tùng đã chọn ({selectedItems.length})
        </h3>
        <div className="space-y-3">
          {selectedItems.map((item, index) => {
            const category = categories.find((c) => c.id === item.categoryId);
            if (!category) return null;
            return (
              <SelectedItemCard
                key={index}
                item={item}
                category={category}
                onRemove={() => onRemoveItem(index)}
                onEdit={() => onEditItem(index)}
              />
            );
          })}
        </div>
      </div>

      {/* Form Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-neutral-900">Thông tin bảo dưỡng</h3>

        {/* Service Date */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-neutral-900">
            Ngày bảo dưỡng <span className="text-red-500">*</span>
          </label>
          <DatePicker
            value={serviceDate}
            onChange={onServiceDateChange}
            placeholder="Chọn ngày bảo dưỡng"
            max={new Date()}
            className="w-full"
          />
        </div>

        {/* Odometer */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-neutral-900">
            Số km tại thời điểm bảo dưỡng <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={odometerAtService}
            onChange={(e) => onOdometerChange(e.target.value)}
            placeholder="Nhập số km"
            min="0"
            className="w-full px-3 py-2.5 rounded-lg border border-neutral-300 bg-white focus:border-neutral-900 focus:outline-none text-sm"
          />
        </div>

        {/* Garage Name */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-neutral-900">Tên garage/cửa hàng</label>
          <input
            type="text"
            value={garageName}
            onChange={(e) => onGarageNameChange(e.target.value)}
            placeholder="Nhập tên garage (tùy chọn)"
            className="w-full px-3 py-2.5 rounded-lg border border-neutral-300 bg-white focus:border-neutral-900 focus:outline-none text-sm"
          />
        </div>

        {/* Total Cost */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-neutral-900">Tổng chi phí bảo dưỡng (VNĐ)</label>
          <input
            type="number"
            value={totalCost}
            onChange={(e) => onTotalCostChange(e.target.value)}
            placeholder="Nhập tổng chi phí (tùy chọn)"
            min="0"
            className="w-full px-3 py-2.5 rounded-lg border border-neutral-300 bg-white focus:border-neutral-900 focus:outline-none text-sm"
          />
        </div>

        {/* Invoice Image URL */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-neutral-900">Link ảnh hóa đơn</label>
          <input
            type="url"
            value={invoiceImageUrl}
            onChange={(e) => onInvoiceImageUrlChange(e.target.value)}
            placeholder="https://..."
            className="w-full px-3 py-2.5 rounded-lg border border-neutral-300 bg-white focus:border-neutral-900 focus:outline-none text-sm"
          />
        </div>

        {/* Notes */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-neutral-900">Ghi chú chung</label>
          <textarea
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Ghi chú về lần bảo dưỡng (tùy chọn)"
            rows={3}
            className="w-full px-3 py-2.5 rounded-lg border border-neutral-300 bg-white focus:border-neutral-900 focus:outline-none text-sm resize-none"
          />
        </div>
      </div>

      {/* Submit Button - Fixed at bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-4 left-4 right-4 z-30"
      >
        <motion.button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting || !canSubmit}
          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
          className="w-full py-3 rounded-lg bg-[#dc2626] text-white font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Đang tạo phiếu bảo dưỡng...</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              <span>Hoàn tất tạo phiếu bảo dưỡng</span>
            </>
          )}
        </motion.button>
      </motion.div>
    </>
  );
}
