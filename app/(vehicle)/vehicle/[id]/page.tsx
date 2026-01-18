"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Car,
  Calendar,
  Gauge,
  Fuel,
  Settings as SettingsIcon,
  Wrench,
  MapPin,
  Clock,
  TrendingUp,
  AlertCircle,
  FileText,
  Edit,
  Trash2,
  Share2,
  Download,
} from "lucide-react";
import { useUserVehicles } from "@/hooks/useUserVehice";
import BottomNav from "@/components/common/BottomNav";

export default function VehicleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const vehicleId = params.id as string;

  const { vehicles, isLoading } = useUserVehicles({
    PageNumber: 1,
    PageSize: 100,
  });

  const vehicle = vehicles.find((v) => v.id === vehicleId);

  // Mock data for additional details
  const maintenanceHistory = [
    {
      id: 1,
      date: "15/12/2025",
      type: "Thay dầu động cơ",
      cost: "850,000đ",
      odometer: 14200,
      location: "Garage ABC - Q1",
      status: "completed",
    },
    {
      id: 2,
      date: "01/11/2025",
      type: "Bảo dưỡng định kỳ",
      cost: "1,500,000đ",
      odometer: 13500,
      location: "Honda Service - Q3",
      status: "completed",
    },
    {
      id: 3,
      date: "20/09/2025",
      type: "Thay lốp sau",
      cost: "2,200,000đ",
      odometer: 12800,
      location: "Tire Shop XYZ - Q2",
      status: "completed",
    },
  ];

  const upcomingMaintenance = [
    {
      id: 1,
      type: "Thay dầu động cơ",
      dueDate: "20/01/2026",
      dueKm: 15000,
      priority: "high",
    },
    {
      id: 2,
      type: "Kiểm tra phanh",
      dueDate: "05/02/2026",
      dueKm: 15500,
      priority: "medium",
    },
    {
      id: 3,
      type: "Bảo dưỡng định kỳ",
      dueDate: "15/03/2026",
      dueKm: 20000,
      priority: "low",
    },
  ];

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

  const getCarImage = () => {
    if (vehicle.userVehicleVariant.imageUrl)
      return vehicle.userVehicleVariant.imageUrl;
    const brandLower = vehicle.userVehicleVariant.model.brandName.toLowerCase();
    if (brandLower.includes("honda"))
      return "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1400&auto=format&fit=crop&q=80";
    if (brandLower.includes("toyota"))
      return "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=1400&auto=format&fit=crop&q=80";
    if (brandLower.includes("mazda"))
      return "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1400&auto=format&fit=crop&q=80";
    return "https://images.unsplash.com/photo-1542362567-b07e54358753?w=1400&auto=format&fit=crop&q=80";
  };

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
            <img
              src={getCarImage()}
              alt={`${vehicle.userVehicleVariant.model.brandName} ${vehicle.userVehicleVariant.model.name}`}
              className="w-full h-full object-cover"
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
                  {vehicle.vinNumber}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Upcoming Maintenance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900">
                Bảo dưỡng sắp tới
              </h2>
              <AlertCircle className="h-5 w-5 text-orange-500" />
            </div>
            <div className="space-y-3">
              {upcomingMaintenance.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className={`bg-white rounded-2xl p-4 border-2 ${
                    item.priority === "high"
                      ? "border-red-200 bg-red-50/50"
                      : item.priority === "medium"
                      ? "border-orange-200 bg-orange-50/50"
                      : "border-blue-200 bg-blue-50/50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Wrench
                        className={`h-5 w-5 ${
                          item.priority === "high"
                            ? "text-red-600"
                            : item.priority === "medium"
                            ? "text-orange-600"
                            : "text-blue-600"
                        }`}
                      />
                      <h3 className="font-semibold text-gray-900">
                        {item.type}
                      </h3>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        item.priority === "high"
                          ? "bg-red-100 text-red-700"
                          : item.priority === "medium"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {item.priority === "high"
                        ? "Khẩn cấp"
                        : item.priority === "medium"
                        ? "Quan trọng"
                        : "Bình thường"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {item.dueDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Gauge className="h-4 w-4" />
                      {item.dueKm.toLocaleString()} km
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Maintenance History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900">
                Lịch sử bảo dưỡng
              </h2>
              <FileText className="h-5 w-5 text-blue-500" />
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {maintenanceHistory.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className={`p-4 ${
                    index !== maintenanceHistory.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  } hover:bg-gray-50 transition cursor-pointer`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {item.type}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {item.date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Gauge className="h-3 w-3" />
                          {item.odometer.toLocaleString()} km
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{item.cost}</p>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium mt-1">
                        Hoàn thành
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="h-3 w-3" />
                    {item.location}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="grid grid-cols-2 gap-3 pb-6"
          >
            <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-2xl p-4 font-semibold transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 active:scale-95">
              <Calendar className="h-5 w-5" />
              Đặt lịch bảo dưỡng
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
