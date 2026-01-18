"use client";

import { Card } from "@/components/ui/card";
import { useBrands } from "@/hooks/useBrand";
import { useState } from "react";
import Image from "next/image";

interface StepThreeProps {
  vehicleType: "motorcycle" | "car" | "electric";
  selectedBrandId?: string | null;
  onSelect: (brandId: string) => void; // ✅ trả id
  onBrandSelected: (brandId: string) => void; // ✅ gọi API lấy model xe
  onClear?: () => void; // ✅ clear brand
}

export function StepThreeBrand({ vehicleType, selectedBrandId, onSelect, onBrandSelected, onClear }: StepThreeProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // UI truyền params (phân trang + sort)
  const { brands, isLoading, isError } = useBrands(
    {
      PageNumber: 1,
      PageSize: 5, // lấy nhiều để lọc thoải mái
      IsDescending: false,
    },
    true
  );

  // Gọi API khi chọn thương hiệu
  const handleBrandSelect = (brandId: string) => {
    onSelect(brandId); // trả về brandId
    onBrandSelected(brandId); // gọi API để lấy mẫu xe
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
    }
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2 text-gray-900">Chọn hãng xe</h2>
        <p className="text-sm text-gray-500">Chọn hãng xe của bạn</p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-gray-400 border-r-transparent mb-2"></div>
            <p className="text-sm text-gray-500">Đang tải thương hiệu...</p>
          </div>
        </div>
      )}

      {isError && (
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-red-500">Không tải được danh sách thương hiệu.</p>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="grid grid-cols-4 gap-3">
          {/* Clear Card - First Card */}
          {onClear && (
            <Card
              className="relative p-4 cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-[1.02] border-gray-200 border-dashed-gray-200 overflow-hidden"
              onClick={handleClear}
            >
              {/* Diagonal Line (Prohibition Sign) - From top-left to bottom-right */}
              <div className="absolute inset-0 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <line x1="0" y1="0" x2="100" y2="100" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>

              {/* Empty space for visual balance */}
              <div className="relative h-14 w-14 mx-auto bg-transparent flex items-center justify-center opacity-0">
                <div className="w-8 h-8"></div>
              </div>
            </Card>
          )}

          {/* Brand Cards */}
          {brands.map((brand) => {
            const isSelected = selectedBrandId === brand.id;
            return (
              <Card
                key={brand.id}
                className={`
                  relative p-4 cursor-pointer transition-all duration-300
                  ${
                    isSelected
                      ? "ring-2 ring-black shadow-lg scale-105 bg-gray-50"
                      : "hover:shadow-md hover:scale-[1.02] border-gray-200"
                  }
                `}
                onClick={() => handleBrandSelect(brand.id)}
              >
                {/* Selected Indicator */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-black rounded-full flex items-center justify-center animate-in fade-in zoom-in duration-200">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}

                <div className="relative h-14 w-14 mx-auto bg-white/70 rounded-lg flex items-center justify-center overflow-hidden">
                  {brand.logoUrl ? (
                    <Image
                      src={brand.logoUrl}
                      alt={brand.name}
                      fill
                      className={`object-contain transition-transform duration-300 ${
                        isSelected ? "scale-110" : "group-hover:scale-105"
                      }`}
                      sizes="56px"
                    />
                  ) : (
                    <span className="text-xs text-gray-400">{brand.name}</span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
