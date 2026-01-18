"use client";
import Header from "@/components/common/Header";
import React, { useState } from "react";
import {
  Bell,
  Wrench,
  Calendar,
  AlertCircle,
  ChevronRight,
  Clock,
  MapPin,
  Package,
  ShoppingCart,
  Check,
  Gauge,
  X,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { useUserVehicles } from "@/hooks/useUserVehice";
import BottomNav from "@/components/common/BottomNav";
import { useRouter } from "next/navigation";

// Mock data for specific vehicle - keyed by vehicle ID
const MOCK_VEHICLE_ID = "019badfe-bbe9-7f52-88f7-90ecc92be494";

const vehicleDataMap = {
  [MOCK_VEHICLE_ID]: {
    reminders: [
      {
        id: 1,
        type: "urgent",
        title: "Thay dầu động cơ",
        description: "Đã đến lịch thay dầu",
        dueDate: "3 ngày nữa",
        dueKm: "15,240 km",
        icon: Wrench,
        color: "red",
      },
      {
        id: 2,
        type: "warning",
        title: "Kiểm tra lốp xe",
        description: "Nên kiểm tra áp suất lốp",
        dueDate: "1 tuần nữa",
        dueKm: "15,800 km",
        icon: AlertCircle,
        color: "orange",
      },
      {
        id: 3,
        type: "info",
        title: "Bảo dưỡng định kỳ",
        description: "Bảo dưỡng 10,000 km",
        dueDate: "2 tuần nữa",
        dueKm: "20,000 km",
        icon: Calendar,
        color: "blue",
      },
    ],
    products: [
      {
        id: 1,
        name: "Dầu động cơ Castrol 5W-30",
        category: "Dầu nhờn",
        price: "450,000đ",
        image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400",
        rating: 4.8,
      },
      {
        id: 2,
        name: "Lốp Michelin Primacy 4",
        category: "Lốp xe",
        price: "2,150,000đ",
        image: "https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=400",
        rating: 4.9,
      },
      {
        id: 3,
        name: "Phanh Brembo Ceramic",
        category: "Phanh",
        price: "1,800,000đ",
        image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400",
        rating: 4.7,
      },
    ],
    schedule: [
      {
        id: 1,
        date: "20/01/2026",
        time: "09:00",
        title: "Thay dầu động cơ",
        location: "Garage ABC - Q1",
        status: "confirmed",
      },
      {
        id: 2,
        date: "27/01/2026",
        time: "14:30",
        title: "Kiểm tra tổng quát",
        location: "Service Center XYZ - Q3",
        status: "pending",
      },
    ],
  },
};

export default function Page() {
  const { vehicles, metadata, isLoading } = useUserVehicles({
    PageNumber: 1,
    PageSize: 10,
  });
  const router = useRouter();

  const [currentVehicleIndex, setCurrentVehicleIndex] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  // Total slots = vehicles + 1 "Add Vehicle" card at the end
  const totalSlots = vehicles.length + 1;
  const isAddVehicleCard = currentVehicleIndex === vehicles.length;

  const currentVehicle = isAddVehicleCard ? null : (vehicles[currentVehicleIndex] || vehicles[0]);

  // Get vehicle-specific data based on current vehicle ID
  const currentVehicleData = currentVehicle
    ? vehicleDataMap[currentVehicle.id as keyof typeof vehicleDataMap]
    : null;

  const maintenanceReminders = currentVehicleData?.reminders || [];
  const recommendedProducts = currentVehicleData?.products || [];
  const upcomingSchedule = currentVehicleData?.schedule || [];

  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold && currentVehicleIndex > 0) {
      setCurrentVehicleIndex(currentVehicleIndex - 1);
    } else if (info.offset.x < -swipeThreshold && currentVehicleIndex < totalSlots - 1) {
      setCurrentVehicleIndex(currentVehicleIndex + 1);
    }
  };

  const tutorialSteps = [
    {
      title: "Chào mừng đến với Vehicle Care!",
      description: "Hãy cùng khám phá các tính năng quản lý xe của bạn",
      highlight: null,
    },
    {
      title: "Thông tin xe của bạn",
      description: "Vuốt sang trái/phải để chuyển đổi giữa các xe. Xem số km đã đi và trung bình km/ngày",
      highlight: "vehicle-card",
    },
    {
      title: "Nhắc nhở bảo dưỡng",
      description: "Theo dõi các lịch bảo dưỡng quan trọng với mức độ ưu tiên khác nhau",
      highlight: "reminders",
    },
    {
      title: "Lịch sắp tới",
      description: "Quản lý các buổi hẹn bảo dưỡng và kiểm tra xe của bạn",
      highlight: "schedule",
    },
    {
      title: "Sản phẩm phù hợp",
      description: "Khám phá các sản phẩm và phụ tùng phù hợp với xe của bạn",
      highlight: "products",
    },
  ];

  React.useEffect(() => {
    const hasSeenTutorial = localStorage.getItem("hasSeenTutorial");
    if (!hasSeenTutorial && vehicles.length > 0) {
      setShowTutorial(true);
    }
  }, [vehicles.length]);

  const handleCompleteTutorial = () => {
    localStorage.setItem("hasSeenTutorial", "true");
    setShowTutorial(false);
    setTutorialStep(0);
  };

  // Show loading skeleton
  if (isLoading) {
    return (
      <main className="min-h-dvh bg-gray-50">
        <Header />
        <div className="mx-auto max-w-md px-4 py-6 space-y-6">
          {/* Vehicle Card Skeleton */}
          <div className="rounded-3xl p-6 shadow-xl bg-gradient-to-br from-gray-900 to-gray-800 animate-pulse">
            <div style={{ height: '156px' }} className="flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="h-4 w-20 bg-white/20 rounded mb-2"></div>
                  <div className="h-8 w-32 bg-white/30 rounded mb-1"></div>
                  <div className="h-5 w-24 bg-white/20 rounded"></div>
                </div>
                <div className="h-10 w-24 bg-white/20 rounded-full"></div>
              </div>
              <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                <div>
                  <div className="h-3 w-12 bg-white/20 rounded mb-1"></div>
                  <div className="h-6 w-16 bg-white/30 rounded"></div>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div>
                  <div className="h-3 w-16 bg-white/20 rounded mb-1"></div>
                  <div className="h-6 w-20 bg-white/30 rounded"></div>
                </div>
                <div className="ml-auto">
                  <div className="h-9 w-20 bg-white/20 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Reminders Skeleton */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="h-6 w-40 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-5 w-5 bg-gray-300 rounded-full animate-pulse"></div>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 animate-pulse">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
                    <div className="flex-1">
                      <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                      <div className="flex items-center gap-3">
                        <div className="h-4 w-20 bg-gray-200 rounded"></div>
                        <div className="h-4 w-20 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Schedule Skeleton */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="h-6 w-32 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-5 w-5 bg-gray-300 rounded-full animate-pulse"></div>
            </div>
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
              {[1, 2].map((i) => (
                <div key={i} className={`p-4 ${i !== 2 ? "border-b border-gray-100" : ""} animate-pulse`}>
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center min-w-[60px]">
                      <div className="h-3 w-12 bg-gray-200 rounded mb-1"></div>
                      <div className="h-8 w-10 bg-gray-200 rounded"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-5 w-32 bg-gray-200 rounded"></div>
                        <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-4 w-16 bg-gray-200 rounded"></div>
                        <div className="h-4 w-32 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Products Skeleton */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="h-6 w-36 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-5 w-5 bg-gray-300 rounded-full animate-pulse"></div>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-xl flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="h-5 w-full bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 w-20 bg-gray-200 rounded mb-3"></div>
                      <div className="flex items-center justify-between">
                        <div className="h-6 w-24 bg-gray-200 rounded"></div>
                        <div className="h-8 w-16 bg-gray-200 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Skeleton */}
          <div className="grid grid-cols-2 gap-3 pb-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 animate-pulse">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="h-4 w-16 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <BottomNav />
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-gray-50">
      <Header />

      {/* iOS-style Mobile Container */}
      <div className="mx-auto max-w-md px-4 py-6 space-y-6">
        {/* Vehicle Header Card - iOS Style - SWIPEABLE */}
        <motion.div
          id="vehicle-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className={`rounded-3xl p-6 shadow-xl cursor-grab active:cursor-grabbing ${
              isAddVehicleCard
                ? "bg-white border-2 border-dashed border-gray-300"
                : "bg-gradient-to-br from-gray-900 to-gray-800 text-white"
            }`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentVehicleIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                style={{ height: '156px' }}
                className="flex flex-col"
              >
                {isAddVehicleCard ? (
                  // Add Vehicle Card - Same height as regular card
                  <div className="flex flex-col items-center justify-center h-full" onClick={() => router.push("/vehicle/add")}>
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                      <Plus className="h-8 w-8 text-gray-400" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 mb-1">
                      Thêm xe mới
                    </h2>
                    <p className="text-xs text-gray-500 text-center mb-4">
                      Quản lý thêm xe của bạn
                    </p>
                  </div>
                ) : (
                  // Regular Vehicle Card
                  <div className="flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Xe hiện tại</p>
                        <h1 className="text-2xl font-semibold">
                          {currentVehicle?.userVehicleVariant.model.brandName || "Honda"}
                        </h1>
                        <p className="text-gray-300">
                          {currentVehicle?.userVehicleVariant.model.name || "City"}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur">
                          <span className="text-lg font-bold tracking-wide">
                            {currentVehicle?.licensePlate || "59A-12345"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                      <div>
                        <p className="text-xs text-gray-400">Số km</p>
                        <p className="text-xl font-semibold">
                          {currentVehicle
                            ? (currentVehicle.currentOdometer / 1000).toFixed(1)
                            : "15.2"}
                          k
                        </p>
                      </div>
                      <div className="h-8 w-px bg-white/10" />
                      <div>
                        <p className="text-xs text-gray-400">TB/ngày</p>
                        <p className="text-xl font-semibold">
                          {currentVehicle?.averageKmPerDay || 45} km
                        </p>
                      </div>
                      <div className="ml-auto">
                        <button
                          onClick={() => router.push(`/vehicle/${currentVehicle?.id}`)}
                          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium transition backdrop-blur"
                        >
                          Chi tiết
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Pagination Dots */}
          {totalSlots > 1 && (
            <div className="flex items-center justify-center gap-2 mt-3">
              {Array.from({ length: totalSlots }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentVehicleIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentVehicleIndex
                      ? "w-6 bg-gray-900"
                      : "w-2 bg-gray-300"
                  }`}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Urgent Reminders Section */}
        <motion.div
          id="reminders"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">
              Nhắc nhở quan trọng
            </h2>
            <Bell className="h-5 w-5 text-red-500" />
          </div>

          {maintenanceReminders.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Bell className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                Chưa có nhắc nhở
              </h3>
              <p className="text-sm text-gray-500">
                Xe này chưa có lịch bảo dưỡng nào
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {maintenanceReminders.map((reminder, index) => {
              const Icon = reminder.icon;
              const colorClasses = {
                red: "bg-red-50 border-red-200 text-red-600",
                orange: "bg-orange-50 border-orange-200 text-orange-600",
                blue: "bg-blue-50 border-blue-200 text-blue-600",
              };

              return (
                <motion.div
                  key={reminder.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  className={`${
                    colorClasses[reminder.color as keyof typeof colorClasses]
                  } rounded-2xl p-4 border-2 active:scale-[0.98] transition cursor-pointer`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-xl ${
                        reminder.color === "red"
                          ? "bg-red-100"
                          : reminder.color === "orange"
                          ? "bg-orange-100"
                          : "bg-blue-100"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-0.5">
                        {reminder.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {reminder.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs font-medium">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {reminder.dueDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Gauge className="h-3.5 w-3.5" />
                          {reminder.dueKm}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  </div>
                </motion.div>
              );
            })}
            </div>
          )}
        </motion.div>

        {/* Upcoming Schedule Timeline */}
        <motion.div
          id="schedule"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Lịch sắp tới</h2>
            <Calendar className="h-5 w-5 text-blue-500" />
          </div>

          {upcomingSchedule.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                Chưa có lịch hẹn
              </h3>
              <p className="text-sm text-gray-500">
                Xe này chưa có buổi hẹn bảo dưỡng nào
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
              {upcomingSchedule.map((schedule, index) => (
              <motion.div
                key={schedule.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className={`p-4 ${
                  index !== upcomingSchedule.length - 1
                    ? "border-b border-gray-100"
                    : ""
                } active:bg-gray-50 transition cursor-pointer`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center min-w-[60px]">
                    <span className="text-xs font-medium text-gray-500 uppercase">
                      {schedule.date.split("/")[1]} Thg{" "}
                      {schedule.date.split("/")[1]}
                    </span>
                    <span className="text-2xl font-bold text-gray-900">
                      {schedule.date.split("/")[0]}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {schedule.title}
                      </h3>
                      {schedule.status === "confirmed" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                          <Check className="h-3 w-3" />
                          Đã xác nhận
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700 text-xs font-medium">
                          <Clock className="h-3 w-3" />
                          Chờ xác nhận
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {schedule.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {schedule.location}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recommended Products */}
        <motion.div
          id="products"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">
              Sản phẩm phù hợp
            </h2>
            <Package className="h-5 w-5 text-purple-500" />
          </div>

          {recommendedProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                Chưa có sản phẩm
              </h3>
              <p className="text-sm text-gray-500">
                Chưa có sản phẩm gợi ý cho xe này
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recommendedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-2xl p-4 border border-gray-100 active:scale-[0.98] transition cursor-pointer"
              >
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {product.name}
                      </h3>
                      <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    </div>
                    <p className="text-xs text-gray-500 mb-2">
                      {product.category}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">
                        {product.price}
                      </span>
                      <button className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-full transition flex items-center gap-1">
                        <ShoppingCart className="h-3.5 w-3.5" />
                        Mua
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Actions Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 gap-3 pb-6"
        >
          <button className="bg-white rounded-2xl p-4 border border-gray-100 active:scale-95 transition flex flex-col items-center gap-2 hover:border-blue-200 hover:bg-blue-50/50">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">
              Đặt lịch
            </span>
          </button>

          <button className="bg-white rounded-2xl p-4 border border-gray-100 active:scale-95 transition flex flex-col items-center gap-2 hover:border-green-200 hover:bg-green-50/50">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <Wrench className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">
              Lịch sử
            </span>
          </button>
        </motion.div>
      </div>

      {/* Tutorial Overlay */}
      <AnimatePresence>
        {showTutorial && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
              onClick={() => {
                if (tutorialStep === tutorialSteps.length - 1) {
                  handleCompleteTutorial();
                }
              }}
            />

            {/* Tutorial Card */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-md"
            >
              <div className="bg-white rounded-t-3xl p-6 shadow-2xl">
                {/* Progress Bar */}
                <div className="flex items-center gap-1 mb-4">
                  {tutorialSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1 flex-1 rounded-full transition-all ${
                        index <= tutorialStep ? "bg-blue-500" : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>

                {/* Content */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {tutorialSteps[tutorialStep].title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {tutorialSteps[tutorialStep].description}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  {tutorialStep > 0 && (
                    <button
                      onClick={() => setTutorialStep(tutorialStep - 1)}
                      className="px-6 py-3 rounded-full border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition"
                    >
                      Quay lại
                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (tutorialStep < tutorialSteps.length - 1) {
                        setTutorialStep(tutorialStep + 1);
                        // Scroll to highlighted section
                        const nextHighlight = tutorialSteps[tutorialStep + 1].highlight;
                        if (nextHighlight) {
                          setTimeout(() => {
                            document.getElementById(nextHighlight)?.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            });
                          }, 100);
                        }
                      } else {
                        handleCompleteTutorial();
                      }
                    }}
                    className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:from-blue-600 hover:to-blue-700 transition shadow-lg"
                  >
                    {tutorialStep < tutorialSteps.length - 1 ? "Tiếp tục" : "Bắt đầu sử dụng"}
                  </button>

                  {tutorialStep === 0 && (
                    <button
                      onClick={handleCompleteTutorial}
                      className="p-3 rounded-full hover:bg-gray-100 transition"
                    >
                      <X className="h-5 w-5 text-gray-500" />
                    </button>
                  )}
                </div>

                {/* Step Counter */}
                <div className="text-center mt-4 text-sm text-gray-500">
                  {tutorialStep + 1} / {tutorialSteps.length}
                </div>
              </div>
            </motion.div>

            {/* Highlight Effect */}
            {tutorialSteps[tutorialStep].highlight && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 pointer-events-none z-40"
                style={{
                  background: `radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.7) 100%)`,
                }}
              />
            )}
          </>
        )}
      </AnimatePresence>

      <BottomNav/>
    </main>
  );
}
