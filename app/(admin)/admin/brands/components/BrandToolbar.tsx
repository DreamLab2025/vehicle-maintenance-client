"use client";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BrandToolbarProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function BrandToolbar({ onRefresh, isRefreshing }: BrandToolbarProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isRefreshing}
      onClick={onRefresh}
      className="shrink-0"
    >
      <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
      Làm mới
    </Button>
  );
}
