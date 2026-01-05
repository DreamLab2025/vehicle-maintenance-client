"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface StepFiveProps {
  onSubmit: (basicInfo: {
    odometer: string;
    color: string;
    licensePlate: string;
    engineNumber: string;
    chassisNumber: string;
    registrationDate: string;
    insuranceExpiry: string;
    notes: string;
  }) => void;
}

export function StepFiveBasicInfo({ onSubmit }: StepFiveProps) {
  const [formData, setFormData] = useState({
    odometer: "",
    color: "",
    licensePlate: "",
    engineNumber: "",
    chassisNumber: "",
    registrationDate: "",
    insuranceExpiry: "",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Thông tin cơ bản xe
        </h1>
        <p className="text-muted-foreground">
          Nhập đầy đủ thông tin của chiếc xe
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="odometer">Số km hiện tại</Label>
          <Input
            id="odometer"
            name="odometer"
            type="number"
            placeholder="Ví dụ: 50000"
            value={formData.odometer}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="color">Màu sắc</Label>
          <Input
            id="color"
            name="color"
            type="text"
            placeholder="Ví dụ: Trắng, Đen, Xanh"
            value={formData.color}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="licensePlate">Biển số xe</Label>
          <Input
            id="licensePlate"
            name="licensePlate"
            type="text"
            placeholder="Ví dụ: 30K1-12345"
            value={formData.licensePlate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="engineNumber">Số động cơ</Label>
          <Input
            id="engineNumber"
            name="engineNumber"
            type="text"
            placeholder="Số động cơ"
            value={formData.engineNumber}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="chassisNumber">Số khung xe</Label>
          <Input
            id="chassisNumber"
            name="chassisNumber"
            type="text"
            placeholder="Số khung xe"
            value={formData.chassisNumber}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="registrationDate">Ngày đăng ký</Label>
          <Input
            id="registrationDate"
            name="registrationDate"
            type="date"
            value={formData.registrationDate}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="insuranceExpiry">Hạn bảo hiểm</Label>
          <Input
            id="insuranceExpiry"
            name="insuranceExpiry"
            type="date"
            value={formData.insuranceExpiry}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Ghi chú thêm</Label>
        <textarea
          id="notes"
          name="notes"
          placeholder="Ghi chú hoặc thông tin thêm về chiếc xe..."
          value={formData.notes}
          onChange={handleChange}
          className="w-full p-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          rows={4}
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 font-semibold"
        size="lg"
      >
        Đăng ký xe
      </Button>
    </form>
  );
}
