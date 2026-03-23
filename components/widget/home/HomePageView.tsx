"use client";

import { useState } from "react";
import Header from "@/components/common/Header";
import BottomNav from "@/components/common/BottomNav";
import { HomePageSkeleton } from "@/components/ui/skeletons";
import { useUserVehicles } from "@/hooks/useUserVehice";
import { HomeVehicleCarousel } from "./HomeVehicleCarousel";
import { HomeUndeclaredPartsSection } from "./HomeUndeclaredPartsSection";
import { HomeRemindersSection } from "./HomeRemindersSection";

export function HomePageView() {
  const { vehicles, isLoading } = useUserVehicles({
    PageNumber: 1,
    PageSize: 10,
  });
  const [currentVehicleIndex, setCurrentVehicleIndex] = useState(0);

  const totalSlots = vehicles.length + 1;
  const isAddVehicleCard = currentVehicleIndex === vehicles.length;
  const currentVehicle = isAddVehicleCard ? null : vehicles[currentVehicleIndex] || vehicles[0];

  if (isLoading) {
    return (
      <main className="min-h-dvh bg-neutral-50">
        <Header />
        <HomePageSkeleton />
        <BottomNav />
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-neutral-50">
      <Header />

      <div className="px-5 pt-6 pb-32 space-y-6">
        <HomeVehicleCarousel
          currentVehicleIndex={currentVehicleIndex}
          onSelectIndex={setCurrentVehicleIndex}
          totalSlots={totalSlots}
          isAddVehicleCard={isAddVehicleCard}
          currentVehicle={currentVehicle}
        />

        <HomeUndeclaredPartsSection currentVehicle={currentVehicle} />

        <HomeRemindersSection currentVehicle={currentVehicle} />
      </div>

      <BottomNav />
    </main>
  );
}
