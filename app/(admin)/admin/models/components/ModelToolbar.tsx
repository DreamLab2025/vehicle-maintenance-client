"use client";

import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";

interface ModelToolbarProps {
  onCreateClick: () => void;
  onRefresh?: () => void;
}

export function ModelToolbar({ onCreateClick, onRefresh }: ModelToolbarProps) {
  return (
    <div className="flex items-center gap-3">
      {onRefresh && (
        <Button variant="outline" size="icon" onClick={onRefresh} className="hover:bg-gray-50 border-gray-200">
          <RefreshCw className="h-4 w-4" />
        </Button>
      )}

      <Button onClick={onCreateClick} className="bg-red-600 hover:bg-red-700 text-white shadow-sm">
        <Plus className="mr-2 h-4 w-4" />
        Thêm Mẫu Xe
      </Button>
    </div>
  );
}
