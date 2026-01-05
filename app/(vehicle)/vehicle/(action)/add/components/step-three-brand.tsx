"use client";

import { Card } from "@/components/ui/card";
import { useBrands } from "@/hooks/useBrand";
import Image from "next/image";
import { useMemo, useState } from "react";

interface StepThreeProps {
  vehicleType: "motorcycle" | "car" | "truck";
  onSelect: (brandId: string) => void; // ✅ trả id
}

/**
 * Vì API /brands hiện trả tất cả thương hiệu,
 * mình lọc theo vehicleType bằng allowlist như mock cũ.
 * (Sau này nếu backend có field type/category thì đổi filter là xong.)
 */
const BRAND_ALLOWLIST: Record<StepThreeProps["vehicleType"], string[]> = {
  motorcycle: ["Honda", "Yamaha", "Suzuki", "Kawasaki", "SYM", "Piaggio"],
  car: [
    "Toyota",
    "Honda",
    "Hyundai",
    "Ford",
    "Mazda",
    "Kia",
    "Nissan",
    "Mitsubishi",
    "VinFast",
  ],
  truck: ["Isuzu", "Dongfeng", "Hino", "Hyundai", "FAW", "Daewoo"],
};

export function StepThreeBrand({ vehicleType, onSelect }: StepThreeProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // UI truyền params (phân trang + sort)
  const { brands, isLoading, isError } = useBrands(
    {
      PageNumber: 1,
      PageSize: 50, // lấy nhiều để lọc thoải mái
      IsDescending: false,
    },
    true
  );

  const filtered = useMemo(() => {
    const allow = new Set(
      BRAND_ALLOWLIST[vehicleType].map((x) => x.toLowerCase())
    );
    const q = searchTerm.trim().toLowerCase();

    return (brands || [])
      .filter((b) => allow.has(b.name.toLowerCase()))
      .filter((b) => (q ? b.name.toLowerCase().includes(q) : true));
  }, [brands, searchTerm, vehicleType]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Chọn hãng xe</h2>
        <p className="mt-1 text-xs text-foreground/45">Chọn hãng xe của bạn</p>
      </div>

      {/* Search (bật lại nếu cần) */}
      {/* 
      <Input
        placeholder="Tìm kiếm hãng xe..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      /> 
      */}

      {isLoading && (
        <p className="text-sm text-foreground/60">Đang tải thương hiệu...</p>
      )}

      {isError && (
        <p className="text-sm text-red-500">
          Không tải được danh sách thương hiệu.
        </p>
      )}

      {!isLoading && !isError && (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((brand) => (
            <Card
              key={brand.id} // ✅ key = id
              className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => onSelect(brand.id)} // ✅ trả id
            >
              <button className="w-full flex items-center gap-3">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-white/70">
                  {brand.logoUrl ? (
                    <Image
                      src={brand.logoUrl}
                      alt={brand.name}
                      fill
                      className="object-contain p-1"
                      sizes="40px"
                    />
                  ) : null}
                </div>

                <div className="flex-1 text-left">
                  <p className="font-semibold text-foreground">{brand.name}</p>
                  {/* optional: website/phone */}
                  {/* <p className="text-xs text-foreground/45">{brand.website}</p> */}
                </div>
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
