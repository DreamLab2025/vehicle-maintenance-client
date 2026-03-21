"use client";

import { motion } from "framer-motion";
import { Car, Package, Check, FileText } from "lucide-react";
import { MaintenanceStep, MAINTENANCE_STEPS } from "./shared";

const STEP_ICONS = {
  vehicle: Car,
  categories: Package,
  products: Check,
  form: FileText,
};

interface StepIndicatorProps {
  currentStep: MaintenanceStep;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const currentStepIndex = MAINTENANCE_STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div className="px-4 py-3 bg-neutral-50 border-b border-neutral-200">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {MAINTENANCE_STEPS.map((step, index) => {
          const Icon = STEP_ICONS[step.id];
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
              {index < MAINTENANCE_STEPS.length - 1 && (
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
