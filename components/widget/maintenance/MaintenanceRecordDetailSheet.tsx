"use client";

import { useRef } from "react";
import { motion, AnimatePresence, useDragControls, PanInfo } from "framer-motion";
import { Calendar, Gauge, DollarSign, Package, X, FileText, Building2, MessageSquare } from "lucide-react";
import { useMaintenanceRecordById } from "@/hooks/useMaintenanceRecord";
import { LoadingSpinner } from "@/components/ui/skeletons";
import Image from "next/image";

// Animation config
const SHEET_ANIMATION = {
  type: "spring" as const,
  damping: 30,
  stiffness: 300,
  mass: 0.8,
};

const DRAG_THRESHOLD = {
  offset: 80,
  velocity: 300,
};

interface MaintenanceRecordDetailSheetProps {
  recordId: string | null;
  onClose: () => void;
}

export function MaintenanceRecordDetailSheet({ recordId, onClose }: MaintenanceRecordDetailSheetProps) {
  const dragControls = useDragControls();
  const sheetRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError } = useMaintenanceRecordById(recordId, !!recordId);
  const record = data?.data;

  // Handle drag end - close if dragged down enough
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > DRAG_THRESHOLD.offset || info.velocity.y > DRAG_THRESHOLD.velocity) {
      onClose();
    }
  };

  const isOpen = recordId !== null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            ref={sheetRef}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={SHEET_ANIMATION}
            drag="y"
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={handleDragEnd}
            className="fixed inset-x-0 bottom-0 z-[70] bg-white rounded-t-[24px] max-h-[90vh] overflow-hidden"
            style={{ touchAction: "none" }}
          >
            {/* Handle - Drag area */}
            <div
              className="pt-3 pb-2 cursor-grab active:cursor-grabbing"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <div className="w-10 h-1 bg-neutral-300 rounded-full mx-auto" />
            </div>

            {/* Scrollable Content */}
            <div className="max-h-[calc(90vh-70px)] overflow-y-auto px-4 pb-6">
              {isLoading ? (
                <div className="py-8">
                  <LoadingSpinner text="Đang tải chi tiết..." />
                </div>
              ) : isError || !record ? (
                <div className="py-8 flex flex-col items-center justify-center">
                  <FileText className="h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-[13px] text-gray-500">Không thể tải chi tiết phiếu bảo dưỡng</p>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-lg font-semibold text-gray-900">Chi tiết phiếu bảo dưỡng</h2>
                      <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <X className="h-5 w-5 text-gray-500" />
                      </button>
                    </div>
                  </motion.div>

                  {/* Main Info Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 mb-4"
                  >
                    <div className="space-y-3">
                      {/* Date */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                          <Calendar className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-[12px] text-gray-500">Ngày bảo dưỡng</p>
                          <p className="text-[14px] font-semibold text-gray-900">
                            {formatDate(record.serviceDate)}
                          </p>
                        </div>
                      </div>

                      {/* Odometer */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                          <Gauge className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-[12px] text-gray-500">Số km tại thời điểm bảo dưỡng</p>
                          <p className="text-[14px] font-semibold text-gray-900">
                            {record.odometerAtService.toLocaleString("vi-VN")} km
                          </p>
                        </div>
                      </div>

                      {/* Garage */}
                      {record.garageName && (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                            <Building2 className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-[12px] text-gray-500">Cơ sở bảo dưỡng</p>
                            <p className="text-[14px] font-semibold text-gray-900">
                              {record.garageName}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Total Cost */}
                      {record.totalCost > 0 && (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                            <DollarSign className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-[12px] text-gray-500">Tổng chi phí</p>
                            <p className="text-[14px] font-semibold text-gray-900">
                              {formatCurrency(record.totalCost)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Notes */}
                  {record.notes && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="bg-white rounded-2xl border border-gray-100 p-4 mb-4"
                    >
                      <div className="flex items-start gap-3">
                        <MessageSquare className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-[12px] text-gray-500 mb-1">Ghi chú</p>
                          <p className="text-[13px] text-gray-700 leading-relaxed">{record.notes}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Invoice Image */}
                  {record.invoiceImageUrl && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-white rounded-2xl border border-gray-100 p-4 mb-4"
                    >
                      <p className="text-[12px] text-gray-500 mb-3">Hóa đơn</p>
                      <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-200">
                        <Image
                          src={record.invoiceImageUrl}
                          alt="Invoice"
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Items List */}
                  {record.items && record.items.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="bg-white rounded-2xl border border-gray-100 p-4"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <Package className="h-5 w-5 text-gray-600" />
                        <h3 className="text-[14px] font-semibold text-gray-900">
                          Danh sách phụ tùng ({record.items.length})
                        </h3>
                      </div>
                      <div className="space-y-3">
                        {record.items.map((item, index) => (
                          <div
                            key={item.id || index}
                            className="p-3 rounded-xl bg-gray-50 border border-gray-100"
                          >
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex-1">
                                <p className="text-[13px] font-semibold text-gray-900 mb-1">
                                  {item.partName}
                                </p>
                                <p className="text-[11px] text-gray-500">
                                  {item.partCategoryCode}
                                </p>
                              </div>
                              {item.price > 0 && (
                                <p className="text-[13px] font-semibold text-gray-900">
                                  {formatCurrency(item.price)}
                                </p>
                              )}
                            </div>
                            {item.notes && (
                              <p className="text-[12px] text-gray-600 mt-2">{item.notes}</p>
                            )}
                            {item.instanceIdentifier && (
                              <p className="text-[11px] text-gray-400 mt-1">
                                ID: {item.instanceIdentifier}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
