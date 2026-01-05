"use client";
import { Card } from "@/components/ui/card";
import { Camera, Edit3 } from "lucide-react";

interface StepOneProps {
  onSelect: (method: "manual" | "scan") => void;
}

export function StepOneInputMethod({ onSelect }: StepOneProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Chọn loại hình thức</h2>
        <p className="mt-1 text-xs text-foreground/45">
          Chọn cách bạn muốn nhập thông tin xe của mình
        </p>
      </div>

      <div className="grid gap-4">
        <div
          className="p-6 border-2 rounded-lg cursor-pointer transition-all border-border hover:border-primary/50"
          onClick={() => onSelect("manual")}
        >
          <div className="flex flex-col items-center">
            <Edit3 className="w-8 h-8 mb-4 text-red-600" />
            <h3 className="text-lg font-semibold">Thủ công</h3>
            <p className="md:text-base text-muted-foreground mt-2 text-xs">
              Nhập thông tin xe một cách thủ công
            </p>
          </div>
        </div>

        <div
          className="p-6 border-2 rounded-lg cursor-pointer transition-all border-dashed border-primary bg-primary/5"
          onClick={() => onSelect("scan")}
        >
          <div className="w-full text-center">
            <Camera className="w-8 h-8 mx-auto text-red-600" />
            <h3 className="text-lg font-semibold">Quét</h3>
            <p className="md:text-base text-muted-foreground mt-2 text-xs">
              Quét ảnh để tự động lấy thông tin (AI sẽ áp dụng sau)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
