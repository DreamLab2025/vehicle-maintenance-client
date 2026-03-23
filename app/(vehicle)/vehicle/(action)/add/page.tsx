"use client";

import * as React from "react";
import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CornerUpLeft } from "lucide-react";
import { StepOneInputMethod } from "./components/step-one-input-method";
import { StepTwoVehicleType } from "./components/step-two-vehicle-type";
import { StepThreeBrand } from "./components/step-three-brand";
import { StepFourModel } from "./components/step-four-model";
import { StepFiveVehicleInfo } from "./components/step-five-basic-info";
import { toast } from "sonner";
import { useCreateUserVehicle } from "@/hooks/useUserVehice";
import { useRouter } from "next/navigation";
import type { CreateUserVehicleRequest } from "@/lib/api/services/fetchUserVehicle";

interface VehicleFormData {
  inputMethod: "manual" | "scan" | null;
  vehicleType: "motorcycle" | "car" | "electric" | null;

  // store id
  brandId: string | null;

  // ✅ IMPORTANT: this is VEHICLE VARIANT ID (NOT modelId)
  vehicleVariantId: string | null;

  vehicleInfo: {
    licensePlate: string;
    nickname: string;
    vinNumber: string;
    purchaseDate: string; // yyyy-mm-dd từ input
    currentOdometer: number;
  } | null;
}

export default function AddVehiclePage() {
  const router = useRouter();
  const footerRef = React.useRef<HTMLDivElement>(null);

  // 1..4
  const TOTAL_STEPS = 4;

  const [currentStep, setCurrentStep] = useState(1);
  const [step4Valid, setStep4Valid] = useState(false);

  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);

  const [formData, setFormData] = useState<VehicleFormData>({
    inputMethod: null,
    vehicleType: null,
    brandId: null,
    vehicleVariantId: null,
    vehicleInfo: null,
  });

  const DEFAULT_VEHICLE_INFO = useMemo(
    () => ({
      licensePlate: "",
      nickname: "",
      vinNumber: "",
      purchaseDate: "",
      currentOdometer: 0,
    }),
    []
  );

  const {
    mutateAsync: createUserVehicle,
    isLoading: isCreatingUserVehicle,
    isError: isCreatingUserVehicleError,
  } = useCreateUserVehicle();

  useEffect(() => {
    if (isCreatingUserVehicleError) toast.error("Đăng ký xe thất bại!");
  }, [isCreatingUserVehicleError]);

  const handleFinalSubmit = async (payload: CreateUserVehicleRequest) => {
    await toast.promise(createUserVehicle(payload), {
      loading: "Đang đăng ký xe...",
      success: "Xe của bạn đã được đăng ký thành công!",
      error: "Đăng ký xe thất bại!",
    });

    router.push("/");
  };

  const handleBack = () => {

    if (currentStep > 1) setCurrentStep((s) => s - 1);
    else router.push("/");
  };

  // Step 1
  const handleInputMethodSelect = (method: "manual" | "scan") => {
    if (method === "scan") {
      toast.info("Chức năng đang trong quá trình phát triển", {
        description: "Tính năng quét AI sẽ được cập nhật trong phiên bản sắp tới.",
      });
      return;
    }

    setFormData((prev) => ({ ...prev, inputMethod: method }));
    setCurrentStep(2);
  };

  // Step 2
  const handleVehicleTypeSelect = (type: "motorcycle" | "car" | "electric") => {
    setFormData((prev) => ({
      ...prev,
      vehicleType: type,

      // reset downstream
      brandId: null,
      vehicleVariantId: null,
      vehicleInfo: null,
    }));
    setSelectedBrandId(null);
    setStep4Valid(false);
    setCurrentStep(3);
  };

  // Step 3: brand selected
  const handleBrandSelected = (brandId: string) => {
    setSelectedBrandId(brandId);
    setFormData((prev) => ({
      ...prev,
      brandId,
      vehicleVariantId: null, // reset variant when brand changes
    }));
  };

  // Step 3: model/variant confirm
  const handleVariantConfirmed = (vehicleVariantId: string) => {
    setFormData((prev) => ({
      ...prev,
      vehicleVariantId,
    }));

    // Scroll xuống bottom để hiển thị nút "Tiếp theo"
    setTimeout(() => {
      footerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 100);
  };

  const isNextButtonDisabled = () => {
    if (currentStep === 1) return formData.inputMethod === null;
    if (currentStep === 2) return formData.vehicleType === null;

    // Step 3: must have brand + variant
    if (currentStep === 3) return !formData.brandId || !formData.vehicleVariantId;

    // Step 4: must have vehicleInfo + valid
    if (currentStep === 4) return !formData.vehicleVariantId || !formData.vehicleInfo || !step4Valid;

    return false;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 md:p-8">
        <div className="flex justify-end border-b border-gray-200 px-4 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800"
          >
            <CornerUpLeft className="h-4 w-4" />
            Thoát
          </Button>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="p-4 md:p-8">
            {currentStep === 1 && <StepOneInputMethod onSelect={handleInputMethodSelect} />}

            {currentStep === 2 && <StepTwoVehicleType onSelect={handleVehicleTypeSelect} />}

            {currentStep === 3 && formData.vehicleType && (
              <div className="space-y-8">
                <StepThreeBrand
                  vehicleType={formData.vehicleType}
                  selectedBrandId={selectedBrandId}
                  onSelect={handleBrandSelected}
                  onBrandSelected={handleBrandSelected}
                  onClear={() => {
                    setSelectedBrandId(null);
                    setFormData((prev) => ({
                      ...prev,
                      brandId: null,
                      vehicleVariantId: null,
                    }));
                  }}
                />

                {selectedBrandId && (
                  <div className="animate-fade-in-up">
                    <StepFourModel
                      selectedBrandId={selectedBrandId}
                      // ✅ your StepFourModel must call this with variant.id
                      onModelConfirm={(vehicleVariantId) => {
                        handleVariantConfirmed(vehicleVariantId);
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {currentStep === 4 && (
              <StepFiveVehicleInfo
                odometerDigits={6}
                value={formData.vehicleInfo ?? DEFAULT_VEHICLE_INFO}
                onChange={(next, isValid) => {
                  setStep4Valid(isValid);
                  setFormData((prev) => ({ ...prev, vehicleInfo: next }));
                }}
              />
            )}
          </div>
        </div>
      </div>

      <footer ref={footerRef} className="bg-white">
        <div className="max-w-2xl mx-auto md:px-8 py-4">
          {/* Progress Bar */}
          <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-black transition-all duration-300"
              style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
            />
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between px-4">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center text-sm text-muted-foreground disabled:opacity-40"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Quay lại
            </button>

            <Button
              disabled={isNextButtonDisabled() || isCreatingUserVehicle}
              onClick={() => {
                if (currentStep < TOTAL_STEPS) {
                  setCurrentStep((s) => s + 1);
                  return;
                }

                // SUBMIT at step 4
                if (!formData.vehicleVariantId || !formData.vehicleInfo) return;

                // purchaseDate yyyy-mm-dd -> ISO
                const [y, m, d] = formData.vehicleInfo.purchaseDate.split("-").map(Number);
                const iso = new Date(y, (m ?? 1) - 1, d ?? 1, 0, 0, 0).toISOString();

                const payload: CreateUserVehicleRequest = {
                  vehicleVariantId: formData.vehicleVariantId,
                  licensePlate: formData.vehicleInfo.licensePlate,
                  nickname: formData.vehicleInfo.nickname,
                  vinNumber: formData.vehicleInfo.vinNumber,
                  purchaseDate: iso,
                  currentOdometer: formData.vehicleInfo.currentOdometer,
                };

                handleFinalSubmit(payload);
              }}
              className="h-10 px-5 rounded-2xl bg-black text-white hover:bg-black/90"
            >
              {currentStep < TOTAL_STEPS ? (
                <>
                  Tiếp theo <ArrowRight className="w-4 h-4 ml-1" />
                </>
              ) : (
                <>Đăng ký xe</>
              )}
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
