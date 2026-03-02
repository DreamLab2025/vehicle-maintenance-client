"use client";

import { useState, useCallback, useMemo, useEffect, Suspense, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Check, Package, Loader2, DollarSign, FileText, Car, Plus, MotorbikeIcon, Gauge, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { usePartCategoriesByVehicleId } from "@/hooks/usePartCategories";
import { useProductsByCategory } from "@/hooks/usePartProducts";
import { useUserVehicles } from "@/hooks/useUserVehice";
import { useCreateMaintenanceRecord } from "@/hooks/useMaintenanceRecord";
import type { PartProduct } from "@/lib/api/services/fetchPartProducts";
import type { PartCategory } from "@/lib/api/services/fetchPartCategories";
import { DatePicker } from "@/components/ui/date-picker";
import { 
  VehicleCardGridSkeleton, 
  LoadingSpinner 
} from "@/components/ui/skeletons";

// ─── Category Card ─────────────────────────────────────────────

function CategoryCard({
  category,
  isSelected,
  onClick,
  index,
}: {
  category: PartCategory;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`w-full flex items-center gap-4 p-3 rounded-lg border transition-all ${
        isSelected
          ? "border-[#dc2626] bg-neutral-50"
          : "border-neutral-200 bg-white hover:border-neutral-300"
      }`}
    >
      {category.iconUrl ? (
        <Image
          src={category.iconUrl}
          alt={category.name}
          width={64}
          height={64}
          className="w-16 h-16 rounded-xl object-cover"
          unoptimized
        />
      ) : (
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
          <Package className="w-8 h-8 text-white" />
        </div>
      )}

      <div className="flex-1 text-left">
        <h3 className={`font-medium text-sm ${isSelected ? "text-neutral-900" : "text-neutral-900"}`}>
          {category.name}
        </h3>
        {category.description && (
          <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2">
            {category.description}
          </p>
        )}
      </div>

      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-5 h-5 rounded-full bg-[#dc2626] flex items-center justify-center"
        >
          <Check className="w-3 h-3 text-white" />
        </motion.div>
      )}
    </motion.button>
  );
}

// ─── Product Card ─────────────────────────────────────────────

function ProductCard({
  product,
  isSelected,
  isAlreadyAdded,
  onClick,
  index,
}: {
  product: PartProduct;
  isSelected: boolean;
  isAlreadyAdded: boolean;
  onClick: () => void;
  index: number;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={isAlreadyAdded}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`w-full flex items-center gap-4 p-3 rounded-lg border transition-all  ${
        isAlreadyAdded
          ? "border-neutral-200 bg-neutral-100 opacity-60 cursor-not-allowed"
          : isSelected
          ? "border-[#dc2626] bg-neutral-50"
          : "border-neutral-200 bg-white hover:border-neutral-300"
      }`}
    >
      {product.imageUrl ? (
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={64}
          height={64}
          className="w-16 h-16 rounded-xl object-cover"
          unoptimized
        />
      ) : (
        <div className=" rounded-lg flex items-center justify-center">
          <Image src="/images/product_test.png" alt="Product Test" width={56} height={56} className="w-full h-full rounded-xl object-fit relative" />
        </div>
      )}

      <div className="flex-1 text-left min-w-0">
        {/* Product Name and Brand - Better layout for long text */}
        <div className="flex items-start gap-2 mb-2">
          <h3 className={`font-medium text-sm flex-1 min-w-0 line-clamp-2 ${isAlreadyAdded ? "text-neutral-400" : "text-neutral-900"}`}>
            {product.name}
          </h3>
          <span className={`text-[10px] font-medium border border-red-500 rounded-full px-2 py-0.5 bg-red-500 text-white whitespace-nowrap flex-shrink-0 ${isAlreadyAdded ? "opacity-60" : ""}`}>
            {product.brand}
          </span>
        </div>
        
        {/* Description */}
        {product.description && (
          <p className={`text-xs mt-1 line-clamp-2 ${isAlreadyAdded ? "text-neutral-300" : "text-neutral-500"}`}>
            {product.description}
          </p>
        )}
        
        {/* Price */}
        {product.referencePrice > 0 && (
          <p className={`text-sm font-semibold mt-2 ${isAlreadyAdded ? "text-neutral-400" : "text-[#dc2626]"}`}>
            {product.referencePrice.toLocaleString("vi-VN")} đ
          </p>
        )}
        
        {/* Already Added Badge */}
        {isAlreadyAdded && (
          <p className="text-xs text-neutral-500 mt-1.5 font-medium">Đã được thêm</p>
        )}
      </div>

      {isSelected && !isAlreadyAdded && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-5 h-5 rounded-full bg-[#dc2626] flex items-center justify-center"
        >
          <Check className="w-3 h-3 text-white" />
        </motion.div>
      )}
      {isAlreadyAdded && (
        <div className="w-5 h-5 rounded-full bg-neutral-300 flex items-center justify-center">
          <Check className="w-3 h-3 text-neutral-500" />
        </div>
      )}
    </motion.button>
  );
}

// ─── Selected Item Display ─────────────────────────────────────

interface SelectedItem {
  categoryId: string;
  categoryCode: string;
  categoryName: string;
  // Case 1: Product from system
  productId?: string;
  productName?: string;
  // Case 2: Custom product
  customPartName?: string;
  customKmInterval?: number;
  customMonthsInterval?: number;
  // Common fields
  price?: string;
  itemNotes?: string;
  instanceIdentifier?: string;
  isCustom: boolean;
}

function SelectedItemCard({
  item,
  onRemove,
  onEdit,
}: {
  item: SelectedItem;
  category: PartCategory;
  onRemove: () => void;
  onEdit: () => void;
}) {
  const productName = item.isCustom ? item.customPartName : item.productName;
  
  return (
    <div className="p-4 rounded-2xl border-2 border-neutral-200 bg-white">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-sm text-neutral-900">{productName}</h4>
            {item.isCustom && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500 text-white font-medium">
                Tùy chỉnh
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">{item.categoryName}</p>
          {item.isCustom && (
            <div className="flex items-center gap-3 mt-1">
              {item.customKmInterval && (
                <p className="text-xs text-neutral-600">
                  {item.customKmInterval.toLocaleString("vi-VN")} km
                </p>
              )}
              {item.customMonthsInterval && (
                <p className="text-xs text-neutral-600">
                  {item.customMonthsInterval} tháng
                </p>
              )}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-xs text-red-500 font-medium hover:text-red-600 transition-colors"
        >
          Xóa
        </button>
      </div>
      <div className="flex items-center justify-between">
        {item.price && (
          <p className="text-sm font-semibold text-red-500">
            {Number(item.price).toLocaleString("vi-VN")} đ
          </p>
        )}
        <button
          type="button"
          onClick={onEdit}
          className="text-xs text-red-500 font-medium hover:text-red-600 transition-colors"
        >
          Chỉnh sửa
        </button>
      </div>
      {item.instanceIdentifier && (
        <p className="text-xs text-neutral-500 mt-1">
          Vị trí: {item.instanceIdentifier}
        </p>
      )}
      {item.itemNotes && (
        <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
          {item.itemNotes}
        </p>
      )}
    </div>
  );
}

// ─── Step Indicator ───────────────────────────────────────────

function StepIndicator({ currentStep }: { currentStep: "vehicle" | "categories" | "products" | "form" }) {
  const steps = [
    { id: "vehicle", label: "Chọn xe", icon: Car },
    { id: "categories", label: "Loại phụ tùng", icon: Package },
    { id: "products", label: "Sản phẩm", icon: Check },
    { id: "form", label: "Hoàn tất", icon: FileText },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="px-4 py-3 bg-neutral-50 border-b border-neutral-200">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;

          return (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center flex-1">
                <motion.div
                  layoutId={`step-circle-${step.id}`}
                  initial={false}
                  animate={{
                    scale: isActive ? 1.2 : 1,
                    y: isActive ? -2 : 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    isCompleted
                      ? "bg-[#dc2626] text-white"
                      : isActive
                      ? "bg-[#f88c8c] text-white shadow-lg"
                      : "bg-neutral-200 text-neutral-400"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </motion.div>
                <motion.span
                  initial={false}
                  animate={{
                    fontWeight: isActive ? 600 : 500,
                  }}
                  transition={{ duration: 0.2 }}
                  className={`text-[10px] mt-1.5 text-center transition-colors ${
                    isActive || isCompleted ? "text-neutral-900" : "text-neutral-400"
                  }`}
                >
                  {step.label}
                </motion.span>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-px mx-2 -mt-4 relative">
                  <div className="absolute inset-0 bg-neutral-200" />
                  <motion.div
                    initial={false}
                    animate={{
                      width: isCompleted ? "100%" : "0%",
                    }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="absolute inset-0 bg-neutral-900"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────

function MaintenanceCategoryPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get params from URL (from notification)
  const vehicleIdFromQuery = searchParams.get("vehicleId");
  const categoryNameFromQuery = searchParams.get("categoryName");
  const odometerFromQuery = searchParams.get("odometer");

  // Initialize step based on query params
  const initialStep = useMemo(() => {
    if (vehicleIdFromQuery && categoryNameFromQuery) {
      return "products"; // Jump to products if both vehicle and category are provided
    }
    if (vehicleIdFromQuery) {
      return "categories"; // Jump to categories if only vehicle is provided
    }
    return "vehicle";
  }, [vehicleIdFromQuery, categoryNameFromQuery]);

  const [step, setStep] = useState<"vehicle" | "categories" | "products" | "form">(initialStep);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(vehicleIdFromQuery);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);

  // Form fields for maintenance record
  const [serviceDate, setServiceDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [odometerAtService, setOdometerAtService] = useState<string>(odometerFromQuery || "");
  const [garageName, setGarageName] = useState<string>("");
  const [totalCost, setTotalCost] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [invoiceImageUrl, setInvoiceImageUrl] = useState<string>("");

  // Form fields for current item being added/edited
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);
  const [currentPrice, setCurrentPrice] = useState<string>("");
  const [currentItemNotes, setCurrentItemNotes] = useState<string>("");
  const [currentInstanceIdentifier, setCurrentInstanceIdentifier] = useState<string>("");
  
  // Custom product fields
  const [isCustomProduct, setIsCustomProduct] = useState<boolean>(false);
  const [customPartName, setCustomPartName] = useState<string>("");
  const [customKmInterval, setCustomKmInterval] = useState<string>("");
  const [customMonthsInterval, setCustomMonthsInterval] = useState<string>("");

  // Ref for product details form to scroll to
  const productDetailsFormRef = useRef<HTMLDivElement>(null);

  // Fetch vehicles
  const { vehicles, isLoading: isLoadingVehicles } = useUserVehicles({
    PageNumber: 1,
    PageSize: 100,
  });

  // Fetch categories for selected vehicle
  const { categories, isLoading: isLoadingCategories } = usePartCategoriesByVehicleId(
    selectedVehicleId,
    (step !== "vehicle" && !!selectedVehicleId) || !!vehicleIdFromQuery
  );

  // Find category by name from query params
  const matchedCategoryFromQuery = useMemo(() => {
    if (categoryNameFromQuery && categories.length > 0) {
      return categories.find((c) => c.name === categoryNameFromQuery) || null;
    }
    return null;
  }, [categoryNameFromQuery, categories]);

  // Auto-select category if found from query params
  const effectiveCategoryId = useMemo(() => {
    if (selectedCategoryId) return selectedCategoryId;
    if (matchedCategoryFromQuery) return matchedCategoryFromQuery.id;
    return null;
  }, [selectedCategoryId, matchedCategoryFromQuery]);

  // Pagination state for products
  const [productPageNumber, setProductPageNumber] = useState(1);
  const productPageSize = 5;

  // Fetch products for selected category
  const { products, isLoading: isLoadingProducts, metadata: productsMetadata } = useProductsByCategory(
    effectiveCategoryId || "",
    step === "products" && !!effectiveCategoryId,
    {
      pageNumber: productPageNumber,
      pageSize: productPageSize,
    }
  );

  // Reset pagination when category changes
  useEffect(() => {
    setProductPageNumber(1);
  }, [effectiveCategoryId]);

  // Get selected vehicle
  const selectedVehicle = useMemo(() => {
    if (!selectedVehicleId) return null;
    return vehicles.find((v) => v.id === selectedVehicleId) || null;
  }, [selectedVehicleId, vehicles]);

  // Get selected category
  const selectedCategory = useMemo(() => {
    if (!effectiveCategoryId) return null;
    return categories.find((c) => c.id === effectiveCategoryId) || null;
  }, [effectiveCategoryId, categories]);

  // Get current product
  const currentProduct = useMemo(() => {
    if (!currentProductId) return null;
    return products.find((p) => p.id === currentProductId) || null;
  }, [currentProductId, products]);

  // Create maintenance record mutation
  const { mutate: createMaintenanceRecord, isPending: isSubmitting } = useCreateMaintenanceRecord();

  // Set odometer from vehicle when vehicle is selected (always use latest from API)
  useEffect(() => {
    if (selectedVehicleId && vehicles.length > 0) {
      const vehicle = vehicles.find((v) => v.id === selectedVehicleId);
      if (vehicle) {
        // Always use the latest value from vehicle API, not from query param
        setOdometerAtService(vehicle.currentOdometer.toString());
      }
    } else if (selectedVehicleId && odometerFromQuery && !odometerAtService) {
      // Only use query param as fallback if vehicle hasn't loaded yet
      setOdometerAtService(odometerFromQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVehicleId, vehicles, odometerFromQuery]);

  // Sync effectiveCategoryId to selectedCategoryId when matched
  useEffect(() => {
    if (effectiveCategoryId && !selectedCategoryId && matchedCategoryFromQuery) {
      setSelectedCategoryId(effectiveCategoryId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveCategoryId, matchedCategoryFromQuery]);

  const handleVehicleSelect = useCallback((vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    if (vehicle) {
      setOdometerAtService(vehicle.currentOdometer.toString());
    }
    setStep("categories");
  }, [vehicles]);

  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setStep("products");
    setCurrentProductId(null);
    setCurrentPrice("");
    setCurrentItemNotes("");
    setCurrentInstanceIdentifier("");
    setIsCustomProduct(false);
    setCustomPartName("");
    setCustomKmInterval("");
    setCustomMonthsInterval("");
  }, []);

  const handleProductSelect = useCallback((productId: string) => {
    setCurrentProductId(productId);
    const product = products.find((p) => p.id === productId);
    if (product && product.referencePrice > 0) {
      setCurrentPrice(product.referencePrice.toString());
    }
    
    // Scroll to product details form with smooth animation
    setTimeout(() => {
      productDetailsFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }, [products]);

  const handleAddItem = useCallback(() => {
    if (!selectedCategory) return;

    // Validate based on product type
    if (!isCustomProduct) {
      // Case 1: Product from system
      if (!currentProduct) return;
      
      // Kiểm tra xem product đã được thêm vào selectedItems chưa (trừ khi đang edit)
      if (editingItemIndex === null) {
        const isAlreadyAdded = selectedItems.some((item) => !item.isCustom && item.productId === currentProduct.id);
        if (isAlreadyAdded) {
          return; // Không cho thêm lại nếu đã được thêm
        }
      }

      const newItem: SelectedItem = {
        categoryId: selectedCategory.id,
        categoryCode: selectedCategory.code,
        categoryName: selectedCategory.name,
        productId: currentProduct.id,
        productName: currentProduct.name,
        price: currentPrice || undefined,
        itemNotes: currentItemNotes || undefined,
        instanceIdentifier: currentInstanceIdentifier || undefined,
        isCustom: false,
      };

      if (editingItemIndex !== null) {
        // Edit existing item
        setSelectedItems((prev) => {
          const updated = [...prev];
          updated[editingItemIndex] = newItem;
          return updated;
        });
        setEditingItemIndex(null);
      } else {
        // Add new item
        setSelectedItems((prev) => [...prev, newItem]);
      }
    } else {
      // Case 2: Custom product
      if (!customPartName.trim()) return;
      
      // Validate required fields
      if (!customKmInterval || Number(customKmInterval) <= 0) return;
      if (!customMonthsInterval || Number(customMonthsInterval) <= 0) return;

      const newItem: SelectedItem = {
        categoryId: selectedCategory.id,
        categoryCode: selectedCategory.code,
        categoryName: selectedCategory.name,
        customPartName: customPartName.trim(),
        customKmInterval: Number(customKmInterval),
        customMonthsInterval: Number(customMonthsInterval),
        price: currentPrice || undefined,
        itemNotes: currentItemNotes || undefined,
        instanceIdentifier: currentInstanceIdentifier || undefined,
        isCustom: true,
      };

      if (editingItemIndex !== null) {
        // Edit existing item
        setSelectedItems((prev) => {
          const updated = [...prev];
          updated[editingItemIndex] = newItem;
          return updated;
        });
        setEditingItemIndex(null);
      } else {
        // Add new item
        setSelectedItems((prev) => [...prev, newItem]);
      }
    }

    // Reset form
    setCurrentProductId(null);
    setCurrentPrice("");
    setCurrentItemNotes("");
    setCurrentInstanceIdentifier("");
    setIsCustomProduct(false);
    setCustomPartName("");
    setCustomKmInterval("");
    setCustomMonthsInterval("");
    setSelectedCategoryId(null);
    setStep("categories");
  }, [
    selectedCategory,
    currentProduct,
    isCustomProduct,
    customPartName,
    customKmInterval,
    customMonthsInterval,
    currentPrice,
    currentItemNotes,
    currentInstanceIdentifier,
    selectedItems,
    editingItemIndex,
  ]);

  const handleRemoveItem = useCallback((index: number) => {
    setSelectedItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleEditItem = useCallback((index: number) => {
    const item = selectedItems[index];
    setEditingItemIndex(index);
    setSelectedCategoryId(item.categoryId);
    setIsCustomProduct(item.isCustom);
    
    if (item.isCustom) {
      setCustomPartName(item.customPartName || "");
      setCustomKmInterval(item.customKmInterval?.toString() || "");
      setCustomMonthsInterval(item.customMonthsInterval?.toString() || "");
      setCurrentProductId(null);
    } else {
      setCurrentProductId(item.productId || null);
      setCustomPartName("");
      setCustomKmInterval("");
      setCustomMonthsInterval("");
    }
    
    setCurrentPrice(item.price || "");
    setCurrentItemNotes(item.itemNotes || "");
    setCurrentInstanceIdentifier(item.instanceIdentifier || "");
    setStep("products");
  }, [selectedItems]);

  const handleBack = useCallback(() => {
    if (step === "categories") {
      setStep("vehicle");
    } else if (step === "products") {
      setStep("categories");
      setCurrentProductId(null);
      setCurrentPrice("");
      setCurrentItemNotes("");
      setCurrentInstanceIdentifier("");
      setIsCustomProduct(false);
      setCustomPartName("");
      setCustomKmInterval("");
      setCustomMonthsInterval("");
      setEditingItemIndex(null);
    } else if (step === "form") {
      if (selectedItems.length > 0) {
        setStep("categories");
      } else {
        setStep("products");
      }
    } else {
      router.push("/");
    }
  }, [step, selectedItems.length, router]);

  const handleContinueToForm = useCallback(() => {
    if (selectedItems.length === 0) {
      // If no items, go back to select categories
      setStep("categories");
      return;
    }
    setStep("form");
  }, [selectedItems.length]);

  const handleSubmit = useCallback(() => {
    if (!selectedVehicleId || !serviceDate || !odometerAtService || selectedItems.length === 0) {
      return;
    }

    const payload = {
      serviceDate,
      odometerAtService: Number(odometerAtService),
      garageName: garageName || undefined,
      totalCost: totalCost ? Number(totalCost) : undefined,
      notes: notes || undefined,
      invoiceImageUrl: invoiceImageUrl || undefined,
      items: selectedItems.map((item) => {
        if (item.isCustom) {
          // Case 2: Custom product
          return {
            partCategoryCode: item.categoryCode,
            customPartName: item.customPartName,
            customKmInterval: item.customKmInterval,
            customMonthsInterval: item.customMonthsInterval,
            instanceIdentifier: item.instanceIdentifier || undefined,
            price: item.price ? Number(item.price) : undefined,
            itemNotes: item.itemNotes || undefined,
            updatesTracking: true,
          };
        } else {
          // Case 1: Product from system
          return {
            partCategoryCode: item.categoryCode,
            partProductId: item.productId,
            instanceIdentifier: item.instanceIdentifier || undefined,
            price: item.price ? Number(item.price) : undefined,
            itemNotes: item.itemNotes || undefined,
            updatesTracking: true,
          };
        }
      }),
    };

    createMaintenanceRecord(
      {
        userVehicleId: selectedVehicleId,
        payload,
      },
      {
        onSuccess: () => {
          setTimeout(() => {
            // Use replace to avoid going back to maintenance page
            router.replace(`/vehicle/${selectedVehicleId}`);
          }, 1500);
        },
      }
    );
  }, [
    selectedVehicleId,
    serviceDate,
    odometerAtService,
    garageName,
    totalCost,
    notes,
    invoiceImageUrl,
    selectedItems,
    createMaintenanceRecord,
    router,
  ]);

  return (
    <div className="min-h-screen bg-white">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-white border-b border-neutral-200">
        <div className="flex items-center justify-between px-4 h-14">
          <motion.button
            type="button"
            onClick={handleBack}
            whileTap={{ scale: 0.95 }}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-neutral-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-neutral-700" />
          </motion.button>

          <div className="flex-1 text-center">
            <h1 className="text-base font-semibold text-neutral-900">
              {step === "vehicle" && "Chọn xe"}
              {step === "categories" && "Chọn loại phụ tùng"}
              {step === "products" && "Chọn sản phẩm"}
              {step === "form" && "Thông tin bảo dưỡng"}
            </h1>
          </div>

          <div className="w-9" />
        </div>
        
        {/* Step Indicator */}
        <StepIndicator currentStep={step} />
      </header>

      {/* ── Content ── */}
      <div className="px-4 pt-6 pb-24">
        <AnimatePresence mode="wait">
          {/* Step 1: Vehicle Selection */}
          {step === "vehicle" && (
            <motion.div
              key="vehicle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6"
            >
              {/* Vehicle Selection - Card Grid */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-3"
              >
                <label className="text-sm font-medium text-neutral-900 flex items-center gap-2">
                  <Car className="w-4 h-4 text-neutral-600" />
                  Chọn xe <span className="text-red-500">*</span>
                </label>
                
                {isLoadingVehicles ? (
                  <VehicleCardGridSkeleton count={2} />
                ) : vehicles.length === 0 ? (
                  <div className="p-6 rounded-xl bg-neutral-50 border border-neutral-200 text-center">
                    <p className="text-sm text-neutral-600">Chưa có xe nào. Vui lòng thêm xe trước.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {vehicles.map((vehicle) => {
                      const isSelected = selectedVehicleId === vehicle.id;
                      return (
                        <motion.button
                          key={vehicle.id}
                          type="button"
                          onClick={() => handleVehicleSelect(vehicle.id)}
                          whileTap={{ scale: 0.98 }}
                          className={`relative rounded-xl overflow-hidden text-left transition-all ${
                            isSelected
                              ? "ring-2 ring-red-500 ring-offset-2"
                              : "hover:shadow-md"
                          }`}
                          style={{
                            backgroundImage: `url('/images/Card_bg.png')`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                          }}
                        >
                          {/* Subtle glow effect */}
                          <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-500/20 rounded-full blur-3xl" />

                          <div className="p-5 text-white relative">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-12 h-12 rounded-xl bg-white flex items-center justify-center overflow-hidden"
                                  style={{
                                    backgroundImage: `url('/images/logo_only.png')`,
                                    backgroundSize: "70%",
                                    backgroundPosition: "center",
                                    backgroundRepeat: "no-repeat",
                                  }}
                                />
                                <div>
                                  <h3 className="text-lg font-semibold leading-tight">
                                    {vehicle.userVehicleVariant?.model?.brandName || "Xe"}
                                  </h3>
                                  <p className="text-white/50 text-[13px] font-normal">
                                    {vehicle.userVehicleVariant?.model?.name || ""}
                                  </p>
                                </div>
                              </div>
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
                                <div className="px-3 py-2 flex items-center bg-white h-full border border-white rounded-l-lg">
                                  <span className="text-[20px] font-bold text-black leading-none">
                                    {vehicle.licensePlate}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-white/5 rounded-xl p-3">
                                <div className="flex items-center gap-1.5 text-white/40 text-[11px] mb-1">
                                  <Gauge className="h-3 w-3" />
                                  Số km hiện tại
                                </div>
                                <p className="text-[17px] font-bold">
                                {vehicle ? `${(vehicle.currentOdometer.toLocaleString("vi-VN"))}` : "0"}
                                </p>
                              </div>
                              {vehicle.averageKmPerDay > 0 && (
                                <div className="flex-1 bg-white/5 rounded-xl p-3">
                                  <div className="flex items-center gap-1.5 text-white/40 text-[11px] mb-1">
                                    <MotorbikeIcon className="h-3 w-3" />
                                    Trung bình
                                  </div>
                                  <p className="text-[17px] font-bold">{vehicle.averageKmPerDay} km/ngày</p>
                                </div>
                              )}
                            </div>

                            {/* Selected indicator */}
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-3 right-3 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center"
                              >
                                <Check className="w-4 h-4 text-white" />
                              </motion.div>
                            )}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}

          {/* Step 2: Category Selection */}
          {step === "categories" && selectedVehicleId && (
            <motion.div
              key="categories"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6"
            >
              {/* Vehicle Info Card */}
              {selectedVehicle && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-neutral-50 border border-neutral-200"
                >
                  <div className="flex items-center gap-3">
                    {selectedVehicle.userVehicleVariant?.imageUrl ? (
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-white border border-neutral-200 flex-shrink-0">
                        <Image
                          src={selectedVehicle.userVehicleVariant.imageUrl}
                          alt={selectedVehicle.licensePlate}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-neutral-900 flex items-center justify-center flex-shrink-0">
                        <Car className="w-8 h-8 text-white" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-neutral-500">Xe đã chọn</p>
                      <p className="text-sm font-semibold text-neutral-900 truncate">{selectedVehicle.licensePlate}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Selected Items Summary */}
              {selectedItems.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-neutral-50 border border-neutral-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-sm text-neutral-900">
                        Đã chọn {selectedItems.length} phụ tùng
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={handleContinueToForm}
                      className="px-3 py-1.5 rounded-lg bg-neutral-900 text-white text-xs font-medium hover:bg-neutral-800 transition-colors"
                    >
                      Tiếp tục
                    </button>
                  </div>
                  <div className="space-y-2">
                    {selectedItems.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-neutral-200"
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                          <span className="text-sm text-neutral-700">
                            {item.isCustom ? item.customPartName : item.productName}
                          </span>
                          {item.isCustom && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500 text-white font-medium">
                              Tùy chỉnh
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleEditItem(index)}
                            className="px-2 py-1 rounded text-neutral-600 text-xs hover:bg-neutral-100 transition-colors"
                          >
                            Sửa
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            className="px-2 py-1 rounded text-neutral-600 text-xs hover:bg-neutral-100 transition-colors"
                          >
                            Xóa
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Categories List */}
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-3">
                  Chọn loại phụ tùng đã thay
                </h3>
                {isLoadingCategories ? (
                  <LoadingSpinner text="Đang tải danh mục..." />
                ) : categories.length > 0 ? (
                  <div className="space-y-3">
                    {categories.map((category, index) => (
                      <CategoryCard
                        key={category.id}
                        category={category}
                        isSelected={selectedCategoryId === category.id}
                        onClick={() => handleCategorySelect(category.id)}
                        index={index}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 p-6 rounded-2xl bg-neutral-50 border-2 border-dashed border-neutral-200">
                    <Package className="w-12 h-12 text-neutral-300 mb-4" />
                    <p className="text-sm font-medium text-neutral-400 text-center">
                      Chưa có danh mục phụ tùng nào cho xe này
                    </p>
                    <p className="text-xs text-neutral-400 mt-2 text-center">
                      Vui lòng khai báo phụ tùng cho xe trước
                    </p>
                  </div>
                )}
              </div>

              {/* Continue Button - Fixed at bottom */}
              {selectedItems.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="fixed bottom-4 left-4 right-4 z-30"
                >
                  <motion.button
                    type="button"
                    onClick={handleContinueToForm}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-lg bg-[#dc2626] text-white font-medium text-sm flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Tiếp tục với {selectedItems.length} phụ tùng</span>
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Step 3: Product Selection */}
          {step === "products" && selectedCategoryId && (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6"
            >
              {/* Category Info */}
              {selectedCategory && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-neutral-50 border border-neutral-200"
                >
                  <div className="flex items-center gap-3">
                    {selectedCategory.iconUrl ? (
                      <Image
                        src={selectedCategory.iconUrl}
                        alt={selectedCategory.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-lg object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-neutral-900 flex items-center justify-center">
                        <Package className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-neutral-900">
                        {selectedCategory.name}
                      </h3>
                      {selectedCategory.description && (
                        <p className="text-xs text-neutral-600 mt-0.5">
                          {selectedCategory.description}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Toggle between system products and custom product */}
              <div className="relative p-1.5 rounded-2xl bg-neutral-100 mb-4 inline-flex w-full">
                {/* Animated background slider */}
                <motion.div
                  layoutId="toggle-bg"
                  className="absolute top-1.5 bottom-1.5 rounded-xl bg-[#dc2626]"
                  initial={false}
                  animate={{
                    left: isCustomProduct ? "50%" : "0.375rem",
                    width: "calc(50% - 0.75rem)",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                />
                
                {/* System Products Button */}
                <motion.button
                  type="button"
                  onClick={() => {
                    setIsCustomProduct(false);
                    setCurrentProductId(null);
                    setCustomPartName("");
                    setCustomKmInterval("");
                    setCustomMonthsInterval("");
                  }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative z-10 flex-1 py-2.5 px-6 rounded-xl font-medium text-sm transition-colors duration-200 ${
                    !isCustomProduct
                      ? "text-white"
                      : "text-neutral-600"
                  }`}
                >
                  Chọn từ hệ thống
                </motion.button>
                
                {/* Custom Product Button */}
                <motion.button
                  type="button"
                  onClick={() => {
                    setIsCustomProduct(true);
                    setCurrentProductId(null);
                    setCustomPartName("");
                    setCustomKmInterval("");
                    setCustomMonthsInterval("");
                  }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative z-10 flex-1 py-2.5 px-6 rounded-xl font-medium text-sm transition-colors duration-200 ${
                    isCustomProduct
                      ? "text-white"
                      : "text-neutral-600"
                  }`}
                >
                  Nhập tùy chỉnh
                </motion.button>
              </div>

              {/* Products List - Only show when not custom */}
              {!isCustomProduct && (
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 mb-3">
                    Chọn sản phẩm
                  </h3>
                  {isLoadingProducts ? (
                    <LoadingSpinner text="Đang tải sản phẩm..." />
                  ) : products.length > 0 ? (
                    <>
                      <div className="space-y-3">
                        {products.map((product, index) => {
                          const isAlreadyAdded = selectedItems.some((item) => !item.isCustom && item.productId === product.id);
                          return (
                            <ProductCard
                              key={product.id}
                              product={product}
                              isSelected={currentProductId === product.id}
                              isAlreadyAdded={isAlreadyAdded}
                              onClick={() => {
                                handleProductSelect(product.id);
                              }}
                              index={index}
                            />
                          );
                        })}
                      </div>
                      
                      {/* Pagination */}
                      {productsMetadata && productsMetadata.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-6">
                          {/* Previous Button */}
                          <motion.button
                            type="button"
                            onClick={() => setProductPageNumber((prev) => Math.max(1, prev - 1))}
                            disabled={productPageNumber === 1}
                            whileTap={{ scale: 0.95 }}
                            className="w-9 h-9 rounded-lg border border-neutral-300 bg-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 transition-colors"
                          >
                            <ChevronLeft className="w-4 h-4 text-neutral-700" />
                          </motion.button>

                          {/* Page Numbers */}
                          <div className="flex items-center gap-1">
                            {Array.from({ length: productsMetadata.totalPages }, (_, i) => i + 1).map((pageNum) => {
                              // Show first page, last page, current page, and pages around current
                              const showPage = 
                                pageNum === 1 ||
                                pageNum === productsMetadata.totalPages ||
                                (pageNum >= productPageNumber - 1 && pageNum <= productPageNumber + 1);
                              
                              if (!showPage) {
                                // Show ellipsis
                                if (pageNum === productPageNumber - 2 || pageNum === productPageNumber + 2) {
                                  return (
                                    <span key={pageNum} className="px-2 text-neutral-400">
                                      ...
                                    </span>
                                  );
                                }
                                return null;
                              }

                              return (
                                <motion.button
                                  key={pageNum}
                                  type="button"
                                  onClick={() => setProductPageNumber(pageNum)}
                                  whileTap={{ scale: 0.95 }}
                                  className={`w-9 h-9 rounded-lg border flex items-center justify-center text-sm font-medium transition-colors ${
                                    productPageNumber === pageNum
                                      ? "bg-[#dc2626] text-white border-[#dc2626]"
                                      : "border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50"
                                  }`}
                                >
                                  {pageNum}
                                </motion.button>
                              );
                            })}
                          </div>

                          {/* Next Button */}
                          <motion.button
                            type="button"
                            onClick={() => setProductPageNumber((prev) => Math.min(productsMetadata.totalPages, prev + 1))}
                            disabled={productPageNumber === productsMetadata.totalPages}
                            whileTap={{ scale: 0.95 }}
                            className="w-9 h-9 rounded-lg border border-neutral-300 bg-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 transition-colors"
                          >
                            <ChevronRight className="w-4 h-4 text-neutral-700" />
                          </motion.button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 p-6 rounded-2xl bg-neutral-50 border-2 border-dashed border-neutral-200">
                      <Package className="w-12 h-12 text-neutral-300 mb-4" />
                      <p className="text-sm font-medium text-neutral-400 text-center">
                        Không có sản phẩm nào cho loại này
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Custom Product Form */}
              {isCustomProduct && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Custom Part Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-neutral-700">
                      Tên sản phẩm <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customPartName}
                      onChange={(e) => setCustomPartName(e.target.value)}
                      placeholder="Dầu nhớt Liquid 5900"
                      className="w-full px-3 py-2.5 rounded-lg border border-neutral-300 bg-white focus:border-[#dc2626] focus:outline-none text-sm transition-colors"
                    />
                  </div>

                  {/* Custom Intervals - Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Custom KM Interval */}
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-neutral-700">
                        Chu kỳ thay theo km <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={customKmInterval}
                        onChange={(e) => setCustomKmInterval(e.target.value)}
                        placeholder="2500"
                        min="0"
                        required
                        className="w-full px-3 py-2.5 rounded-lg border border-neutral-300 bg-white focus:border-[#dc2626] focus:outline-none text-sm transition-colors"
                      />
                    </div>

                    {/* Custom Months Interval */}
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-neutral-700">
                        Chu kỳ thay theo tháng <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={customMonthsInterval}
                        onChange={(e) => setCustomMonthsInterval(e.target.value)}
                        placeholder="6 "
                        min="0"
                        required
                        className="w-full px-3 py-2.5 rounded-lg border border-neutral-300 bg-white focus:border-[#dc2626] focus:outline-none text-sm transition-colors"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Product Details Form - Show for both system product and custom product */}
              {(currentProduct || isCustomProduct) && (
                <motion.div
                  ref={productDetailsFormRef}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-4"
                >
                  <h4 className="font-semibold text-sm text-neutral-900">
                    Thông tin chi tiết
                  </h4>

                  {/* Price */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-neutral-700 flex items-center gap-2">
                      <DollarSign className="w-3 h-3" />
                      Giá phụ tùng (VNĐ)
                    </label>
                    <input
                      type="number"
                      value={currentPrice}
                      onChange={(e) => setCurrentPrice(e.target.value)}
                      placeholder={currentProduct && currentProduct.referencePrice > 0 ? currentProduct.referencePrice.toString() : "Nhập giá"}
                      min="0"
                      className="w-full px-3 py-2 rounded-xl border-2 border-neutral-200 bg-white focus:border-red-500 focus:outline-none text-sm"
                    />
                  </div>

                  {/* Instance Identifier */}
                  {selectedCategory?.allowsMultipleInstances && (
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-neutral-700 flex items-center gap-2">
                        <Package className="w-3 h-3" />
                        Vị trí/Vị trí lắp đặt
                      </label>
                      <input
                        type="text"
                        value={currentInstanceIdentifier}
                        onChange={(e) => setCurrentInstanceIdentifier(e.target.value)}
                        placeholder="Ví dụ: Lốp trước trái, Má phanh sau..."
                        className="w-full px-3 py-2 rounded-xl border-2 border-neutral-200 bg-white focus:border-red-500 focus:outline-none text-sm"
                      />
                    </div>
                  )}

                  {/* Item Notes */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-neutral-700 flex items-center gap-2">
                      <FileText className="w-3 h-3" />
                      Ghi chú về phụ tùng
                    </label>
                    <textarea
                      value={currentItemNotes}
                      onChange={(e) => setCurrentItemNotes(e.target.value)}
                      placeholder="Ghi chú về phụ tùng đã thay (tùy chọn)"
                      rows={2}
                      className="w-full px-3 py-2 rounded-xl border-2 border-neutral-200 bg-white focus:border-red-500 focus:outline-none text-sm resize-none"
                    />
                  </div>

                  {/* Add/Update Button */}
                  <motion.button
                    type="button"
                    onClick={handleAddItem}
                    disabled={
                      (!isCustomProduct && !currentProductId) || 
                      (isCustomProduct && (!customPartName.trim() || !customKmInterval || Number(customKmInterval) <= 0 || !customMonthsInterval || Number(customMonthsInterval) <= 0))
                    }
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-lg bg-[#dc2626] text-white font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{editingItemIndex !== null ? "Cập nhật phụ tùng" : "Thêm phụ tùng"}</span>
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Step 4: Maintenance Record Form */}
          {step === "form" && selectedVehicleId && selectedItems.length > 0 && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6"
            >
              {/* Selected Items Summary */}
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                <h3 className="font-semibold text-sm text-neutral-900 mb-3">
                  Phụ tùng đã chọn ({selectedItems.length})
                </h3>
                <div className="space-y-3">
                  {selectedItems.map((item, index) => {
                    const category = categories.find((c) => c.id === item.categoryId);
                    if (!category) return null;
                    return (
                      <SelectedItemCard
                        key={index}
                        item={item}
                        category={category}
                        onRemove={() => handleRemoveItem(index)}
                        onEdit={() => {
                          handleEditItem(index);
                          setStep("products");
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Form Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-neutral-900">
                  Thông tin bảo dưỡng
                </h3>

                {/* Service Date */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-neutral-900">
                    Ngày bảo dưỡng <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    value={serviceDate}
                    onChange={setServiceDate}
                    placeholder="Chọn ngày bảo dưỡng"
                    max={new Date()}
                    className="w-full"
                  />
                </div>

                {/* Odometer */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-neutral-900">
                    Số km tại thời điểm bảo dưỡng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={odometerAtService}
                    onChange={(e) => setOdometerAtService(e.target.value)}
                    placeholder={selectedVehicle ? selectedVehicle.currentOdometer.toString() : "Nhập số km"}
                    min="0"
                    className="w-full px-3 py-2.5 rounded-lg border border-neutral-300 bg-white focus:border-neutral-900 focus:outline-none text-sm"
                  />
                </div>

                {/* Garage Name */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-neutral-900">
                    Tên garage/cửa hàng
                  </label>
                  <input
                    type="text"
                    value={garageName}
                    onChange={(e) => setGarageName(e.target.value)}
                    placeholder="Nhập tên garage (tùy chọn)"
                    className="w-full px-3 py-2.5 rounded-lg border border-neutral-300 bg-white focus:border-neutral-900 focus:outline-none text-sm"
                  />
                </div>

                {/* Total Cost */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-neutral-900">
                    Tổng chi phí bảo dưỡng (VNĐ)
                  </label>
                  <input
                    type="number"
                    value={totalCost}
                    onChange={(e) => setTotalCost(e.target.value)}
                    placeholder="Nhập tổng chi phí (tùy chọn)"
                    min="0"
                    className="w-full px-3 py-2.5 rounded-lg border border-neutral-300 bg-white focus:border-neutral-900 focus:outline-none text-sm"
                  />
                </div>

                {/* Invoice Image URL */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-neutral-900">
                    Link ảnh hóa đơn
                  </label>
                  <input
                    type="url"
                    value={invoiceImageUrl}
                    onChange={(e) => setInvoiceImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2.5 rounded-lg border border-neutral-300 bg-white focus:border-neutral-900 focus:outline-none text-sm"
                  />
                </div>

                {/* Notes */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-neutral-900">
                    Ghi chú chung
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ghi chú về lần bảo dưỡng (tùy chọn)"
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-lg border border-neutral-300 bg-white focus:border-neutral-900 focus:outline-none text-sm resize-none"
                  />
                </div>
              </div>

              {/* Submit Button - Fixed at bottom */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed bottom-4 left-4 right-4 z-30"
              >
                <motion.button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !selectedVehicleId || !serviceDate || !odometerAtService}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  className="w-full py-3 rounded-lg bg-[#dc2626] text-white font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang tạo phiếu bảo dưỡng...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Hoàn tất tạo phiếu bảo dưỡng</span>
                    </>
                  )}
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function MaintenanceCategoryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
      </div>
    }>
      <MaintenanceCategoryPageContent />
    </Suspense>
  );
}
