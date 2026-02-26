"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
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
  FileText,
  AlertCircle,
  History,
  Eye,
  EyeOff,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useUserVehicles, useOdometerHistory } from "@/hooks/useUserVehice";
import { OdometerHistoryChart } from "@/components/odometer/OdometerHistoryChart";
import type { OdometerHistoryItem } from "@/lib/types/vehicle.types";

export default function VehicleDetailPage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const vehicleId = params.id as string;
  const [currentPage, setCurrentPage] = useState(1);
  const [allHistory, setAllHistory] = useState<OdometerHistoryItem[]>([]);
  const [showVin, setShowVin] = useState(false);

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
      <main className="min-h-dvh bg-neutral-50">
        <div className="mx-auto max-w-md">
          <div className="h-screen flex items-center justify-center">
            <div className="animate-pulse text-[13px] text-gray-400">{t("common.loading")}</div>
          </div>
        </div>
      </main>
    );
  }

  if (!vehicle) {
    return (
      <main className="min-h-dvh bg-neutral-50">
        <div className="mx-auto max-w-md">
          <div className="h-screen flex flex-col items-center justify-center p-6">
            <AlertCircle className="h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-[15px] font-semibold text-gray-900 mb-2">
              {t("vehicle.notFound")}
            </h2>
            <p className="text-[13px] text-gray-600 text-center mb-6">
              {t("vehicle.notFoundDesc")}
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl font-semibold hover:from-red-600 hover:to-red-700 transition active:scale-95 text-[15px]"
            >
              {t("common.goHome")}
            </button>
          </div>
        </div>
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
    <main className="min-h-dvh bg-neutral-50 pb-28">
      <div className="mx-auto max-w-md">
        {/* Hero Section with Image */}
        <div className="relative h-[300px] bg-gradient-to-br from-gray-400 to-gray-500 overflow-hidden border-b border-l border-r  rounded-bl-3xl rounded-br-3xl">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.back()}
            className="absolute top-4 left-4 z-20 w-9 h-9 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-white/20 transition active:scale-95"
          >
            <ArrowLeft className="h-4 w-4 text-white" />
          </motion.button>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-4 right-4 z-20 flex items-center gap-2"
          >
            <button className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-white/20 transition active:scale-95">
              <Share2 className="h-4 w-4 text-white" />
            </button>
            <button className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-white/20 transition active:scale-95">
              <Edit className="h-4 w-4 text-white" />
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
            className="absolute bottom-4 left-4 right-4 z-10"
          >
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[13px] text-white/50 mb-1 font-normal">
                  {vehicle.nickname || t("vehicle.myVehicle")}
                </p>
                <h1 className="text-lg font-semibold text-white mb-0.5 leading-tight">
                  {vehicle.userVehicleVariant.model.brandName}
                </h1>
                <p className="text-[13px] text-white/50 font-normal">
                  {vehicle.userVehicleVariant.model.name}
                </p>
              </div>
              <div className="flex items-center rounded-lg bg-black backdrop-blur-xl border border-black overflow-hidden h-12">
                <div className="flex-shrink-0 bg-black h-full flex items-center">
                  <Image
                    src="/images/VIE_rm_bg.png"
                    alt="VIE Badge"
                    width={50}
                    height={48}
                    className="object-contain h-full w-auto"
                    unoptimized
                  />
                </div>
                <div className="px-3 py-2 flex items-center bg-white h-full border border-white rounded-l-lg">
                  <span className="text-[20px] font-bold text-black leading-none">
                    {vehicle.licensePlate}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Content Section */}
        <div className="px-5 pt-6 space-y-6">
          {/* Vehicle Specifications - Combined List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-[15px] font-semibold text-gray-900 mb-3">
              {t("vehicle.specifications")}
            </h2>
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-2.5">
              {/* Stats Items */}
              <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <Gauge className="h-4 w-4 text-gray-400" />
                  <span className="text-[13px] text-semibold text-neutral-600">{t("vehicle.odometer")}</span>
                </div>
                <span className="text-[13px] font-bold text-gray-900">
                  {vehicle.currentOdometer.toLocaleString("vi-VN")}
                </span>
              </div>

              <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-4 w-4 text-gray-400" />
                  <span className="text-[13px] text-semibold text-neutral-600">{t("vehicle.avgPerDay")}</span>
                </div>
                <span className="text-[13px] font-semibold text-gray-900">
                  {vehicle.averageKmPerDay || "_ _"}
                </span>
              </div>

              <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-[13px] text-semibold text-neutral-600">{t("vehicle.purchaseYear")}</span>
                </div>
                <span className="text-[13px] font-semibold text-gray-900">
                  {new Date(vehicle.purchaseDate).getFullYear()}
                </span>
              </div>

              {/* Technical Specifications */}
              <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <Car className="h-4 w-4 text-gray-400" />
                  <span className="text-[13px] text-semibold text-neutral-600">{t("vehicle.vehicleType")}</span>
                </div>
                <span className="text-[13px] font-semibold text-gray-900">
                  {vehicle.userVehicleVariant.model.typeName}
                </span>
              </div>

              <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <Fuel className="h-4 w-4 text-gray-400" />
                  <span className="text-[13px] text-semibold text-neutral-600">{t("vehicle.fuelType")}</span>
                </div>
                <span className="text-[13px] font-semibold text-gray-900">
                  {vehicle.userVehicleVariant.model.fuelTypeName}
                </span>
              </div>

              <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <SettingsIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-[13px] text-semibold text-neutral-600">{t("vehicle.transmission")}</span>
                </div>
                <span className="text-[13px] font-semibold text-gray-900">
                  {vehicle.userVehicleVariant.model.transmissionTypeName}
                </span>
              </div>

              <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-[13px] text-semibold text-neutral-600">{t("vehicle.manufactureYear")}</span>
                </div>
                <span className="text-[13px] font-semibold text-gray-900">
                  {vehicle.userVehicleVariant.model.releaseYear}
                </span>
              </div>

              <div className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <span className="text-[13px] text-semibold text-neutral-600">{t("vehicle.vinNumber")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-mono text-gray-900 bg-gray-50 px-2 py-1 rounded">
                    {vehicle.vinNumber
                      ? showVin
                        ? vehicle.vinNumber
                        : "•".repeat(vehicle.vinNumber.length)
                      : t("vehicle.vinNotUpdated")}
                  </span>
                  {vehicle.vinNumber && (
                    <button
                      onClick={() => setShowVin(!showVin)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                      aria-label={showVin ? t("vehicle.hideVin") : t("vehicle.showVin")}
                    >
                      {showVin ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  )}
                </div>
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
              <h2 className="text-[15px] font-semibold text-gray-900">
                {t("vehicle.odometerHistory")}
              </h2>
              <History className="h-4 w-4 text-red-500" />
            </div>
            {isLoadingHistory && currentPage === 1 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-[13px] text-gray-500">{t("vehicle.loadingHistory")}</p>
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
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col items-center justify-center">
                <History className="h-12 w-12 text-gray-300 mb-3" />
                <p className="text-[13px] text-gray-500">{t("vehicle.noHistory")}</p>
              </div>
            )}
          </motion.div>

        </div>
      </div>

      {/* Fixed Bottom Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-5 py-4 safe-area-bottom">
        <div className="mx-auto max-w-md">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => router.push(`/odometer/${vehicleId}`)}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl p-4 font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-red-500/25 active:scale-[0.98]"
            >
              <Gauge className="h-5 w-5 text-white" />
              <span className="text-[15px]">{t("vehicle.updateOdometer")}</span>
            </button>
            <button className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 rounded-2xl p-4 font-bold transition flex items-center justify-center gap-2 active:scale-[0.98] shadow-sm">
              <Trash2 className="h-5 w-5 text-gray-600" />
              <span className="text-[15px]">{t("vehicle.deleteVehicle")}</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
