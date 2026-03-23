"use client";

import { motion } from "framer-motion";
import { Calendar, Gauge, DollarSign, Package, ChevronRight, FileText } from "lucide-react";
import { useMaintenanceRecordsByVehicle } from "@/hooks/useMaintenanceRecord";
import { LoadingSpinner } from "@/components/ui/skeletons";
import type { MaintenanceRecordListItem } from "@/lib/api/services/fetchMaintenanceRecord";

interface MaintenanceRecordsListProps {
  userVehicleId: string;
  onRecordClick: (recordId: string) => void;
}

export function MaintenanceRecordsList({ userVehicleId, onRecordClick }: MaintenanceRecordsListProps) {
  const { data, isLoading, isError } = useMaintenanceRecordsByVehicle(userVehicleId, !!userVehicleId);

  const records = data?.data || [];

  if (isLoading) {
    return (
      <LoadingSpinner
        text="Đang tải lịch sử bảo dưỡng..."
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8"
      />
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col items-center justify-center">
        <FileText className="h-12 w-12 text-gray-300 mb-3" />
        <p className="text-[13px] text-gray-500">Không thể tải lịch sử bảo dưỡng</p>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col items-center justify-center">
        <FileText className="h-12 w-12 text-gray-300 mb-3" />
        <p className="text-[13px] text-gray-500">Chưa có phiếu bảo dưỡng nào</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {records.map((record, index) => (
        <MaintenanceRecordCard key={record.id} record={record} index={index} onClick={() => onRecordClick(record.id)} />
      ))}
    </div>
  );
}

interface MaintenanceRecordCardProps {
  record: MaintenanceRecordListItem;
  index: number;
  onClick: () => void;
}

function MaintenanceRecordCard({ record, index, onClick }: MaintenanceRecordCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
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
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-all active:scale-[0.98] text-left"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          {/* Header with date and garage */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-[13px] font-semibold text-gray-900">{formatDate(record.serviceDate)}</span>
            </div>
            {record.garageName && (
              <span className="text-[12px] text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">{record.garageName}</span>
            )}
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Gauge className="h-3.5 w-3.5 text-gray-400" />
              <span className="text-[12px] text-gray-600">{record.odometerAtService.toLocaleString("vi-VN")} km</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Package className="h-3.5 w-3.5 text-gray-400" />
              <span className="text-[12px] text-gray-600">
                {record.itemCount} {record.itemCount === 1 ? "phụ tùng" : "phụ tùng"}
              </span>
            </div>
            {record.totalCost > 0 && (
              <div className="flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-[12px] font-semibold text-gray-900">{formatCurrency(record.totalCost)}</span>
              </div>
            )}
          </div>

          {/* Notes preview */}
          {record.notes && <p className="text-[12px] text-gray-500 line-clamp-1">{record.notes}</p>}
        </div>

        <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
      </div>
    </motion.button>
  );
}
