"use client";

import { useState, useCallback, useMemo, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePartCategoriesByVehicleId } from "@/hooks/usePartCategories";
import { useProductsByCategory } from "@/hooks/usePartProducts";
import { useUserVehicles } from "@/hooks/useUserVehice";
import { useCreateMaintenanceRecord } from "@/hooks/useMaintenanceRecord";

// Components
import { StepIndicator } from "./components/StepIndicator";
import { VehicleSelection } from "./components/VehicleSelection";
import { CategorySelection } from "./components/CategorySelection";
import { ProductSelection } from "./components/ProductSelection";
import { MaintenanceForm } from "./components/MaintenanceForm";

// Shared types and constants
import type { SelectedItem, MaintenanceStep } from "./components/shared";

function MaintenanceCategoryPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL params (from notification)
  const vehicleIdFromQuery = searchParams.get("vehicleId");
  const categoryNameFromQuery = searchParams.get("categoryName");
  const odometerFromQuery = searchParams.get("odometer");

  // Step management
  const initialStep = useMemo((): MaintenanceStep => {
    if (vehicleIdFromQuery && categoryNameFromQuery) return "products";
    if (vehicleIdFromQuery) return "categories";
    return "vehicle";
  }, [vehicleIdFromQuery, categoryNameFromQuery]);

  const [step, setStep] = useState<MaintenanceStep>(initialStep);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(vehicleIdFromQuery);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);

  // Form fields - Maintenance Record
  const [serviceDate, setServiceDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [odometerAtService, setOdometerAtService] = useState<string>(odometerFromQuery || "");
  const [garageName, setGarageName] = useState<string>("");
  const [totalCost, setTotalCost] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [invoiceImageUrl, setInvoiceImageUrl] = useState<string>("");

  // Form fields - Current item
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);
  const [currentPrice, setCurrentPrice] = useState<string>("");
  const [currentItemNotes, setCurrentItemNotes] = useState<string>("");
  const [currentInstanceIdentifier, setCurrentInstanceIdentifier] = useState<string>("");

  // Custom product fields
  const [isCustomProduct, setIsCustomProduct] = useState<boolean>(false);
  const [customPartName, setCustomPartName] = useState<string>("");
  const [customKmInterval, setCustomKmInterval] = useState<string>("");
  const [customMonthsInterval, setCustomMonthsInterval] = useState<string>("");

  // Pagination
  const [productPageNumber, setProductPageNumber] = useState(1);
  const productPageSize = 5;

  // Data fetching
  const { vehicles, isLoading: isLoadingVehicles } = useUserVehicles({
    PageNumber: 1,
    PageSize: 100,
  });

  const { categories, isLoading: isLoadingCategories } = usePartCategoriesByVehicleId(
    selectedVehicleId,
    (step !== "vehicle" && !!selectedVehicleId) || !!vehicleIdFromQuery
  );

  // Derived values - must be before useProductsByCategory
  const matchedCategoryFromQuery = useMemo(() => {
    if (categoryNameFromQuery && categories.length > 0) {
      return categories.find((c) => c.name === categoryNameFromQuery) || null;
    }
    return null;
  }, [categoryNameFromQuery, categories]);

  const effectiveCategoryId = useMemo(() => {
    if (selectedCategoryId) return selectedCategoryId;
    if (matchedCategoryFromQuery) return matchedCategoryFromQuery.id;
    return null;
  }, [selectedCategoryId, matchedCategoryFromQuery]);

  const { products, isLoading: isLoadingProducts, metadata: productsMetadata } = useProductsByCategory(
    effectiveCategoryId || "",
    step === "products" && !!effectiveCategoryId,
    { pageNumber: productPageNumber, pageSize: productPageSize }
  );

  const { mutate: createMaintenanceRecord, isPending: isSubmitting } = useCreateMaintenanceRecord();

  const selectedVehicle = useMemo(() => {
    if (!selectedVehicleId) return null;
    return vehicles.find((v) => v.id === selectedVehicleId) || null;
  }, [selectedVehicleId, vehicles]);

  const selectedCategory = useMemo(() => {
    if (!effectiveCategoryId) return null;
    return categories.find((c) => c.id === effectiveCategoryId) || null;
  }, [effectiveCategoryId, categories]);

  // Effects
  useEffect(() => {
    setProductPageNumber(1);
  }, [effectiveCategoryId]);

  useEffect(() => {
    if (selectedVehicleId && vehicles.length > 0) {
      const vehicle = vehicles.find((v) => v.id === selectedVehicleId);
      if (vehicle) setOdometerAtService(vehicle.currentOdometer.toString());
    } else if (selectedVehicleId && odometerFromQuery && !odometerAtService) {
      setOdometerAtService(odometerFromQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVehicleId, vehicles]);

  useEffect(() => {
    if (effectiveCategoryId && !selectedCategoryId && matchedCategoryFromQuery) {
      setSelectedCategoryId(effectiveCategoryId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveCategoryId, matchedCategoryFromQuery]);

  // Handlers
  const handleVehicleSelect = useCallback((vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    if (vehicle) setOdometerAtService(vehicle.currentOdometer.toString());
    setStep("categories");
  }, [vehicles]);

  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setStep("products");
    resetItemForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetItemForm = useCallback(() => {
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
  }, [products]);

  const handleAddItem = useCallback(() => {
    if (!selectedCategory) return;

    if (!isCustomProduct) {
      if (!currentProductId) return;
      const isAlreadyAdded = selectedItems.some(
        (item) => !item.isCustom && item.productId === currentProductId
      );
      if (isAlreadyAdded && editingItemIndex === null) return;

      const newItem: SelectedItem = {
        categoryId: selectedCategory.id,
        categoryCode: selectedCategory.code,
        categoryName: selectedCategory.name,
        productId: currentProductId,
        productName: products.find((p) => p.id === currentProductId)?.name,
        price: currentPrice || undefined,
        itemNotes: currentItemNotes || undefined,
        instanceIdentifier: currentInstanceIdentifier || undefined,
        isCustom: false,
      };

      addOrUpdateItem(newItem);
    } else {
      if (!customPartName.trim() || !customKmInterval || !customMonthsInterval) return;

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

      addOrUpdateItem(newItem);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedCategory,
    currentProductId,
    products,
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

  const addOrUpdateItem = (newItem: SelectedItem) => {
    if (editingItemIndex !== null) {
      setSelectedItems((prev) => {
        const updated = [...prev];
        updated[editingItemIndex] = newItem;
        return updated;
      });
      setEditingItemIndex(null);
    } else {
      setSelectedItems((prev) => [...prev, newItem]);
    }
    resetItemForm();
    setSelectedCategoryId(null);
    setStep("categories");
  };

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
      resetItemForm();
      setEditingItemIndex(null);
    } else if (step === "form") {
      setStep(selectedItems.length > 0 ? "categories" : "products");
    } else {
      router.push("/");
    }
  }, [step, selectedItems.length, router, resetItemForm]);

  const handleContinueToForm = useCallback(() => {
    if (selectedItems.length === 0) {
      setStep("categories");
      return;
    }
    setStep("form");
  }, [selectedItems.length]);

  const handleSubmit = useCallback(() => {
    if (!selectedVehicleId || !serviceDate || !odometerAtService || selectedItems.length === 0) return;

    const payload = {
      serviceDate,
      odometerAtService: Number(odometerAtService),
      garageName: garageName || undefined,
      totalCost: totalCost ? Number(totalCost) : undefined,
      notes: notes || undefined,
      invoiceImageUrl: invoiceImageUrl || undefined,
      items: selectedItems.map((item) => {
        if (item.isCustom) {
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
        }
        return {
          partCategoryCode: item.categoryCode,
          partProductId: item.productId,
          instanceIdentifier: item.instanceIdentifier || undefined,
          price: item.price ? Number(item.price) : undefined,
          itemNotes: item.itemNotes || undefined,
          updatesTracking: true,
        };
      }),
    };

    createMaintenanceRecord(
      { userVehicleId: selectedVehicleId, payload },
      {
        onSuccess: () => {
          setTimeout(() => router.replace(`/vehicle/${selectedVehicleId}`), 1500);
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

  // Step title mapping
  const stepTitles = {
    vehicle: "Chọn xe",
    categories: "Chọn loại phụ tùng",
    products: "Chọn sản phẩm",
    form: "Thông tin bảo dưỡng",
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
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
            <h1 className="text-base font-semibold text-neutral-900">{stepTitles[step]}</h1>
          </div>

          <div className="w-9" />
        </div>

        <StepIndicator currentStep={step} />
      </header>

      {/* Content */}
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
              <div className="space-y-3">
                <label className="text-sm font-medium text-neutral-900 flex items-center gap-2">
                  Chọn xe <span className="text-red-500">*</span>
                </label>
                <VehicleSelection
                  vehicles={vehicles}
                  selectedVehicleId={selectedVehicleId}
                  isLoading={isLoadingVehicles}
                  onSelect={handleVehicleSelect}
                />
              </div>
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
              <CategorySelection
                categories={categories}
                selectedVehicle={selectedVehicle}
                selectedCategoryId={selectedCategoryId}
                selectedItems={selectedItems}
                isLoading={isLoadingCategories}
                onCategorySelect={handleCategorySelect}
                onContinueToForm={handleContinueToForm}
                onEditItem={handleEditItem}
                onRemoveItem={handleRemoveItem}
              />
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
              <ProductSelection
                products={products}
                selectedCategory={selectedCategory}
                selectedItems={selectedItems}
                currentProductId={currentProductId}
                productPageNumber={productPageNumber}
                productsMetadata={productsMetadata}
                isCustomProduct={isCustomProduct}
                isLoading={isLoadingProducts}
                onProductSelect={handleProductSelect}
                onPageChange={setProductPageNumber}
                onToggleCustomProduct={setIsCustomProduct}
                currentPrice={currentPrice}
                currentItemNotes={currentItemNotes}
                currentInstanceIdentifier={currentInstanceIdentifier}
                customPartName={customPartName}
                customKmInterval={customKmInterval}
                customMonthsInterval={customMonthsInterval}
                onPriceChange={setCurrentPrice}
                onItemNotesChange={setCurrentItemNotes}
                onInstanceIdentifierChange={setCurrentInstanceIdentifier}
                onCustomPartNameChange={setCustomPartName}
                onCustomKmIntervalChange={setCustomKmInterval}
                onCustomMonthsIntervalChange={setCustomMonthsInterval}
                onAddItem={handleAddItem}
                onCancel={resetItemForm}
                editingItemIndex={editingItemIndex}
              />
            </motion.div>
          )}

          {/* Step 4: Maintenance Form */}
          {step === "form" && selectedVehicleId && selectedItems.length > 0 && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6"
            >
              <MaintenanceForm
                selectedItems={selectedItems}
                categories={categories}
                serviceDate={serviceDate}
                odometerAtService={odometerAtService}
                garageName={garageName}
                totalCost={totalCost}
                notes={notes}
                invoiceImageUrl={invoiceImageUrl}
                isSubmitting={isSubmitting}
                onServiceDateChange={setServiceDate}
                onOdometerChange={setOdometerAtService}
                onGarageNameChange={setGarageName}
                onTotalCostChange={setTotalCost}
                onNotesChange={setNotes}
                onInvoiceImageUrlChange={setInvoiceImageUrl}
                onRemoveItem={handleRemoveItem}
                onEditItem={(index) => {
                  handleEditItem(index);
                  setStep("products");
                }}
                onSubmit={handleSubmit}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function MaintenanceCategoryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
        </div>
      }
    >
      <MaintenanceCategoryPageContent />
    </Suspense>
  );
}
