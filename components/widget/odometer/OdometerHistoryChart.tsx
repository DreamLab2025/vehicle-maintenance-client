"use client";

import React from "react";
import { motion } from "framer-motion";
import { Gauge, Calendar, TrendingUp, ChevronDown } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/skeletons";
import { PaginationMetadata } from "@/lib/api/apiService";
import { OdometerHistoryItem } from "@/lib/api/services/fetchOdometer";


interface OdometerHistoryChartProps {
  data: OdometerHistoryItem[];
  isLoading?: boolean;
  metadata?: PaginationMetadata;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
}

export function OdometerHistoryChart({
  data,
  isLoading = false,
  metadata,
  onLoadMore,
  isLoadingMore = false,
}: OdometerHistoryChartProps) {
  const formatNumber = (n: number) => n.toLocaleString("vi-VN");

  // Hiển thị tất cả items đã load
  const displayedData = data;
  const hasMore = metadata?.hasNextPage;

  if (isLoading) {
    return <LoadingSpinner text="Đang tải lịch sử..." className="bg-white rounded-2xl border border-gray-100 p-8" />;
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-8 flex flex-col items-center justify-center">
        <Gauge className="h-12 w-12 text-gray-300 mb-3" />
        <p className="text-sm text-gray-500">Chưa có lịch sử cập nhật</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* History List */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {displayedData.map((item, index) => {
          const date = new Date(item.recordedDate);
          const formattedDate = date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
          const isLatest = index === 0;
          const previousItem = index > 0 ? data[index - 1] : null;
          const kmDifference = previousItem ? item.odometerValue - previousItem.odometerValue : null;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 ${
                index !== data.length - 1 ? "border-b border-gray-100" : ""
              } hover:bg-gray-50 transition ${isLatest ? "bg-blue-50/30" : ""}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Gauge className={`h-4 w-4 ${isLatest ? "text-red-600" : "text-gray-400"}`} />
                    <h3 className={`font-semibold ${isLatest ? "text-black-900" : "text-gray-900"}`}>
                      {formatNumber(item.odometerValue)} km
                    </h3>
                    {isLatest && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-medium">
                        Mới nhất
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 ml-6">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formattedDate}
                    </span>
                    {kmDifference !== null && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />+{formatNumber(kmDifference)} km
                        </span>
                      </>
                    )}
                  </div>
                  {item.kmOnRecordedDate > 0 && (
                    <div className="mt-2 ml-6 text-xs text-gray-400">
                      Đã đi {formatNumber(item.kmOnRecordedDate)} km vào ngày này
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      item.source === "ManualInput"
                        ? "bg-green-100 text-green-700"
                        : item.source === "Scan"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {item.source === "ManualInput" ? "Thủ công" : item.source === "Scan" ? "Quét" : "Tự động"}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Load More Button */}
        {hasMore && (
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={onLoadMore}
              disabled={isLoadingMore}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingMore ? (
                <>
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span>Đang tải...</span>
                </>
              ) : (
                <>
                  <span>Xem thêm</span>
                  <ChevronDown className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
