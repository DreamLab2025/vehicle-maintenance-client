"use client";
import { Card } from "@/components/ui/card";
import { Bike, Truck, Car } from "lucide-react";

interface StepTwoProps {
  onSelect: (type: "motorcycle" | "car" | "truck") => void;
}

export function StepTwoVehicleType({ onSelect }: StepTwoProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-semibold mb-2">Chọn loại xe</h2>
        <p className="mt-1 text-xs text-foreground/45">
          Loại xe của bạn là gì?
        </p>
      </div>

      {/* Cards */}
      <div className="grid gap-4">
        {/* Motorcycle */}
        <Card
          onClick={() => onSelect("motorcycle")}
          className="relative h-40 cursor-pointer overflow-hidden rounded-xl"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/motorcycle.jpeg')" }}
          />
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
            <Bike className="w-10 h-10 mb-2" />
            <h3 className="text-lg font-semibold">Xe máy</h3>
          </div>
        </Card>

        {/* Car */}
        <Card
          onClick={() => onSelect("car")}
          className="relative h-40 cursor-pointer overflow-hidden rounded-xl"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/car.jpg')" }}
          />
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
            <Car className="w-10 h-10 mb-2" />
            <h3 className="text-lg font-semibold">Xe ô tô</h3>
          </div>
        </Card>

        {/* Truck */}
        <Card
          onClick={() => onSelect("truck")}
          className="relative h-40 cursor-pointer overflow-hidden rounded-xl"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/truck.jpeg')" }}
          />
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
            <Truck className="w-10 h-10 mb-2" />
            <h3 className="text-lg font-semibold">Xe tải</h3>
          </div>
        </Card>
      </div>
    </div>
  );
}
