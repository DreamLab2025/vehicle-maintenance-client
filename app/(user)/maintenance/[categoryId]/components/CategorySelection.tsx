"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Check, Package, Car } from "lucide-react";
import type { PaginationMetadata } from "@/lib/api/apiService";
import type { PartCategory } from "@/lib/api/services/fetchPartCategories";
import type { UserVehicle } from "@/lib/api/services/fetchUserVehicle";
import type { SelectedItem } from "./shared";
import { ProductPagination } from "./ProductSelection";

interface CategoryCardProps {
  category: PartCategory;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}

export function CategoryCard({ category, isSelected, onClick, index }: CategoryCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`w-full flex items-center gap-4 p-3 rounded-lg border transition-all ${
        isSelected
          ? "border-[#dc2626] bg-neutral-50"
          : "border-neutral-200 bg-white hover:border-neutral-300"
      }`}
    >
      {category.iconUrl ? (
        <Image
          src={category.iconUrl}
          alt={category.name}
          width={64}
          height={64}
          className="w-16 h-16 rounded-xl object-cover"
          unoptimized
        />
      ) : (
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
          <Package className="w-8 h-8 text-white" />
        </div>
      )}

      <div className="flex-1 text-left">
        <h3 className={`font-medium text-sm ${isSelected ? "text-neutral-900" : "text-neutral-900"}`}>
          {category.name}
        </h3>
        {category.description && (
          <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2">
            {category.description}
          </p>
        )}
      </div>

      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-5 h-5 rounded-full bg-[#dc2626] flex items-center justify-center"
        >
          <Check className="w-3 h-3 text-white" />
        </motion.div>
      )}
    </motion.button>
  );
}

interface SelectedItemsListProps {
  items: SelectedItem[];
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
  onContinue: () => void;
}

export function SelectedItemsList({ items, onEdit, onRemove, onContinue }: SelectedItemsListProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl bg-neutral-50 border border-neutral-200"
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-semibold text-sm text-neutral-900">
            Đã chọn {items.length} phụ tùng
          </h3>
        </div>
        <button
          type="button"
          onClick={onContinue}
          className="px-3 py-1.5 rounded-lg bg-neutral-900 text-white text-xs font-medium hover:bg-neutral-800 transition-colors"
        >
          Tiếp tục
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-neutral-200"
          >
            <div className="flex items-center gap-2 flex-1">
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
              <span className="text-sm text-neutral-700">
                {item.isCustom ? item.customPartName : item.productName}
              </span>
              {item.isCustom && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500 text-white font-medium">
                  Tùy chỉnh
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onEdit(index)}
                className="px-2 py-1 rounded text-neutral-600 text-xs hover:bg-neutral-100 transition-colors"
              >
                Sửa
              </button>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="px-2 py-1 rounded text-neutral-600 text-xs hover:bg-neutral-100 transition-colors"
              >
                Xóa
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

interface CategorySelectionProps {
  categories: PartCategory[];
  categoriesMetadata: PaginationMetadata | undefined;
  categoryPageNumber: number;
  onCategoryPageChange: (page: number) => void;
  selectedVehicle: UserVehicle | null;
  selectedCategoryId: string | null;
  selectedItems: SelectedItem[];
  isLoading: boolean;
  onCategorySelect: (categoryId: string) => void;
  onContinueToForm: () => void;
  onEditItem: (index: number) => void;
  onRemoveItem: (index: number) => void;
}

export function CategorySelection({
  categories,
  categoriesMetadata,
  categoryPageNumber,
  onCategoryPageChange,
  selectedVehicle,
  selectedCategoryId,
  selectedItems,
  isLoading,
  onCategorySelect,
  onContinueToForm,
  onEditItem,
  onRemoveItem,
}: CategorySelectionProps) {
  return (
    <>
      {/* Vehicle Info Card */}
      {selectedVehicle && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-neutral-50 border border-neutral-200"
        >
          <div className="flex items-center gap-3">
            {selectedVehicle.userVehicleVariant?.imageUrl ? (
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-white border border-neutral-200 flex-shrink-0">
                <Image
                  src={selectedVehicle.userVehicleVariant.imageUrl}
                  alt={selectedVehicle.licensePlate}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-lg bg-neutral-900 flex items-center justify-center flex-shrink-0">
                <Car className="w-8 h-8 text-white" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-neutral-500">Xe đã chọn</p>
              <p className="text-sm font-semibold text-neutral-900 truncate">{selectedVehicle.licensePlate}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Selected Items Summary */}
      {selectedItems.length > 0 && (
        <SelectedItemsList
          items={selectedItems}
          onEdit={onEditItem}
          onRemove={onRemoveItem}
          onContinue={onContinueToForm}
        />
      )}

      {/* Categories List */}
      <div>
        <h3 className="text-sm font-semibold text-neutral-900 mb-3">
          Chọn loại phụ tùng đã thay
        </h3>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-neutral-300 border-t-red-500 rounded-full animate-spin" />
          </div>
        ) : categories.length > 0 ? (
          <>
            <div className="space-y-3">
              {categories.map((category, index) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  isSelected={selectedCategoryId === category.id}
                  onClick={() => onCategorySelect(category.id)}
                  index={index}
                />
              ))}
            </div>
            {categoriesMetadata && categoriesMetadata.totalPages > 1 && (
              <ProductPagination
                currentPage={categoryPageNumber}
                totalPages={categoriesMetadata.totalPages}
                onPageChange={onCategoryPageChange}
              />
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 p-6 rounded-2xl bg-neutral-50 border-2 border-dashed border-neutral-200">
            <Package className="w-12 h-12 text-neutral-300 mb-4" />
            <p className="text-sm font-medium text-neutral-400 text-center">
              Chưa có danh mục phụ tùng nào cho xe này
            </p>
            <p className="text-xs text-neutral-400 mt-2 text-center">
              Vui lòng khai báo phụ tùng cho xe trước
            </p>
          </div>
        )}
      </div>

      {/* Continue Button - Fixed at bottom */}
      {selectedItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 left-4 right-4 z-30"
        >
          <motion.button
            type="button"
            onClick={onContinueToForm}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 rounded-lg bg-[#dc2626] text-white font-medium text-sm flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Tiếp tục với {selectedItems.length} phụ tùng</span>
          </motion.button>
        </motion.div>
      )}
    </>
  );
}
