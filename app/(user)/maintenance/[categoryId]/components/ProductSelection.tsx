"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  Package,
  Check,
  Plus,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  FileText,
} from "lucide-react";
import type { PartProduct } from "@/lib/api/services/fetchPartProducts";
import type { PartCategory } from "@/lib/api/services/fetchPartCategories";
import type { SelectedItem } from "./shared";

interface ProductCardProps {
  product: PartProduct;
  isSelected: boolean;
  isAlreadyAdded: boolean;
  onClick: () => void;
  index: number;
}

export function ProductCard({ product, isSelected, isAlreadyAdded, onClick, index }: ProductCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={isAlreadyAdded}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`w-full flex items-center gap-4 p-3 rounded-lg border transition-all ${
        isAlreadyAdded
          ? "border-neutral-200 bg-neutral-100 opacity-60 cursor-not-allowed"
          : isSelected
          ? "border-[#dc2626] bg-neutral-50"
          : "border-neutral-200 bg-white hover:border-neutral-300"
      }`}
    >
      {product.imageUrl ? (
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={64}
          height={64}
          className="w-16 h-16 rounded-xl object-cover"
          unoptimized
        />
      ) : (
        <div className="rounded-lg flex items-center justify-center">
          <Image
            src="/images/product_test.png"
            alt="Product Test"
            width={56}
            height={56}
            className="w-full h-full rounded-xl object-fit relative"
          />
        </div>
      )}

      <div className="flex-1 text-left min-w-0">
        {/* Product Name and Brand */}
        <div className="flex items-start gap-2 mb-2">
          <h3
            className={`font-medium text-sm flex-1 min-w-0 line-clamp-2 ${
              isAlreadyAdded ? "text-neutral-400" : "text-neutral-900"
            }`}
          >
            {product.name}
          </h3>
          <span
            className={`text-[10px] font-medium border border-red-500 rounded-full px-2 py-0.5 bg-red-500 text-white whitespace-nowrap flex-shrink-0 ${
              isAlreadyAdded ? "opacity-60" : ""
            }`}
          >
            {product.brand}
          </span>
        </div>

        {/* Description */}
        {product.description && (
          <p
            className={`text-xs mt-1 line-clamp-2 ${
              isAlreadyAdded ? "text-neutral-300" : "text-neutral-500"
            }`}
          >
            {product.description}
          </p>
        )}

        {/* Price */}
        {product.referencePrice > 0 && (
          <p className={`text-sm font-semibold mt-2 ${isAlreadyAdded ? "text-neutral-400" : "text-[#dc2626]"}`}>
            {product.referencePrice.toLocaleString("vi-VN")} đ
          </p>
        )}

        {/* Already Added Badge */}
        {isAlreadyAdded && <p className="text-xs text-neutral-500 mt-1.5 font-medium">Đã được thêm</p>}
      </div>

      {isSelected && !isAlreadyAdded && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-5 h-5 rounded-full bg-[#dc2626] flex items-center justify-center"
        >
          <Check className="w-3 h-3 text-white" />
        </motion.div>
      )}
      {isAlreadyAdded && (
        <div className="w-5 h-5 rounded-full bg-neutral-300 flex items-center justify-center">
          <Check className="w-3 h-3 text-neutral-500" />
        </div>
      )}
    </motion.button>
  );
}

interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ProductPagination({ currentPage, totalPages, onPageChange }: ProductPaginationProps) {
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      {/* Previous Button */}
      <motion.button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        whileTap={{ scale: 0.95 }}
        className="w-9 h-9 rounded-lg border border-neutral-300 bg-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 transition-colors"
      >
        <ChevronLeft className="w-4 h-4 text-neutral-700" />
      </motion.button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
          const showPage = pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);

          if (!showPage) {
            if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
              return (
                <span key={pageNum} className="px-2 text-neutral-400">
                  ...
                </span>
              );
            }
            return null;
          }

          return (
            <motion.button
              key={pageNum}
              type="button"
              onClick={() => onPageChange(pageNum)}
              whileTap={{ scale: 0.95 }}
              className={`w-9 h-9 rounded-lg border flex items-center justify-center text-sm font-medium transition-colors ${
                currentPage === pageNum
                  ? "bg-[#dc2626] text-white border-[#dc2626]"
                  : "border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50"
              }`}
            >
              {pageNum}
            </motion.button>
          );
        })}
      </div>

      {/* Next Button */}
      <motion.button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        whileTap={{ scale: 0.95 }}
        className="w-9 h-9 rounded-lg border border-neutral-300 bg-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 transition-colors"
      >
        <ChevronRight className="w-4 h-4 text-neutral-700" />
      </motion.button>
    </div>
  );
}

interface ProductDetailsFormProps {
  currentProduct: PartProduct | null;
  isCustomProduct: boolean;
  currentPrice: string;
  currentItemNotes: string;
  currentInstanceIdentifier: string;
  customPartName: string;
  customKmInterval: string;
  customMonthsInterval: string;
  selectedCategory: PartCategory | null;
  editingItemIndex: number | null;
  onPriceChange: (price: string) => void;
  onItemNotesChange: (notes: string) => void;
  onInstanceIdentifierChange: (identifier: string) => void;
  onCustomPartNameChange: (name: string) => void;
  onCustomKmIntervalChange: (km: string) => void;
  onCustomMonthsIntervalChange: (months: string) => void;
  onAddItem: () => void;
  onCancel: () => void;
}

export function ProductDetailsForm({
  currentProduct,
  isCustomProduct,
  currentPrice,
  currentItemNotes,
  currentInstanceIdentifier,
  customPartName,
  customKmInterval,
  customMonthsInterval,
  selectedCategory,
  editingItemIndex,
  onPriceChange,
  onItemNotesChange,
  onInstanceIdentifierChange,
  onCustomPartNameChange,
  onCustomKmIntervalChange,
  onCustomMonthsIntervalChange,
  onAddItem,
  onCancel,
}: ProductDetailsFormProps) {
  const canSubmit = isCustomProduct
    ? customPartName.trim() !== "" && customKmInterval !== "" && customMonthsInterval !== ""
    : currentProduct !== null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-4"
    >
      <h4 className="font-semibold text-sm text-neutral-900">Thông tin chi tiết</h4>

      {/* Custom Product Fields */}
      {isCustomProduct && (
        <>
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-700">
              Tên sản phẩm <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={customPartName}
              onChange={(e) => onCustomPartNameChange(e.target.value)}
              placeholder="Dầu nhớt Liquid 5900"
              className="w-full px-3 py-2.5 rounded-lg border border-neutral-300 bg-white focus:border-[#dc2626] focus:outline-none text-sm transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-xs font-medium text-neutral-700">
                Chu kỳ thay theo km <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={customKmInterval}
                onChange={(e) => onCustomKmIntervalChange(e.target.value)}
                placeholder="2500"
                min="0"
                className="w-full px-3 py-2.5 rounded-lg border border-neutral-300 bg-white focus:border-[#dc2626] focus:outline-none text-sm transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-neutral-700">
                Chu kỳ thay theo tháng <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={customMonthsInterval}
                onChange={(e) => onCustomMonthsIntervalChange(e.target.value)}
                placeholder="6"
                min="0"
                className="w-full px-3 py-2.5 rounded-lg border border-neutral-300 bg-white focus:border-[#dc2626] focus:outline-none text-sm transition-colors"
              />
            </div>
          </div>
        </>
      )}

      {/* Price */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-neutral-700 flex items-center gap-2">
          <DollarSign className="w-3 h-3" />
          Giá phụ tùng (VNĐ)
        </label>
        <input
          type="number"
          value={currentPrice}
          onChange={(e) => onPriceChange(e.target.value)}
          placeholder={currentProduct && currentProduct.referencePrice > 0 ? currentProduct.referencePrice.toString() : "Nhập giá"}
          min="0"
          className="w-full px-3 py-2 rounded-xl border-2 border-neutral-200 bg-white focus:border-red-500 focus:outline-none text-sm"
        />
      </div>

      {/* Instance Identifier */}
      {selectedCategory?.allowsMultipleInstances && (
        <div className="space-y-2">
          <label className="text-xs font-medium text-neutral-700 flex items-center gap-2">
            <Package className="w-3 h-3" />
            Vị trí/Vị trí lắp đặt
          </label>
          <input
            type="text"
            value={currentInstanceIdentifier}
            onChange={(e) => onInstanceIdentifierChange(e.target.value)}
            placeholder="Ví dụ: Lốp trước trái, Má phanh sau..."
            className="w-full px-3 py-2 rounded-xl border-2 border-neutral-200 bg-white focus:border-red-500 focus:outline-none text-sm"
          />
        </div>
      )}

      {/* Item Notes */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-neutral-700 flex items-center gap-2">
          <FileText className="w-3 h-3" />
          Ghi chú về phụ tùng
        </label>
        <textarea
          value={currentItemNotes}
          onChange={(e) => onItemNotesChange(e.target.value)}
          placeholder="Ghi chú về phụ tùng đã thay (tùy chọn)"
          rows={2}
          className="w-full px-3 py-2 rounded-xl border-2 border-neutral-200 bg-white focus:border-red-500 focus:outline-none text-sm resize-none"
        />
      </div>

      {/* Add/Update Button */}
      <motion.button
        type="button"
        onClick={onAddItem}
        disabled={!canSubmit}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 rounded-lg bg-[#dc2626] text-white font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        <span>{editingItemIndex !== null ? "Cập nhật phụ tùng" : "Thêm phụ tùng"}</span>
      </motion.button>
    </motion.div>
  );
}

interface ProductSelectionProps {
  products: PartProduct[];
  selectedCategory: PartCategory | null;
  selectedItems: SelectedItem[];
  currentProductId: string | null;
  productPageNumber: number;
  productsMetadata: { totalPages: number } | null;
  isCustomProduct: boolean;
  isLoading: boolean;
  onProductSelect: (productId: string) => void;
  onPageChange: (page: number) => void;
  onToggleCustomProduct: (isCustom: boolean) => void;
  // Form state
  currentPrice: string;
  currentItemNotes: string;
  currentInstanceIdentifier: string;
  customPartName: string;
  customKmInterval: string;
  customMonthsInterval: string;
  // Form handlers
  onPriceChange: (price: string) => void;
  onItemNotesChange: (notes: string) => void;
  onInstanceIdentifierChange: (identifier: string) => void;
  onCustomPartNameChange: (name: string) => void;
  onCustomKmIntervalChange: (km: string) => void;
  onCustomMonthsIntervalChange: (months: string) => void;
  onAddItem: () => void;
  onCancel: () => void;
  editingItemIndex: number | null;
}

export function ProductSelection({
  products,
  selectedCategory,
  selectedItems,
  currentProductId,
  productPageNumber,
  productsMetadata,
  isCustomProduct,
  isLoading,
  onProductSelect,
  onPageChange,
  onToggleCustomProduct,
  currentPrice,
  currentItemNotes,
  currentInstanceIdentifier,
  customPartName,
  customKmInterval,
  customMonthsInterval,
  onPriceChange,
  onItemNotesChange,
  onInstanceIdentifierChange,
  onCustomPartNameChange,
  onCustomKmIntervalChange,
  onCustomMonthsIntervalChange,
  onAddItem,
  onCancel,
  editingItemIndex,
}: ProductSelectionProps) {
  const currentProduct = currentProductId ? products.find((p) => p.id === currentProductId) || null : null;
  const showDetailsForm = currentProduct || isCustomProduct;

  return (
    <>
      {/* Category Info */}
      {selectedCategory && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-neutral-50 border border-neutral-200"
        >
          <div className="flex items-center gap-3">
            {selectedCategory.iconUrl ? (
              <Image
                src={selectedCategory.iconUrl}
                alt={selectedCategory.name}
                width={40}
                height={40}
                className="w-10 h-10 rounded-lg object-cover"
                unoptimized
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-neutral-900 flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-neutral-900">{selectedCategory.name}</h3>
              {selectedCategory.description && (
                <p className="text-xs text-neutral-600 mt-0.5">{selectedCategory.description}</p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Toggle between system products and custom product */}
      <div className="relative p-1.5 rounded-2xl bg-neutral-100 mb-4 inline-flex w-full">
        <motion.div
          layoutId="toggle-bg"
          className="absolute top-1.5 bottom-1.5 rounded-xl bg-[#dc2626]"
          initial={false}
          animate={{
            left: isCustomProduct ? "50%" : "0.375rem",
            width: "calc(50% - 0.75rem)",
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
        />

        <motion.button
          type="button"
          onClick={() => onToggleCustomProduct(false)}
          whileTap={{ scale: 0.95 }}
          className={`relative z-10 flex-1 py-2.5 px-6 rounded-xl font-medium text-sm transition-colors duration-200 ${
            !isCustomProduct ? "text-white" : "text-neutral-600"
          }`}
        >
          Chọn từ hệ thống
        </motion.button>

        <motion.button
          type="button"
          onClick={() => onToggleCustomProduct(true)}
          whileTap={{ scale: 0.95 }}
          className={`relative z-10 flex-1 py-2.5 px-6 rounded-xl font-medium text-sm transition-colors duration-200 ${
            isCustomProduct ? "text-white" : "text-neutral-600"
          }`}
        >
          Nhập tùy chỉnh
        </motion.button>
      </div>

      {/* Products List */}
      {!isCustomProduct && (
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 mb-3">Chọn sản phẩm</h3>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-neutral-300 border-t-red-500 rounded-full animate-spin" />
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="space-y-3">
                {products.map((product, index) => {
                  const isAlreadyAdded = selectedItems.some((item) => !item.isCustom && item.productId === product.id);
                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isSelected={currentProductId === product.id}
                      isAlreadyAdded={isAlreadyAdded}
                      onClick={() => onProductSelect(product.id)}
                      index={index}
                    />
                  );
                })}
              </div>

              {/* Pagination */}
              {productsMetadata && productsMetadata.totalPages > 1 && (
                <ProductPagination
                  currentPage={productPageNumber}
                  totalPages={productsMetadata.totalPages}
                  onPageChange={onPageChange}
                />
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 p-6 rounded-2xl bg-neutral-50 border-2 border-dashed border-neutral-200">
              <Package className="w-12 h-12 text-neutral-300 mb-4" />
              <p className="text-sm font-medium text-neutral-400 text-center">
                Không có sản phẩm nào cho loại này
              </p>
            </div>
          )}
        </div>
      )}

      {/* Product Details Form */}
      {showDetailsForm && (
        <ProductDetailsForm
          currentProduct={currentProduct}
          isCustomProduct={isCustomProduct}
          currentPrice={currentPrice}
          currentItemNotes={currentItemNotes}
          currentInstanceIdentifier={currentInstanceIdentifier}
          customPartName={customPartName}
          customKmInterval={customKmInterval}
          customMonthsInterval={customMonthsInterval}
          selectedCategory={selectedCategory}
          editingItemIndex={editingItemIndex}
          onPriceChange={onPriceChange}
          onItemNotesChange={onItemNotesChange}
          onInstanceIdentifierChange={onInstanceIdentifierChange}
          onCustomPartNameChange={onCustomPartNameChange}
          onCustomKmIntervalChange={onCustomKmIntervalChange}
          onCustomMonthsIntervalChange={onCustomMonthsIntervalChange}
          onAddItem={onAddItem}
          onCancel={onCancel}
        />
      )}
    </>
  );
}
