"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { BrandDialog } from "./BrandDialog";

export function BrandToolbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200 px-6 transition-all active:scale-95"
      >
        <Plus className="mr-2 h-5 w-5" />
        Thêm thương hiệu
      </Button>

      <BrandDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
