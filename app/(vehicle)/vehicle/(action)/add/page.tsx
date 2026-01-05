"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, ChevronLeft, CornerUpLeft } from "lucide-react";
import { StepOneInputMethod } from "./components/step-one-input-method";
import { StepTwoVehicleType } from "./components/step-two-vehicle-type";
import { StepThreeBrand } from "./components/step-three-brand";
import { StepFourModel } from "./components/step-four-model";
import { StepFiveBasicInfo } from "./components/step-five-basic-info";
import { toast } from "sonner";

interface VehicleFormData {
  inputMethod: "manual" | "scan" | null;
  vehicleType: "motorcycle" | "car" | "truck" | null;
  brand: string | null;
  model: string | null;
  basicInfo: {
    odometer: string;
    color: string;
    licensePlate: string;
    engineNumber: string;
    chassisNumber: string;
    registrationDate: string;
    insuranceExpiry: string;
    notes: string;
  } | null;
}

const MOCK_BRAND_ID = "019b7887-5c46-74eb-a75e-615c64059d87"; // Honda
const MOCK_TYPE_ID = "11111111-1111-1111-1111-111111111111"; // Motorcycle (ví dụ)

export default function AddVehiclePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<VehicleFormData>({
    inputMethod: null,
    vehicleType: null,
    brand: null,
    model: null,
    basicInfo: null,
  });

  const handleInputMethodSelect = (method: "manual" | "scan") => {
    if (method === "scan") {
      toast.info("Chức năng đang trong quá trình phát triển", {
        description:
          "Tính năng quét AI sẽ được cập nhật trong phiên bản sắp tới.",
      });
      return;
    }

    setFormData((prev) => ({ ...prev, inputMethod: method }));
    setCurrentStep(2);
  };

  const handleVehicleTypeSelect = (type: "motorcycle" | "car" | "truck") => {
    setFormData((prev) => ({ ...prev, vehicleType: type }));
    setCurrentStep(3);
  };

  const handleBrandSelect = (brand: string) => {
    setFormData((prev) => ({ ...prev, brand }));
    setCurrentStep(4);
  };

  const handleModelSelect = (model: string) => {
    setFormData((prev) => ({ ...prev, model }));
    setCurrentStep(5);
  };

  const handleBasicInfoSubmit = (basicInfo: VehicleFormData["basicInfo"]) => {
    setFormData((prev) => ({ ...prev, basicInfo }));
    handleFinalSubmit({ ...formData, basicInfo });
  };

  const handleFinalSubmit = (data: VehicleFormData) => {
    console.log("Submitting vehicle data:", data);
    alert("Xe của bạn đã được đăng ký thành công!");
    // TODO: Call API to save vehicle data
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1  md:p-8">
        <div className="flex justify-end border-b  border-gray-200 px-4 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="flex h-18 items-center gap-2 bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 "
          >
            <CornerUpLeft className="h-4 w-4" />
            Thoát
          </Button>
        </div>
        <div className="max-w-2xl mx-auto">
          {/* Form Content */}
          <div className="p-4 md:p-8">
            {currentStep === 1 && (
              <StepOneInputMethod onSelect={handleInputMethodSelect} />
            )}
            {currentStep === 2 && (
              <StepTwoVehicleType onSelect={handleVehicleTypeSelect} />
            )}
            {currentStep === 3 && formData.vehicleType && (
              <StepThreeBrand
                vehicleType={formData.vehicleType}
                onSelect={handleBrandSelect}
              />
            )}
            {currentStep === 4 && MOCK_TYPE_ID && MOCK_BRAND_ID && (
              <StepFourModel
                typeId={MOCK_TYPE_ID}
                brandId={MOCK_BRAND_ID}
                onSelect={handleModelSelect}
              />
            )}
            {currentStep === 5 && (
              <StepFiveBasicInfo onSubmit={handleBasicInfoSubmit} />
            )}
          </div>
        </div>
      </div>

      <footer className=" bg-white">
        <div className="max-w-2xl mx-auto md:px-8 py-4">
          {/* Progress Bar */}
          <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-black transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between px-4">
            {/* Back button - text style */}
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center text-sm text-muted-foreground disabled:opacity-40"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Quay lại
            </button>

            {/* Next / Submit button - pill */}
            {currentStep < 5 ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="h-10 px-5 rounded-2xl bg-black text-white hover:bg-black/90"
              >
                Tiếp theo
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={() => handleFinalSubmit(formData)}
                className="h-10 px-5 rounded-full bg-black text-white hover:bg-black/90"
              >
                Đăng ký xe
              </Button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
