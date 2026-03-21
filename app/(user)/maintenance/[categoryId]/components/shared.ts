"use client";

// Types
export interface SelectedItem {
  categoryId: string;
  categoryCode: string;
  categoryName: string;
  // Case 1: Product from system
  productId?: string;
  productName?: string;
  // Case 2: Custom product
  customPartName?: string;
  customKmInterval?: number;
  customMonthsInterval?: number;
  // Common fields
  price?: string;
  itemNotes?: string;
  instanceIdentifier?: string;
  isCustom: boolean;
}

export type MaintenanceStep = "vehicle" | "categories" | "products" | "form";

// Step config
export const MAINTENANCE_STEPS = [
  { id: "vehicle" as const, label: "Chọn xe" },
  { id: "categories" as const, label: "Loại phụ tùng" },
  { id: "products" as const, label: "Sản phẩm" },
  { id: "form" as const, label: "Hoàn tất" },
];
