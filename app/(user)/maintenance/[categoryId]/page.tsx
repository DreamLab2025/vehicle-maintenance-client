"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Check, Package, Loader2, Calendar, Gauge, Building2, DollarSign, FileText, Image as ImageIcon, Car, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { usePartCategoryById } from "@/hooks/usePartCategories";
import { useProductsByCategory } from "@/hooks/usePartProducts";
import { useUserVehicles } from "@/hooks/useUserVehice";
import { useCreateMaintenanceRecord } from "@/hooks/useMaintenanceRecord";
import type { PartProduct } from "@/lib/api/services/fetchPartProducts";
import type { UserVehicle } from "@/lib/types/vehicle.types";

// ─── License Plate Display ────────────────────────────────────

function LicensePlateDisplay({ licensePlate }: { licensePlate: string }) {
  return (
    <div className="flex items-center rounded-lg bg-black backdrop-blur-xl border border-black overflow-hidden h-10">
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
      <div className="px-3 py-2 flex items-center bg-white h-full border border-white rounded-l-lg flex-1">
        <span className="text-lg font-bold text-black leading-none">
          {licensePlate}
        </span>
      </div>
    </div>
  );
}

// ─── Vehicle Dropdown ──────────────────────────────────────────

function VehicleDropdown({
  vehicles,
  selectedVehicleId,
  onSelect,
  isLoading,
}: {
  vehicles: UserVehicle[];
  selectedVehicleId: string | null;
  onSelect: (vehicleId: string) => void;
  isLoading: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedVehicle = useMemo(() => {
    if (!selectedVehicleId) return null;
    return vehicles.find((v) => v.id === selectedVehicleId) || null;
  }, [selectedVehicleId, vehicles]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleSelect = (vehicleId: string) => {
    onSelect(vehicleId);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 bg-white focus:border-red-500 focus:outline-none flex items-center justify-between hover:border-red-300 transition-colors"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 text-red-500 animate-spin" />
            <span className="text-sm text-neutral-500">Đang tải...</span>
          </div>
        ) : selectedVehicle ? (
          <LicensePlateDisplay licensePlate={selectedVehicle.licensePlate} />
        ) : (
          <span className="text-sm text-neutral-500">-- Chọn xe --</span>
        )}
        <ChevronDown className={`w-5 h-5 text-neutral-400 transition-transform flex-shrink-0 ml-3 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            />

            {/* Dropdown Content */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden max-h-[400px] overflow-y-auto"
            >
              {vehicles.length > 0 ? (
                <div className="p-2 space-y-2">
                  {vehicles.map((vehicle, index) => (
                    <motion.button
                      key={vehicle.id}
                      type="button"
                      onClick={() => handleSelect(vehicle.id)}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className={`w-full p-3 rounded-xl transition-all ${
                        selectedVehicleId === vehicle.id
                          ? "bg-red-50 border-2 border-red-500"
                          : "bg-neutral-50 hover:bg-red-50/50 border-2 border-transparent hover:border-red-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <LicensePlateDisplay licensePlate={vehicle.licensePlate} />
                        {selectedVehicleId === vehicle.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-3"
                          >
                            <Check className="w-5 h-5 text-red-500 flex-shrink-0" />
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-neutral-500">
                  Chưa có xe nào
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────

function ProductCard({
  product,
  isSelected,
  onClick,
  index,
}: {
  product: PartProduct;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
        isSelected
          ? "border-red-500 bg-red-50 shadow-md"
          : "border-neutral-200 bg-white hover:border-neutral-300"
      }`}
    >
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-16 h-16 rounded-xl object-cover"
        />
      ) : (
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
          <Package className="w-8 h-8 text-white" />
        </div>
      )}

      <div className="flex-1 text-left">
        <h3 className={`font-semibold text-base ${isSelected ? "text-red-600" : "text-neutral-900"}`}>
          {product.name}
        </h3>
        <p className="text-xs text-neutral-500 mt-0.5">
          {product.brand}
        </p>
        {product.description && (
          <p className="text-xs text-neutral-400 mt-1 line-clamp-1">
            {product.description}
          </p>
        )}
        {product.referencePrice > 0 && (
          <p className="text-sm font-semibold text-red-500 mt-1">
            {product.referencePrice.toLocaleString("vi-VN")} đ
          </p>
        )}
      </div>

      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center"
        >
          <Check className="w-4 h-4 text-white" />
        </motion.div>
      )}
    </motion.button>
  );
}

// ─── Main Page ────────────────────────────────────────────────

export default function MaintenanceCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const categoryId = params.categoryId as string;
  const userVehicleIdFromQuery = searchParams.get("vehicleId");

  const [selectedProduct, setSelectedProduct] = useState<PartProduct | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(userVehicleIdFromQuery);
  const [step, setStep] = useState<"product" | "form" | "confirm">("product");
  
  // Form fields
  const [serviceDate, setServiceDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [odometerAtService, setOdometerAtService] = useState<string>("");
  const [garageName, setGarageName] = useState<string>("");
  const [totalCost, setTotalCost] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [invoiceImageUrl, setInvoiceImageUrl] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [itemNotes, setItemNotes] = useState<string>("");
  const [instanceIdentifier, setInstanceIdentifier] = useState<string>("");

  // Fetch category details
  const { category, isLoading: isLoadingCategory } = usePartCategoryById(categoryId, !!categoryId);

  // Fetch products
  const { products, isLoading: isLoadingProducts } = useProductsByCategory(
    categoryId,
    !!categoryId
  );

  // Fetch vehicles
  const { vehicles, isLoading: isLoadingVehicles } = useUserVehicles({
    PageNumber: 1,
    PageSize: 100,
  });

  // Get selected vehicle
  const selectedVehicle = useMemo(() => {
    if (!selectedVehicleId) return null;
    return vehicles.find((v) => v.id === selectedVehicleId) || null;
  }, [selectedVehicleId, vehicles]);

  // Create maintenance record mutation
  const { mutate: createMaintenanceRecord, isPending: isSubmitting } = useCreateMaintenanceRecord();

  const handleProductSelect = useCallback((product: PartProduct) => {
    setSelectedProduct(product);
    // If vehicle is already selected, go to form, otherwise show vehicle selection
    if (selectedVehicleId) {
      setStep("form");
    } else {
      setStep("form");
    }
  }, [selectedVehicleId]);

  const handleBack = useCallback(() => {
    if (step === "form") {
      setStep("product");
      setSelectedProduct(null);
    } else if (step === "confirm") {
      setStep("form");
    } else {
      router.push("/maintenance");
    }
  }, [step, router]);

  const handleSubmit = useCallback(() => {
    if (!category || !selectedProduct || !selectedVehicleId) return;

    // Validate required fields
    if (!serviceDate || !odometerAtService) {
      return;
    }

    const payload = {
      serviceDate,
      odometerAtService: Number(odometerAtService),
      garageName: garageName || undefined,
      totalCost: totalCost ? Number(totalCost) : undefined,
      notes: notes || undefined,
      invoiceImageUrl: invoiceImageUrl || undefined,
      items: [
        {
          partCategoryCode: category.code,
          partProductId: selectedProduct.id,
          instanceIdentifier: instanceIdentifier || undefined,
          price: price ? Number(price) : undefined,
          itemNotes: itemNotes || undefined,
          updatesTracking: true,
        },
      ],
    };

    createMaintenanceRecord(
      {
        userVehicleId: selectedVehicleId,
        payload,
      },
      {
        onSuccess: () => {
          setTimeout(() => {
            router.push("/maintenance");
          }, 1500);
        },
      }
    );
  }, [
    category,
    selectedProduct,
    selectedVehicleId,
    serviceDate,
    odometerAtService,
    garageName,
    totalCost,
    notes,
    invoiceImageUrl,
    price,
    itemNotes,
    instanceIdentifier,
    createMaintenanceRecord,
    router,
  ]);

  if (isLoadingCategory) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white pb-28 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-8 h-8 text-red-500 animate-spin mb-4" />
          <p className="text-sm font-medium text-neutral-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white pb-28 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Package className="w-12 h-12 text-neutral-300 mb-4" />
          <p className="text-sm font-medium text-neutral-400">Không tìm thấy loại phụ tùng</p>
          <button
            onClick={() => router.push("/maintenance")}
            className="mt-4 px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-medium"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white pb-28">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-neutral-200/50">
        <div className="flex items-center justify-between px-5 h-14">
          <motion.button
            type="button"
            onClick={handleBack}
            whileTap={{ scale: 0.9 }}
            className="w-9 h-9 rounded-full bg-white/80 shadow-sm flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-neutral-700" />
          </motion.button>

          <h1 className="text-base font-bold text-neutral-900">
            {step === "product" && "Chọn sản phẩm"}
            {step === "form" && "Thông tin bảo dưỡng"}
            {step === "confirm" && "Xác nhận"}
          </h1>

          <div className="w-9" />
        </div>
      </header>

      {/* ── Content ── */}
      <div className="px-5 pt-4">
        <AnimatePresence mode="wait">
          {step === "product" && (
            <motion.div
              key="product"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              {/* Category info */}
              <div className="mb-4 p-4 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 border border-red-100">
                <div className="flex items-center gap-3">
                  {category.iconUrl ? (
                    <img
                      src={category.iconUrl}
                      alt={category.name}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-base text-neutral-900">
                      {category.name}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Chọn sản phẩm đã thay
                    </p>
                  </div>
                </div>
              </div>

              {isLoadingProducts ? (
                <div className="flex flex-col items-center justify-center py-28">
                  <Loader2 className="w-8 h-8 text-red-500 animate-spin mb-4" />
                  <p className="text-sm font-medium text-neutral-400">Đang tải sản phẩm...</p>
                </div>
              ) : products.length > 0 ? (
                products.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isSelected={selectedProduct?.id === product.id}
                    onClick={() => handleProductSelect(product)}
                    index={index}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-28">
                  <Package className="w-12 h-12 text-neutral-300 mb-4" />
                  <p className="text-sm font-medium text-neutral-400">
                    Không có sản phẩm nào cho loại này
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {step === "form" && selectedProduct && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Vehicle Selection */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                  <Car className="w-4 h-4 text-red-500" />
                  Chọn xe <span className="text-red-500">*</span>
                </label>
                <VehicleDropdown
                  vehicles={vehicles}
                  selectedVehicleId={selectedVehicleId}
                  onSelect={(vehicleId) => {
                    setSelectedVehicleId(vehicleId);
                    const vehicle = vehicles.find((v) => v.id === vehicleId);
                    if (vehicle) {
                      setOdometerAtService(vehicle.currentOdometer.toString());
                    }
                  }}
                  isLoading={isLoadingVehicles}
                />
              </div>

              {/* Service Date */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Ngày bảo dưỡng <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={serviceDate}
                  onChange={(e) => setServiceDate(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 bg-white focus:border-red-500 focus:outline-none text-sm"
                />
              </div>

              {/* Odometer */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                  <Gauge className="w-4 h-4" />
                  Số km tại thời điểm bảo dưỡng <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={odometerAtService}
                  onChange={(e) => setOdometerAtService(e.target.value)}
                  placeholder={selectedVehicle ? selectedVehicle.currentOdometer.toString() : "Nhập số km"}
                  min="0"
                  className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 bg-white focus:border-red-500 focus:outline-none text-sm"
                />
              </div>

              {/* Garage Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Tên garage/cửa hàng
                </label>
                <input
                  type="text"
                  value={garageName}
                  onChange={(e) => setGarageName(e.target.value)}
                  placeholder="Nhập tên garage (tùy chọn)"
                  className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 bg-white focus:border-red-500 focus:outline-none text-sm"
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Giá phụ tùng (VNĐ)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder={selectedProduct.referencePrice > 0 ? selectedProduct.referencePrice.toString() : "Nhập giá"}
                  min="0"
                  className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 bg-white focus:border-red-500 focus:outline-none text-sm"
                />
              </div>

              {/* Total Cost */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Tổng chi phí bảo dưỡng (VNĐ)
                </label>
                <input
                  type="number"
                  value={totalCost}
                  onChange={(e) => setTotalCost(e.target.value)}
                  placeholder="Nhập tổng chi phí (tùy chọn)"
                  min="0"
                  className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 bg-white focus:border-red-500 focus:outline-none text-sm"
                />
              </div>

              {/* Instance Identifier (for parts that allow multiple instances) */}
              {category.allowsMultipleInstances && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Vị trí/Vị trí lắp đặt
                  </label>
                  <input
                    type="text"
                    value={instanceIdentifier}
                    onChange={(e) => setInstanceIdentifier(e.target.value)}
                    placeholder="Ví dụ: Lốp trước trái, Má phanh sau..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 bg-white focus:border-red-500 focus:outline-none text-sm"
                  />
                </div>
              )}

              {/* Item Notes */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Ghi chú về phụ tùng
                </label>
                <textarea
                  value={itemNotes}
                  onChange={(e) => setItemNotes(e.target.value)}
                  placeholder="Ghi chú về phụ tùng đã thay (tùy chọn)"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 bg-white focus:border-red-500 focus:outline-none text-sm resize-none"
                />
              </div>

              {/* Invoice Image URL */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Link ảnh hóa đơn
                </label>
                <input
                  type="url"
                  value={invoiceImageUrl}
                  onChange={(e) => setInvoiceImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 bg-white focus:border-red-500 focus:outline-none text-sm"
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Ghi chú chung
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ghi chú về lần bảo dưỡng (tùy chọn)"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 bg-white focus:border-red-500 focus:outline-none text-sm resize-none"
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !selectedVehicleId || !serviceDate || !odometerAtService}
                whileTap={{ scale: 0.97 }}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold text-base shadow-lg shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Đang tạo phiếu bảo dưỡng...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Xác nhận thay thế</span>
                  </>
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
