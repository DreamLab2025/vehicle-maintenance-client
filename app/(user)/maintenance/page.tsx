"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Package, Wrench, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePartCategories } from "@/hooks/usePartCategories";
import type { PartCategory } from "@/lib/api/services/fetchPartCategories";

// ─── Category Card ─────────────────────────────────────────────

function CategoryCard({
  category,
  onClick,
  index,
}: {
  category: PartCategory;
  onClick: () => void;
  index: number;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-neutral-200 bg-white hover:border-red-500 hover:bg-red-50 transition-all group"
    >
      {category.iconUrl ? (
        <img
          src={category.iconUrl}
          alt={category.name}
          className="w-14 h-14 rounded-xl object-cover"
        />
      ) : (
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
          <Package className="w-7 h-7 text-white" />
        </div>
      )}

      <div className="flex-1 text-left">
        <h3 className="font-semibold text-base text-neutral-900 group-hover:text-red-600 transition-colors">
          {category.name}
        </h3>
        <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2">
          {category.description}
        </p>
      </div>

      <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-red-500 transition-colors" />
    </motion.button>
  );
}

// ─── Main Page ────────────────────────────────────────────────

export default function MaintenancePage() {
  const router = useRouter();

  // Fetch categories
  const { categories, isLoading: isLoadingCategories } = usePartCategories({
    PageNumber: 1,
    PageSize: 100,
    IsDescending: false,
  });

  const handleCategorySelect = useCallback((category: PartCategory) => {
    router.push(`/maintenance/${category.id}`);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white pb-28">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-neutral-200/50">
        <div className="flex items-center justify-between px-5 h-14">
          <motion.button
            type="button"
            onClick={() => router.push("/")}
            whileTap={{ scale: 0.9 }}
            className="w-9 h-9 rounded-full bg-white/80 shadow-sm flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-neutral-700" />
          </motion.button>

          <h1 className="text-base font-bold text-neutral-900">
            Chọn loại phụ tùng
          </h1>

          <div className="w-9" />
        </div>
      </header>

      {/* ── Content ── */}
      <div className="px-5 pt-4">
        {isLoadingCategories ? (
          <div className="flex flex-col items-center justify-center py-28">
            <Loader2 className="w-8 h-8 text-red-500 animate-spin mb-4" />
            <p className="text-sm font-medium text-neutral-400">Đang tải...</p>
          </div>
        ) : categories.length > 0 ? (
          <div className="space-y-3">
            {categories.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                onClick={() => handleCategorySelect(category)}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-28">
            <Wrench className="w-12 h-12 text-neutral-300 mb-4" />
            <p className="text-sm font-medium text-neutral-400">Không có loại phụ tùng nào</p>
          </div>
        )}
      </div>
    </div>
  );
}
