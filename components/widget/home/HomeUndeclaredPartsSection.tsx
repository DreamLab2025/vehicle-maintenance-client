"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserVehicleParts } from "@/hooks/useVehiclePart";
import { AlertTriangle, Car, CheckCircle2, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { UserVehicle, UserVehiclePart } from "@/lib/api/services/fetchUserVehicle";
import { PartsGridSkeleton } from "@/components/ui/skeletons";
import { UndeclaredPartBottomSheet } from "./UndeclaredPartBottomSheet";

type HomeUndeclaredPartsSectionProps = {
  currentVehicle: UserVehicle | null | undefined;
};

export function HomeUndeclaredPartsSection({ currentVehicle }: HomeUndeclaredPartsSectionProps) {
  const router = useRouter();
  const partsEnabled = !!currentVehicle?.id;
  const { parts: vehicleParts, isLoading: isLoadingParts } = useUserVehicleParts(
    currentVehicle?.id || "",
    partsEnabled,
  );
  const undeclaredParts = useMemo(() => vehicleParts.filter((part) => !part.isDeclared), [vehicleParts]);
  const [isOpen, setIsOpen] = useState(true);
  const [selectedPart, setSelectedPart] = useState<UserVehiclePart | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setSelectedPart(null);
  }, [currentVehicle?.id]);

  const handleDeclare = useCallback(() => {
    if (selectedPart && currentVehicle?.id) {
      router.push(`/vehicle/${currentVehicle.id}/parts/${selectedPart.partCategoryCode}`);
      setSelectedPart(null);
    }
  }, [selectedPart, currentVehicle?.id, router]);

  return (
    <>
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <button
          onClick={() => setIsOpen((v) => !v)}
          className="flex items-center justify-between w-full mb-3 hover:opacity-80 transition-opacity"
        >
          <div className="flex items-center gap-2">
            <h2 className="text-[15px] font-semibold text-neutral-900">{"Chưa khai báo"}</h2>
            {undeclaredParts.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[11px] font-semibold">
                {undeclaredParts.length}
              </span>
            )}
          </div>
          {currentVehicle && undeclaredParts.length > 0 && (
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="h-4 w-4 text-neutral-500" />
            </motion.div>
          )}
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {!currentVehicle ? (
                <div className="bg-gradient-to-br from-neutral-50 to-slate-50 rounded-2xl p-6 text-center border border-neutral-200">
                  <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-3">
                    <Car className="h-6 w-6 text-neutral-400" />
                  </div>
                  <h3 className="font-semibold text-neutral-700 text-[14px] mb-1">{"Chưa có xe"}</h3>
                  <p className="text-[12px] text-neutral-500">{"Vui lòng thêm xe để quản lý phụ tùng"}</p>
                </div>
              ) : isLoadingParts ? (
                <PartsGridSkeleton count={4} />
              ) : undeclaredParts.length === 0 ? (
                <div className="bg-gradient-to-br from-white-50 to-green-50 rounded-2xl p-6 text-center border border-emerald-100">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  </div>
                  <h3 className="font-semibold text-green-800 text-[14px] mb-1">{"Hoàn tất!"}</h3>
                  <p className="text-[12px] text-green-600">{"Tất cả phụ tùng đã được khai báo"}</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-3 shadow-sm">
                  <div className="grid grid-cols-4 gap-2">
                    {undeclaredParts.map((part, index) => (
                      <motion.button
                        key={part.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.08 + index * 0.03 }}
                        onClick={() => setSelectedPart(part)}
                        className="flex flex-col items-center gap-1.5 p-1.5 rounded-xl hover:bg-neutral-50 transition-colors active:scale-95"
                      >
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-white-50 to-orange-50 border border-black/10 flex items-center justify-center overflow-hidden">
                          {part.iconUrl ? (
                            <Image
                              src={part.iconUrl}
                              alt={part.partCategoryName}
                              width={28}
                              height={28}
                              className="object-contain"
                              unoptimized
                              key={`${part.id}-${part.iconUrl}`}
                            />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                          )}
                        </div>
                        <span className="text-[10px] font-medium text-neutral-600 text-center leading-tight line-clamp-2">
                          {part.partCategoryName}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      <UndeclaredPartBottomSheet
        part={selectedPart}
        onClose={() => setSelectedPart(null)}
        onDeclare={handleDeclare}
      />
    </>
  );
}
