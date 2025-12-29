"use client";
import CenterStackCarousel from "@/components/common/CarStackCarousel";
import Header from "@/components/common/Header";
import React from "react";

export default function Page() {
  const [filter, setFilter] = React.useState<
    | "all"
    | "dueSoon"
    | "overdue"
    | "fluids"
    | "brakes"
    | "tires"
    | "battery"
    | "filters"
    | "engine"
  >("all");
  return (
    <main className="min-h-dvh bg-white text-black">
      <Header />
     
      <div className=" left-4 top-4 font-semibold text-lg ">Xe của bạn</div>
      <div className="max-w-4xl mx-auto px-8">
        <CenterStackCarousel />
      </div>
    </main>
  );
}
