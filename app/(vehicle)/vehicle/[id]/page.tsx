"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Car,
  Calendar,
  Gauge,
  Fuel,
  Settings as SettingsIcon,
  TrendingUp,
  Edit,
  Share2,
  Download,
  FileText,
  AlertCircle,
  History,
} from "lucide-react";
import Image from "next/image";
import { useUserVehicles, useOdometerHistory } from "@/hooks/useUserVehice";
import BottomNav from "@/components/common/BottomNav";
import { OdometerHistoryChart } from "@/components/odometer/OdometerHistoryChart";
import type { OdometerHistoryItem } from "@/lib/types/vehicle.types";

export default function VehicleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const vehicleId = params.id as string;
  const [currentPage, setCurrentPage] = useState(1);
  const [allHistory, setAllHistory] = useState<OdometerHistoryItem[]>([]);

  const { vehicles, isLoading } = useUserVehicles({
    PageNumber: 1,
    PageSize: 100,
  });

  const vehicle = vehicles.find((v) => v.id === vehicleId);

  // Fetch odometer history
  const { 
    history: odometerHistory, 
    isLoading: isLoadingHistory,
    isFetching: isFetchingHistory,
    metadata: historyMetadata,
  } = useOdometerHistory(
    vehicleId,
    {
      PageNumber: currentPage,
      PageSize: 5,
      IsDescending: true,
    },
    !!vehicleId
  );

  // Accumulate history data
  React.useEffect(() => {
    if (odometerHistory && odometerHistory.length > 0) {
      if (currentPage === 1) {
        // Reset on first page
        setAllHistory(odometerHistory);
      } else {
        // Append new data
        setAllHistory((prev) => [...prev, ...odometerHistory]);
      }
    }
  }, [odometerHistory, currentPage]);

  // Reset when vehicleId changes
  React.useEffect(() => {
    setCurrentPage(1);
    setAllHistory([]);
  }, [vehicleId]);

  const handleLoadMore = () => {
    if (historyMetadata?.hasNextPage && !isFetchingHistory) {
      setCurrentPage((prev) => prev + 1);
    }
  };


  if (isLoading) {
    return (
      <main className="min-h-dvh bg-gray-50">
        <div className="mx-auto max-w-md">
          <div className="h-screen flex items-center justify-center">
            <div className="animate-pulse text-gray-400">Đang tải...</div>
          </div>
        </div>
        <BottomNav />
      </main>
    );
  }

  if (!vehicle) {
    return (
      <main className="min-h-dvh bg-gray-50">
        <div className="mx-auto max-w-md">
          <div className="h-screen flex flex-col items-center justify-center p-6">
            <AlertCircle className="h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Không tìm thấy xe
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Xe bạn đang tìm không tồn tại hoặc đã bị xóa
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition"
            >
              Quay về trang chủ
            </button>
          </div>
        </div>
        <BottomNav />
      </main>
    );
  }

  // const getCarImage = () => {
  //   if (vehicle.userVehicleVariant.imageUrl)
  //     return vehicle.userVehicleVariant.imageUrl;
  //   const brandLower = vehicle.userVehicleVariant.model.brandName.toLowerCase();
  //   if (brandLower.includes("honda"))
  //     return "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1400&auto=format&fit=crop&q=80";
  //   if (brandLower.includes("toyota"))
  //     return "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=1400&auto=format&fit=crop&q=80";
  //   if (brandLower.includes("mazda"))
  //     return "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1400&auto=format&fit=crop&q=80";
  //   return "https://images.unsplash.com/photo-1542362567-b07e54358753?w=1400&auto=format&fit=crop&q=80";
  // };

  return (
    <main className="min-h-dvh bg-gray-50 pb-24">
      <div className="mx-auto max-w-md">
        {/* Hero Section with Image */}
        <div className="relative h-80 bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.back()}
            className="absolute top-6 left-4 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-white/20 transition"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </motion.button>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-6 right-4 z-20 flex items-center gap-2"
          >
            <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-white/20 transition">
              <Share2 className="h-5 w-5 text-white" />
            </button>
            <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-white/20 transition">
              <Edit className="h-5 w-5 text-white" />
            </button>
          </motion.div>

          {/* Car Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Image
              src={vehicle.userVehicleVariant.imageUrl || ""}
              alt={`${vehicle.userVehicleVariant.model.brandName} ${vehicle.userVehicleVariant.model.name}`}
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
          </motion.div>

          {/* Vehicle Info Overlay */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-6 left-4 right-4 z-10"
          >
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm text-white/70 mb-1">
                  {vehicle.nickname || "Xe của tôi"}
                </p>
                <h1 className="text-3xl font-bold text-white mb-1">
                  {vehicle.userVehicleVariant.model.brandName}
                </h1>
                <p className="text-xl text-white/90">
                  {vehicle.userVehicleVariant.model.name}
                </p>
              </div>
              <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20">
                <span className="text-lg font-bold text-white tracking-wide">
                  {vehicle.licensePlate}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Content Section */}
        <div className="px-4 pt-6 space-y-6">
          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-3 gap-3"
          >
            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Gauge className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-1">Số km</p>
              <p className="text-xl font-bold text-gray-900">
                {(vehicle.currentOdometer / 1000).toFixed(1)}k
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-1">TB/ngày</p>
              <p className="text-xl font-bold text-gray-900">
                {vehicle.averageKmPerDay}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-orange-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-1">Năm mua</p>
              <p className="text-xl font-bold text-gray-900">
                {new Date(vehicle.purchaseDate).getFullYear()}
              </p>
            </div>
          </motion.div>

          {/* Vehicle Specifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Thông số kỹ thuật
            </h2>
            <div className="bg-white rounded-2xl p-4 border border-gray-100 space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <Car className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Loại xe</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {vehicle.userVehicleVariant.model.typeName}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <Fuel className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Nhiên liệu</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {vehicle.userVehicleVariant.model.fuelTypeName}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <SettingsIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Hộp số</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {vehicle.userVehicleVariant.model.transmissionTypeName}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Năm sản xuất</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {vehicle.userVehicleVariant.model.releaseYear}
                </span>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Số VIN</span>
                </div>
                <span className="text-xs font-mono text-gray-900 bg-gray-50 px-2 py-1 rounded">
                  {vehicle.vinNumber || "Chưa Cập Nhật"}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Odometer History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900">
                Lịch sử cập nhật số km
              </h2>
              <History className="h-5 w-5 text-blue-500" />
            </div>
            {isLoadingHistory && currentPage === 1 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-8 flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-sm text-gray-500">Đang tải lịch sử...</p>
              </div>
            ) : allHistory.length > 0 ? (
              <OdometerHistoryChart 
                data={allHistory} 
                isLoading={false}
                metadata={historyMetadata}
                onLoadMore={handleLoadMore}
                isLoadingMore={isFetchingHistory && currentPage > 1}
              />
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-8 flex flex-col items-center justify-center">
                <History className="h-12 w-12 text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">Chưa có lịch sử cập nhật</p>
              </div>
            )}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-2 gap-3 pb-6"
          >
            <button
              onClick={() => router.push(`/odometer/${vehicleId}`)}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-2xl p-4 font-semibold transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 active:scale-95"
            >
              <Gauge className="h-5 w-5" />
              Cập nhật số km
            </button>
            <button className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 rounded-2xl p-4 font-semibold transition flex items-center justify-center gap-2 active:scale-95">
              <Download className="h-5 w-5" />
              Xuất báo cáo
            </button>
          </motion.div>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
